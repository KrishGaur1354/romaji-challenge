# Romanji Challenge

[![Vercel Deployment](https://vercel.com/button)](https://romanjichallenge.vercel.app/)

A modern web application designed to help users practice and test their knowledge of Romaji through interactive challenges.

## 🚀 Live Demo
**Check it out here:** [Romanji Challenge](https://romanjichallenge.vercel.app/)

## 📂 Project Structure
```
src/
 ├── components/            # Reusable UI components
 │   ├── ui/                # UI elements (GameCard, ScoreBoard, etc.)
 │   ├── GameCard.tsx       # Displays game details
 │   ├── ScoreBoard.tsx     # Leaderboard component
 │
 ├── hooks/                 # Custom hooks
 │   ├── use-mobile.tsx     # Hook for mobile responsiveness
 │   ├── use-toast.ts       # Hook for notifications
 │
 ├── lib/                   # Utility functions
 │   ├── utils.ts           # General utility functions
 │
 ├── pages/                 # Page components
 │   ├── Index.tsx          # Main game interface
 │   ├── NotFound.tsx       # 404 Page
 │
 ├── App.tsx                # Root component
 ├── main.tsx               # Application entry point
 ├── index.css              # Global styles
 ├── App.css                # Component styles

config/
 ├── tailwind.config.ts      # Tailwind CSS configuration
 ├── vite.config.ts          # Vite configuration
 ├── tsconfig.json           # TypeScript configuration

other/
 ├── package.json            # Project dependencies
 ├── postcss.config.js       # PostCSS configuration
 ├── eslint.config.js        # Linting rules
 ├── README.md               # Project documentation
```

## 🛠️ Tech Stack
- **Frontend:** React (TypeScript), Vite
- **State Management:** React Query (@tanstack/react-query)
- **UI Framework:** Tailwind CSS
- **Routing:** React Router
- **Notifications:** Sonner
- **Hosting:** Vercel

## 💻 Installation & Setup
### Prerequisites
- [Node.js](https://nodejs.org/) (or [Bun](https://bun.sh/))
- [Git](https://git-scm.com/)

### Clone the Repository
```sh
git clone https://github.com/yourusername/romanjichallenge.git
cd romanjichallenge
```

### Install Dependencies
Using npm:
```sh
npm install
```
Using Bun:
```sh
bun install
```

### Run the Development Server
```sh
npm run dev
```
This starts the app on `http://localhost:5173/` (default Vite port).

## 🚀 Deployment
The app is already deployed on **Vercel**. To deploy manually:
```sh
vercel deploy
```

## 🛠️ Features
✅ Interactive Romaji learning game  
✅ Scoreboard for tracking progress  
✅ Responsive design (mobile-friendly)  
✅ Optimized performance using Vite  
✅ Custom hooks for modularity  
✅ Toast notifications with Sonner  

## 🤝 Contributing
1. Fork the repository
2. Create a new branch (`git checkout -b feature-branch`)
3. Commit your changes (`git commit -m "Add new feature"`)
4. Push the branch (`git push origin feature-branch`)
5. Open a Pull Request

## 📜 License
This project is licensed under the **MIT License**.

