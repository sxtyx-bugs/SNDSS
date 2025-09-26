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
  const [location, setLocation] = useLocation();
  
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
      
      // For student safety, ensure history doesn't save visits
      if (location.startsWith("/app")) {
        // Add special meta tags for history control
        const metaHistoryControl = document.createElement('meta');
        metaHistoryControl.name = 'history-control';
        metaHistoryControl.content = 'no-store';
        document.head.appendChild(metaHistoryControl);
        
        // Add another meta tag for additional history control
        const metaPragma = document.createElement('meta');
        metaPragma.name = 'pragma';
        metaPragma.content = 'no-cache';
        document.head.appendChild(metaPragma);
        
        // Set title to something generic for history
        document.title = "Reference Material";
      }
    }
  }, [location]);
  
  // Handle the special case of the "H" link in the header
  const handleAppLinkClick = (e: React.MouseEvent) => {
    e.preventDefault();
    // Use replace instead of push to avoid adding to history
    setLocation("/app", true); // The second parameter 'true' means replace instead of push
  };
  
  // Modify the global document to handle app links specially
  useEffect(() => {
    const handleDocumentClick = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      if (target.tagName === 'A' && target.getAttribute('href') === '/app') {
        e.preventDefault();
        setLocation("/app", true); // Replace instead of push
      }
    };
    
    document.addEventListener('click', handleDocumentClick);
    return () => {
      document.removeEventListener('click', handleDocumentClick);
    };
  }, [setLocation]);
  
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