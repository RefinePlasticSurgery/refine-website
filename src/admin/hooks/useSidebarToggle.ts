import { useState, useEffect } from 'react';

export const useSidebarToggle = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  // Initialize mobile state on mount
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 1024);
    };
    checkMobile();
    
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);
  
  const toggleSidebar = () => {
    console.log('[useSidebarToggle] Toggle called, current state:', sidebarOpen);
    setSidebarOpen(prev => {
      console.log('[useSidebarToggle] State updating from', prev, 'to', !prev);
      return !prev;
    });
  };
  const closeSidebar = () => {
    console.log('[useSidebarToggle] Close called');
    setSidebarOpen(false);
  };
  const openSidebar = () => {
    console.log('[useSidebarToggle] Open called');
    setSidebarOpen(true);
  };

  // Handle ESC key
  useEffect(() => {
    const handleEsc = (e: KeyboardEvent) => {
      if (e.key === 'Escape') closeSidebar();
    };
    window.addEventListener('keydown', handleEsc);
    return () => window.removeEventListener('keydown', handleEsc);
  }, []);

  // Close sidebar when resizing to desktop
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth >= 1024) {
        setSidebarOpen(false);
      }
    };
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  return { sidebarOpen, toggleSidebar, closeSidebar, openSidebar, isMobile };
};
