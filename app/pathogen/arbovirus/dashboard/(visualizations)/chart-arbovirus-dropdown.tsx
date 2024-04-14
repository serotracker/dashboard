import { useContext, useMemo, useState, useCallback } from "react";
import { arbovirusesSF, convertArboSFtoArbo, median } from "./recharts";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

interface ChartArbovirusDropdownProps {
  possibleArboviruses: arbovirusesSF[];
  selectedArbovirus: arbovirusesSF | "N/A";
  setUserArbovirusSelection: (input: arbovirusesSF) => void;
  arbovirusToSortOrderMap: Record<arbovirusesSF, number>;
}

const ChartArbovirusDropdown = (props: ChartArbovirusDropdownProps) => (
  <DropdownMenu>
    <DropdownMenuTrigger disabled={props.possibleArboviruses.length < 2} asChild>
      <Button variant="outline" size="sm" className="mx-2 whitespace-nowrap text-white ignore-for-visualization-download">
        Currently viewing: {props.selectedArbovirus !== 'N/A' ? convertArboSFtoArbo(props.selectedArbovirus) : 'N/A'}
      </Button>
    </DropdownMenuTrigger>
    <DropdownMenuContent align="end" className="p-2">
      {props.possibleArboviruses
        .sort((a,b) => props.arbovirusToSortOrderMap[a] - props.arbovirusToSortOrderMap[b])
        .map((pathogen) => 
          <DropdownMenuItem
            key={`median-seroprevalence-by-who-region-and-age-group-table-dropdown-item-${pathogen}`}
            onSelect={() => props.setUserArbovirusSelection(pathogen)}
            disabled={props.selectedArbovirus === pathogen}
            asChild
          >
            <button className="w-full hover:cursor-pointer">
              {convertArboSFtoArbo(pathogen)}
            </button>
          </DropdownMenuItem>
        )
      }
    </DropdownMenuContent>
  </DropdownMenu>
)

interface UseChartArbovirusDropdownInput {
  possibleArboviruses: arbovirusesSF[];
}

interface UseChartArbovirusDropdownOutput {
  chartArbovirusDropdown: React.ReactNode;
  selectedArbovirus: arbovirusesSF | "N/A";
}

export const useChartArbovirusDropdown = (input: UseChartArbovirusDropdownInput): UseChartArbovirusDropdownOutput => {
  const pathogenOrder: arbovirusesSF[] = [
    "ZIKV",
    "DENV",
    "CHIKV",
    "YF",
    "WNV",
    "MAYV",
  ];
  const arbovirusToSortOrderMap: Record<arbovirusesSF, number> = {
    "ZIKV": 1,
    "DENV": 2,
    "CHIKV": 3,
    "YF": 4,
    "WNV": 5,
    "MAYV": 6
  }

  const [userArbovirusSelection, setUserArbovirusSelection] = useState<arbovirusesSF>(pathogenOrder[0]);

  const selectedArbovirus = useMemo(() => {
    if(input.possibleArboviruses.length === 0) {
      return "N/A"
    }

    if(input.possibleArboviruses.includes(userArbovirusSelection)) {
      return userArbovirusSelection;
    }

    return input.possibleArboviruses[0]
  }, [userArbovirusSelection, input.possibleArboviruses])

  return {
    chartArbovirusDropdown: <ChartArbovirusDropdown
      possibleArboviruses={input.possibleArboviruses}
      selectedArbovirus={selectedArbovirus}
      setUserArbovirusSelection={setUserArbovirusSelection}
      arbovirusToSortOrderMap={arbovirusToSortOrderMap}
    />,
    selectedArbovirus
  }
}