# Romaji Challenge - Learn Japanese Characters

A modern, elegant web application for learning Japanese Hiragana and Katakana characters through interactive challenges.

## Features

- **Character Recognition**: Test your knowledge by typing the romaji for displayed characters
- **Hand Drawing Practice**: Draw characters and get instant feedback with advanced stroke recognition
- **Translation Challenge**: Translate Japanese words to English to expand your vocabulary
- **Multiple Character Sets**: Practice both Hiragana and Katakana
- **Elegant UI**: Clean, modern interface with beautiful animations and glass-morphism design
- **Progress Tracking**: Monitor your learning journey with detailed score tracking
- **Mobile Optimized**: Responsive design that works perfectly on all devices
- **PWA Support**: Install as a mobile app for offline access
- **Dark/Light Mode**: Switch between themes for comfortable learning

## Mobile App

This application can be installed as a native mobile app on both Android and iOS devices.

### Installation Options

#### 1. PWA (Progressive Web App) - Easiest Method
1. Visit the website on your mobile browser
2. On iOS: Tap the Share button → "Add to Home Screen"
3. On Android: Tap the menu (⋮) → "Add to Home Screen" or "Install App"

#### 2. Native Mobile App Development

For developers who want to build native mobile apps:

```bash
# Install dependencies
npm install

# Build the web app
npm run build

# Add mobile platforms (if not already added)
npm run mobile:add:android
npm run mobile:add:ios

# Sync web assets to mobile projects
npm run mobile:sync

# Open in Android Studio
npm run mobile:open:android

# Open in Xcode (macOS only)
npm run mobile:open:ios

# Run on Android device/emulator
npm run mobile:dev

# Run on iOS device/simulator (macOS only)
npm run mobile:dev:ios
```

#### Prerequisites for Native Development
- **Android**: Android Studio, Java 17+, Android SDK
- **iOS**: Xcode (macOS only), iOS 13+

#### Mobile App Features
- Native performance with web technologies
- Offline capability
- Touch-optimized drawing recognition
- Platform-specific UI adaptations
- Native splash screen and icons

## Technology Stack

- **Frontend**: React 18, TypeScript, Vite
- **Styling**: Tailwind CSS, Framer Motion
- **Mobile**: Capacitor (for native apps)
- **UI Components**: Radix UI, shadcn/ui
- **Character Recognition**: TensorFlow.js
- **Drawing**: Custom stroke analysis and pattern matching

## Getting Started

### Development

```bash
# Clone the repository
git clone https://github.com/KrishGaur1354/romaji-challenge.git
cd romaji-challenge

# Install dependencies
npm install

# Start development server
npm run dev

# Build for production
npm run build
```

### Mobile Development

```bash
# Build and sync for mobile development
npm run mobile:build

# Open Android project in Android Studio
npm run mobile:open:android

# Open iOS project in Xcode
npm run mobile:open:ios
```

## Project Structure

```
romaji-challenge/
├── src/
│   ├── components/          # React components
│   │   ├── DrawingCanvas.tsx    # Canvas for character drawing
│   │   ├── GameCard.tsx         # Main game interface
│   │   ├── ScoreBoard.tsx       # Progress tracking
│   │   └── ui/                  # Reusable UI components
│   ├── data/                # Character data and mappings
│   ├── services/            # Recognition and game logic
│   ├── hooks/               # Custom React hooks
│   ├── lib/                 # Utility functions
│   └── types/               # TypeScript type definitions
├── public/                  # Static assets and PWA files
├── android/                 # Android native project (generated)
├── ios/                     # iOS native project (generated)
├── capacitor.config.ts      # Mobile app configuration
└── manifest.json           # PWA configuration
```

## Features in Detail

### Character Recognition Mode
- Display random Hiragana or Katakana characters
- Type the correct romaji pronunciation
- Instant feedback with scoring system
- Progressive difficulty with achievement tracking

### Hand Drawing Mode
- Touch-optimized canvas for mobile devices
- Advanced stroke pattern recognition
- Real-time accuracy feedback
- Guidance grid for proper character proportions
- Support for various stroke orders and styles

### Translation Mode
- Japanese words with English translations
- Vocabulary building exercises
- Hint system for learning support
- Focus on commonly used words and phrases

### Mobile Optimizations
- Responsive design for all screen sizes
- Touch-friendly interface elements
- Optimized canvas drawing for touch devices
- Proper handling of device orientation changes
- Safe area support for modern smartphones
- Prevent zoom on input focus
- Offline PWA capabilities

## Performance

- Lightweight bundle size with code splitting
- Smooth 60fps animations
- Optimized touch handling
- Efficient canvas operations
- Lazy loading of character recognition models

## Browser Support

- Modern browsers with ES2020+ support
- iOS Safari 13+
- Android Chrome 80+
- Desktop Chrome, Firefox, Safari, Edge

## Contributing

1. Fork the repository
2. Create a feature branch: `git checkout -b feature-name`
3. Make your changes with proper mobile testing
4. Test on both web and mobile platforms
5. Commit your changes: `git commit -m 'Add some feature'`
6. Push to the branch: `git push origin feature-name`
7. Submit a pull request

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## Acknowledgments

- Japanese character data sourced from various educational resources
- TensorFlow.js team for machine learning capabilities
- React and Vite communities for excellent development tools
- Capacitor team for seamless mobile app development

## Author

**Krish Gaur**
- GitHub: [@KrishGaur1354](https://github.com/KrishGaur1354)
- Portfolio: [krishgaur.dev](https://krishgaur.dev)

Crafted with dedication to make Japanese learning accessible and enjoyable for everyone.

