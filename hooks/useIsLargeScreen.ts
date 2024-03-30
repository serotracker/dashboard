import { useState, useEffect } from 'react';

// Checks if the screen width is greater than 1024px
export const useIsLargeScreen = () => {
  const [isLargeScreen, setIsLargeScreen] = useState(false);

  useEffect(() => {
    const checkScreenSize = () => {
      setIsLargeScreen(window.innerWidth > 1024);
    };

    checkScreenSize(); // Check on initial render

    window.addEventListener('resize', checkScreenSize);
    return () => window.removeEventListener('resize', checkScreenSize);
  }, []);

  return isLargeScreen;
};