const IdealistaScraper = require("./scraper");
const DatabaseService = require("./database");
const NotificationService = require("./notification");

/**
 * Monitoring service
 * Coordinates scraping, database storage, and notifications
 */
class MonitorService {
  constructor() {
    this.scraper = new IdealistaScraper();
    this.database = new DatabaseService();
    this.notification = new NotificationService();
    this.isRunning = false;
  }

  /**
   * Initialize all services
   */
  async initialize() {
    try {
      await this.database.connect();
      this.notification.initialize();
      console.log("✅ Monitor service initialized");
    } catch (error) {
      console.error("❌ Error initializing monitor service:", error.message);
      throw error;
    }
  }

  /**
   * Check for new apartments
   * Main monitoring function
   */
  async checkForNewApartments() {
    if (this.isRunning) {
      console.log("⚠️  Previous check still running, skipping...");
      return;
    }

    this.isRunning = true;
    const startTime = new Date();

    try {
      console.log("\n" + "=".repeat(60));
      console.log(
        `🔍 Starting apartment check at ${startTime.toLocaleString()}`
      );
      console.log("=".repeat(60) + "\n");

      // Scrape apartments (only first page for monitoring)
      const apartments = await this.scraper.scrapeMultiplePages(1);

      if (apartments.length === 0) {
        console.log("ℹ️  No apartments found");
        this.isRunning = false;
        return;
      }

      console.log(`\n📊 Found ${apartments.length} apartments total`);

      // Check which ones are new
      const newApartments = [];

      for (const apartment of apartments) {
        const exists = await this.database.apartmentExists(apartment.url);

        if (!exists) {
          const saved = await this.database.saveApartment(apartment);
          if (saved) {
            newApartments.push(apartment);
            console.log(`✨ New apartment: ${apartment.title}`);
          }
        }
      }

      // Send notifications for new apartments
      if (newApartments.length > 0) {
        console.log(
          `\n📤 Sending notifications for ${newApartments.length} new apartment(s)...`
        );

        const notificationMode = process.env.NOTIFICATION_MODE || "summary";

        if (notificationMode === "individual") {
          // Send individual notification for each apartment
          for (const apartment of newApartments) {
            const sent = await this.notification.sendApartmentNotification(
              apartment
            );
            if (sent) {
              await this.database.markAsNotified(apartment.url);
            }
          }
        } else {
          // Send summary notification
          const sent = await this.notification.sendSummaryNotification(
            newApartments
          );
          if (sent) {
            for (const apartment of newApartments) {
              await this.database.markAsNotified(apartment.url);
            }
          }
        }

        console.log("✅ Notifications sent successfully");
      } else {
        console.log("ℹ️  No new apartments found");
      }

      // Display statistics
      const stats = await this.database.getStats();
      console.log("\n📈 Database Statistics:");
      console.log(`   Total apartments: ${stats.total}`);
      console.log(`   Notified: ${stats.notified}`);
      console.log(`   Not notified: ${stats.notNotified}`);

      const endTime = new Date();
      const duration = ((endTime - startTime) / 1000).toFixed(2);
      console.log(`\n⏱️  Check completed in ${duration} seconds`);
      console.log("=".repeat(60) + "\n");
    } catch (error) {
      console.error("❌ Error during apartment check:", error.message);
    } finally {
      this.isRunning = false;
    }
  }

  /**
   * Cleanup and close connections
   */
  async close() {
    try {
      await this.scraper.close();
      await this.database.close();
      console.log("✅ Monitor service closed");
    } catch (error) {
      console.error("Error closing monitor service:", error.message);
    }
  }

  /**
   * Get monitor status
   * @returns {Object} Status information
   */
  getStatus() {
    return {
      isRunning: this.isRunning,
      timestamp: new Date().toISOString(),
    };
  }
}

module.exports = MonitorService;
