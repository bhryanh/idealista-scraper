#!/usr/bin/env bash
# Render build script with Puppeteer cache optimization
# exit on error
set -o errexit

echo "🚀 Starting Render build..."

# Install npm dependencies
echo "📦 Installing npm dependencies..."
npm install

# Set Puppeteer cache directory to use Render's persistent cache
export PUPPETEER_CACHE_DIR=/opt/render/.cache/puppeteer

# Create cache directory if it doesn't exist
mkdir -p $PUPPETEER_CACHE_DIR

# Install Chrome (will use cached version if available)
echo "🌐 Installing Chrome for Puppeteer..."
npx puppeteer browsers install chrome

echo "✓ Chrome installed at: $PUPPETEER_CACHE_DIR"

echo "✅ Build completed successfully!"
