const puppeteer = require("puppeteer");
const {
  BROWSER_CONFIG,
  USER_AGENT,
  VIEWPORT,
  HTTP_HEADERS,
  SCRAPER_SETTINGS,
} = require("../config/constants");

/**
 * Browser manager for Puppeteer
 * Handles browser initialization and page creation
 */
class BrowserManager {
  constructor() {
    this.browser = null;
  }

  /**
   * Initialize and return a Puppeteer browser instance
   * Reuses existing browser if already initialized
   */
  async initialize() {
    if (!this.browser) {
      this.browser = await puppeteer.launch(BROWSER_CONFIG);
    }
    return this.browser;
  }

  /**
   * Create a new page with configured settings
   * @returns {Promise<Page>} Configured Puppeteer page
   */
  async createPage() {
    const browser = await this.initialize();
    const page = await browser.newPage();

    // Set user agent to simulate a real browser
    await page.setUserAgent(USER_AGENT);

    // Set viewport dimensions
    await page.setViewport(VIEWPORT);

    // Remove automation detection
    await page.evaluateOnNewDocument(() => {
      Object.defineProperty(navigator, "webdriver", {
        get: () => false,
      });
    });

    // Set HTTP headers
    await page.setExtraHTTPHeaders(HTTP_HEADERS);

    return page;
  }

  /**
   * Navigate to a URL and return the HTML content
   * @param {string} url - URL to navigate to
   * @returns {Promise<string>} HTML content of the page
   */
  async getPageContent(url) {
    const page = await this.createPage();

    try {
      console.log(`   Loading ${url}...`);

      await page.goto(url, {
        waitUntil: "networkidle2",
        timeout: SCRAPER_SETTINGS.navigationTimeout,
      });

      // Wait for content to fully load
      await new Promise((resolve) =>
        setTimeout(resolve, SCRAPER_SETTINGS.pageLoadDelay)
      );

      const html = await page.content();
      return html;
    } finally {
      await page.close();
    }
  }

  /**
   * Close the browser instance
   */
  async close() {
    if (this.browser) {
      await this.browser.close();
      this.browser = null;
      console.log("\n🔒 Browser closed.");
    }
  }
}

module.exports = BrowserManager;
