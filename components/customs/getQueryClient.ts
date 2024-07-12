import { cache } from "react";
import { QueryClient } from "@tanstack/react-query";

// To ensure the whole app is using the same queryClient instance

const getQueryClient = cache(() => {
  return new QueryClient({
    defaultOptions: {
      queries: {
        staleTime: Infinity,
        gcTime: Infinity
      },
    },
  })});

export default getQueryClient;
