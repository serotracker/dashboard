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
  visualizationFootnote: string;
  visualizationDownloadFootnote: string;
}

const initialMersFilterMetadataContext: MersFilterMetadataContextType = {
  numberOfNonTypenameFiltersApplied: 0,
  dataTableAdditionalButtonConfig: {
    enabled: false
  },
  // A little hack here. The visualizations have problems if you don't have placeholder text when you try to turn a filter on.
  // Basically, if you don't get why this is here, replace this with an empty string and go to the ESTIMATES_BY_REGION visualization
  // in MERSTracker and apply a filter. The footnote doesn't show up until you switch to a different variant of the visualization.
  // If you tried that with the empty string or undefined and it worked just fine feel free to get rid of this hack though.
  visualizationFootnote: '⠀',
  visualizationDownloadFootnote: '⠀',
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
  
  const visualizationFootnote = useMemo(() => {
    return numberOfNonTypenameFiltersApplied !== 0
      ? `Screening assays detect antibodies to MERS-CoV typically using recombinant spike and nucleocapsid proteins. Confirmatory assays detect neutralizing antibodies to MERS-CoV using live virus or pseudotyped particles and are recommended to confirm positive screening results. ${numberOfNonTypenameFiltersApplied} filter(s) have been applied to this visualization using the filters to the left.`
      // A little hack here. The visualizations have problems if you don't have placeholder text when you try to turn a filter on.
      // Basically, if you don't get why this is here, replace this with an empty string and go to the ESTIMATES_BY_REGION visualization
      // in MERSTracker and apply a filter. The footnote doesn't show up until you switch to a different variant of the visualization.
      // If you tried that with the empty string or undefined and it worked just fine feel free to get rid of this hack though.
      : 'Screening assays detect antibodies to MERS-CoV typically using recombinant spike and nucleocapsid proteins. Confirmatory assays detect neutralizing antibodies to MERS-CoV using live virus or pseudotyped particles and are recommended to confirm positive screening results.';
  }, [ numberOfNonTypenameFiltersApplied ])

  const visualizationDownloadFootnote = useMemo(() => {
    return 'SeroTracker Research Group (2024); MERSTracker Dashboard. Website, accessible via https://new.serotracker.com/'
  }, [])

  return (
    <MersFilterMetadataContext.Provider
      value={{
        numberOfNonTypenameFiltersApplied,
        dataTableAdditionalButtonConfig,
        visualizationFootnote,
        visualizationDownloadFootnote
      }}
    >
      {props.children}
    </MersFilterMetadataContext.Provider>
  );
}