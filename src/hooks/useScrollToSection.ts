import { useCallback } from 'react';

export const useScrollToSection = () => {
  const scrollToSection = useCallback((sectionId: string, offset: number = 100) => {
    // For hash links, use native browser behavior
    if (sectionId.startsWith('#')) {
      const element = document.getElementById(sectionId.substring(1));
      if (element) {
        const elementPosition = element.getBoundingClientRect().top;
        const offsetPosition = elementPosition + window.scrollY - offset;
        window.scrollTo({ top: offsetPosition, behavior: 'smooth' });
      } else {
        // If element doesn't exist, update hash anyway to navigate to the section
        // when it becomes available (e.g., after page load)
        window.location.hash = sectionId;
      }
    } else {
      // For direct IDs
      const element = document.getElementById(sectionId);
      if (element) {
        const elementPosition = element.getBoundingClientRect().top;
        const offsetPosition = elementPosition + window.scrollY - offset;
        window.scrollTo({ top: offsetPosition, behavior: 'smooth' });
      }
    }
  }, []);

  return { scrollToSection };
};