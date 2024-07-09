import { useState, useEffect,  useMemo} from 'react';

// Checks if the screen width is greater than 1024px (Need the useEffect to ensure it only happens on mount - useMemo broke the build)
// TODO: see if there is a better way to do this
export const useIsLargeScreen = () => {
  const [isLargeScreen, setIsLargeScreen] = useState<boolean | undefined>(undefined);

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