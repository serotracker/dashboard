import { useQuery } from "@tanstack/react-query";

export default function useArboData() {
  return useQuery({
    queryKey: ["ArbovirusRecords"],
    queryFn: () =>
      fetch("http://127.0.0.1:5000/data_provider/arbo/records").then(
        (response) => response.json(),
      ),
  });
}
