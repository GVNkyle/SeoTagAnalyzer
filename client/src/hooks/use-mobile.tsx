import { useState, useEffect } from 'react';

// Custom hook to detect if the viewport is mobile size
export function useIsMobile() {
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    // Function to check if the window matches mobile viewport
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 640); // Tailwind's sm breakpoint
    };

    // Initial check
    checkMobile();

    // Set up listener for window resize
    window.addEventListener('resize', checkMobile);

    // Clean up event listener
    return () => {
      window.removeEventListener('resize', checkMobile);
    };
  }, []);

  return isMobile;
}