import { Switch, Route, useLocation } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { ThemeProvider } from "@/components/ThemeProvider";
import { useEffect } from "react";
import { initPrivacyFeatures, applyPrivacyMode } from "@/lib/privacy";

import Home from "@/pages/home";
import AppPage from "@/pages/app";
import Share from "@/pages/share";
import NotFound from "@/pages/not-found";

function Router() {
  const [location] = useLocation();
  
  useEffect(() => {
    // Initialize privacy features for all pages
    initPrivacyFeatures();
    
    // Apply extra privacy mode for sensitive routes
    if (location.startsWith("/app") || location.startsWith("/share")) {
      applyPrivacyMode(location);
      
      // Add noopener and noreferrer to all links
      document.querySelectorAll('a').forEach(link => {
        link.rel = 'noopener noreferrer';
      });
      
      // We don't modify document.referrer directly as it's read-only
      // Instead, we rely on the meta tag approach in privacy.ts
      
      // For student safety, ensure history doesn't save visits
      if (location.startsWith("/app")) {
        // Add special meta tag for /app route
        const metaHistoryControl = document.createElement('meta');
        metaHistoryControl.name = 'history-control';
        metaHistoryControl.content = 'no-store';
        document.head.appendChild(metaHistoryControl);
        
        // Set title to something generic for history
        document.title = "Reference Material";
      }
    }
  }, [location]);
  
  return (
    <Switch>
      <Route path="/" component={Home} />
      <Route path="/app" component={AppPage} />
      <Route path="/share/:id" component={Share} />
      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <ThemeProvider defaultTheme="dark">
        <TooltipProvider>
          <Toaster />
          <Router />
        </TooltipProvider>
      </ThemeProvider>
    </QueryClientProvider>
  );
}

export default App;