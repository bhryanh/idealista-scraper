const axios = require("axios");
const { SCRAPE_DO_CONFIG, SCRAPER_SETTINGS } = require("../config/constants");

/**
 * HTTP Client for scrape.do API
 * Handles HTTP requests through scrape.do proxy service
 */
class HttpClient {
  constructor() {
    this.apiUrl = SCRAPE_DO_CONFIG.apiUrl;
    this.token = SCRAPE_DO_CONFIG.token;
  }

  /**
   * Fetch page content through scrape.do
   * @param {string} targetUrl - URL to scrape
   * @returns {Promise<string>} HTML content of the page
   */
  async getPageContent(targetUrl) {
    try {
      console.log(`   Loading ${targetUrl}...`);

      const encodedUrl = encodeURIComponent(targetUrl);
      const requestUrl = `${this.apiUrl}?token=${this.token}&url=${encodedUrl}&geoCode=es&render=true&super=true`;

      const response = await axios({
        method: "get",
        url: requestUrl,
        headers: {
          "Accept-Language": "es-ES,es;q=0.9,pt-BR;q=0.8,pt;q=0.7,en;q=0.6",
        },
        timeout: SCRAPER_SETTINGS.navigationTimeout,
      });

      if (response.status !== 200) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      }

      return response.data;
    } catch (error) {
      console.error(`Error fetching ${targetUrl}:`, error.message);
      throw error;
    }
  }

  /**
   * Close/cleanup method for compatibility with old BrowserManager API
   * No actual cleanup needed for HTTP client, but kept for API consistency
   */
  async close() {
    console.log("\n🔒 HTTP Client closed.");
  }
}

module.exports = HttpClient;
