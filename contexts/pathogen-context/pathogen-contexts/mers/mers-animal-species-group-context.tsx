import { MersAnimalSpecies } from "@/gql/graphql"
import { createContext, useMemo } from "react";

export enum MersAnimalSpeciesGroup {
  CAMELS = 'CAMELS',
  OTHER_ANIMAL_SPECIES = 'OTHER_ANIMAL_SPECIES',
  UNCATEGORIZED = 'UNCATEGORIZED'
}

export const isMersAnimalSpeciesGroup = (animalSpeciesGroup: string): animalSpeciesGroup is MersAnimalSpeciesGroup => Object.values(MersAnimalSpeciesGroup).some((element) => element === animalSpeciesGroup);

interface MersAnimalSpeciesGroupContextType {
  mersAnimalSpeciesToAnimalSpeciesGroupMap: Record<MersAnimalSpecies, MersAnimalSpeciesGroup>;
  mersAnimalSpeciesGroupToSortOrderMap: Record<MersAnimalSpeciesGroup, number>;
  mersAnimalSpeciesGroupToLabelMap: Record<MersAnimalSpeciesGroup, string>;
}

const initialMersAnimalSpeciesGroupContext: MersAnimalSpeciesGroupContextType = {
  mersAnimalSpeciesToAnimalSpeciesGroupMap: {
    [MersAnimalSpecies.Baboon]: MersAnimalSpeciesGroup.OTHER_ANIMAL_SPECIES,
    [MersAnimalSpecies.BactrianCamel]: MersAnimalSpeciesGroup.CAMELS,
    [MersAnimalSpecies.Bat]: MersAnimalSpeciesGroup.OTHER_ANIMAL_SPECIES,
    [MersAnimalSpecies.Buffalo]: MersAnimalSpeciesGroup.OTHER_ANIMAL_SPECIES,
    [MersAnimalSpecies.Cattle]: MersAnimalSpeciesGroup.OTHER_ANIMAL_SPECIES,
    [MersAnimalSpecies.Donkey]: MersAnimalSpeciesGroup.OTHER_ANIMAL_SPECIES,
    [MersAnimalSpecies.DromedaryCamel]: MersAnimalSpeciesGroup.CAMELS,
    [MersAnimalSpecies.Goat]: MersAnimalSpeciesGroup.OTHER_ANIMAL_SPECIES,
    [MersAnimalSpecies.Horse]: MersAnimalSpeciesGroup.OTHER_ANIMAL_SPECIES,
    [MersAnimalSpecies.Mule]: MersAnimalSpeciesGroup.OTHER_ANIMAL_SPECIES,
    [MersAnimalSpecies.Sheep]: MersAnimalSpeciesGroup.OTHER_ANIMAL_SPECIES,
    [MersAnimalSpecies.WaterBuffalo]: MersAnimalSpeciesGroup.OTHER_ANIMAL_SPECIES,
  },
  mersAnimalSpeciesGroupToSortOrderMap: {
    [MersAnimalSpeciesGroup.CAMELS]: 1,
    [MersAnimalSpeciesGroup.OTHER_ANIMAL_SPECIES]: 2,
    [MersAnimalSpeciesGroup.UNCATEGORIZED]: 3,
  },
  mersAnimalSpeciesGroupToLabelMap: {
    [MersAnimalSpeciesGroup.CAMELS]: 'Camels',
    [MersAnimalSpeciesGroup.OTHER_ANIMAL_SPECIES]: 'Other animal species',
    [MersAnimalSpeciesGroup.UNCATEGORIZED]: 'Uncategorized',
  }
};

export const MersAnimalSpeciesGroupContext = createContext<
  MersAnimalSpeciesGroupContextType
>(initialMersAnimalSpeciesGroupContext);

interface MersAnimalSpeciesGroupProviderProps {
  children: React.ReactNode;
}

export const MersAnimalSpeciesGroupProvider = (props: MersAnimalSpeciesGroupProviderProps) => {
  const mersAnimalSpeciesToAnimalSpeciesGroupMap = useMemo(() => {
    return initialMersAnimalSpeciesGroupContext['mersAnimalSpeciesToAnimalSpeciesGroupMap'];
  }, []);

  const mersAnimalSpeciesGroupToSortOrderMap = useMemo(() => {
    return initialMersAnimalSpeciesGroupContext['mersAnimalSpeciesGroupToSortOrderMap'];
  }, []);

  const mersAnimalSpeciesGroupToLabelMap = useMemo(() => {
    return initialMersAnimalSpeciesGroupContext['mersAnimalSpeciesGroupToLabelMap'];
  }, []);

  return (
    <MersAnimalSpeciesGroupContext.Provider
      value={{
        mersAnimalSpeciesToAnimalSpeciesGroupMap,
        mersAnimalSpeciesGroupToSortOrderMap,
        mersAnimalSpeciesGroupToLabelMap,
      }}
    >
      {props.children}
    </MersAnimalSpeciesGroupContext.Provider>
  );
}