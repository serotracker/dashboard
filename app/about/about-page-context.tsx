"use client";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

export const AboutPageProvider = ({
  children,
}: {
  children: React.ReactNode;
}): React.ReactNode => {
  const queryClient = new QueryClient({
    defaultOptions: {
      queries: {
        staleTime: Infinity,
        cacheTime: Infinity
      },
    },
  });
  
  return (
    <QueryClientProvider client={queryClient}>
      {children}
    </QueryClientProvider>
  );
};