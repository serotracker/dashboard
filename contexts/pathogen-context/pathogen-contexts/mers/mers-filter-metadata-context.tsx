import { createContext, useContext, useMemo } from "react";
import { useMersPrimaryEstimates } from "@/hooks/mers/useMersPrimaryEstimates";
import { MersContext } from "./mers-context";
import { typedObjectEntries } from "@/lib/utils";
import { AdditionalButtonConfiguration } from "@/components/ui/data-table/data-table";
import { PathogenContextActionType } from "../../pathogen-context";
import { useFaoMersEventData } from "@/hooks/mers/useFaoMersEventData";

interface MersFilterMetadataContextType {
  numberOfNonTypenameFiltersApplied: number;
  dataTableAdditionalButtonConfig: AdditionalButtonConfiguration;
}

const initialMersFilterMetadataContext: MersFilterMetadataContextType = {
  numberOfNonTypenameFiltersApplied: 0,
  dataTableAdditionalButtonConfig: {
    enabled: false
  }
};

export const MersFilterMetadataContext = createContext<
  MersFilterMetadataContextType
>(initialMersFilterMetadataContext);

interface MersFilterMetadataProviderProps {
  children: React.ReactNode;
}

export const MersFilterMetadataProvider = (props: MersFilterMetadataProviderProps) => {
  const { selectedFilters, dispatch } = useContext(MersContext);
  const { data } = useMersPrimaryEstimates();
  const { faoMersEvents } = useFaoMersEventData();

  const numberOfNonTypenameFiltersApplied: number = useMemo(() => typedObjectEntries(selectedFilters)
    .filter((selectedFilter) => selectedFilter[0] !== '__typename')
    .filter((selectedFilter) => selectedFilter[1].length > 0)
    .length
  , [ selectedFilters ]);

  const dataTableAdditionalButtonConfig: AdditionalButtonConfiguration = useMemo(() => {
    if(numberOfNonTypenameFiltersApplied === 0) {
      return {
        enabled: false
      }
    }

    return {
      enabled: true,
      buttonText: `Reset all filters (${numberOfNonTypenameFiltersApplied} currently applied)`,
      onClick: () => dispatch({
        type: PathogenContextActionType.RESET_FILTERS,
        payload: {
          data:{
            mersEstimates: data?.mersPrimaryEstimates ?? [],
            faoMersEventData: faoMersEvents ?? [],
          }
        }
      })
    }
  }, [ numberOfNonTypenameFiltersApplied ])

  return (
    <MersFilterMetadataContext.Provider
      value={{
        numberOfNonTypenameFiltersApplied,
        dataTableAdditionalButtonConfig
      }}
    >
      {props.children}
    </MersFilterMetadataContext.Provider>
  );
}