const nodemailer = require("nodemailer");

/**
 * Email notification service
 * Uses nodemailer to send email notifications
 * Supports multiple recipient email addresses
 */
class EmailService {
  constructor() {
    this.transporter = null;
    this.fromEmail = null;
    this.toEmails = [];
  }

  /**
   * Initialize nodemailer transporter
   */
  initialize() {
    try {
      const emailUser = process.env.EMAIL_USER;
      const emailPassword = process.env.EMAIL_PASSWORD;
      const toEmailsString = process.env.EMAIL_TO;

      if (!emailUser || !emailPassword) {
        throw new Error(
          "Email credentials are not defined in environment variables"
        );
      }

      if (!toEmailsString) {
        throw new Error(
          "Email recipients are not defined in environment variables"
        );
      }

      // Parse multiple email addresses (comma-separated)
      this.toEmails = toEmailsString
        .split(",")
        .map((email) => email.trim())
        .filter((email) => email.length > 0);

      if (this.toEmails.length === 0) {
        throw new Error("No valid email recipients found");
      }

      this.fromEmail = emailUser;

      // Configure transporter
      const transportConfig = {
        service: process.env.EMAIL_SERVICE || "gmail",
        auth: {
          user: emailUser,
          pass: emailPassword,
        },
      };

      // Use custom SMTP settings if provided
      if (process.env.EMAIL_HOST) {
        delete transportConfig.service;
        transportConfig.host = process.env.EMAIL_HOST;
        transportConfig.port = parseInt(process.env.EMAIL_PORT) || 587;
        transportConfig.secure = process.env.EMAIL_SECURE === "true";
      }

      this.transporter = nodemailer.createTransport(transportConfig);

      console.log(`✅ Email service initialized`);
      console.log(`   Recipients: ${this.toEmails.length} email(s)`);
    } catch (error) {
      console.error("❌ Error initializing email service:", error.message);
      throw error;
    }
  }

  /**
   * Format apartment data into HTML email
   * @param {Object} apartment - Apartment data
   * @returns {string} Formatted HTML message
   */
  formatApartmentHTML(apartment) {
    let html = `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h2 style="color: #2c3e50;">🏠 New Apartment Found!</h2>
        <div style="background-color: #f8f9fa; padding: 20px; border-radius: 8px; margin: 20px 0;">
          <h3 style="color: #34495e; margin-top: 0;">${apartment.title}</h3>
    `;

    if (apartment.price) {
      html += `<p><strong>💰 Price:</strong> ${apartment.price}</p>`;
    }

    if (apartment.bedrooms) {
      html += `<p><strong>🛏️ Bedrooms:</strong> ${apartment.bedrooms}</p>`;
    }

    if (apartment.area) {
      html += `<p><strong>📏 Area:</strong> ${apartment.area}</p>`;
    }

    if (apartment.tags) {
      html += `<p><strong>🏷️ Tags:</strong> ${apartment.tags}</p>`;
    }

    html += `
          <p style="margin-top: 20px;">
            <a href="${apartment.url}"
               style="background-color: #3498db; color: white; padding: 12px 24px;
                      text-decoration: none; border-radius: 5px; display: inline-block;">
              View Apartment
            </a>
          </p>
        </div>
      </div>
    `;

    return html;
  }

  /**
   * Format apartment data into plain text
   * @param {Object} apartment - Apartment data
   * @returns {string} Formatted text message
   */
  formatApartmentText(apartment) {
    let text = `🏠 New Apartment Found!\n\n`;
    text += `${apartment.title}\n\n`;

    if (apartment.price) {
      text += `💰 Price: ${apartment.price}\n`;
    }

    if (apartment.bedrooms) {
      text += `🛏️ Bedrooms: ${apartment.bedrooms}\n`;
    }

    if (apartment.area) {
      text += `📏 Area: ${apartment.area}\n`;
    }

    if (apartment.tags) {
      text += `🏷️ Tags: ${apartment.tags}\n`;
    }

    text += `\n🔗 ${apartment.url}`;

    return text;
  }

  /**
   * Send email to all recipients
   * @param {string} subject - Email subject
   * @param {string} text - Plain text body
   * @param {string} html - HTML body
   * @returns {Promise<Object>} Result object with success count and errors
   */
  async sendToAllRecipients(subject, text, html) {
    if (!this.transporter) {
      this.initialize();
    }

    const results = {
      success: 0,
      failed: 0,
      errors: [],
    };

    for (const toEmail of this.toEmails) {
      try {
        await this.transporter.sendMail({
          from: `"Idealista Monitor" <${this.fromEmail}>`,
          to: toEmail,
          subject: subject,
          text: text,
          html: html,
        });
        results.success++;
      } catch (error) {
        results.failed++;
        results.errors.push({
          email: toEmail,
          error: error.message,
        });
        console.error(`   ❌ Failed to send to ${toEmail}: ${error.message}`);
      }
    }

    return results;
  }

  /**
   * Send email notification about a new apartment
   * @param {Object} apartment - Apartment data
   * @returns {Promise<boolean>} True if sent successfully to at least one recipient
   */
  async sendApartmentNotification(apartment) {
    try {
      const subject = `🏠 New Apartment: ${apartment.title}`;
      const text = this.formatApartmentText(apartment);
      const html = this.formatApartmentHTML(apartment);

      const results = await this.sendToAllRecipients(subject, text, html);

      if (results.success > 0) {
        console.log(
          `✅ Email notification sent for: ${apartment.title} (${results.success}/${this.toEmails.length} recipients)`
        );
        return true;
      } else {
        console.error(
          `❌ Failed to send email notification to any recipient for: ${apartment.title}`
        );
        return false;
      }
    } catch (error) {
      console.error("❌ Error sending email notification:", error.message);
      return false;
    }
  }

  /**
   * Send a summary email with multiple apartments
   * @param {Array} apartments - Array of apartment objects
   * @returns {Promise<boolean>} True if sent successfully to at least one recipient
   */
  async sendSummaryNotification(apartments) {
    try {
      if (apartments.length === 0) {
        return false;
      }

      const subject = `🏠 ${apartments.length} New Apartment${
        apartments.length > 1 ? "s" : ""
      } Found!`;

      // Build text version
      let text = `🏠 ${apartments.length} New Apartment${
        apartments.length > 1 ? "s" : ""
      } Found!\n\n`;

      apartments.forEach((apt, index) => {
        text += `${index + 1}. ${apt.title}\n`;
        text += `   💰 ${apt.price || "N/A"}\n`;
        text += `   🔗 ${apt.url}\n\n`;
      });

      // Build HTML version
      let html = `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h2 style="color: #2c3e50;">🏠 ${apartments.length} New Apartment${
        apartments.length > 1 ? "s" : ""
      } Found!</h2>
      `;

      apartments.forEach((apt, index) => {
        html += `
          <div style="background-color: #f8f9fa; padding: 15px; border-radius: 8px; margin: 15px 0;">
            <h3 style="color: #34495e; margin-top: 0;">${index + 1}. ${
          apt.title
        }</h3>
            <p><strong>💰 Price:</strong> ${apt.price || "N/A"}</p>
            <p>
              <a href="${apt.url}"
                 style="background-color: #3498db; color: white; padding: 10px 20px;
                        text-decoration: none; border-radius: 5px; display: inline-block;">
                View Apartment
              </a>
            </p>
          </div>
        `;
      });

      html += `</div>`;

      const results = await this.sendToAllRecipients(subject, text, html);

      if (results.success > 0) {
        console.log(
          `✅ Summary email sent for ${apartments.length} apartment(s) to ${results.success}/${this.toEmails.length} recipient(s)`
        );
        return true;
      } else {
        console.error("❌ Failed to send summary email to any recipient");
        return false;
      }
    } catch (error) {
      console.error("❌ Error sending summary email:", error.message);
      return false;
    }
  }

  /**
   * Send a simple text email
   * @param {string} subject - Email subject
   * @param {string} message - Message text
   * @returns {Promise<boolean>} True if sent successfully to at least one recipient
   */
  async sendMessage(subject, message) {
    try {
      const results = await this.sendToAllRecipients(subject, message, message);

      if (results.success > 0) {
        console.log(
          `✅ Email sent to ${results.success}/${this.toEmails.length} recipient(s)`
        );
        return true;
      } else {
        console.error("❌ Failed to send email to any recipient");
        return false;
      }
    } catch (error) {
      console.error("❌ Error sending email:", error.message);
      return false;
    }
  }
}

module.exports = EmailService;
