const twilio = require("twilio");

/**
 * Notification service for sending WhatsApp messages
 * Uses Twilio API
 * Supports multiple recipient phone numbers
 */
class NotificationService {
  constructor() {
    this.client = null;
    this.fromNumber = null;
    this.toNumbers = [];
  }

  /**
   * Initialize Twilio client
   */
  initialize() {
    try {
      const accountSid = process.env.TWILIO_ACCOUNT_SID;
      const authToken = process.env.TWILIO_AUTH_TOKEN;
      this.fromNumber = process.env.TWILIO_WHATSAPP_FROM;
      const toNumbersString = process.env.TWILIO_WHATSAPP_TO;

      if (!accountSid || !authToken) {
        throw new Error(
          "Twilio credentials are not defined in environment variables"
        );
      }

      if (!this.fromNumber || !toNumbersString) {
        throw new Error(
          "WhatsApp phone numbers are not defined in environment variables"
        );
      }

      // Parse multiple phone numbers (comma-separated)
      this.toNumbers = toNumbersString
        .split(",")
        .map((num) => num.trim())
        .filter((num) => num.length > 0);

      if (this.toNumbers.length === 0) {
        throw new Error("No valid WhatsApp recipient numbers found");
      }

      this.client = twilio(accountSid, authToken);
      console.log(`✅ Twilio client initialized`);
      console.log(`   Recipients: ${this.toNumbers.length} number(s)`);
    } catch (error) {
      console.error("❌ Error initializing Twilio:", error.message);
      throw error;
    }
  }

  /**
   * Format apartment data into a readable message
   * @param {Object} apartment - Apartment data
   * @returns {string} Formatted message
   */
  formatApartmentMessage(apartment) {
    let message = "🏠 *New Apartment Found!*\n\n";
    message += `📍 *${apartment.title}*\n\n`;

    if (apartment.price) {
      message += `💰 Price: ${apartment.price}\n`;
    }

    if (apartment.bedrooms) {
      message += `🛏️ Bedrooms: ${apartment.bedrooms}\n`;
    }

    if (apartment.area) {
      message += `📏 Area: ${apartment.area}\n`;
    }

    if (apartment.tags) {
      message += `🏷️ Tags: ${apartment.tags}\n`;
    }

    message += `\n🔗 ${apartment.url}`;

    return message;
  }

  /**
   * Send a message to all recipient numbers
   * @param {string} message - Message text to send
   * @returns {Promise<Object>} Result object with success count and errors
   */
  async sendToAllRecipients(message) {
    if (!this.client) {
      this.initialize();
    }

    const results = {
      success: 0,
      failed: 0,
      errors: [],
    };

    for (const toNumber of this.toNumbers) {
      try {
        await this.client.messages.create({
          from: `whatsapp:${this.fromNumber}`,
          to: `whatsapp:${toNumber}`,
          body: message,
        });
        results.success++;
      } catch (error) {
        results.failed++;
        results.errors.push({
          number: toNumber,
          error: error.message,
        });
        console.error(`   ❌ Failed to send to ${toNumber}: ${error.message}`);
      }
    }

    return results;
  }

  /**
   * Send a WhatsApp message about a new apartment
   * @param {Object} apartment - Apartment data
   * @returns {Promise<boolean>} True if sent successfully to at least one recipient
   */
  async sendApartmentNotification(apartment) {
    try {
      const message = this.formatApartmentMessage(apartment);
      const results = await this.sendToAllRecipients(message);

      if (results.success > 0) {
        console.log(
          `✅ WhatsApp notification sent for: ${apartment.title} (${results.success}/${this.toNumbers.length} recipients)`
        );
        return true;
      } else {
        console.error(
          `❌ Failed to send notification to any recipient for: ${apartment.title}`
        );
        return false;
      }
    } catch (error) {
      console.error("❌ Error sending WhatsApp notification:", error.message);
      return false;
    }
  }

  /**
   * Send a summary message with multiple apartments
   * @param {Array} apartments - Array of apartment objects
   * @returns {Promise<boolean>} True if sent successfully to at least one recipient
   */
  async sendSummaryNotification(apartments) {
    try {
      if (apartments.length === 0) {
        return false;
      }

      let message = `🏠 *${apartments.length} New Apartment${
        apartments.length > 1 ? "s" : ""
      } Found!*\n\n`;

      apartments.forEach((apt, index) => {
        message += `${index + 1}. ${apt.title}\n`;
        message += `   💰 ${apt.price || "N/A"}\n`;
        message += `   🔗 ${apt.url}\n\n`;
      });

      const results = await this.sendToAllRecipients(message);

      if (results.success > 0) {
        console.log(
          `✅ Summary notification sent for ${apartments.length} apartment(s) to ${results.success}/${this.toNumbers.length} recipient(s)`
        );
        return true;
      } else {
        console.error("❌ Failed to send summary notification to any recipient");
        return false;
      }
    } catch (error) {
      console.error("❌ Error sending summary notification:", error.message);
      return false;
    }
  }

  /**
   * Send a simple text message
   * @param {string} text - Message text
   * @returns {Promise<boolean>} True if sent successfully to at least one recipient
   */
  async sendMessage(text) {
    try {
      const results = await this.sendToAllRecipients(text);

      if (results.success > 0) {
        console.log(
          `✅ WhatsApp message sent to ${results.success}/${this.toNumbers.length} recipient(s)`
        );
        return true;
      } else {
        console.error("❌ Failed to send message to any recipient");
        return false;
      }
    } catch (error) {
      console.error("❌ Error sending WhatsApp message:", error.message);
      return false;
    }
  }
}

module.exports = NotificationService;
