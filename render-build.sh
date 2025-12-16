#!/usr/bin/env bash
# Render build script with Puppeteer cache optimization
# exit on error
set -o errexit

echo "🚀 Starting Render build..."

# Install npm dependencies
echo "📦 Installing npm dependencies..."
npm install

# Store/pull Puppeteer cache with build cache
if [[ ! -d $PUPPETEER_CACHE_DIR ]]; then
  echo "📥 Copying Puppeteer Cache from Build Cache..."
  cp -R $XDG_CACHE_HOME/puppeteer/ $PUPPETEER_CACHE_DIR
else
  echo "💾 Storing Puppeteer Cache in Build Cache..."
  cp -R $PUPPETEER_CACHE_DIR $XDG_CACHE_HOME
fi

echo "✅ Build completed successfully!"
