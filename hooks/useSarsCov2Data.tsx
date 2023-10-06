import { customCache } from "@/cache/sarscov2";
import { useQuery } from "@tanstack/react-query";

export default function useSarsCov2Data() {
  return useQuery({
    queryKey: ["SarsCov2Records"],
    queryFn: async () => {
      if (customCache.records && customCache.records.length > 0) {
        console.log("using cached data")
        return customCache.records;
      } else {
        const response = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/sarscov2/records`, { cache: 'no-store' });
        const data = await response.json();
        customCache.records = data;
        return data;
      }
    },
    cacheTime: 0
  });
}
