import { useState, useCallback, useEffect } from 'react';

const STORAGE_KEY = 'refine-admin-sidebar-collapsed';

/**
 * Consolidated sidebar hook.
 * Replaces the two separate useSidebarToggle + useAdminSidebarCollapsed hooks.
 *
 * - mobileOpen: whether the drawer is open on mobile
 * - collapsed: whether the desktop sidebar is in icon-only mode (persisted to localStorage)
 */
export const useSidebar = () => {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [collapsed, setCollapsed] = useState(false);
  const [ready, setReady] = useState(false);

  // Hydrate collapsed state from localStorage after mount (avoids SSR mismatch)
  useEffect(() => {
    try {
      setCollapsed(localStorage.getItem(STORAGE_KEY) === '1');
    } catch {
      /* ignore private-browsing / quota errors */
    }
    setReady(true);
  }, []);

  // Close mobile drawer when viewport grows to desktop
  useEffect(() => {
    const handler = () => {
      if (window.innerWidth >= 1024) setMobileOpen(false);
    };
    window.addEventListener('resize', handler);
    return () => window.removeEventListener('resize', handler);
  }, []);

  // Close mobile drawer on Escape
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setMobileOpen(false);
    };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, []);

  const openMobile   = useCallback(() => setMobileOpen(true), []);
  const closeMobile  = useCallback(() => setMobileOpen(false), []);
  const toggleMobile = useCallback(() => setMobileOpen(v => !v), []);

  const toggleCollapsed = useCallback(() => {
    setCollapsed(prev => {
      const next = !prev;
      try {
        localStorage.setItem(STORAGE_KEY, next ? '1' : '0');
      } catch {
        /* ignore */
      }
      return next;
    });
  }, []);

  return {
    mobileOpen,
    openMobile,
    closeMobile,
    toggleMobile,
    /** collapsed is false until localStorage has been read */
    collapsed: ready ? collapsed : false,
    toggleCollapsed,
    ready,
  };
};
