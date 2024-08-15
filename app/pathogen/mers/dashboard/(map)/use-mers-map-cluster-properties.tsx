import { MersAnimalSpecies, MersEventAnimalSpecies } from "@/gql/graphql";
import { MapDataPointVisibilityOptions } from "./use-mers-map-customization-modal";
import { ClusteringSettings } from "@/components/ui/pathogen-map/pathogen-map"; 
import { GenericMapPopUpWidth } from "@/components/ui/pathogen-map/map-pop-up/generic-map-pop-up";
import { MapPinColours } from "./mers-map";
import { useMemo } from "react";

export interface UseMersMapClusterPropertiesInput {
  estimateDataShown: boolean;
  eventDataShown: boolean;
}

export enum MersMapClusteringPropertyKey {
  "Reported Human Events" = "Reported Human Events",
  "Human Cases" = "Human Cases",
  "Human Deaths" = "Human Deaths",
  "Reported Animal Events" = "Reported Animal Events",
  "Camel Events" = "Camel Events",
  "Bat Events" = "Bat Events",
  "Goat Events" = "Goat Events",
  "Cattle Events" = "Cattle Events",
  "Sheep Events" = "Sheep Events",
  "Human Seroprevalence Estimates" = "Human Seroprevalence Estimates",
  "Animal Seroprevalence Estimates" = "Animal Seroprevalence Estimates",
  "Camel Seroprevalence Estimates" = "Camel Seroprevalence Estimates",
  "Bat Seroprevalence Estimates" = "Bat Seroprevalence Estimates",
  "Goat Seroprevalence Estimates" = "Goat Seroprevalence Estimates",
  "Cattle Seroprevalence Estimates" = "Cattle Seroprevalence Estimates",
  "Sheep Seroprevalence Estimates" = "Sheep Seroprevalence Estimates",
  "Human Viral Estimates" = "Human Viral Estimates",
  "Animal Viral Estimates" = "Animal Viral Estimates",
  "Camel Viral Estimates" = "Camel Viral Estimates",
  "Bat Viral Estimates" = "Bat Viral Estimates",
  "Goat Viral Estimates" = "Goat Viral Estimates",
  "Cattle Viral Estimates" = "Cattle Viral Estimates",
  "Sheep Viral Estimates" = "Sheep Viral Estimates"
}

export const useMersMapClusterProperties = (input: UseMersMapClusterPropertiesInput) => {
  const { estimateDataShown, eventDataShown } = input;

  const clusteringSettings: ClusteringSettings<MersMapClusteringPropertyKey> = useMemo(() => ({
    clusteringEnabled: true,
    headerText: "MERS Data",
    popUpWidth: GenericMapPopUpWidth.MEDIUM,
    clusterProperties: {
      "Reported Human Events": ["+", ["case", ["==", ["get", "__typename"], "HumanMersEvent"], 1, 0]],
      "Human Cases": ["+", ["case", ["==", ["get", "__typename"], "HumanMersEvent"], ["get", "humansAffected"], 0]],
      "Human Deaths": ["+", ["case", ["==", ["get", "__typename"], "HumanMersEvent"], ["get", "humanDeaths"], 0]],
      "Reported Animal Events": ["+", ["case", ["==", ["get", "__typename"], "AnimalMersEvent"], 1, 0]],
      "Camel Events": ["+", ["case", [ "all",
        ["==", ["get", "__typename"], "AnimalMersEvent"],
        ["==", ["get", "animalSpecies"], MersEventAnimalSpecies.Camel]
      ], 1, 0]],
      "Bat Events": ["+", ["case", [ "all",
        ["==", ["get", "__typename"], "AnimalMersEvent"],
        ["==", ["get", "animalSpecies"], MersEventAnimalSpecies.Bat]
      ], 1, 0]],
      "Goat Events": ["+", ["case", [ "all",
        ["==", ["get", "__typename"], "AnimalMersEvent"],
        ["==", ["get", "animalSpecies"], MersEventAnimalSpecies.Goat]
      ], 1, 0]],
      "Cattle Events": ["+", ["case", [ "all",
        ["==", ["get", "__typename"], "AnimalMersEvent"],
        ["==", ["get", "animalSpecies"], MersEventAnimalSpecies.Cattle]
      ], 1, 0]],
      "Sheep Events": ["+", ["case", [ "all",
        ["==", ["get", "__typename"], "AnimalMersEvent"],
        ["==", ["get", "animalSpecies"], MersEventAnimalSpecies.Sheep]
      ], 1, 0]],
      "Human Seroprevalence Estimates": ["+", ["case", ["==", ["get", "primaryEstimateInfoTypename"], "PrimaryHumanMersSeroprevalenceEstimateInformation"], 1, 0]],
      "Human Viral Estimates": ["+", ["case", ["==", ["get", "primaryEstimateInfoTypename"], "PrimaryHumanMersViralEstimateInformation"], 1, 0]],
      "Animal Seroprevalence Estimates": ["+", ["case", ["==", ["get", "primaryEstimateInfoTypename"], "PrimaryAnimalMersSeroprevalenceEstimateInformation"], 1, 0]],
      "Camel Seroprevalence Estimates": ["+", ["case", [ "all",
        ["==", ["get", "primaryEstimateInfoTypename"], "PrimaryAnimalMersSeroprevalenceEstimateInformation"],
        ["==", ["get", "animalSpecies", ["get", "primaryEstimateInfo"]], MersAnimalSpecies.Camel]
      ], 1, 0]],
      "Bat Seroprevalence Estimates": ["+", ["case", [ "all",
        ["==", ["get", "primaryEstimateInfoTypename"], "PrimaryAnimalMersSeroprevalenceEstimateInformation"],
        ["==", ["get", "animalSpecies", ["get", "primaryEstimateInfo"]], MersAnimalSpecies.Bat]
      ], 1, 0]],
      "Goat Seroprevalence Estimates": ["+", ["case", [ "all",
        ["==", ["get", "primaryEstimateInfoTypename"], "PrimaryAnimalMersSeroprevalenceEstimateInformation"],
        ["==", ["get", "animalSpecies", ["get", "primaryEstimateInfo"]], MersAnimalSpecies.Goat]
      ], 1, 0]],
      "Cattle Seroprevalence Estimates": ["+", ["case", [ "all",
        ["==", ["get", "primaryEstimateInfoTypename"], "PrimaryAnimalMersSeroprevalenceEstimateInformation"],
        ["==", ["get", "animalSpecies", ["get", "primaryEstimateInfo"]], MersAnimalSpecies.Cattle]
      ], 1, 0]],
      "Sheep Seroprevalence Estimates": ["+", ["case", [ "all",
        ["==", ["get", "primaryEstimateInfoTypename"], "PrimaryAnimalMersSeroprevalenceEstimateInformation"],
        ["==", ["get", "animalSpecies", ["get", "primaryEstimateInfo"]], MersAnimalSpecies.Sheep]
      ], 1, 0]],
      "Animal Viral Estimates": ["+", ["case", ["==", ["get", "primaryEstimateInfoTypename"], "PrimaryAnimalMersViralEstimateInformation"], 1, 0]],
      "Camel Viral Estimates": ["+", ["case", [ "all",
        ["==", ["get", "primaryEstimateInfoTypename"], "PrimaryAnimalMersViralEstimateInformation"],
        ["==", ["get", "animalSpecies", ["get", "primaryEstimateInfo"]], MersAnimalSpecies.Camel]
      ], 1, 0]],
      "Bat Viral Estimates": ["+", ["case", [ "all",
        ["==", ["get", "primaryEstimateInfoTypename"], "PrimaryAnimalMersViralEstimateInformation"],
        ["==", ["get", "animalSpecies", ["get", "primaryEstimateInfo"]], MersAnimalSpecies.Bat]
      ], 1, 0]],
      "Goat Viral Estimates": ["+", ["case", [ "all",
        ["==", ["get", "primaryEstimateInfoTypename"], "PrimaryAnimalMersViralEstimateInformation"],
        ["==", ["get", "animalSpecies", ["get", "primaryEstimateInfo"]], MersAnimalSpecies.Goat]
      ], 1, 0]],
      "Cattle Viral Estimates": ["+", ["case", [ "all",
        ["==", ["get", "primaryEstimateInfoTypename"], "PrimaryAnimalMersViralEstimateInformation"],
        ["==", ["get", "animalSpecies", ["get", "primaryEstimateInfo"]], MersAnimalSpecies.Cattle]
      ], 1, 0]],
      "Sheep Viral Estimates": ["+", ["case", [ "all",
        ["==", ["get", "primaryEstimateInfoTypename"], "PrimaryAnimalMersViralEstimateInformation"],
        ["==", ["get", "animalSpecies", ["get", "primaryEstimateInfo"]], MersAnimalSpecies.Sheep]
      ], 1, 0]],
    },
    validClusterPropertyKeys: [
      ...(eventDataShown ? [MersMapClusteringPropertyKey["Reported Human Events"]] : []),
      ...(eventDataShown ? [MersMapClusteringPropertyKey["Human Cases"]] : []),
      ...(eventDataShown ? [MersMapClusteringPropertyKey["Human Deaths"]] : []),
      ...(eventDataShown ? [MersMapClusteringPropertyKey["Reported Animal Events"]] : []),
      ...(eventDataShown ? [MersMapClusteringPropertyKey["Camel Events"]] : []),
      ...(eventDataShown ? [MersMapClusteringPropertyKey["Bat Events"]] : []),
      ...(eventDataShown ? [MersMapClusteringPropertyKey["Goat Events"]] : []),
      ...(eventDataShown ? [MersMapClusteringPropertyKey["Cattle Events"]] : []),
      ...(eventDataShown ? [MersMapClusteringPropertyKey["Sheep Events"]] : []),
      ...(estimateDataShown ? [MersMapClusteringPropertyKey["Human Seroprevalence Estimates"]] : []),
      ...(estimateDataShown ? [MersMapClusteringPropertyKey["Animal Seroprevalence Estimates"]] : []),
      ...(estimateDataShown ? [MersMapClusteringPropertyKey["Camel Seroprevalence Estimates"]] : []),
      ...(estimateDataShown ? [MersMapClusteringPropertyKey["Bat Seroprevalence Estimates"]] : []),
      ...(estimateDataShown ? [MersMapClusteringPropertyKey["Goat Seroprevalence Estimates"]] : []),
      ...(estimateDataShown ? [MersMapClusteringPropertyKey["Cattle Seroprevalence Estimates"]] : []),
      ...(estimateDataShown ? [MersMapClusteringPropertyKey["Sheep Seroprevalence Estimates"]] : []),
      ...(estimateDataShown ? [MersMapClusteringPropertyKey["Human Viral Estimates"]] : []),
      ...(estimateDataShown ? [MersMapClusteringPropertyKey["Camel Viral Estimates"]] : []),
      ...(estimateDataShown ? [MersMapClusteringPropertyKey["Bat Viral Estimates"]] : []),
      ...(estimateDataShown ? [MersMapClusteringPropertyKey["Goat Viral Estimates"]] : []),
      ...(estimateDataShown ? [MersMapClusteringPropertyKey["Cattle Viral Estimates"]] : []),
      ...(estimateDataShown ? [MersMapClusteringPropertyKey["Sheep Viral Estimates"]] : [])
    ],
    clusterPropertyKeysIncludedInSum: [
      MersMapClusteringPropertyKey["Reported Human Events"],
      MersMapClusteringPropertyKey["Reported Animal Events"],
      MersMapClusteringPropertyKey["Human Seroprevalence Estimates"],
      MersMapClusteringPropertyKey["Animal Seroprevalence Estimates"],
      MersMapClusteringPropertyKey["Human Viral Estimates"],
      MersMapClusteringPropertyKey["Animal Viral Estimates"]
    ],
    clusterPropertyToColourMap: {
      [MersMapClusteringPropertyKey["Reported Human Events"]]: MapPinColours['HumanMersEvent'],
      [MersMapClusteringPropertyKey["Human Cases"]]: MapPinColours['human-mers-event-alt'],
      [MersMapClusteringPropertyKey["Human Deaths"]]: MapPinColours['human-mers-event-alt'],
      [MersMapClusteringPropertyKey["Reported Animal Events"]]: MapPinColours['AnimalMersEvent'],
      [MersMapClusteringPropertyKey["Camel Events"]]: MapPinColours['animal-mers-event-alt'],
      [MersMapClusteringPropertyKey["Bat Events"]]: MapPinColours['animal-mers-event-alt'],
      [MersMapClusteringPropertyKey["Goat Events"]]: MapPinColours['animal-mers-event-alt'],
      [MersMapClusteringPropertyKey["Cattle Events"]]: MapPinColours['animal-mers-event-alt'],
      [MersMapClusteringPropertyKey["Sheep Events"]]: MapPinColours['animal-mers-event-alt'],
      [MersMapClusteringPropertyKey["Human Seroprevalence Estimates"]]: MapPinColours['PrimaryHumanMersSeroprevalenceEstimateInformation'],
      [MersMapClusteringPropertyKey["Animal Seroprevalence Estimates"]]: MapPinColours['PrimaryAnimalMersSeroprevalenceEstimateInformation'],
      [MersMapClusteringPropertyKey["Camel Seroprevalence Estimates"]]: MapPinColours['mers-animal-viral-estimate-alt'],
      [MersMapClusteringPropertyKey["Bat Seroprevalence Estimates"]]: MapPinColours['mers-animal-viral-estimate-alt'],
      [MersMapClusteringPropertyKey["Goat Seroprevalence Estimates"]]: MapPinColours['mers-animal-viral-estimate-alt'],
      [MersMapClusteringPropertyKey["Cattle Seroprevalence Estimates"]]: MapPinColours['mers-animal-viral-estimate-alt'],
      [MersMapClusteringPropertyKey["Sheep Seroprevalence Estimates"]]: MapPinColours['mers-animal-viral-estimate-alt'],
      [MersMapClusteringPropertyKey["Human Viral Estimates"]]: MapPinColours['PrimaryHumanMersViralEstimateInformation'],
      [MersMapClusteringPropertyKey["Animal Viral Estimates"]]: MapPinColours['PrimaryAnimalMersViralEstimateInformation'],
      [MersMapClusteringPropertyKey["Camel Viral Estimates"]]: MapPinColours['mers-animal-viral-estimate-alt'],
      [MersMapClusteringPropertyKey["Bat Viral Estimates"]]: MapPinColours['mers-animal-viral-estimate-alt'],
      [MersMapClusteringPropertyKey["Goat Viral Estimates"]]: MapPinColours['mers-animal-viral-estimate-alt'],
      [MersMapClusteringPropertyKey["Cattle Viral Estimates"]]: MapPinColours['mers-animal-viral-estimate-alt'],
      [MersMapClusteringPropertyKey["Sheep Viral Estimates"]]: MapPinColours['mers-animal-viral-estimate-alt']
    }
  }), [ estimateDataShown, eventDataShown ]);

  return {
    clusteringSettings
  }
};