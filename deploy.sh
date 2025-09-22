#!/bin/bash

# FarmFresh Deployment Script
# This script automates the deployment process

set -e  # Exit on any error

echo "🚀 FarmFresh Deployment Starting..."
echo "=================================="

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Function to print colored output
print_status() {
    echo -e "${GREEN}✅ $1${NC}"
}

print_error() {
    echo -e "${RED}❌ $1${NC}"
}

print_warning() {
    echo -e "${YELLOW}⚠️  $1${NC}"
}

print_info() {
    echo -e "${BLUE}ℹ️  $1${NC}"
}

# Check if we're in the right directory
if [ ! -f "package.json" ]; then
    print_error "package.json not found. Please run this script from your project root."
    exit 1
fi

# Check if node_modules exists
if [ ! -d "node_modules" ]; then
    print_info "Installing dependencies..."
    npm install
fi

# Clean previous build
if [ -d "dist" ]; then
    print_info "Cleaning previous build..."
    rm -rf dist
fi

# Build the application
print_info "Building application for production..."
npm run build

if [ $? -eq 0 ]; then
    print_status "Build completed successfully!"
else
    print_error "Build failed! Please check the errors above."
    exit 1
fi

# Check if dist directory was created
if [ ! -d "dist" ]; then
    print_error "Build directory 'dist' not found. Build may have failed."
    exit 1
fi

print_status "Build verification passed!"

# Ask user which deployment platform they want to use
echo ""
echo "🌐 Choose your deployment platform:"
echo "1) Vercel (Recommended)"
echo "2) Netlify"
echo "3) Firebase Hosting"
echo "4) Manual (just build)"
echo ""
read -p "Enter your choice (1-4): " choice

case $choice in
    1)
        print_info "Deploying to Vercel..."
        if command -v vercel &> /dev/null; then
            vercel --prod
            print_status "Deployed to Vercel successfully!"
        else
            print_warning "Vercel CLI not found. Installing..."
            npm install -g vercel
            print_info "Please run 'vercel login' and then run this script again."
        fi
        ;;
    2)
        print_info "Deploying to Netlify..."
        if command -v netlify &> /dev/null; then
            netlify deploy --prod --dir=dist
            print_status "Deployed to Netlify successfully!"
        else
            print_warning "Netlify CLI not found. Installing..."
            npm install -g netlify-cli
            print_info "Please run 'netlify login' and then run this script again."
        fi
        ;;
    3)
        print_info "Deploying to Firebase..."
        if command -v firebase &> /dev/null; then
            firebase deploy
            print_status "Deployed to Firebase successfully!"
        else
            print_warning "Firebase CLI not found. Installing..."
            npm install -g firebase-tools
            print_info "Please run 'firebase login' and 'firebase init' first."
        fi
        ;;
    4)
        print_info "Manual deployment selected."
        print_status "Your built files are in the 'dist' directory."
        print_info "You can now upload these files to your hosting provider."
        ;;
    *)
        print_error "Invalid choice. Please run the script again."
        exit 1
        ;;
esac

echo ""
print_status "Deployment process completed!"
echo ""
print_info "📋 Post-deployment checklist:"  
echo "   1. Test your application at the deployed URL"
echo "   2. Verify environment variables are set correctly"
echo "   3. Check Supabase authentication settings"
echo "   4. Test real-time features"
echo "   5. Monitor for any errors"
echo ""
print_status "🎉 Your FarmFresh app is now live!"