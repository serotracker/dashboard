'use client'

import getQueryClient from "@/components/customs/getQueryClient"
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

function CustomQueryClientProvider({ children }: { children: React.ReactNode }) {
  // Why cant we use getQueryClient here?
  const client = new QueryClient({
    defaultOptions: {
      queries: {
        staleTime: Infinity,
        gcTime: Infinity
      },
    },
  });
  
  return (
    <QueryClientProvider client={client}>
      {children}
    </QueryClientProvider>
  );
}

export default CustomQueryClientProvider;