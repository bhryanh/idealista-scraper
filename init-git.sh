#!/bin/bash

# Script to initialize Git and prepare for deployment
# Usage: bash init-git.sh

echo "🚀 Initializing Git repository for deployment..."
echo ""

# Check if git is already initialized
if [ -d ".git" ]; then
    echo "✅ Git already initialized"
else
    echo "📦 Initializing Git..."
    git init
    echo "✅ Git initialized"
fi

# Check if remote exists
if git remote | grep -q "origin"; then
    echo "✅ Remote 'origin' already exists"
    REMOTE_URL=$(git remote get-url origin)
    echo "   Current remote: $REMOTE_URL"
    echo ""
    echo "❓ Do you want to change the remote URL? (y/n)"
    read -r response
    if [[ "$response" == "y" ]]; then
        echo "Enter new GitHub repository URL:"
        echo "Example: https://github.com/YOUR_USERNAME/idealista-scraper.git"
        read -r new_url
        git remote set-url origin "$new_url"
        echo "✅ Remote URL updated"
    fi
else
    echo ""
    echo "📝 Enter your GitHub repository URL:"
    echo "Example: https://github.com/YOUR_USERNAME/idealista-scraper.git"
    echo ""
    read -r repo_url

    if [ -z "$repo_url" ]; then
        echo "❌ No URL provided. Skipping remote setup."
        echo "   You can add it later with:"
        echo "   git remote add origin <your-repo-url>"
    else
        git remote add origin "$repo_url"
        echo "✅ Remote 'origin' added"
    fi
fi

echo ""
echo "📋 Checking for staged changes..."

# Check if there are changes to commit
if git diff-index --quiet HEAD -- 2>/dev/null; then
    echo "✅ No changes to commit"
else
    echo "📦 Staging all files..."
    git add .

    echo ""
    echo "💬 Enter commit message (or press Enter for default):"
    read -r commit_msg

    if [ -z "$commit_msg" ]; then
        commit_msg="Initial commit: Idealista scraper with monitoring"
    fi

    git commit -m "$commit_msg"
    echo "✅ Changes committed"
fi

echo ""
echo "🌿 Current branch:"
git branch --show-current

echo ""
echo "📊 Repository status:"
git status --short

echo ""
echo "✅ Git setup complete!"
echo ""
echo "Next steps:"
echo "1. Create a repository on GitHub: https://github.com/new"
echo "2. Push your code: git push -u origin main"
echo "3. Deploy on Render: https://render.com"
echo ""
echo "See QUICK_DEPLOY.md for detailed instructions!"
