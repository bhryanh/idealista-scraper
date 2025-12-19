/**
 * Apartment Monitor - Automated Monitoring System
 *
 * Continuously monitors Idealista for new apartments and sends
 * WhatsApp notifications when new listings are found.
 *
 * Usage:
 *   node monitor.js          - Run once
 *   node monitor.js --cron   - Run continuously with scheduled checks
 */

const cron = require("node-cron");
const MonitorService = require("./src/services/monitor");

/**
 * Main monitoring function
 */
async function runMonitor() {
  const monitor = new MonitorService();

  try {
    await monitor.initialize();
    await monitor.checkForNewApartments();
  } catch (error) {
    console.error("❌ Error running monitor:", error.message);
  }
}

/**
 * Start continuous monitoring with cron
 */
function startCronMonitoring() {
  const monitor = new MonitorService();

  console.log("🚀 Starting Idealista Apartment Monitor");
  console.log("=" .repeat(60));

  // Initialize services
  monitor.initialize().then(() => {
    console.log("✅ Monitor services initialized");

    // Get schedule from environment or use default (every 10 minutes)
    const schedule = process.env.MONITOR_SCHEDULE || "*/10 * * * *";
    console.log(`⏰ Schedule: ${schedule}`);
    console.log(`   (Checks every 10 minutes by default)`);
    console.log("=" .repeat(60) + "\n");

    // Run immediately on start
    console.log("🏃 Running initial check...\n");
    monitor.checkForNewApartments();

    // Schedule recurring checks
    cron.schedule(schedule, () => {
      monitor.checkForNewApartments();
    });

    console.log("✅ Monitoring started successfully");
    console.log("   Press Ctrl+C to stop\n");
  }).catch((error) => {
    console.error("❌ Failed to initialize monitor:", error.message);
    process.exit(1);
  });

  // Handle graceful shutdown
  process.on("SIGINT", async () => {
    console.log("\n\n🛑 Shutting down monitor...");
    await monitor.close();
    process.exit(0);
  });

  process.on("SIGTERM", async () => {
    console.log("\n\n🛑 Shutting down monitor...");
    await monitor.close();
    process.exit(0);
  });
}

/**
 * Parse command line arguments and start
 */
function main() {
  const args = process.argv.slice(2);

  if (args.includes("--cron") || args.includes("-c")) {
    // Start continuous monitoring
    startCronMonitoring();
  } else if (args.includes("--help") || args.includes("-h")) {
    // Show help
    console.log(`
Idealista Apartment Monitor

Usage:
  node monitor.js              Run a single check
  node monitor.js --cron       Run continuously with scheduled checks
  node monitor.js --help       Show this help message

Environment Variables:
  MONITOR_SCHEDULE            Cron schedule (default: */10 * * * *)
  MONITOR_MAX_PAGES           Number of pages to scrape (default: 1)
  NOTIFICATION_MODE           'individual' or 'summary' (default: summary)
  USE_DATABASE                Enable/disable database (default: true)
  USE_EMAIL_NOTIFICATIONS     Enable/disable email notifications (default: true)
  MONGODB_URI                 MongoDB connection string
  EMAIL_USER                  Email sender address
  EMAIL_PASSWORD              Email password or app password
  EMAIL_TO                    Email recipient(s) (comma-separated)

Examples:
  # Run once
  node monitor.js

  # Run every 10 minutes (default)
  node monitor.js --cron

  # Custom schedule (every 5 minutes)
  MONITOR_SCHEDULE="*/5 * * * *" node monitor.js --cron
`);
  } else {
    // Run once
    console.log("🔍 Running single apartment check...\n");
    runMonitor().then(() => {
      console.log("\n✅ Check completed");
      process.exit(0);
    }).catch((error) => {
      console.error("❌ Error:", error.message);
      process.exit(1);
    });
  }
}

// Start the application
if (require.main === module) {
  main();
}

module.exports = { runMonitor, startCronMonitoring };
