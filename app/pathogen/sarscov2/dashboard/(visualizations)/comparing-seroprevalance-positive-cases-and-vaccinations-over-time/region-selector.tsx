import { useContext, useMemo, useState } from "react"
import { Plus, X } from "lucide-react";
import { Select } from "@/components/customs/select";
import assertNever from "assert-never";
import { CountryInformationContext } from "@/contexts/pathogen-context/country-information-context";
import { typedObjectKeys } from "@/lib/utils";
import { GbdSubRegion, GbdSuperRegion, UnRegion, WhoRegion } from "@/gql/graphql";
import { isUNRegion, unRegionEnumToLabelMap } from "@/lib/un-regions";
import { gbdSubRegionToLabelMap, gbdSuperRegionToLabelMap, isGbdSubRegion, isGbdSuperRegion } from "@/lib/gbd-regions";
import { isWHORegion } from "@/lib/who-regions";
import { Button } from "@/components/ui/button";
import { SeriesFieldsRegionPortion, SeriesRegionType, isSeriesRegionType } from "./series-generator";

type RegionSelectorState = {
  regionType: SeriesRegionType.GLOBAL
} | {
  regionType: SeriesRegionType.WHO_REGION,
  whoRegions: WhoRegion[],
} | {
  regionType: SeriesRegionType.UN_REGION,
  unRegions: UnRegion[],
} | {
  regionType: SeriesRegionType.COUNTRY,
  countryAlphaTwoCodes: string[],
} | {
  regionType: SeriesRegionType.GBD_SUPER_REGION,
  gbdSuperRegions: GbdSuperRegion[]
} | {
  regionType: SeriesRegionType.GBD_SUB_REGION,
  gbdSubRegions: GbdSubRegion[]
} | undefined;

interface RegionSelectorProps {
  selectedRegionType: SeriesRegionType | undefined;
  selectedRegions: string[];
  countryAlphaTwoCodeToCountryNameMap: Record<string, string | undefined>;
  propagateRegionChange: (input: RegionSelectorState) => void;
  handleRegionSelectorDeletion: () => void;
}

const selectedRegionTypeToLabelMap = {
  [SeriesRegionType.COUNTRY]: 'Country',
  [SeriesRegionType.GBD_SUB_REGION]: 'GBD Subregion',
  [SeriesRegionType.GBD_SUPER_REGION]: 'GBD Superregion',
  [SeriesRegionType.GLOBAL]: 'Global',
  [SeriesRegionType.WHO_REGION]: 'WHO Region',
  [SeriesRegionType.UN_REGION]: 'UN Region',
  'N/A': 'N/A'
}

const RegionSelector = (props: RegionSelectorProps) => {
  const [selectedRegionOptions, setSelectedRegionOptions] = useState<string[]>([])
  const [regionToLabeMap, setRegionToLabelMap] = useState<Record<string, string | undefined>>({});

  const selectedRegionTypeOnChange = (newValue: string[]) => {
    if(newValue.length === 0) {
      setSelectedRegionOptions([])
      setRegionToLabelMap({});
      props.propagateRegionChange(undefined);
      return
    }

    const newRegionType = newValue[0];

    if(!(isSeriesRegionType(newRegionType))) {
      setSelectedRegionOptions([])
      setRegionToLabelMap({});
      props.propagateRegionChange(undefined);
      return
    }

    if(newRegionType === SeriesRegionType.GLOBAL) {
      setSelectedRegionOptions(['Global']);
      setRegionToLabelMap({});
      props.propagateRegionChange({
        regionType: SeriesRegionType.GLOBAL
      });
      return;
    }
    if(newRegionType === SeriesRegionType.COUNTRY) {
      const allCountryAlphaTwoCodes = typedObjectKeys(props.countryAlphaTwoCodeToCountryNameMap);

      if(allCountryAlphaTwoCodes.length === 0) {
        setSelectedRegionOptions([])
        setRegionToLabelMap({});
        props.propagateRegionChange(undefined);
      } else {
        setSelectedRegionOptions(allCountryAlphaTwoCodes);
        setRegionToLabelMap(props.countryAlphaTwoCodeToCountryNameMap);
        props.propagateRegionChange({
          regionType: SeriesRegionType.COUNTRY,
          countryAlphaTwoCodes: allCountryAlphaTwoCodes.slice(0,1)
        });
      }

      return;
    }
    if(newRegionType === SeriesRegionType.WHO_REGION) {
      const allWhoRegions = Object.values(WhoRegion)
      setSelectedRegionOptions(allWhoRegions);
      setRegionToLabelMap({});
      props.propagateRegionChange({
        regionType: SeriesRegionType.WHO_REGION,
        whoRegions: allWhoRegions.slice(0,1)
      });
      return;
    }
    if(newRegionType === SeriesRegionType.UN_REGION) {
      const allUnRegions = Object.values(UnRegion)
      setSelectedRegionOptions(allUnRegions);
      setRegionToLabelMap(unRegionEnumToLabelMap);
      props.propagateRegionChange({
        regionType: SeriesRegionType.UN_REGION,
        unRegions: allUnRegions.slice(0,1)
      });
      return;
    }
    if(newRegionType === SeriesRegionType.GBD_SUB_REGION) {
      const allGbdSubRegions = Object.values(GbdSubRegion)
      setSelectedRegionOptions(allGbdSubRegions);
      setRegionToLabelMap(gbdSubRegionToLabelMap);
      props.propagateRegionChange({
        regionType: SeriesRegionType.GBD_SUB_REGION,
        gbdSubRegions: allGbdSubRegions.slice(0,1)
      });
      return;
    }
    if(newRegionType === SeriesRegionType.GBD_SUPER_REGION) {
      const allGbdSuperRegions = Object.values(GbdSuperRegion)
      setSelectedRegionOptions(allGbdSuperRegions);
      setRegionToLabelMap(gbdSuperRegionToLabelMap);
      props.propagateRegionChange({
        regionType: SeriesRegionType.GBD_SUPER_REGION,
        gbdSuperRegions: allGbdSuperRegions.slice(0,1)
      });
      return;
    }

    assertNever(newRegionType);
  }

  const selectedRegionOnChange = (newValue: string[]) => {
    if(props.selectedRegionType === SeriesRegionType.GLOBAL) {
      props.propagateRegionChange({
        regionType: SeriesRegionType.GLOBAL,
      });
      return;
    }
    if(props.selectedRegionType === SeriesRegionType.COUNTRY) {
      props.propagateRegionChange({
        regionType: SeriesRegionType.COUNTRY,
        countryAlphaTwoCodes: newValue
      });
      return;
    }
    if(props.selectedRegionType === SeriesRegionType.WHO_REGION) {
      props.propagateRegionChange({
        regionType: SeriesRegionType.WHO_REGION,
        whoRegions: newValue.filter((value): value is WhoRegion => isWHORegion(value))
      });
      return;
    }
    if(props.selectedRegionType === SeriesRegionType.UN_REGION) {
      props.propagateRegionChange({
        regionType: SeriesRegionType.UN_REGION,
        unRegions: newValue.filter((value): value is UnRegion => isUNRegion(value))
      });
      return;
    }
    if(props.selectedRegionType === SeriesRegionType.GBD_SUB_REGION) {
      props.propagateRegionChange({
        regionType: SeriesRegionType.GBD_SUB_REGION,
        gbdSubRegions: newValue.filter((value): value is GbdSubRegion => isGbdSubRegion(value))
      });
      return;
    }
    if(props.selectedRegionType === SeriesRegionType.GBD_SUPER_REGION) {
      props.propagateRegionChange({
        regionType: SeriesRegionType.GBD_SUPER_REGION,
        gbdSuperRegions: newValue.filter((value): value is GbdSuperRegion => isGbdSuperRegion(value))
      });
      return;
    }
    if(props.selectedRegionType === undefined) {
      props.propagateRegionChange(undefined);
      return;
    }

    assertNever(props.selectedRegionType)
  }

  return (
    <div className="w-full bg-sky-100 rounded-md pb-2 mb-2">
      <div className="w-full flex justify-end">
        <button className={"rounded-full hover:bg-gray-100 p-1"} onClick={() => props.handleRegionSelectorDeletion()} aria-label="Remove filter">
          <X />
        </button>
      </div>
      <Select
        className="mx-2 w-auto"
        borderedAreaClassname="bg-white"
        handleOnChange={(value) => selectedRegionTypeOnChange(value)}
        heading={'Region Type'}
        selected={props.selectedRegionType ? [ props.selectedRegionType ] : []}
        options={[
          SeriesRegionType.COUNTRY,
          SeriesRegionType.GBD_SUB_REGION,
          SeriesRegionType.GBD_SUPER_REGION,
          SeriesRegionType.GLOBAL,
          SeriesRegionType.WHO_REGION,
          SeriesRegionType.UN_REGION
        ]}
        optionToLabelMap={selectedRegionTypeToLabelMap}
        singleSelect={true}
      />
      <Select
        className="mx-2 w-auto"
        borderedAreaClassname="bg-white"
        handleOnChange={(value) => selectedRegionOnChange(value)}
        heading={'Regions'}
        selected={props.selectedRegions}
        options={selectedRegionOptions}
        optionToLabelMap={regionToLabeMap}
        singleSelect={false}
      />
    </div>
  )
}

interface RegionSelectorContainerProps {
  maximumRegionSelectorCount: number;
  setSelectedSeries: (input: SeriesFieldsRegionPortion[]) => void;
  countryAlphaTwoCodeToCountryNameMap: Record<string, string | undefined>;
}

const getSelectedRegionsFromRegionSelectorState = (state: RegionSelectorState): string[] => {
  if(!state) {
    return [];
  }
  if(state.regionType === SeriesRegionType.GLOBAL) {
    return ['Global']
  }
  if(state.regionType === SeriesRegionType.COUNTRY) {
    return state.countryAlphaTwoCodes;
  }
  if(state.regionType === SeriesRegionType.GBD_SUB_REGION) {
    return state.gbdSubRegions;
  }
  if(state.regionType === SeriesRegionType.GBD_SUPER_REGION) {
    return state.gbdSuperRegions;
  }
  if(state.regionType === SeriesRegionType.UN_REGION) {
    return state.unRegions;
  }
  if(state.regionType === SeriesRegionType.WHO_REGION) {
    return state.whoRegions;
  }
  assertNever(state);
}

const regionSelectorStatesToSelectedSeries = (
  regionSelectorStates: RegionSelectorState[]
): SeriesFieldsRegionPortion[] => {
  return regionSelectorStates.flatMap((state) => {
    if(!state) {
      return [];
    }
    if(state.regionType === SeriesRegionType.GLOBAL) {
      return [{ regionType: SeriesRegionType.GLOBAL }]
    }
    if(state.regionType === SeriesRegionType.COUNTRY) {
      return state.countryAlphaTwoCodes.map((countryAlphaTwoCode): SeriesFieldsRegionPortion => ({
        regionType: SeriesRegionType.COUNTRY,
        countryAlphaTwoCode
      }))
    }
    if(state.regionType === SeriesRegionType.GBD_SUB_REGION) {
      return state.gbdSubRegions.map((gbdSubRegion): SeriesFieldsRegionPortion => ({
        regionType: SeriesRegionType.GBD_SUB_REGION,
        gbdSubRegion
      }))
    }
    if(state.regionType === SeriesRegionType.GBD_SUPER_REGION) {
      return state.gbdSuperRegions.map((gbdSuperRegion): SeriesFieldsRegionPortion => ({
        regionType: SeriesRegionType.GBD_SUPER_REGION,
        gbdSuperRegion
      }))
    }
    if(state.regionType === SeriesRegionType.UN_REGION) {
      return state.unRegions.map((unRegion): SeriesFieldsRegionPortion => ({
        regionType: SeriesRegionType.UN_REGION,
        unRegion
      }))
    }
    if(state.regionType === SeriesRegionType.WHO_REGION) {
      return state.whoRegions.map((whoRegion): SeriesFieldsRegionPortion => ({
        regionType: SeriesRegionType.WHO_REGION,
        whoRegion
      }))
    }

    assertNever(state)
  });
}

interface HandleRegionSelectorDeletionInput {
  regionSelectorState: {selectorId: string };
}

interface PropagateRegionChangeInput {
  regionSelectorState: {selectorId: string };
  newRegionSelectorState: RegionSelectorState;
}

const RegionSelectorContainer = (props: RegionSelectorContainerProps) => {
  const { maximumRegionSelectorCount } = props;

  const [
    allRegionSelectorStates, setAllRegionSelectorStates
  ] = useState<{selectorId: string, sortOrder: number, state: RegionSelectorState}[]>([
    { selectorId: crypto.randomUUID(), sortOrder: 0, state: { regionType: SeriesRegionType.GLOBAL } }
  ]);

  const addNewRegionSelector = () => {
    setAllRegionSelectorStates((currentRegionSelectorStates) => {
      const newRegionSelectorStates = [
        ...currentRegionSelectorStates,
        {
          selectorId: crypto.randomUUID(),
          sortOrder: Math.max(...currentRegionSelectorStates.map(({ sortOrder }) => sortOrder)) + 1,
          state: undefined
        }
      ].sort((a, b) => a.sortOrder - b.sortOrder);

      const newSelectedSeries = regionSelectorStatesToSelectedSeries(
        newRegionSelectorStates.map(({ state }) => state)
      );

      props.setSelectedSeries(newSelectedSeries);

      return newRegionSelectorStates;
    })
  }

  const handleRegionSelectorDeletion = (input: HandleRegionSelectorDeletionInput) => {
    setAllRegionSelectorStates((currentRegionSelectorStates) => {
      const newRegionSelectorStates = currentRegionSelectorStates.filter(
        (element) => element.selectorId !== input.regionSelectorState.selectorId
      ).sort((a, b) => a.sortOrder - b.sortOrder);

      const newSelectedSeries = regionSelectorStatesToSelectedSeries(
        newRegionSelectorStates.map(({ state }) => state)
      );

      props.setSelectedSeries(newSelectedSeries);

      return newRegionSelectorStates;
    })
  }

  const propagateRegionChange = (input: PropagateRegionChangeInput) => {
    setAllRegionSelectorStates((currentRegionSelectorStates) => {
      const selectorElement = currentRegionSelectorStates.find((element) => element.selectorId === input.regionSelectorState.selectorId);

      const newRegionSelectorStates = [
        ...currentRegionSelectorStates.filter((element) => element.selectorId !== input.regionSelectorState.selectorId),
        ...(selectorElement ? [{
          selectorId: selectorElement.selectorId,
          sortOrder: selectorElement.sortOrder,
          state: input.newRegionSelectorState
        }] : [])
      ].sort((a, b) => a.sortOrder - b.sortOrder);

      const newSelectedSeries = regionSelectorStatesToSelectedSeries(
        newRegionSelectorStates.map(({ state }) => state)
      );

      props.setSelectedSeries(newSelectedSeries);

      return newRegionSelectorStates;
    });
  }

  const isAtMaximumRegionSelectorCount = useMemo(() => 
    allRegionSelectorStates.length >= maximumRegionSelectorCount
  , [maximumRegionSelectorCount, allRegionSelectorStates])

  return (
    <div className='h-full'>
      {allRegionSelectorStates.map((regionSelectorState) => 
        <RegionSelector
          key={regionSelectorState.selectorId}
          selectedRegionType={regionSelectorState.state?.regionType}
          selectedRegions={getSelectedRegionsFromRegionSelectorState(regionSelectorState.state)}
          countryAlphaTwoCodeToCountryNameMap={props.countryAlphaTwoCodeToCountryNameMap}
          propagateRegionChange={(input) => propagateRegionChange({
            regionSelectorState,
            newRegionSelectorState: input
          })}
          handleRegionSelectorDeletion={() => handleRegionSelectorDeletion({ regionSelectorState })}
        />
      )}
      {!isAtMaximumRegionSelectorCount && (
        <Button
          onClick={!isAtMaximumRegionSelectorCount ? () => addNewRegionSelector() : () => {}}
          className="w-full bg-sc2virus"
          aria-label="Add filter"
        >
          <Plus/>
        </Button>
      )}
    </div>
  );
}

interface UseRegionSelectorInput {
  maximumRegionSelectorCount: number;
}

export const useRegionSelector = (input: UseRegionSelectorInput) => {
  const { maximumRegionSelectorCount } = input;

  const { countryAlphaTwoCodeToCountryNameMap } = useContext(CountryInformationContext);
  const [selectedSeries, setSelectedSeries] = useState<SeriesFieldsRegionPortion[]>([
    { regionType: SeriesRegionType.GLOBAL }
  ])

  const regionSelector = useMemo(() => (
    <RegionSelectorContainer
      maximumRegionSelectorCount={maximumRegionSelectorCount}
      countryAlphaTwoCodeToCountryNameMap={countryAlphaTwoCodeToCountryNameMap}
      setSelectedSeries={setSelectedSeries}
    />
  ), [maximumRegionSelectorCount, setSelectedSeries, countryAlphaTwoCodeToCountryNameMap])

  return {
    regionSelector,
    seriesRegionPortions: selectedSeries
  }
}