import { useQuery } from "@tanstack/react-query";

export default function useSarsCov2Data() {
  return useQuery({
    queryKey: ["SarsCov2Records"],
    queryFn: () =>
      fetch("http://127.0.0.1:5000/data_provider/sarscov2/records").then(
        (response) => response.json(),
      ),
  });
}
