/**
 * Configuration constants for the Idealista scraper
 * Loads configuration from .env file
 */

require("dotenv").config();

/**
 * Build search URL from environment variables
 * Constructs URL in format: /alquiler-viviendas/city-province/con-filters/?ordenado-por=sort
 */
function buildSearchUrl() {
  const baseUrl = process.env.BASE_URL || "https://www.idealista.com";
  const city = process.env.CITY || "valencia";
  const province = process.env.PROVINCE || "valencia";
  const sortOrder = process.env.SORT_ORDER || "fecha-publicacion-desc";

  const filters = [];

  // Price filter
  const maxPrice = process.env.MAX_PRICE;
  if (maxPrice) {
    filters.push(`precio-hasta_${maxPrice}`);
  }

  // Bedrooms filter
  const bedrooms = process.env.BEDROOMS;
  if (bedrooms) {
    const bedroomMap = {
      dos: "de-dos-dormitorios",
      tres: "de-tres-dormitorios",
      "cuatro-cinco-o-mas": "de-cuatro-cinco-habitaciones-o-mas",
    };
    bedrooms.split(",").forEach((bedroom) => {
      const mapped = bedroomMap[bedroom.trim()];
      if (mapped) filters.push(mapped);
    });
  }

  // Bathrooms filter
  const bathrooms = process.env.BATHROOMS;
  if (bathrooms) {
    const bathroomMap = {
      dos: "dos-banos",
      "tres-o-mas": "tres-banos-o-mas",
    };
    bathrooms.split(",").forEach((bathroom) => {
      const mapped = bathroomMap[bathroom.trim()];
      if (mapped) filters.push(mapped);
    });
  }

  // Air conditioning
  if (process.env.AIR_CONDITIONING === "true") {
    filters.push("aireacondicionado");
  }

  // Publication date filter
  const publishedFilter = process.env.PUBLISHED_FILTER;
  if (publishedFilter) {
    filters.push(`publicado_${publishedFilter}`);
  }

  // Pets filter
  if (process.env.ALLOW_PETS === "true") {
    filters.push("mascotas");
  }

  // Rental type
  const rentalType = process.env.RENTAL_TYPE;
  if (rentalType) {
    filters.push(rentalType);
  }

  // Build complete URL
  const filterString = filters.length > 0 ? `con-${filters.join(",")}` : "";
  const path = filterString
    ? `/alquiler-viviendas/${city}-${province}/${filterString}/`
    : `/alquiler-viviendas/${city}-${province}/`;

  return `${baseUrl}${path}?ordenado-por=${sortOrder}`;
}

const BASE_URL = process.env.BASE_URL || "https://www.idealista.com";
const SEARCH_URL = buildSearchUrl();

/**
 * Browser configuration settings
 * Optimized for both local development and cloud deployment
 */
const BROWSER_CONFIG = {
  headless: true,
  // Use Puppeteer's bundled Chromium (works both locally and on Render)
  args: [
    "--no-sandbox",
    "--disable-setuid-sandbox",
    "--disable-blink-features=AutomationControlled",
    "--disable-dev-shm-usage",
    "--disable-gpu",
    "--disable-software-rasterizer",
    "--disable-extensions",
    "--disable-accelerated-2d-canvas",
    "--no-first-run",
    "--no-zygote",
    "--single-process",
  ],
};

/**
 * User agent string to simulate a real browser
 */
const USER_AGENT =
  "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/131.0.0.0 Safari/537.36";

/**
 * Viewport configuration
 */
const VIEWPORT = {
  width: 1920,
  height: 1080,
};

/**
 * HTTP headers for requests
 */
const HTTP_HEADERS = {
  "Accept-Language": "es-ES,es;q=0.9,pt-BR;q=0.8,pt;q=0.7,en;q=0.6",
};

/**
 * Scraper settings
 */
const SCRAPER_SETTINGS = {
  navigationTimeout: 30000,
  pageLoadDelay: 2000,
  requestDelayMin: parseInt(process.env.REQUEST_DELAY_MIN) || 3000,
  requestDelayMax: parseInt(process.env.REQUEST_DELAY_MAX) || 5000,
  maxPages: parseInt(process.env.MAX_PAGES) || 3,
};

/**
 * Output file names
 */
const OUTPUT_FILES = {
  json: process.env.OUTPUT_JSON || "apartments.json",
  csv: process.env.OUTPUT_CSV || "apartments.csv",
};

module.exports = {
  BASE_URL,
  SEARCH_URL,
  BROWSER_CONFIG,
  USER_AGENT,
  VIEWPORT,
  HTTP_HEADERS,
  SCRAPER_SETTINGS,
  OUTPUT_FILES,
};
