import { useContext, useMemo, useState } from "react"
import { Plus, X } from "lucide-react";
import { Select } from "@/components/customs/select";
import { SecondaryKeyFieldsRegionPortion, SecondaryKeyRegionType, isSecondaryKeyRegionType } from "./secondary-key-lib";
import assertNever from "assert-never";
import { CountryInformationContext } from "@/contexts/pathogen-context/country-information-context";
import { typedObjectKeys } from "@/lib/utils";
import { GbdSubRegion, GbdSuperRegion, UnRegion, WhoRegion } from "@/gql/graphql";
import { isUNRegion, unRegionEnumToLabelMap } from "@/lib/un-regions";
import { gbdSubRegionToLabelMap, gbdSuperRegionToLabelMap, isGbdSubRegion, isGbdSuperRegion } from "@/lib/gbd-regions";
import { isWHORegion } from "@/lib/who-regions";
import { Button } from "@/components/ui/button";

type RegionSelectorState = {
  regionType: SecondaryKeyRegionType.GLOBAL
} | {
  regionType: SecondaryKeyRegionType.WHO_REGION,
  whoRegions: WhoRegion[],
} | {
  regionType: SecondaryKeyRegionType.UN_REGION,
  unRegions: UnRegion[],
} | {
  regionType: SecondaryKeyRegionType.COUNTRY,
  countryAlphaTwoCodes: string[],
} | {
  regionType: SecondaryKeyRegionType.GBD_SUPER_REGION,
  gbdSuperRegions: GbdSuperRegion[]
} | {
  regionType: SecondaryKeyRegionType.GBD_SUB_REGION,
  gbdSubRegions: GbdSubRegion[]
} | undefined;

interface RegionSelectorProps {
  selectedRegionType: SecondaryKeyRegionType | undefined;
  selectedRegions: string[];
  countryAlphaTwoCodeToCountryNameMap: Record<string, string | undefined>;
  propagateRegionChange: (input: RegionSelectorState) => void;
  handleRegionSelectorDeletion: () => void;
}

const selectedRegionTypeToLabelMap = {
  [SecondaryKeyRegionType.COUNTRY]: 'Country',
  [SecondaryKeyRegionType.GBD_SUB_REGION]: 'GBD Subregion',
  [SecondaryKeyRegionType.GBD_SUPER_REGION]: 'GBD Superregion',
  [SecondaryKeyRegionType.GLOBAL]: 'Global',
  [SecondaryKeyRegionType.WHO_REGION]: 'WHO Region',
  [SecondaryKeyRegionType.UN_REGION]: 'UN Region',
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

    if(!(isSecondaryKeyRegionType(newRegionType))) {
      setSelectedRegionOptions([])
      setRegionToLabelMap({});
      props.propagateRegionChange(undefined);
      return
    }

    if(newRegionType === SecondaryKeyRegionType.GLOBAL) {
      setSelectedRegionOptions(['Global']);
      setRegionToLabelMap({});
      props.propagateRegionChange({
        regionType: SecondaryKeyRegionType.GLOBAL
      });
      return;
    }
    if(newRegionType === SecondaryKeyRegionType.COUNTRY) {
      const allCountryAlphaTwoCodes = typedObjectKeys(props.countryAlphaTwoCodeToCountryNameMap);

      if(allCountryAlphaTwoCodes.length === 0) {
        setSelectedRegionOptions([])
        setRegionToLabelMap({});
        props.propagateRegionChange(undefined);
      } else {
        setSelectedRegionOptions(allCountryAlphaTwoCodes);
        setRegionToLabelMap(props.countryAlphaTwoCodeToCountryNameMap);
        props.propagateRegionChange({
          regionType: SecondaryKeyRegionType.COUNTRY,
          countryAlphaTwoCodes: allCountryAlphaTwoCodes.slice(0,1)
        });
      }

      return;
    }
    if(newRegionType === SecondaryKeyRegionType.WHO_REGION) {
      const allWhoRegions = Object.values(WhoRegion)
      setSelectedRegionOptions(allWhoRegions);
      setRegionToLabelMap({});
      props.propagateRegionChange({
        regionType: SecondaryKeyRegionType.WHO_REGION,
        whoRegions: allWhoRegions.slice(0,1)
      });
      return;
    }
    if(newRegionType === SecondaryKeyRegionType.UN_REGION) {
      const allUnRegions = Object.values(UnRegion)
      setSelectedRegionOptions(allUnRegions);
      setRegionToLabelMap(unRegionEnumToLabelMap);
      props.propagateRegionChange({
        regionType: SecondaryKeyRegionType.UN_REGION,
        unRegions: allUnRegions.slice(0,1)
      });
      return;
    }
    if(newRegionType === SecondaryKeyRegionType.GBD_SUB_REGION) {
      const allGbdSubRegions = Object.values(GbdSubRegion)
      setSelectedRegionOptions(allGbdSubRegions);
      setRegionToLabelMap(gbdSubRegionToLabelMap);
      props.propagateRegionChange({
        regionType: SecondaryKeyRegionType.GBD_SUB_REGION,
        gbdSubRegions: allGbdSubRegions.slice(0,1)
      });
      return;
    }
    if(newRegionType === SecondaryKeyRegionType.GBD_SUPER_REGION) {
      const allGbdSuperRegions = Object.values(GbdSuperRegion)
      setSelectedRegionOptions(allGbdSuperRegions);
      setRegionToLabelMap(gbdSuperRegionToLabelMap);
      props.propagateRegionChange({
        regionType: SecondaryKeyRegionType.GBD_SUPER_REGION,
        gbdSuperRegions: allGbdSuperRegions.slice(0,1)
      });
      return;
    }

    assertNever(newRegionType);
  }

  const selectedRegionOnChange = (newValue: string[]) => {
    if(props.selectedRegionType === SecondaryKeyRegionType.GLOBAL) {
      props.propagateRegionChange({
        regionType: SecondaryKeyRegionType.GLOBAL,
      });
      return;
    }
    if(props.selectedRegionType === SecondaryKeyRegionType.COUNTRY) {
      props.propagateRegionChange({
        regionType: SecondaryKeyRegionType.COUNTRY,
        countryAlphaTwoCodes: newValue
      });
      return;
    }
    if(props.selectedRegionType === SecondaryKeyRegionType.WHO_REGION) {
      props.propagateRegionChange({
        regionType: SecondaryKeyRegionType.WHO_REGION,
        whoRegions: newValue.filter((value): value is WhoRegion => isWHORegion(value))
      });
      return;
    }
    if(props.selectedRegionType === SecondaryKeyRegionType.UN_REGION) {
      props.propagateRegionChange({
        regionType: SecondaryKeyRegionType.UN_REGION,
        unRegions: newValue.filter((value): value is UnRegion => isUNRegion(value))
      });
      return;
    }
    if(props.selectedRegionType === SecondaryKeyRegionType.GBD_SUB_REGION) {
      props.propagateRegionChange({
        regionType: SecondaryKeyRegionType.GBD_SUB_REGION,
        gbdSubRegions: newValue.filter((value): value is GbdSubRegion => isGbdSubRegion(value))
      });
      return;
    }
    if(props.selectedRegionType === SecondaryKeyRegionType.GBD_SUPER_REGION) {
      props.propagateRegionChange({
        regionType: SecondaryKeyRegionType.GBD_SUPER_REGION,
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
          SecondaryKeyRegionType.COUNTRY,
          SecondaryKeyRegionType.GBD_SUB_REGION,
          SecondaryKeyRegionType.GBD_SUPER_REGION,
          SecondaryKeyRegionType.GLOBAL,
          SecondaryKeyRegionType.WHO_REGION,
          SecondaryKeyRegionType.UN_REGION
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
  setSelectedSecondaryKeys: (input: SecondaryKeyFieldsRegionPortion[]) => void;
  countryAlphaTwoCodeToCountryNameMap: Record<string, string | undefined>;
}

const getSelectedRegionsFromRegionSelectorState = (state: RegionSelectorState): string[] => {
  if(!state) {
    return [];
  }
  if(state.regionType === SecondaryKeyRegionType.GLOBAL) {
    return ['Global']
  }
  if(state.regionType === SecondaryKeyRegionType.COUNTRY) {
    return state.countryAlphaTwoCodes;
  }
  if(state.regionType === SecondaryKeyRegionType.GBD_SUB_REGION) {
    return state.gbdSubRegions;
  }
  if(state.regionType === SecondaryKeyRegionType.GBD_SUPER_REGION) {
    return state.gbdSuperRegions;
  }
  if(state.regionType === SecondaryKeyRegionType.UN_REGION) {
    return state.unRegions;
  }
  if(state.regionType === SecondaryKeyRegionType.WHO_REGION) {
    return state.whoRegions;
  }
  assertNever(state);
}

const regionSelectorStatesToSelectedSecondaryKeys = (
  regionSelectorStates: RegionSelectorState[]
): SecondaryKeyFieldsRegionPortion[] => {
  return regionSelectorStates.flatMap((state) => {
    if(!state) {
      return [];
    }
    if(state.regionType === SecondaryKeyRegionType.GLOBAL) {
      return [{ regionType: SecondaryKeyRegionType.GLOBAL }]
    }
    if(state.regionType === SecondaryKeyRegionType.COUNTRY) {
      return state.countryAlphaTwoCodes.map((countryAlphaTwoCode): SecondaryKeyFieldsRegionPortion => ({
        regionType: SecondaryKeyRegionType.COUNTRY,
        countryAlphaTwoCode
      }))
    }
    if(state.regionType === SecondaryKeyRegionType.GBD_SUB_REGION) {
      return state.gbdSubRegions.map((gbdSubRegion): SecondaryKeyFieldsRegionPortion => ({
        regionType: SecondaryKeyRegionType.GBD_SUB_REGION,
        gbdSubRegion
      }))
    }
    if(state.regionType === SecondaryKeyRegionType.GBD_SUPER_REGION) {
      return state.gbdSuperRegions.map((gbdSuperRegion): SecondaryKeyFieldsRegionPortion => ({
        regionType: SecondaryKeyRegionType.GBD_SUPER_REGION,
        gbdSuperRegion
      }))
    }
    if(state.regionType === SecondaryKeyRegionType.UN_REGION) {
      return state.unRegions.map((unRegion): SecondaryKeyFieldsRegionPortion => ({
        regionType: SecondaryKeyRegionType.UN_REGION,
        unRegion
      }))
    }
    if(state.regionType === SecondaryKeyRegionType.WHO_REGION) {
      return state.whoRegions.map((whoRegion): SecondaryKeyFieldsRegionPortion => ({
        regionType: SecondaryKeyRegionType.WHO_REGION,
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
    { selectorId: crypto.randomUUID(), sortOrder: 0, state: { regionType: SecondaryKeyRegionType.GLOBAL } }
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
      ]

      const newSelectedSecondaryKeys = regionSelectorStatesToSelectedSecondaryKeys(
        newRegionSelectorStates.map(({ state }) => state)
      );

      props.setSelectedSecondaryKeys(newSelectedSecondaryKeys);

      return newRegionSelectorStates;
    })
  }

  const handleRegionSelectorDeletion = (input: HandleRegionSelectorDeletionInput) => {
    setAllRegionSelectorStates((currentRegionSelectorStates) => {
      const newRegionSelectorStates = currentRegionSelectorStates.filter(
        (element) => element.selectorId !== input.regionSelectorState.selectorId
      );

      const newSelectedSecondaryKeys = regionSelectorStatesToSelectedSecondaryKeys(
        newRegionSelectorStates.map(({ state }) => state)
      );

      props.setSelectedSecondaryKeys(newSelectedSecondaryKeys);

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
      ]

      const newSelectedSecondaryKeys = regionSelectorStatesToSelectedSecondaryKeys(
        newRegionSelectorStates.map(({ state }) => state)
      );

      props.setSelectedSecondaryKeys(newSelectedSecondaryKeys);

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
  const [selectedSecondaryKeys, setSelectedSecondaryKeys] = useState<SecondaryKeyFieldsRegionPortion[]>([
    { regionType: SecondaryKeyRegionType.GLOBAL }
  ])

  const regionSelector = useMemo(() => (
    <RegionSelectorContainer
      maximumRegionSelectorCount={maximumRegionSelectorCount}
      countryAlphaTwoCodeToCountryNameMap={countryAlphaTwoCodeToCountryNameMap}
      setSelectedSecondaryKeys={setSelectedSecondaryKeys}
    />
  ), [maximumRegionSelectorCount, setSelectedSecondaryKeys, countryAlphaTwoCodeToCountryNameMap])

  return {
    regionSelector,
    secondaryKeyRegionPortions: selectedSecondaryKeys
  }
}