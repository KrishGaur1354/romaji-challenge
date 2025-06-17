#!/bin/bash

# Romaji Challenge Mobile App Build Script
echo "🚀 Building Romaji Challenge Mobile App..."

# Check if required tools are installed
echo "📋 Checking prerequisites..."

# Check Node.js
if ! command -v node &> /dev/null; then
    echo "❌ Node.js is not installed. Please install Node.js first."
    exit 1
fi

# Check npm
if ! command -v npm &> /dev/null; then
    echo "❌ npm is not installed. Please install npm first."
    exit 1
fi

echo "✅ Prerequisites check passed!"

# Install dependencies
echo "📦 Installing dependencies..."
npm install

# Build the web app
echo "🔨 Building web application..."
npm run build

# Sync with mobile platforms
echo "📱 Syncing with mobile platforms..."
npm run mobile:sync

# Check platform argument
PLATFORM=${1:-"android"}

if [ "$PLATFORM" = "android" ]; then
    echo "🤖 Opening Android project..."
    if command -v adb &> /dev/null; then
        echo "📱 Android Debug Bridge found!"
        npm run mobile:open:android
    else
        echo "⚠️  Android Studio not found. Please install Android Studio to continue."
        echo "   Download from: https://developer.android.com/studio"
    fi
elif [ "$PLATFORM" = "ios" ]; then
    echo "🍎 Opening iOS project..."
    if [[ "$OSTYPE" == "darwin"* ]]; then
        if command -v xcodebuild &> /dev/null; then
            echo "🛠️  Xcode found!"
            npm run mobile:open:ios
        else
            echo "⚠️  Xcode not found. Please install Xcode to continue."
            echo "   Download from Mac App Store"
        fi
    else
        echo "❌ iOS development requires macOS. Current OS: $OSTYPE"
        exit 1
    fi
elif [ "$PLATFORM" = "both" ]; then
    echo "📱 Preparing both platforms..."
    npm run mobile:open:android
    if [[ "$OSTYPE" == "darwin"* ]]; then
        npm run mobile:open:ios
    else
        echo "⚠️  Skipping iOS (requires macOS)"
    fi
else
    echo "❌ Unknown platform: $PLATFORM"
    echo "Usage: $0 [android|ios|both]"
    exit 1
fi

echo "✅ Mobile app setup complete!"
echo ""
echo "📖 Next steps:"
echo "   1. Open the respective IDE (Android Studio or Xcode)"
echo "   2. Connect your device or start an emulator"
echo "   3. Build and run the app"
echo ""
echo "🌐 Alternative: Use PWA for instant mobile experience"
echo "   Visit the website on mobile and 'Add to Home Screen'" 