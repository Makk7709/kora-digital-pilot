import React from 'react';
import { Toaster } from '@/components/ui/toaster';
import { Toaster as Sonner } from '@/components/ui/sonner';
import { TooltipProvider } from '@/components/ui/tooltip';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { Routes, Route } from 'react-router-dom';
import Index from './pages/Index';
import Landing from './pages/Landing';
import Settings from './pages/Settings';
import NotFound from './pages/NotFound';
import Auth from './pages/Auth';
import LinkedInCallback from './components/LinkedInCallback';
import RequireAuth from './components/auth/RequireAuth';
import { DataModeProvider } from './contexts/DataModeContext';
import { AuthProvider } from './contexts/AuthContext';
import { TenantProvider } from './contexts/TenantContext';

// Routes de diagnostic uniquement disponibles en développement: tree-shaken en build prod.
const DEV = import.meta.env.DEV;
const TestAPI = DEV
  ? React.lazy(() => import('./components/TestAPI').then((m) => ({ default: m.TestAPI })))
  : null;
const DiagnosticTest = DEV ? React.lazy(() => import('./components/DiagnosticTest')) : null;

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <AuthProvider>
      <TenantProvider>
        <DataModeProvider>
          <TooltipProvider>
            <Toaster />
            <Sonner />
            <React.Suspense fallback={null}>
              <Routes>
                <Route path="/" element={<Landing />} />
                <Route path="/auth" element={<Auth />} />
                <Route
                  path="/app"
                  element={
                    <RequireAuth>
                      <Index />
                    </RequireAuth>
                  }
                />
                <Route
                  path="/settings"
                  element={
                    <RequireAuth>
                      <Settings />
                    </RequireAuth>
                  }
                />
                {DEV && TestAPI && <Route path="/test-api" element={<TestAPI />} />}
                {DEV && DiagnosticTest && <Route path="/diagnostic" element={<DiagnosticTest />} />}
                <Route path="/auth/linkedin/callback" element={<LinkedInCallback />} />
                {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
                <Route path="*" element={<NotFound />} />
              </Routes>
            </React.Suspense>
          </TooltipProvider>
        </DataModeProvider>
      </TenantProvider>
    </AuthProvider>
  </QueryClientProvider>
);

export default App;
