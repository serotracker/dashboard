import { useMap } from "react-map-gl/mapbox";
import { useRouter } from "next/navigation";
import { useCallback } from "react";
import { Row } from "@tanstack/react-table";
import { getBoundingBoxFromCountryAlphaTwoCode } from "@/lib/bounding-boxes";
import { DashboardType, dashboardTypeToMapIdMap } from "@/app/pathogen/dashboard-enums";

export const useDataTableMapViewingHandler = () => {
  const allMaps = useMap();
  const mersMap = allMaps[dashboardTypeToMapIdMap[DashboardType.MERS]];
  const router = useRouter();

  const viewOnMapHandler = useCallback(<
    TData extends {
      longitude?: string | number | undefined;
      latitude?: string | number | undefined;
      countryAlphaTwoCode?: string | undefined;
      id: string;
    }
  >(input: {data: TData[], row: Row<Record<string, unknown>>}) => {
    if(!mersMap) {
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

      mersMap.fitBounds([
        longitude - (boxSize / 2),
        latitude - (boxSize / 2),
        longitude + (boxSize / 2),
        latitude + (boxSize / 2),
      ])

      router.push('/pathogen/mers/dashboard#MAP')

      return;
    }

    const countryAlphaTwoCode = dataPoint.countryAlphaTwoCode;

    if(countryAlphaTwoCode !== undefined) {
      const countryBoundingBox = getBoundingBoxFromCountryAlphaTwoCode(countryAlphaTwoCode);

      if(countryBoundingBox) {
        mersMap.fitBounds(countryBoundingBox);
        router.push('/pathogen/mers/dashboard#MAP')

        return;
      }
    }
  }, [mersMap, router])

  return {
    viewOnMapHandler
  }
}