const cheerio = require("cheerio");
const { BASE_URL } = require("../config/constants");

/**
 * Parse HTML content and extract apartment listings
 * @param {string} html - HTML content to parse
 * @returns {Array} Array of parsed listing objects
 */
function parseListings(html) {
  const $ = cheerio.load(html);
  const results = [];

  // Each listing is in <article class="item">
  $("article.item").each((index, element) => {
    const $card = $(element);

    // Extract link and title
    const $link = $card.find("a.item-link");
    const title = $link.attr("title")?.trim() || "";
    const relativeUrl = $link.attr("href") || "";
    const url = relativeUrl ? BASE_URL + relativeUrl : "";

    // Extract price
    const price = $card.find("span.item-price").text().trim() || null;

    // Extract details (bedrooms, area, etc.)
    const details = [];
    $card.find("span.item-detail").each((i, el) => {
      details.push($(el).text().trim());
    });
    const bedrooms = details[0] || null;
    const area = details[1] || null;

    // Extract tags (e.g., "Pets allowed")
    const tags = $card.find("span.listing-tags").text().trim() || null;

    results.push({
      title,
      url,
      price,
      bedrooms,
      area,
      tags,
    });
  });

  return results;
}

/**
 * Extract a single listing's details from its detail page
 * @param {string} html - HTML content of the detail page
 * @returns {Object} Detailed listing information
 */
function parseListingDetails(html) {
  const $ = cheerio.load(html);

  // This function can be expanded to extract more details
  // from individual listing pages if needed
  return {
    description: $(".comment").text().trim() || null,
    features: [],
  };
}

module.exports = {
  parseListings,
  parseListingDetails,
};
