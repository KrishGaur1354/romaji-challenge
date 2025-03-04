# Romaji Challenge

[![Vercel Deployment](https://vercel.com/button)](https://romanjichallenge.vercel.app/)

An elegant web application designed to help users master Japanese characters through interactive challenges and intuitive drawing recognition.

## ✨ Features

### Core Features
- 🎮 Interactive character recognition game
- ✍️ Intuitive drawing interface with real-time feedback
- 🎯 Pattern-based stroke recognition system
- 🔄 Seamless switching between Hiragana and Katakana
- 📊 Dynamic scoreboard for progress tracking
- 💫 Beautiful animations and visual feedback
- 🌓 Light/Dark mode support

### Technical Features
- 📱 Responsive design (mobile-friendly)
- ⚡ Optimized performance with Vite
- 🎨 Modern UI with Tailwind CSS
- 🔔 Elegant notifications with Sonner
- 🎭 Smooth animations with Framer Motion

## 🎯 How It Works

### Character Recognition
The app uses a sophisticated pattern-based recognition system that:
1. Tracks each stroke's direction and position
2. Analyzes stroke patterns in real-time
3. Provides instant visual feedback
4. Matches patterns against known character forms

### Drawing Interface
- Smooth, responsive drawing surface
- Real-time stroke analysis
- Visual feedback for each stroke
- Clear and intuitive controls

## 🛠️ Tech Stack
- **Framework:** React (TypeScript)
- **Build Tool:** Vite
- **Styling:** Tailwind CSS
- **Animations:** Framer Motion
- **State Management:** React Query
- **Notifications:** Sonner
- **Hosting:** Vercel

## 📂 Project Structure
```
src/
 ├── components/            # Reusable UI components
 │   ├── DrawingCanvas.tsx  # Drawing interface
 │   ├── GameCard.tsx       # Game interface
 │   ├── ScoreBoard.tsx     # Progress tracking
 │   ├── StrokeAnimation.tsx # Stroke animations
 │   └── ui/               # UI elements
 │
 ├── services/             # Core services
 │   └── simpleRecognitionService.ts  # Pattern recognition
 │
 ├── types/                # TypeScript types
 │   └── drawing.ts        # Drawing types
 │
 ├── pages/               # Page components
 │   └── Index.tsx        # Main game interface
 │
 └── styles/              # Global styles
```

## 💻 Getting Started

### Prerequisites
- [Node.js](https://nodejs.org/) (v14 or newer)
- [Git](https://git-scm.com/)

### Installation

1. Clone the repository:
```sh
git clone https://github.com/KrishGaur1354/romaji-challenge.git
cd romaji-challenge
```

2. Install dependencies:
```sh
npm install
# or
yarn install
# or
pnpm install
```

3. Start the development server:
```sh
npm run dev
# or
yarn dev
# or
pnpm dev
```

The app will be available at `http://localhost:5173/`

## 🚀 Deployment

The app is deployed on Vercel. To deploy your own instance:

1. Fork this repository
2. Import to Vercel
3. Deploy!

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https%3A%2F%2Fgithub.com%2FKrishGaur1354%2Fromaji-challenge)

## 🤝 Contributing

Contributions are welcome! Here's how you can help:

1. Fork the repository
2. Create a feature branch: `git checkout -b feature/amazing-feature`
3. Commit your changes: `git commit -m 'Add amazing feature'`
4. Push to the branch: `git push origin feature/amazing-feature`
5. Open a Pull Request

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- Thanks to all contributors who have helped shape this project
- Inspired by traditional Japanese calligraphy practice
- Built with modern web technologies and love for learning

## 🔗 Links

- [Live Demo](https://romanjichallenge.vercel.app/)
- [GitHub Repository](https://github.com/KrishGaur1354/romaji-challenge)
- [Report an Issue](https://github.com/KrishGaur1354/romaji-challenge/issues)

