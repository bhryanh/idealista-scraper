/**
 * Web Server for Render.com
 *
 * Runs an Express server (required for Render Free Tier Web Service)
 * and starts the apartment monitor in background.
 */

const express = require("express");
const MonitorService = require("./src/services/monitor");
const cron = require("node-cron");

const app = express();
const PORT = process.env.PORT || 3000;

// Monitor instance
let monitor = null;
let monitorStats = {
  status: "initializing",
  lastCheck: null,
  nextCheck: null,
  checksPerformed: 0,
  apartmentsFound: 0,
  errors: 0,
  uptime: new Date()
};

/**
 * Initialize and start the monitor
 */
async function initializeMonitor() {
  try {
    console.log("🚀 Initializing Apartment Monitor...");
    monitor = new MonitorService();
    await monitor.initialize();

    monitorStats.status = "running";
    console.log("✅ Monitor initialized successfully");

    // Get schedule from environment or use default (every 10 minutes)
    const schedule = process.env.MONITOR_SCHEDULE || "*/10 * * * *";
    console.log(`⏰ Monitoring schedule: ${schedule}`);

    // Run initial check
    console.log("🏃 Running initial check...");
    await runMonitorCheck();

    // Schedule recurring checks
    cron.schedule(schedule, async () => {
      await runMonitorCheck();
    });

    console.log("✅ Monitoring started successfully");
  } catch (error) {
    console.error("❌ Failed to initialize monitor:", error.message);
    monitorStats.status = "error";
    monitorStats.lastError = error.message;
  }
}

/**
 * Run a monitor check
 */
async function runMonitorCheck() {
  try {
    monitorStats.lastCheck = new Date();
    monitorStats.checksPerformed++;

    console.log(`\n🔍 Running check #${monitorStats.checksPerformed}...`);
    const result = await monitor.checkForNewApartments();

    if (result && result.newApartments) {
      monitorStats.apartmentsFound += result.newApartments;
    }

    monitorStats.status = "running";
    console.log(`✅ Check completed successfully`);
  } catch (error) {
    console.error("❌ Error during check:", error.message);
    monitorStats.errors++;
    monitorStats.lastError = error.message;
  }
}

// Middleware
app.use(express.json());

/**
 * Health check endpoint (required by Render)
 */
app.get("/", (req, res) => {
  res.json({
    status: "ok",
    service: "Idealista Apartment Monitor",
    version: "1.0.0",
    uptime: Math.floor((Date.now() - monitorStats.uptime.getTime()) / 1000),
    monitor: {
      status: monitorStats.status,
      lastCheck: monitorStats.lastCheck,
      checksPerformed: monitorStats.checksPerformed
    }
  });
});

/**
 * Detailed status endpoint
 */
app.get("/status", (req, res) => {
  res.json({
    ...monitorStats,
    uptime: Math.floor((Date.now() - monitorStats.uptime.getTime()) / 1000),
    schedule: process.env.MONITOR_SCHEDULE || "*/10 * * * *",
    environment: process.env.NODE_ENV || "development"
  });
});

/**
 * Trigger manual check endpoint
 */
app.post("/check", async (req, res) => {
  if (!monitor || monitorStats.status !== "running") {
    return res.status(503).json({
      error: "Monitor not ready",
      status: monitorStats.status
    });
  }

  try {
    console.log("🔍 Manual check triggered via API");
    await runMonitorCheck();
    res.json({
      success: true,
      message: "Check completed successfully",
      stats: monitorStats
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
});

/**
 * Get monitor configuration
 */
app.get("/config", (req, res) => {
  res.json({
    schedule: process.env.MONITOR_SCHEDULE || "*/10 * * * *",
    notificationMode: process.env.NOTIFICATION_MODE || "summary",
    city: process.env.CITY || "not set",
    maxPrice: process.env.MAX_PRICE || "not set",
    bedrooms: process.env.BEDROOMS || "not set"
  });
});

/**
 * Health endpoint (alternative)
 */
app.get("/health", (req, res) => {
  const isHealthy = monitorStats.status === "running";
  res.status(isHealthy ? 200 : 503).json({
    status: isHealthy ? "healthy" : "unhealthy",
    monitor: monitorStats.status
  });
});

// Handle graceful shutdown
process.on("SIGTERM", async () => {
  console.log("\n🛑 SIGTERM received, shutting down gracefully...");
  if (monitor) {
    await monitor.close();
  }
  process.exit(0);
});

process.on("SIGINT", async () => {
  console.log("\n🛑 SIGINT received, shutting down gracefully...");
  if (monitor) {
    await monitor.close();
  }
  process.exit(0);
});

// Start server
app.listen(PORT, () => {
  console.log("=" .repeat(60));
  console.log(`🌐 Server running on port ${PORT}`);
  console.log(`📍 Environment: ${process.env.NODE_ENV || "development"}`);
  console.log("=" .repeat(60));

  // Initialize monitor after server starts
  initializeMonitor();
});
