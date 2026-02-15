import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { HelmetProvider } from "react-helmet-async";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { AuthProvider } from "@/admin/hooks/useAuth";
import { ProtectedRoute } from "@/admin/components/ProtectedRoute";
import Index from "./pages/Index";
import NotFound from "./pages/NotFound";
import ProcedureDetail from "./pages/ProcedureDetail";
import AboutPage from "./pages/AboutPage";
import TeamPage from "./pages/TeamPage";
import GalleryPage from "./pages/GalleryPage";
import NewsPage from "./pages/NewsPage";
import ContactPage from "./pages/ContactPage";
import PrivacyPolicy from "./pages/PrivacyPolicy";
import TermsOfService from "./pages/TermsOfService";
import PricingPage from "./pages/PricingPage";
import { AdminLogin } from "@/admin/pages/AdminLogin";
import { AdminDashboard } from "@/admin/pages/AdminDashboard";
import { Appointments } from "@/admin/pages/Appointments";
import { Blog } from "@/admin/pages/Blog";
import { Gallery } from "@/admin/pages/Gallery";
import { Team } from "@/admin/pages/Team";
import { Analytics } from "@/admin/pages/Analytics";
import { Settings } from "@/admin/pages/Settings";

// Configure Query Client with sensible defaults for production
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 1000 * 60 * 5, // 5 minutes
      gcTime: 1000 * 60 * 10, // 10 minutes (formerly cacheTime)
      retry: (failureCount) => failureCount < 3, // Retry failed requests up to 3 times
      retryDelay: (attemptIndex) =>
        Math.min(1000 * Math.pow(2, attemptIndex), 30000), // Exponential backoff: 1s, 2s, 4s, ... max 30s
      refetchOnWindowFocus: true,
      refetchOnReconnect: true,
    },
    mutations: {
      retry: 1, // Retry mutations once on failure
      retryDelay: 1000, // Wait 1 second before retry
    },
  },
});

const App = () => (
  <HelmetProvider>
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <AuthProvider>
          <BrowserRouter future={{ v7_startTransition: true, v7_relativeSplatPath: true }}>
            <Routes>
              {/* Admin Routes */}
              <Route path="/admin/login" element={<AdminLogin />} />
              <Route 
                path="/admin/dashboard" 
                element={
                  <ProtectedRoute>
                    <AdminDashboard />
                  </ProtectedRoute>
                } 
              />
              <Route 
                path="/admin/appointments" 
                element={
                  <ProtectedRoute>
                    <Appointments />
                  </ProtectedRoute>
                } 
              />
              <Route 
                path="/admin/blog" 
                element={
                  <ProtectedRoute>
                    <Blog />
                  </ProtectedRoute>
                } 
              />
              <Route 
                path="/admin/gallery" 
                element={
                  <ProtectedRoute>
                    <Gallery />
                  </ProtectedRoute>
                } 
              />
              <Route 
                path="/admin/team" 
                element={
                  <ProtectedRoute>
                    <Team />
                  </ProtectedRoute>
                } 
              />
              <Route 
                path="/admin/analytics" 
                element={
                  <ProtectedRoute>
                    <Analytics />
                  </ProtectedRoute>
                } 
              />
              <Route 
                path="/admin/settings" 
                element={
                  <ProtectedRoute>
                    <Settings />
                  </ProtectedRoute>
                } 
              />
              
              {/* Public Routes */}
              <Route path="/" element={<><Header /><Index /><Footer /></>} />
              <Route path="/about" element={<><Header /><AboutPage /><Footer /></>} />
              <Route path="/team" element={<><Header /><TeamPage /><Footer /></>} />
              <Route path="/gallery" element={<><Header /><GalleryPage /><Footer /></>} />
              <Route path="/news" element={<><Header /><NewsPage /><Footer /></>} />
              <Route path="/contact" element={<><Header /><ContactPage /><Footer /></>} />
              <Route path="/privacy-policy" element={<><Header /><PrivacyPolicy /><Footer /></>} />
              <Route path="/terms-of-service" element={<><Header /><TermsOfService /><Footer /></>} />
              <Route path="/pricing" element={<><Header /><PricingPage /><Footer /></>} />
              <Route path="/procedures/:slug" element={<><Header /><ProcedureDetail /><Footer /></>} />
              {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
              <Route path="*" element={<><Header /><NotFound /><Footer /></>} />
            </Routes>
          </BrowserRouter>
        </AuthProvider>
      </TooltipProvider>
    </QueryClientProvider>
  </HelmetProvider>
);

export default App;
