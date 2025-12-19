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
 * Scrape.do API configuration
 * Get your token from https://www.scrape.do/dashboard
 */
const SCRAPE_DO_CONFIG = {
  apiUrl: process.env.SCRAPE_DO_API_URL || "http://api.scrape.do",
  token: process.env.SCRAPE_DO_TOKEN,
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

module.exports = {
  BASE_URL,
  SEARCH_URL,
  SCRAPE_DO_CONFIG,
  SCRAPER_SETTINGS,
};
