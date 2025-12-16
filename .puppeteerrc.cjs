const { join } = require('path');

/**
 * Puppeteer configuration file
 * Ensures Chrome is found in the correct cache location on Render
 */
module.exports = {
  cacheDirectory: process.env.PUPPETEER_CACHE_DIR || join(__dirname, '.cache', 'puppeteer'),
};
