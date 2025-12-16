/**
 * Utility helper functions
 */

/**
 * Sleep for a specified number of milliseconds
 * @param {number} ms - Milliseconds to sleep
 * @returns {Promise} Promise that resolves after the specified time
 */
function sleep(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

/**
 * Format a timestamp to a readable date string
 * @param {Date} date - Date object to format
 * @returns {string} Formatted date string
 */
function formatDate(date = new Date()) {
  return date.toISOString().split("T")[0];
}

/**
 * Generate a random delay between min and max milliseconds
 * @param {number} min - Minimum delay in milliseconds
 * @param {number} max - Maximum delay in milliseconds
 * @returns {number} Random delay value
 */
function randomDelay(min, max) {
  return min + Math.random() * (max - min);
}

/**
 * Sanitize a string for use in filenames
 * @param {string} str - String to sanitize
 * @returns {string} Sanitized string
 */
function sanitizeFilename(str) {
  return str.replace(/[^a-z0-9]/gi, "_").toLowerCase();
}

module.exports = {
  sleep,
  formatDate,
  randomDelay,
  sanitizeFilename,
};
