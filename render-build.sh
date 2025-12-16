#!/usr/bin/env bash
# Render build script with Puppeteer cache optimization
# exit on error
set -o errexit

echo "🚀 Starting Render build..."

# Install npm dependencies
echo "📦 Installing npm dependencies..."
npm install

PUPPETEER_CACHE_DIR=/opt/render/.cache/puppeteer
mkdir -p $PUPPETEER_CACHE_DIR

npx puppeteer browsers install chrome

if [[ ! -d $PUPPETEER_CACHE_DIR ]]; then
echo "...Copying Puppeteer Cache from Build Cache"
# Copying from the actual path where Puppeteer stores its Chrome binary
cp -R /opt/render/.cache/puppeteer/chrome/linux-143.0.7499.42/chrome-linux64/ $PUPPETEER_CACHE_DIR
else
echo "...Storing Puppeteer Cache in Build Cache"
cp -R $PUPPETEER_CACHE_DIR /opt/render/.cache/puppeteer/chrome/linux-143.0.7499.42/chrome-linux64/
fi

echo "✅ Build completed successfully!"
