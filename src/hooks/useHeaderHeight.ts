import { useState, useEffect, useCallback } from "react";

/**
 * Custom hook to calculate and track header height dynamically
 * Exports CSS variable for use in padding calculations
 */
export const useHeaderHeight = () => {
  const [headerHeight, setHeaderHeight] = useState(0);

  const calculateHeaderHeight = useCallback(() => {
    const header = document.querySelector('header');
    if (header) {
      const height = header.offsetHeight;
      setHeaderHeight(height);
      
      // Export CSS variable for use in other components
      document.documentElement.style.setProperty('--header-height', `${height}px`);
      
      // Also set mobile-specific variable for better control
      const isMobile = window.innerWidth < 768;
      if (isMobile) {
        document.documentElement.style.setProperty('--header-height-mobile', `${height}px`);
      } else {
        document.documentElement.style.setProperty('--header-height-desktop', `${height}px`);
      }
    }
  }, []);

  useEffect(() => {
    // Calculate on mount
    calculateHeaderHeight();

    // Recalculate on window resize with debounce
    let timeoutId: ReturnType<typeof setTimeout>;
    const handleResize = () => {
      clearTimeout(timeoutId);
      timeoutId = setTimeout(calculateHeaderHeight, 150);
    };

    window.addEventListener('resize', handleResize);
    
    // Recalculate when DOM content loads
    if (document.readyState === 'loading') {
      document.addEventListener('DOMContentLoaded', calculateHeaderHeight);
    }

    return () => {
      window.removeEventListener('resize', handleResize);
      document.removeEventListener('DOMContentLoaded', calculateHeaderHeight);
      clearTimeout(timeoutId);
    };
  }, [calculateHeaderHeight]);

  return { headerHeight };
};