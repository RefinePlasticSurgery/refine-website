import { Outlet } from 'react-router-dom';
import { Header } from '@/components/Header';
import { Footer } from '@/components/Footer';

/**
 * Shared wrapper for all public-facing pages.
 * Eliminates the <Header /><Page /><Footer /> pattern repeated in App.tsx.
 * Use as a layout route with <Outlet />.
 */
export const PublicLayout = () => (
  <>
    <Header />
    <Outlet />
    <Footer />
  </>
);
