const IdealistaScraper = require("./scraper");
const DatabaseService = require("./database");
const EmailService = require("./email");

/**
 * Monitoring service
 * Coordinates scraping, database storage, and notifications
 */
class MonitorService {
  constructor() {
    this.scraper = new IdealistaScraper();
    this.database = new DatabaseService();
    this.email = new EmailService();
    this.isRunning = false;
    this.useDatabase = process.env.USE_DATABASE !== "false";
    this.useEmailNotifications =
      process.env.USE_EMAIL_NOTIFICATIONS !== "false";
    // In-memory cache for when database is disabled
    this.seenApartments = new Set();
  }

  /**
   * Initialize all services
   */
  async initialize() {
    try {
      console.log("🔧 Initializing monitor service...");
      console.log(`   Database: ${this.useDatabase ? "enabled" : "disabled"}`);
      console.log(
        `   Email Notifications: ${
          this.useEmailNotifications ? "enabled" : "disabled"
        }`
      );

      if (this.useDatabase) {
        await this.database.connect();
      } else {
        console.log("ℹ️  Using in-memory cache for duplicate detection");
      }

      if (this.useEmailNotifications) {
        this.email.initialize();
      }

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

      // Get number of pages to scrape from environment (default: 1)
      const maxPages = parseInt(process.env.MONITOR_MAX_PAGES) || 1;
      console.log(`📄 Scraping ${maxPages} page(s)...`);

      // Scrape apartments
      const apartments = await this.scraper.scrapeMultiplePages(maxPages);

      if (apartments.length === 0) {
        console.log("ℹ️  No apartments found");
        this.isRunning = false;
        return;
      }

      console.log(`\n📊 Found ${apartments.length} apartments total`);

      // Check which ones are new
      const newApartments = [];

      for (const apartment of apartments) {
        let exists = false;
        let saved = false;

        if (this.useDatabase) {
          // Use database for duplicate detection
          exists = await this.database.apartmentExists(apartment.url);
          if (!exists) {
            saved = await this.database.saveApartment(apartment);
          }
        } else {
          // Use in-memory cache for duplicate detection
          exists = this.seenApartments.has(apartment.url);
          if (!exists) {
            this.seenApartments.add(apartment.url);
            saved = true;
          }
        }

        if (!exists && saved) {
          newApartments.push(apartment);
          console.log(`✨ New apartment: ${apartment.title}`);
        }
      }

      // Send notifications for new apartments
      if (newApartments.length > 0) {
        if (this.useEmailNotifications) {
          console.log(
            `\n📤 Sending email notifications for ${newApartments.length} new apartment(s)...`
          );

          const notificationMode = process.env.NOTIFICATION_MODE || "summary";
          let notificationSent = false;

          if (notificationMode === "individual") {
            // Send individual email for each apartment
            for (const apartment of newApartments) {
              const emailSent = await this.email.sendApartmentNotification(
                apartment
              );
              if (emailSent) {
                notificationSent = true;
                if (this.useDatabase) {
                  await this.database.markAsNotified(apartment.url);
                }
              }
            }
          } else {
            // Send summary email
            const emailSent = await this.email.sendSummaryNotification(
              newApartments
            );
            if (emailSent) {
              notificationSent = true;
              if (this.useDatabase) {
                for (const apartment of newApartments) {
                  await this.database.markAsNotified(apartment.url);
                }
              }
            }
          }

          if (notificationSent) {
            console.log("✅ Email notifications sent successfully");
          }
        } else {
          console.log("ℹ️  Email notifications disabled - skipping notification");
          console.log(
            `   Found ${newApartments.length} new apartment(s) without notification`
          );
        }
      } else {
        console.log("ℹ️  No new apartments found");
      }

      // Display statistics
      if (this.useDatabase) {
        const stats = await this.database.getStats();
        console.log("\n📈 Database Statistics:");
        console.log(`   Total apartments: ${stats.total}`);
        if (this.useEmailNotifications) {
          console.log(`   Notified via email: ${stats.notified}`);
          console.log(`   Pending notification: ${stats.notNotified}`);
        } else {
          console.log(`   Tracked apartments: ${stats.total}`);
          console.log(`   (Email notifications disabled)`);
        }
      } else {
        console.log("\n📈 Cache Statistics:");
        console.log(`   Total seen apartments: ${this.seenApartments.size}`);
      }

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
      if (this.useDatabase) {
        await this.database.close();
      }
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
