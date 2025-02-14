import React from "react";
import { createRoot } from 'react-dom/client'
import App from './App.tsx'
import './index.css'
import { ThemeProvider } from "next-themes";

createRoot(document.getElementById("root") as HTMLElement).render(
    <React.StrictMode>
      <ThemeProvider attribute="class" defaultTheme="light">
        <App />
      </ThemeProvider>
    </React.StrictMode>
  );
