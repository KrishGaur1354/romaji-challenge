import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Index from "./pages/Index";
import NotFound from "./pages/NotFound";
import { ThemeProvider } from "next-themes";
import type { AppProps } from "next/app";
// import "@/styles/globals.css"; 

const queryClient = new QueryClient();

// function MyApp({ Component, pageProps }: AppProps) {
//   return (
//     // The "class" attribute is used on the <html> tag so that you can style dark mode via CSS
//     <ThemeProvider attribute="class">
//       {React.createElement(Component as React.ElementType, pageProps)}
//     </ThemeProvider>
//   );
// }

// export default MyApp;

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Index />} />
          {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
