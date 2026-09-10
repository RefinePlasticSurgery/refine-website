import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { HelmetProvider } from "react-helmet-async";
import { AuthProvider } from "@/admin/hooks/useAuth";
import { ProtectedRoute } from "@/admin/components/ProtectedRoute";
import { PublicLayout } from "@/components/PublicLayout";

// Public pages
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

// Admin pages
import { AdminLogin } from "@/admin/pages/AdminLogin";
import { AdminDashboard } from "@/admin/pages/AdminDashboard";
import { Appointments } from "@/admin/pages/Appointments";
import { Blog } from "@/admin/pages/Blog";
import { Gallery } from "@/admin/pages/Gallery";
import { Team } from "@/admin/pages/Team";
import { Pricing } from "@/admin/pages/Pricing";
import { Analytics } from "@/admin/pages/Analytics";
import { Settings } from "@/admin/pages/Settings";

/**
 * React Query client — configured with sane production defaults.
 * Exponential backoff, 5-min stale time, 10-min gc.
 * All admin data hooks use this cache; no manual fetch boilerplate needed.
 */
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 1000 * 60 * 5,
      gcTime: 1000 * 60 * 10,
      retry: (failureCount) => failureCount < 3,
      retryDelay: (attempt) => Math.min(1000 * 2 ** attempt, 30_000),
      refetchOnWindowFocus: true,
      refetchOnReconnect: true,
    },
    mutations: {
      retry: 1,
      retryDelay: 1000,
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
              {/* ── Admin routes ─────────────────────────────────────────── */}
              <Route path="/admin/login" element={<AdminLogin />} />
              <Route path="/admin/dashboard"   element={<ProtectedRoute><AdminDashboard /></ProtectedRoute>} />
              <Route path="/admin/appointments" element={<ProtectedRoute><Appointments /></ProtectedRoute>} />
              <Route path="/admin/blog"        element={<ProtectedRoute><Blog /></ProtectedRoute>} />
              <Route path="/admin/gallery"     element={<ProtectedRoute><Gallery /></ProtectedRoute>} />
              <Route path="/admin/team"        element={<ProtectedRoute><Team /></ProtectedRoute>} />
              <Route path="/admin/pricing"     element={<ProtectedRoute><Pricing /></ProtectedRoute>} />
              <Route path="/admin/analytics"   element={<ProtectedRoute><Analytics /></ProtectedRoute>} />
              <Route path="/admin/settings"    element={<ProtectedRoute><Settings /></ProtectedRoute>} />

              {/* ── Public routes — shared Header + Footer via PublicLayout ─ */}
              <Route element={<PublicLayout />}>
                <Route path="/"                   element={<Index />} />
                <Route path="/about"              element={<AboutPage />} />
                <Route path="/team"               element={<TeamPage />} />
                <Route path="/gallery"            element={<GalleryPage />} />
                <Route path="/news"               element={<NewsPage />} />
                <Route path="/contact"            element={<ContactPage />} />
                <Route path="/privacy-policy"     element={<PrivacyPolicy />} />
                <Route path="/terms-of-service"   element={<TermsOfService />} />
                <Route path="/pricing"            element={<PricingPage />} />
                <Route path="/procedures/:slug"   element={<ProcedureDetail />} />
                {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL */}
                <Route path="*"                   element={<NotFound />} />
              </Route>
            </Routes>
          </BrowserRouter>
        </AuthProvider>
      </TooltipProvider>
    </QueryClientProvider>
  </HelmetProvider>
);

export default App;
