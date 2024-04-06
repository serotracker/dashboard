import { useMemo } from 'react';
// Checks if the screen width is greater than 1024px
export const useIsLargeScreen = () => {
  const isLargeScreen = useMemo(() => window.innerWidth > 1024, [window.innerWidth])
  return isLargeScreen;
};