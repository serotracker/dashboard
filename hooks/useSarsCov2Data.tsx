import { useQuery } from "@tanstack/react-query";

export default function useSarsCov2Data() {
  return useQuery({
    queryKey: ["SarsCov2Records"],
    queryFn: () =>
      fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/sarscov2/records`).then(
        (response) => response.json(),
      ),
  });
}
