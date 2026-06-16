import { useMap } from "react-map-gl/mapbox";
import { useRouter } from "next/navigation";
import { useCallback } from "react";
import { Row } from "@tanstack/react-table";
import { getBoundingBoxFromCountryAlphaTwoCode } from "@/lib/bounding-boxes";
import { DashboardType, dashboardTypeToMapIdMap } from "@/app/pathogen/dashboard-enums";

export const useDataTableMapViewingHandler = () => {
  const allMaps = useMap();
  const sarsCov2Map = allMaps[dashboardTypeToMapIdMap[DashboardType.SARS_COV_2]];
  const router = useRouter();

  const viewOnMapHandler = useCallback(<
    TData extends {
      longitude?: string | number | undefined;
      latitude?: string | number | undefined;
      countryAlphaTwoCode?: string | undefined;
      id: string;
    }
  >(input: {data: TData[], row: Row<Record<string, unknown>>}) => {
    if(!sarsCov2Map) {
      return;
    }

    const idOfDataPoint = input.row.getValue('id');
    const dataPoint = idOfDataPoint ? input.data.find((dataPoint) => dataPoint.id === idOfDataPoint) : undefined;
    
    if(!dataPoint) {
      return;
    }

    const rawLatitude = dataPoint.latitude;
    const rawLongitude = dataPoint.longitude;

    if(rawLatitude !== undefined && rawLongitude !== undefined) {
      const latitude = typeof rawLatitude === 'string' ? parseFloat(rawLatitude) : rawLatitude;
      const longitude = typeof rawLongitude === 'string' ? parseFloat(rawLongitude) : rawLongitude;

      const boxSize = 2;

      sarsCov2Map.fitBounds([
        longitude - (boxSize / 2),
        latitude - (boxSize / 2),
        longitude + (boxSize / 2),
        latitude + (boxSize / 2),
      ])

      router.push('/pathogen/sarscov2/dashboard#MAP')

      return;
    }

    const countryAlphaTwoCode = dataPoint.countryAlphaTwoCode;

    if(countryAlphaTwoCode !== undefined) {
      const countryBoundingBox = getBoundingBoxFromCountryAlphaTwoCode(countryAlphaTwoCode);

      if(countryBoundingBox) {
        sarsCov2Map.fitBounds(countryBoundingBox);
        router.push('/pathogen/sarscov2/dashboard#MAP')

        return;
      }
    }
  }, [sarsCov2Map, router])

  return {
    viewOnMapHandler
  }
}