/**
 * Idealista Scraper - Main Entry Point
 *
 * Scrapes apartment listings from Idealista.com
 * and exports them to JSON and CSV formats.
 */

const IdealistaScraper = require("./src/services/scraper");
const { saveToJson, saveToCsv, displayResults } = require("./src/utils/fileWriter");
const { SCRAPER_SETTINGS } = require("./src/config/constants");

/**
 * Main function to run the scraper
 */
async function main() {
  console.log("🚀 Starting Idealista scraper...\n");

  const scraper = new IdealistaScraper();

  try {
    // Scrape multiple pages (default: 3 pages, configurable in constants)
    const apartments = await scraper.scrapeMultiplePages(
      SCRAPER_SETTINGS.maxPages
    );

    console.log(`\n📊 Total apartments found: ${apartments.length}`);

    // Display first few results
    displayResults(apartments, 3);

    // Save to JSON and CSV files
    saveToJson(apartments);
    saveToCsv(apartments);

    console.log("\n✅ Scraping completed successfully!");
  } catch (error) {
    console.error("❌ Error during scraping:", error.message);
    process.exit(1);
  } finally {
    // Close the browser to free up resources
    await scraper.close();
  }
}

// Run the scraper
if (require.main === module) {
  main();
}

module.exports = { main };
