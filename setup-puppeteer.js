/**
 * Setup script to ensure Puppeteer Chrome is installed
 * Run this during build on Render
 */

const { execSync } = require('child_process');
const path = require('path');

console.log('🔧 Setting up Puppeteer...');
console.log('Cache directory:', process.env.PUPPETEER_CACHE_DIR || 'default');

try {
  // Use npx to install chrome browser
  console.log('📦 Installing Chrome browser...');
  execSync('npx puppeteer browsers install chrome', {
    stdio: 'inherit',
    env: {
      ...process.env,
      PUPPETEER_CACHE_DIR: process.env.PUPPETEER_CACHE_DIR || path.join(__dirname, '.cache', 'puppeteer')
    }
  });

  console.log('✅ Puppeteer setup completed successfully!');
} catch (error) {
  console.error('❌ Error setting up Puppeteer:', error.message);
  process.exit(1);
}
