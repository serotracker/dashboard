import { MersAnimalSpeciesV2 } from "@/gql/graphql";
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
  "Dromedary Camel Events" = "Dromedary Camel Events",
  "Bactrian Camel Events" = "Bactrian Camel Events",
  "Horse Events" = "Horse Events",
  "Mule Events" = "Mule Events",
  "Buffalo Events" = "Buffalo Events",
  "Bat Events" = "Bat Events",
  "Goat Events" = "Goat Events",
  "Cattle Events" = "Cattle Events",
  "Sheep Events" = "Sheep Events",
  "Donkey Events" = "Donkey Events",
  "Water Buffalo Events" = "Water Buffalo Events",
  "Baboon Events" = "Baboon Events",
  "Human Seroprevalence Estimates" = "Human Seroprevalence Estimates",
  "Animal Seroprevalence Estimates" = "Animal Seroprevalence Estimates",
  "Dromedary Camel Seroprevalence Estimates" = "Dromedary Camel Seroprevalence Estimates",
  "Bactrian Camel Seroprevalence Estimates" = "Bactrian Camel Seroprevalence Estimates",
  "Mule Seroprevalence Estimates" = "Mule Seroprevalence Estimates",
  "Horse Seroprevalence Estimates" = "Horse Seroprevalence Estimates",
  "Buffalo Seroprevalence Estimates" = "Buffalo Seroprevalence Estimates",
  "Bat Seroprevalence Estimates" = "Bat Seroprevalence Estimates",
  "Goat Seroprevalence Estimates" = "Goat Seroprevalence Estimates",
  "Cattle Seroprevalence Estimates" = "Cattle Seroprevalence Estimates",
  "Sheep Seroprevalence Estimates" = "Sheep Seroprevalence Estimates",
  "Donkey Seroprevalence Estimates" = "Donkey Seroprevalence Estimates",
  "Water Buffalo Seroprevalence Estimates" = "Water Buffalo Seroprevalence Estimates",
  "Baboon Seroprevalence Estimates" = "Baboon Seroprevalence Estimates",
  "Human Viral Estimates" = "Human Viral Estimates",
  "Animal Viral Estimates" = "Animal Viral Estimates",
  "Dromedary Camel Viral Estimates" = "Dromedary Camel Viral Estimates",
  "Bactrian Camel Viral Estimates" = "Bactrian Camel Viral Estimates",
  "Mule Viral Estimates" = "Mule Viral Estimates",
  "Horse Viral Estimates" = "Horse Viral Estimates",
  "Buffalo Viral Estimates" = "Buffalo Viral Estimates",
  "Bat Viral Estimates" = "Bat Viral Estimates",
  "Goat Viral Estimates" = "Goat Viral Estimates",
  "Cattle Viral Estimates" = "Cattle Viral Estimates",
  "Sheep Viral Estimates" = "Sheep Viral Estimates",
  "Donkey Viral Estimates" = "Donkey Viral Estimates",
  "Water Buffalo Viral Estimates" = "Water Buffalo Viral Estimates",
  "Baboon Viral Estimates" = "Baboon Viral Estimates",
}

export const useMersMapClusterProperties = (input: UseMersMapClusterPropertiesInput) => {
  const { estimateDataShown, eventDataShown } = input;

  const clusteringSettings: ClusteringSettings<MersMapClusteringPropertyKey> = useMemo(() => ({
    clusteringEnabled: true,
    clusteringRadius: 30,
    headerText: "MERS Data",
    popUpWidth: GenericMapPopUpWidth.MEDIUM,
    clusterProperties: {
      "Reported Human Events": ["+", ["case", ["==", ["get", "__typename"], "HumanMersEvent"], 1, 0]],
      "Human Cases": ["+", ["case", ["==", ["get", "__typename"], "HumanMersEvent"], ["get", "humansAffected"], 0]],
      "Human Deaths": ["+", ["case", ["==", ["get", "__typename"], "HumanMersEvent"], ["get", "humanDeaths"], 0]],
      "Reported Animal Events": ["+", ["case", ["==", ["get", "__typename"], "AnimalMersEvent"], 1, 0]],
      "Dromedary Camel Events": ["+", ["case", [ "all",
        ["==", ["get", "__typename"], "AnimalMersEvent"],
        ["==", ["get", "animalSpecies"], MersAnimalSpeciesV2.DromedaryCamel]
      ], 1, 0]],
      "Bactrian Camel Events": ["+", ["case", [ "all",
        ["==", ["get", "__typename"], "AnimalMersEvent"],
        ["==", ["get", "animalSpecies"], MersAnimalSpeciesV2.BactrianCamel]
      ], 1, 0]],
      "Horse Events": ["+", ["case", [ "all",
        ["==", ["get", "__typename"], "AnimalMersEvent"],
        ["==", ["get", "animalSpecies"], MersAnimalSpeciesV2.Horse]
      ], 1, 0]],
      "Mule Events": ["+", ["case", [ "all",
        ["==", ["get", "__typename"], "AnimalMersEvent"],
        ["==", ["get", "animalSpecies"], MersAnimalSpeciesV2.Mule]
      ], 1, 0]],
      "Buffalo Events": ["+", ["case", [ "all",
        ["==", ["get", "__typename"], "AnimalMersEvent"],
        ["==", ["get", "animalSpecies"], MersAnimalSpeciesV2.Buffalo]
      ], 1, 0]],
      "Bat Events": ["+", ["case", [ "all",
        ["==", ["get", "__typename"], "AnimalMersEvent"],
        ["==", ["get", "animalSpecies"], MersAnimalSpeciesV2.Bat]
      ], 1, 0]],
      "Goat Events": ["+", ["case", [ "all",
        ["==", ["get", "__typename"], "AnimalMersEvent"],
        ["==", ["get", "animalSpecies"], MersAnimalSpeciesV2.Goat]
      ], 1, 0]],
      "Cattle Events": ["+", ["case", [ "all",
        ["==", ["get", "__typename"], "AnimalMersEvent"],
        ["==", ["get", "animalSpecies"], MersAnimalSpeciesV2.Cattle]
      ], 1, 0]],
      "Sheep Events": ["+", ["case", [ "all",
        ["==", ["get", "__typename"], "AnimalMersEvent"],
        ["==", ["get", "animalSpecies"], MersAnimalSpeciesV2.Sheep]
      ], 1, 0]],
      "Donkey Events": ["+", ["case", [ "all",
        ["==", ["get", "__typename"], "AnimalMersEvent"],
        ["==", ["get", "animalSpecies"], MersAnimalSpeciesV2.Donkey]
      ], 1, 0]],
      "Water Buffalo Events": ["+", ["case", [ "all",
        ["==", ["get", "__typename"], "AnimalMersEvent"],
        ["==", ["get", "animalSpecies"], MersAnimalSpeciesV2.WaterBuffalo]
      ], 1, 0]],
      "Baboon Events": ["+", ["case", [ "all",
        ["==", ["get", "__typename"], "AnimalMersEvent"],
        ["==", ["get", "animalSpecies"], MersAnimalSpeciesV2.Baboon]
      ], 1, 0]],
      "Human Seroprevalence Estimates": ["+", ["case", ["==", ["get", "primaryEstimateInfoTypename"], "PrimaryHumanMersSeroprevalenceEstimateInformation"], 1, 0]],
      "Human Viral Estimates": ["+", ["case", ["==", ["get", "primaryEstimateInfoTypename"], "PrimaryHumanMersViralEstimateInformation"], 1, 0]],
      "Animal Seroprevalence Estimates": ["+", ["case", ["==", ["get", "primaryEstimateInfoTypename"], "PrimaryAnimalMersSeroprevalenceEstimateInformation"], 1, 0]],
      "Dromedary Camel Seroprevalence Estimates": ["+", ["case", [ "all",
        ["==", ["get", "primaryEstimateInfoTypename"], "PrimaryAnimalMersSeroprevalenceEstimateInformation"],
        ["in", MersAnimalSpeciesV2.DromedaryCamel, ["get", "animalSpecies", ["get", "primaryEstimateInfo"]]]
      ], 1, 0]],
      "Bactrian Camel Seroprevalence Estimates": ["+", ["case", [ "all",
        ["==", ["get", "primaryEstimateInfoTypename"], "PrimaryAnimalMersSeroprevalenceEstimateInformation"],
        ["in", MersAnimalSpeciesV2.BactrianCamel, ["get", "animalSpecies", ["get", "primaryEstimateInfo"]]]
      ], 1, 0]],
      "Buffalo Seroprevalence Estimates": ["+", ["case", [ "all",
        ["==", ["get", "primaryEstimateInfoTypename"], "PrimaryAnimalMersSeroprevalenceEstimateInformation"],
        ["in", MersAnimalSpeciesV2.Buffalo, ["get", "animalSpecies", ["get", "primaryEstimateInfo"]]]
      ], 1, 0]],
      "Mule Seroprevalence Estimates": ["+", ["case", [ "all",
        ["==", ["get", "primaryEstimateInfoTypename"], "PrimaryAnimalMersSeroprevalenceEstimateInformation"],
        ["in", MersAnimalSpeciesV2.Mule, ["get", "animalSpecies", ["get", "primaryEstimateInfo"]]]
      ], 1, 0]],
      "Horse Seroprevalence Estimates": ["+", ["case", [ "all",
        ["==", ["get", "primaryEstimateInfoTypename"], "PrimaryAnimalMersSeroprevalenceEstimateInformation"],
        ["in", MersAnimalSpeciesV2.Horse, ["get", "animalSpecies", ["get", "primaryEstimateInfo"]]]
      ], 1, 0]],
      "Bat Seroprevalence Estimates": ["+", ["case", [ "all",
        ["==", ["get", "primaryEstimateInfoTypename"], "PrimaryAnimalMersSeroprevalenceEstimateInformation"],
        ["in", MersAnimalSpeciesV2.Bat, ["get", "animalSpecies", ["get", "primaryEstimateInfo"]]]
      ], 1, 0]],
      "Goat Seroprevalence Estimates": ["+", ["case", [ "all",
        ["==", ["get", "primaryEstimateInfoTypename"], "PrimaryAnimalMersSeroprevalenceEstimateInformation"],
        ["in", MersAnimalSpeciesV2.Goat, ["get", "animalSpecies", ["get", "primaryEstimateInfo"]]]
      ], 1, 0]],
      "Cattle Seroprevalence Estimates": ["+", ["case", [ "all",
        ["==", ["get", "primaryEstimateInfoTypename"], "PrimaryAnimalMersSeroprevalenceEstimateInformation"],
        ["in", MersAnimalSpeciesV2.Cattle, ["get", "animalSpecies", ["get", "primaryEstimateInfo"]]]
      ], 1, 0]],
      "Sheep Seroprevalence Estimates": ["+", ["case", [ "all",
        ["==", ["get", "primaryEstimateInfoTypename"], "PrimaryAnimalMersSeroprevalenceEstimateInformation"],
        ["in", MersAnimalSpeciesV2.Sheep, ["get", "animalSpecies", ["get", "primaryEstimateInfo"]]]
      ], 1, 0]],
      "Donkey Seroprevalence Estimates": ["+", ["case", [ "all",
        ["==", ["get", "primaryEstimateInfoTypename"], "PrimaryAnimalMersSeroprevalenceEstimateInformation"],
        ["in", MersAnimalSpeciesV2.Donkey, ["get", "animalSpecies", ["get", "primaryEstimateInfo"]]]
      ], 1, 0]],
      "Water Buffalo Seroprevalence Estimates": ["+", ["case", [ "all",
        ["==", ["get", "primaryEstimateInfoTypename"], "PrimaryAnimalMersSeroprevalenceEstimateInformation"],
        ["in", MersAnimalSpeciesV2.WaterBuffalo, ["get", "animalSpecies", ["get", "primaryEstimateInfo"]]]
      ], 1, 0]],
      "Baboon Seroprevalence Estimates": ["+", ["case", [ "all",
        ["==", ["get", "primaryEstimateInfoTypename"], "PrimaryAnimalMersSeroprevalenceEstimateInformation"],
        ["in", MersAnimalSpeciesV2.Baboon, ["get", "animalSpecies", ["get", "primaryEstimateInfo"]]]
      ], 1, 0]],
      "Animal Viral Estimates": ["+", ["case", ["==", ["get", "primaryEstimateInfoTypename"], "PrimaryAnimalMersViralEstimateInformation"], 1, 0]],
      "Dromedary Camel Viral Estimates": ["+", ["case", [ "all",
        ["==", ["get", "primaryEstimateInfoTypename"], "PrimaryAnimalMersViralEstimateInformation"],
        ["in", MersAnimalSpeciesV2.DromedaryCamel, ["get", "animalSpecies", ["get", "primaryEstimateInfo"]]]
      ], 1, 0]],
      "Bactrian Camel Viral Estimates": ["+", ["case", [ "all",
        ["==", ["get", "primaryEstimateInfoTypename"], "PrimaryAnimalMersViralEstimateInformation"],
        ["in", MersAnimalSpeciesV2.BactrianCamel, ["get", "animalSpecies", ["get", "primaryEstimateInfo"]]]
      ], 1, 0]],
      "Buffalo Viral Estimates": ["+", ["case", [ "all",
        ["==", ["get", "primaryEstimateInfoTypename"], "PrimaryAnimalMersViralEstimateInformation"],
        ["in", MersAnimalSpeciesV2.Buffalo, ["get", "animalSpecies", ["get", "primaryEstimateInfo"]]]
      ], 1, 0]],
      "Mule Viral Estimates": ["+", ["case", [ "all",
        ["==", ["get", "primaryEstimateInfoTypename"], "PrimaryAnimalMersViralEstimateInformation"],
        ["in", MersAnimalSpeciesV2.Mule, ["get", "animalSpecies", ["get", "primaryEstimateInfo"]]]
      ], 1, 0]],
      "Horse Viral Estimates": ["+", ["case", [ "all",
        ["==", ["get", "primaryEstimateInfoTypename"], "PrimaryAnimalMersViralEstimateInformation"],
        ["in", MersAnimalSpeciesV2.Horse, ["get", "animalSpecies", ["get", "primaryEstimateInfo"]]]
      ], 1, 0]],
      "Bat Viral Estimates": ["+", ["case", [ "all",
        ["==", ["get", "primaryEstimateInfoTypename"], "PrimaryAnimalMersViralEstimateInformation"],
        ["in", MersAnimalSpeciesV2.Bat, ["get", "animalSpecies", ["get", "primaryEstimateInfo"]]]
      ], 1, 0]],
      "Goat Viral Estimates": ["+", ["case", [ "all",
        ["==", ["get", "primaryEstimateInfoTypename"], "PrimaryAnimalMersViralEstimateInformation"],
        ["in", MersAnimalSpeciesV2.Goat, ["get", "animalSpecies", ["get", "primaryEstimateInfo"]]]
      ], 1, 0]],
      "Cattle Viral Estimates": ["+", ["case", [ "all",
        ["==", ["get", "primaryEstimateInfoTypename"], "PrimaryAnimalMersViralEstimateInformation"],
        ["in", MersAnimalSpeciesV2.Cattle, ["get", "animalSpecies", ["get", "primaryEstimateInfo"]]]
      ], 1, 0]],
      "Sheep Viral Estimates": ["+", ["case", [ "all",
        ["==", ["get", "primaryEstimateInfoTypename"], "PrimaryAnimalMersViralEstimateInformation"],
        ["in", MersAnimalSpeciesV2.Sheep, ["get", "animalSpecies", ["get", "primaryEstimateInfo"]]]
      ], 1, 0]],
      "Donkey Viral Estimates": ["+", ["case", [ "all",
        ["==", ["get", "primaryEstimateInfoTypename"], "PrimaryAnimalMersViralEstimateInformation"],
        ["in", MersAnimalSpeciesV2.Donkey, ["get", "animalSpecies", ["get", "primaryEstimateInfo"]]]
      ], 1, 0]],
      "Water Buffalo Viral Estimates": ["+", ["case", [ "all",
        ["==", ["get", "primaryEstimateInfoTypename"], "PrimaryAnimalMersViralEstimateInformation"],
        ["in", MersAnimalSpeciesV2.WaterBuffalo, ["get", "animalSpecies", ["get", "primaryEstimateInfo"]]]
      ], 1, 0]],
      "Baboon Viral Estimates": ["+", ["case", [ "all",
        ["==", ["get", "primaryEstimateInfoTypename"], "PrimaryAnimalMersViralEstimateInformation"],
        ["in", MersAnimalSpeciesV2.Baboon, ["get", "animalSpecies", ["get", "primaryEstimateInfo"]]]
      ], 1, 0]],
    },
    validClusterPropertyKeys: [
      //Human
      ...(estimateDataShown ? [MersMapClusteringPropertyKey["Human Seroprevalence Estimates"]] : []),
      ...(estimateDataShown ? [MersMapClusteringPropertyKey["Human Viral Estimates"]] : []),
      ...(eventDataShown ? [MersMapClusteringPropertyKey["Reported Human Events"]] : []),
      ...(eventDataShown ? [MersMapClusteringPropertyKey["Human Cases"]] : []),
      ...(eventDataShown ? [MersMapClusteringPropertyKey["Human Deaths"]] : []),
      //Animal
      ...(estimateDataShown ? [MersMapClusteringPropertyKey["Animal Seroprevalence Estimates"]] : []),
      ...(estimateDataShown ? [MersMapClusteringPropertyKey["Dromedary Camel Seroprevalence Estimates"]] : []),
      ...(estimateDataShown ? [MersMapClusteringPropertyKey["Bactrian Camel Seroprevalence Estimates"]] : []),
      ...(estimateDataShown ? [MersMapClusteringPropertyKey["Mule Seroprevalence Estimates"]] : []),
      ...(estimateDataShown ? [MersMapClusteringPropertyKey["Horse Seroprevalence Estimates"]] : []),
      ...(estimateDataShown ? [MersMapClusteringPropertyKey["Buffalo Seroprevalence Estimates"]] : []),
      ...(estimateDataShown ? [MersMapClusteringPropertyKey["Bat Seroprevalence Estimates"]] : []),
      ...(estimateDataShown ? [MersMapClusteringPropertyKey["Goat Seroprevalence Estimates"]] : []),
      ...(estimateDataShown ? [MersMapClusteringPropertyKey["Cattle Seroprevalence Estimates"]] : []),
      ...(estimateDataShown ? [MersMapClusteringPropertyKey["Sheep Seroprevalence Estimates"]] : []),
      ...(estimateDataShown ? [MersMapClusteringPropertyKey["Donkey Seroprevalence Estimates"]] : []),
      ...(estimateDataShown ? [MersMapClusteringPropertyKey["Water Buffalo Seroprevalence Estimates"]] : []),
      ...(estimateDataShown ? [MersMapClusteringPropertyKey["Baboon Seroprevalence Estimates"]] : []),
      ...(estimateDataShown ? [MersMapClusteringPropertyKey["Animal Viral Estimates"]] : []),
      ...(estimateDataShown ? [MersMapClusteringPropertyKey["Dromedary Camel Viral Estimates"]] : []),
      ...(estimateDataShown ? [MersMapClusteringPropertyKey["Bactrian Camel Viral Estimates"]] : []),
      ...(estimateDataShown ? [MersMapClusteringPropertyKey["Mule Viral Estimates"]] : []),
      ...(estimateDataShown ? [MersMapClusteringPropertyKey["Buffalo Viral Estimates"]] : []),
      ...(estimateDataShown ? [MersMapClusteringPropertyKey["Horse Viral Estimates"]] : []),
      ...(estimateDataShown ? [MersMapClusteringPropertyKey["Bat Viral Estimates"]] : []),
      ...(estimateDataShown ? [MersMapClusteringPropertyKey["Goat Viral Estimates"]] : []),
      ...(estimateDataShown ? [MersMapClusteringPropertyKey["Cattle Viral Estimates"]] : []),
      ...(estimateDataShown ? [MersMapClusteringPropertyKey["Sheep Viral Estimates"]] : []),
      ...(estimateDataShown ? [MersMapClusteringPropertyKey["Donkey Viral Estimates"]] : []),
      ...(estimateDataShown ? [MersMapClusteringPropertyKey["Water Buffalo Viral Estimates"]] : []),
      ...(estimateDataShown ? [MersMapClusteringPropertyKey["Baboon Viral Estimates"]] : []),
      ...(eventDataShown ? [MersMapClusteringPropertyKey["Reported Animal Events"]] : []),
      ...(eventDataShown ? [MersMapClusteringPropertyKey["Dromedary Camel Events"]] : []),
      ...(eventDataShown ? [MersMapClusteringPropertyKey["Bactrian Camel Events"]] : []),
      ...(eventDataShown ? [MersMapClusteringPropertyKey["Horse Events"]] : []),
      ...(eventDataShown ? [MersMapClusteringPropertyKey["Mule Events"]] : []),
      ...(eventDataShown ? [MersMapClusteringPropertyKey["Buffalo Events"]] : []),
      ...(eventDataShown ? [MersMapClusteringPropertyKey["Bat Events"]] : []),
      ...(eventDataShown ? [MersMapClusteringPropertyKey["Goat Events"]] : []),
      ...(eventDataShown ? [MersMapClusteringPropertyKey["Cattle Events"]] : []),
      ...(eventDataShown ? [MersMapClusteringPropertyKey["Sheep Events"]] : []),
      ...(eventDataShown ? [MersMapClusteringPropertyKey["Donkey Events"]] : []),
      ...(eventDataShown ? [MersMapClusteringPropertyKey["Water Buffalo Events"]] : []),
      ...(eventDataShown ? [MersMapClusteringPropertyKey["Baboon Events"]] : []),
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
      [MersMapClusteringPropertyKey["Dromedary Camel Events"]]: MapPinColours['animal-mers-event-alt'],
      [MersMapClusteringPropertyKey["Bactrian Camel Events"]]: MapPinColours['animal-mers-event-alt'],
      [MersMapClusteringPropertyKey["Horse Events"]]: MapPinColours['animal-mers-event-alt'],
      [MersMapClusteringPropertyKey["Mule Events"]]: MapPinColours['animal-mers-event-alt'],
      [MersMapClusteringPropertyKey["Buffalo Events"]]: MapPinColours['animal-mers-event-alt'],
      [MersMapClusteringPropertyKey["Bat Events"]]: MapPinColours['animal-mers-event-alt'],
      [MersMapClusteringPropertyKey["Goat Events"]]: MapPinColours['animal-mers-event-alt'],
      [MersMapClusteringPropertyKey["Cattle Events"]]: MapPinColours['animal-mers-event-alt'],
      [MersMapClusteringPropertyKey["Sheep Events"]]: MapPinColours['animal-mers-event-alt'],
      [MersMapClusteringPropertyKey["Donkey Events"]]: MapPinColours['animal-mers-event-alt'],
      [MersMapClusteringPropertyKey["Water Buffalo Events"]]: MapPinColours['animal-mers-event-alt'],
      [MersMapClusteringPropertyKey["Baboon Events"]]: MapPinColours['animal-mers-event-alt'],
      [MersMapClusteringPropertyKey["Human Seroprevalence Estimates"]]: MapPinColours['PrimaryHumanMersSeroprevalenceEstimateInformation'],
      [MersMapClusteringPropertyKey["Animal Seroprevalence Estimates"]]: MapPinColours['PrimaryAnimalMersSeroprevalenceEstimateInformation'],
      [MersMapClusteringPropertyKey["Dromedary Camel Seroprevalence Estimates"]]: MapPinColours['mers-animal-viral-estimate-alt'],
      [MersMapClusteringPropertyKey["Bactrian Camel Seroprevalence Estimates"]]: MapPinColours['mers-animal-viral-estimate-alt'],
      [MersMapClusteringPropertyKey["Mule Seroprevalence Estimates"]]: MapPinColours['mers-animal-viral-estimate-alt'],
      [MersMapClusteringPropertyKey["Buffalo Seroprevalence Estimates"]]: MapPinColours['mers-animal-viral-estimate-alt'],
      [MersMapClusteringPropertyKey["Horse Seroprevalence Estimates"]]: MapPinColours['mers-animal-viral-estimate-alt'],
      [MersMapClusteringPropertyKey["Bat Seroprevalence Estimates"]]: MapPinColours['mers-animal-viral-estimate-alt'],
      [MersMapClusteringPropertyKey["Goat Seroprevalence Estimates"]]: MapPinColours['mers-animal-viral-estimate-alt'],
      [MersMapClusteringPropertyKey["Cattle Seroprevalence Estimates"]]: MapPinColours['mers-animal-viral-estimate-alt'],
      [MersMapClusteringPropertyKey["Sheep Seroprevalence Estimates"]]: MapPinColours['mers-animal-viral-estimate-alt'],
      [MersMapClusteringPropertyKey["Donkey Seroprevalence Estimates"]]: MapPinColours['mers-animal-viral-estimate-alt'],
      [MersMapClusteringPropertyKey["Water Buffalo Seroprevalence Estimates"]]: MapPinColours['mers-animal-viral-estimate-alt'],
      [MersMapClusteringPropertyKey["Baboon Seroprevalence Estimates"]]: MapPinColours['mers-animal-viral-estimate-alt'],
      [MersMapClusteringPropertyKey["Human Viral Estimates"]]: MapPinColours['PrimaryHumanMersViralEstimateInformation'],
      [MersMapClusteringPropertyKey["Animal Viral Estimates"]]: MapPinColours['PrimaryAnimalMersViralEstimateInformation'],
      [MersMapClusteringPropertyKey["Dromedary Camel Viral Estimates"]]: MapPinColours['mers-animal-viral-estimate-alt'],
      [MersMapClusteringPropertyKey["Bactrian Camel Viral Estimates"]]: MapPinColours['mers-animal-viral-estimate-alt'],
      [MersMapClusteringPropertyKey["Mule Viral Estimates"]]: MapPinColours['mers-animal-viral-estimate-alt'],
      [MersMapClusteringPropertyKey["Buffalo Viral Estimates"]]: MapPinColours['mers-animal-viral-estimate-alt'],
      [MersMapClusteringPropertyKey["Horse Viral Estimates"]]: MapPinColours['mers-animal-viral-estimate-alt'],
      [MersMapClusteringPropertyKey["Bat Viral Estimates"]]: MapPinColours['mers-animal-viral-estimate-alt'],
      [MersMapClusteringPropertyKey["Goat Viral Estimates"]]: MapPinColours['mers-animal-viral-estimate-alt'],
      [MersMapClusteringPropertyKey["Cattle Viral Estimates"]]: MapPinColours['mers-animal-viral-estimate-alt'],
      [MersMapClusteringPropertyKey["Sheep Viral Estimates"]]: MapPinColours['mers-animal-viral-estimate-alt'],
      [MersMapClusteringPropertyKey["Donkey Viral Estimates"]]: MapPinColours['mers-animal-viral-estimate-alt'],
      [MersMapClusteringPropertyKey["Water Buffalo Viral Estimates"]]: MapPinColours['mers-animal-viral-estimate-alt'],
      [MersMapClusteringPropertyKey["Baboon Viral Estimates"]]: MapPinColours['mers-animal-viral-estimate-alt'],
    }
  }), [ estimateDataShown, eventDataShown ]);

  return {
    clusteringSettings
  }
};