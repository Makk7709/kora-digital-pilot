import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Index from "./pages/Index";
import Landing from "./pages/Landing";
import Settings from "./pages/Settings";
import NotFound from "./pages/NotFound";
import LinkedInTest from "./pages/LinkedInTest";
import LinkedInTestSimple from "./pages/LinkedInTestSimple";
import LinkedInTestComplete from "./pages/LinkedInTestComplete";
import LinkedInDebug from "./pages/LinkedInDebug";
import LinkedInCallback from "./components/LinkedInCallback";
import { TestAPI } from "./components/TestAPI";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Landing />} />
          <Route path="/app" element={<Index />} />
          <Route path="/settings" element={<Settings />} />
          <Route path="/test-api" element={<TestAPI />} />
          <Route path="/linkedin-test" element={<LinkedInTest />} />
          <Route path="/linkedin-test-simple" element={<LinkedInTestSimple />} />
          <Route path="/linkedin-test-complete" element={<LinkedInTestComplete />} />
          <Route path="/linkedin-debug" element={<LinkedInDebug />} />
          <Route path="/auth/linkedin/callback" element={<LinkedInCallback />} />
          {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
