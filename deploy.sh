#!/bin/bash

# ============================================================================
# Self-Evolving AI - GitHub Deployment Script for Google Colab
# ============================================================================

echo "🚀 Self-Evolving AI - Deployment Script"
echo "=========================================="
echo ""

# ============================================================================
# CONFIGURATION - Modify these values
# ============================================================================

# GitHub Configuration
GITHUB_USERNAME="craighckby-stack"
REPO_NAME="self-evolving-ai"

# IMPORTANT: You'll be prompted for these if not set
# Or set them here directly:
# GITHUB_TOKEN="ghp_your_token_here"

# ============================================================================
# COLORS
# ============================================================================
GREEN='\033[0;32m'
RED='\033[0;31m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# ============================================================================
# FUNCTIONS
# ============================================================================

print_success() {
    echo -e "${GREEN}✓ $1${NC}"
}

print_error() {
    echo -e "${RED}✗ $1${NC}"
}

print_info() {
    echo -e "${BLUE}ℹ $1${NC}"
}

print_warning() {
    echo -e "${YELLOW}⚠ $1${NC}"
}

# ============================================================================
# STEP 0: Check current directory
# ============================================================================

if [ ! -f "package.json" ]; then
    print_error "package.json not found!"
    echo "Please navigate to your project directory first:"
    echo "  cd /home/z/my-project"
    echo ""
    exit 1
fi

print_success "Found project directory"

# ============================================================================
# STEP 1: Check Git installation
# ============================================================================

if ! command -v git &> /dev/null; then
    print_error "Git is not installed!"
    echo "Installing git..."
    apt-get update -qq && apt-get install -y git
fi

print_success "Git is installed: $(git --version)"

# ============================================================================
# STEP 2: Get GitHub credentials
# ============================================================================

echo ""
echo "=========================================="
echo "📝 GitHub Configuration"
echo "=========================================="

if [ -z "$GITHUB_TOKEN" ]; then
    echo ""
    echo "Enter your GitHub Personal Access Token:"
    echo "(Create one at: https://github.com/settings/tokens)"
    echo ""
    read -s -p "Token: " GITHUB_TOKEN
    echo ""
fi

if [ -z "$GITHUB_TOKEN" ]; then
    print_error "GitHub token is required!"
    exit 1
fi

REPO_URL="https://${GITHUB_USERNAME}:${GITHUB_TOKEN}@github.com/${GITHUB_USERNAME}/${REPO_NAME}.git"
PUBLIC_REPO_URL="https://github.com/${GITHUB_USERNAME}/${REPO_NAME}.git"

print_success "GitHub username: $GITHUB_USERNAME"
print_success "Repository: $REPO_NAME"

# ============================================================================
# STEP 3: Check if repository exists on GitHub
# ============================================================================

echo ""
echo "=========================================="
echo "🔍 Checking GitHub Repository"
echo "=========================================="

HTTP_STATUS=$(curl -s -o /dev/null -w "%{http_code}" -u "${GITHUB_USERNAME}:${GITHUB_TOKEN}" \
    "https://api.github.com/repos/${GITHUB_USERNAME}/${REPO_NAME}")

if [ "$HTTP_STATUS" = "200" ]; then
    print_success "Repository exists on GitHub"
    print_info "URL: $PUBLIC_REPO_URL"
elif [ "$HTTP_STATUS" = "404" ]; then
    print_warning "Repository does not exist on GitHub!"
    echo ""
    echo "Please create the repository first:"
    echo "  1. Go to: https://github.com/new"
    echo "  2. Repository name: $REPO_NAME"
    echo "  3. Make it private or public (your choice)"
    echo "  4. DO NOT initialize with README, .gitignore, or license"
    echo "  5. Click 'Create repository'"
    echo ""
    read -p "Press Enter once you've created the repository..." -r
else
    print_error "Could not check repository (HTTP $HTTP_STATUS)"
    print_info "Check your token and try again"
    exit 1
fi

# ============================================================================
# STEP 4: Initialize Git (if needed)
# ============================================================================

echo ""
echo "=========================================="
echo "🔧 Initializing Git"
echo "=========================================="

if [ ! -d ".git" ]; then
    print_info "Initializing git repository..."
    git init
    git branch -M main
    print_success "Git repository initialized"
else
    print_success "Git repository already exists"
fi

# Configure git user
git config user.email "deployment@self-evolving-ai.local"
git config user.name "Self-Evolving AI"

# ============================================================================
# STEP 5: Create .gitignore (if needed)
# ============================================================================

if [ ! -f ".gitignore" ]; then
    print_info "Creating .gitignore..."
    cat > .gitignore << 'EOF'
# Environment variables
.env
.env.local
.env.*.local

# Database
*.db
*.db-journal
*.db-shm
*.db-wal
db/

# Dependencies
node_modules/
/.pnp
.pnp.js

# Next.js
.next/
out/
build/
dist/

# Debug
npm-debug.log*
yarn-debug.log*
yarn-error.log*

# Local env files
.vercel
*.local

# Vercel
.vercel/

# TypeScript
*.tsbuildinfo
next-env.d.ts

# IDEs
.vscode/
.idea/
*.swp
*.swo
*~

# OS
.DS_Store
Thumbs.db
EOF
    print_success ".gitignore created"
else
    print_success ".gitignore already exists"
fi

# ============================================================================
# STEP 6: Stage files
# ============================================================================

echo ""
echo "=========================================="
echo "📦 Staging Files"
echo "=========================================="

git add .

# Count files
FILE_COUNT=$(git diff --cached --name-only | wc -l)
print_success "Staged $FILE_COUNT files"

# ============================================================================
# STEP 7: Check for sensitive files
# ============================================================================

echo ""
echo "=========================================="
echo "🔒 Security Check"
echo "=========================================="

SENSITIVE_FILES=$(git diff --cached --name-only | grep -E '\.env$' || true)

if [ -n "$SENSITIVE_FILES" ]; then
    print_error "WARNING: .env files are staged!"
    print_info "Removing .env files from commit..."
    git reset HEAD .env
    git reset HEAD .env.* 2>/dev/null || true
    print_warning ".env files will NOT be committed"
fi

print_success "Security check passed"

# ============================================================================
# STEP 8: Create commit
# ============================================================================

echo ""
echo "=========================================="
echo "✍️  Creating Commit"
echo "=========================================="

COMMIT_MESSAGE="feat: Self-Evolving AI with Knowledge Base

- Self-reflection AI engine
- Knowledge base with document upload
- 16 pre-seeded repositories (Google, DeepSeek, Z.ai, etc.)
- Repository sync and management
- GitHub and Gemini API integration
- Production-ready deployment

Built with Next.js 15, TypeScript, Prisma, Gemini 2.0"

git commit -m "$COMMIT_MESSAGE"
print_success "Commit created"

# ============================================================================
# STEP 9: Add remote
# ============================================================================

echo ""
echo "=========================================="
echo "🔗 Adding Remote"
echo "=========================================="

if git remote get-url origin &> /dev/null; then
    print_info "Remote 'origin' exists, updating..."
    git remote set-url origin "$REPO_URL"
else
    print_info "Adding remote 'origin'..."
    git remote add origin "$REPO_URL"
fi

print_success "Remote configured"

# ============================================================================
# STEP 10: Push to GitHub
# ============================================================================

echo ""
echo "=========================================="
echo "🚀 Pushing to GitHub"
echo "=========================================="

print_info "Pushing to: $PUBLIC_REPO_URL"
echo ""
echo "This may take a few minutes..."
echo ""

if git push -u origin main; then
    echo ""
    echo "=========================================="
    print_success "🎉 DEPLOYMENT SUCCESSFUL!"
    echo "=========================================="
    echo ""
    print_info "Your repository is live at:"
    echo "  $PUBLIC_REPO_URL"
    echo ""
    echo "Next steps:"
    echo "  1. Go to https://vercel.com"
    echo "  2. Import your repository"
    echo "  3. Add environment variables (GITHUB_TOKEN, GEMINI_API_KEY)"
    echo "  4. Deploy!"
    echo ""
else
    echo ""
    echo "=========================================="
    print_error "PUSH FAILED!"
    echo "=========================================="
    echo ""
    print_info "Common issues:"
    echo "  - Repository doesn't exist on GitHub"
    echo "  - Token doesn't have 'repo' scope"
    echo "  - Token is expired"
    echo ""
    print_info "Check the error messages above and try again"
    exit 1
fi
