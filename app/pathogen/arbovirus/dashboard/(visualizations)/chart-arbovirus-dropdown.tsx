import { useMemo, useState } from "react";
import { convertArboSFtoArbo } from "./recharts";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Arbovirus } from "@/gql/graphql";

interface ChartArbovirusDropdownProps {
  possibleArboviruses: Arbovirus[];
  selectedArbovirus: Arbovirus | "N/A";
  setUserArbovirusSelection: (input: Arbovirus) => void;
  arbovirusToSortOrderMap: Record<Arbovirus, number>;
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
  possibleArboviruses: Arbovirus[];
}

interface UseChartArbovirusDropdownOutput {
  chartArbovirusDropdown: React.ReactNode;
  selectedArbovirus: Arbovirus | "N/A";
}

export const useChartArbovirusDropdown = (input: UseChartArbovirusDropdownInput): UseChartArbovirusDropdownOutput => {
  const pathogenOrder: Arbovirus[] = [
    Arbovirus.Zikv,
    Arbovirus.Denv,
    Arbovirus.Chikv,
    Arbovirus.Yf,
    Arbovirus.Wnv,
    Arbovirus.Mayv,
  ];
  const arbovirusToSortOrderMap: Record<Arbovirus, number> = {
    [Arbovirus.Zikv]: 1,
    [Arbovirus.Denv]: 2,
    [Arbovirus.Chikv]: 3,
    [Arbovirus.Yf]: 4,
    [Arbovirus.Wnv]: 5,
    [Arbovirus.Mayv]: 6,
  }

  const [userArbovirusSelection, setUserArbovirusSelection] = useState<Arbovirus>(pathogenOrder[0]);

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