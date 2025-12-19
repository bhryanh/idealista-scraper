const HttpClient = require("./httpClient");
const { parseListings } = require("../parsers/listingParser");
const { sleep } = require("../utils/helpers");
const { SEARCH_URL, SCRAPER_SETTINGS } = require("../config/constants");

/**
 * Idealista scraper service
 * Handles scraping logic for multiple pages
 */
class IdealistaScraper {
  constructor() {
    this.httpClient = new HttpClient();
  }

  /**
   * Build URL for a specific page number
   * Dynamically constructs paginated URLs based on the base search URL
   * @param {number} pageNumber - Page number to build URL for
   * @returns {string} Complete URL for the page
   */
  buildPageUrl(pageNumber) {
    if (pageNumber === 1) {
      return SEARCH_URL;
    }

    // Extract base parts from SEARCH_URL and add pagination
    const url = new URL(SEARCH_URL);
    const pathParts = url.pathname.split('/').filter(part => part);

    // Insert pagination before the last segment or modify appropriately
    const paginatedPath = `/${pathParts.join('/')}/pagina-${pageNumber}.htm`;

    return `${url.origin}${paginatedPath}${url.search}`;
  }

  /**
   * Scrape a single page
   * @param {number} pageNumber - Page number to scrape
   * @returns {Promise<Array>} Array of listings found on the page
   */
  async scrapePage(pageNumber) {
    const url = this.buildPageUrl(pageNumber);

    try {
      const html = await this.httpClient.getPageContent(url);
      const listings = parseListings(html);

      return listings;
    } catch (error) {
      console.error(`Error on page ${pageNumber}:`, error.message);
      throw error;
    }
  }

  /**
   * Scrape multiple pages
   * @param {number} maxPages - Maximum number of pages to scrape
   * @returns {Promise<Array>} Array of all listings found
   */
  async scrapeMultiplePages(maxPages = SCRAPER_SETTINGS.maxPages) {
    const allResults = [];

    for (let page = 1; page <= maxPages; page++) {
      console.log(`\n📄 Fetching page ${page}...`);

      try {
        const listings = await this.scrapePage(page);

        if (listings.length === 0) {
          console.log("No results found. Stopping.");
          break;
        }

        console.log(
          `✅ Found ${listings.length} apartments on page ${page}`
        );
        allResults.push(...listings);

        // Add delay between requests to avoid overloading the server
        if (page < maxPages) {
          const delay =
            SCRAPER_SETTINGS.requestDelayMin +
            Math.random() *
              (SCRAPER_SETTINGS.requestDelayMax -
                SCRAPER_SETTINGS.requestDelayMin);
          await sleep(delay);
        }
      } catch (error) {
        console.error(`Error on page ${page}:`, error.message);
        break;
      }
    }

    return allResults;
  }

  /**
   * Close the HTTP client and cleanup resources
   */
  async close() {
    await this.httpClient.close();
  }
}

module.exports = IdealistaScraper;
