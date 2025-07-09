#!/bin/bash

# Build Release Script for Expo Custom Tabs
# This script provides convenient commands for building Android releases

set -e  # Exit on any error

echo "🏗️  Expo Custom Tabs - Build Release Script"
echo "========================================"

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Function to print colored output
print_status() {
    echo -e "${BLUE}ℹ️  $1${NC}"
}

print_success() {
    echo -e "${GREEN}✅ $1${NC}"
}

print_warning() {
    echo -e "${YELLOW}⚠️  $1${NC}"
}

print_error() {
    echo -e "${RED}❌ $1${NC}"
}

# Function to check if command exists
command_exists() {
    command -v "$1" >/dev/null 2>&1
}

# Check prerequisites
check_prerequisites() {
    print_status "Checking prerequisites..."
    
    if ! command_exists npm; then
        print_error "npm is not installed"
        exit 1
    fi
    
    if ! command_exists npx; then
        print_error "npx is not installed"
        exit 1
    fi
    
    if [ ! -f "package.json" ]; then
        print_error "package.json not found. Are you in the project root?"
        exit 1
    fi
    
    if [ ! -d "android" ]; then
        print_error "Android folder not found. Run 'npm run prebuild' first."
        exit 1
    fi
    
    print_success "Prerequisites check passed"
}

# Build functions
build_apk() {
    print_status "Building Android APK (Release)..."
    npm run build:android:release
    
    APK_PATH="android/app/build/outputs/apk/release/app-release.apk"
    if [ -f "$APK_PATH" ]; then
        print_success "APK built successfully!"
        print_status "APK location: $APK_PATH"
        
        # Get file size
        SIZE=$(du -h "$APK_PATH" | cut -f1)
        print_status "APK size: $SIZE"
    else
        print_error "APK build failed - file not found"
        exit 1
    fi
}

build_bundle() {
    print_status "Building Android App Bundle (Release)..."
    npm run build:android:bundle
    
    BUNDLE_PATH="android/app/build/outputs/bundle/release/app-release.aab"
    if [ -f "$BUNDLE_PATH" ]; then
        print_success "App Bundle built successfully!"
        print_status "Bundle location: $BUNDLE_PATH"
        
        # Get file size
        SIZE=$(du -h "$BUNDLE_PATH" | cut -f1)
        print_status "Bundle size: $SIZE"
    else
        print_error "Bundle build failed - file not found"
        exit 1
    fi
}

clean_build() {
    print_status "Cleaning build artifacts..."
    npm run build:android:clean
    print_success "Build artifacts cleaned"
}

prebuild() {
    print_status "Running Expo prebuild (clean)..."
    npm run prebuild
    print_success "Prebuild completed"
}

# Help function
show_help() {
    echo ""
    echo "Usage: ./build-release.sh [command]"
    echo ""
    echo "Commands:"
    echo "  apk         Build Android APK (Release)"
    echo "  bundle      Build Android App Bundle (Release)"
    echo "  clean       Clean build artifacts"
    echo "  prebuild    Run Expo prebuild (clean)"
    echo "  full        Full build process (prebuild + APK)"
    echo "  help        Show this help message"
    echo ""
    echo "Examples:"
    echo "  ./build-release.sh apk       # Build APK only"
    echo "  ./build-release.sh bundle    # Build App Bundle for Play Store"
    echo "  ./build-release.sh full      # Full clean build"
    echo ""
}

# Main script logic
case "${1:-help}" in
    "apk")
        check_prerequisites
        build_apk
        ;;
    "bundle")
        check_prerequisites
        build_bundle
        ;;
    "clean")
        check_prerequisites
        clean_build
        ;;
    "prebuild")
        check_prerequisites
        prebuild
        ;;
    "full")
        check_prerequisites
        print_status "Starting full build process..."
        prebuild
        build_apk
        print_success "Full build completed!"
        ;;
    "help"|*)
        show_help
        ;;
esac

echo ""
print_success "Build script finished!"
