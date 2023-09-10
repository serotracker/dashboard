import { useQuery } from "@tanstack/react-query";

export default function useArboData() {
  return useQuery({
    queryKey: ["ArbovirusRecords"],
    queryFn: () =>
      fetch("http://localhost:5000/data_provider/records/arbo").then(
        (response) => response.json(),
      ),
  });
}
