import { useQuery } from "@tanstack/react-query";

export default function useArboData() {
  return useQuery({
    queryKey: ["ArbovirusRecords"],
    queryFn: () =>
      fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/arbo/records`).then(
        (response) => response.json(),
      ),
  });
}
