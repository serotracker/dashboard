import { DashboardType, dashboardTypeToHoverColourClassnameMap, dashboardTypeToMapIdMap } from "@/app/pathogen/dashboard-enums";
import { cn } from "@/lib/utils";
import { CloudDownload } from "lucide-react";
import { useMemo, useCallback } from "react";
import { useMap } from "react-map-gl/mapbox";
import { Card } from "../card";

interface MapDownloadButtonProps {
  dashboardType: DashboardType
}

const linkId = 'map-download-button-link';

export const MapDownloadButton = (props: MapDownloadButtonProps) => {
  const { dashboardType } = props;

  const mapId = useMemo(() => {
    return dashboardTypeToMapIdMap[dashboardType];
  }, [ dashboardType ]);

  const allMaps = useMap();

  const map = useMemo(() => {
    return allMaps[mapId];
  }, [ allMaps, mapId ]);

  const onDownload = useCallback(() => {
    if(!map) {
      return;
    }

    const link = document.getElementById(linkId);
    if(!link) {
      return;
    }

    link.setAttribute('download', 'map.png');
    link.setAttribute('href', map.getCanvas().toDataURL("image/png").replace("image/png", "image/octet-stream"));
    link.click();
  }, [ map ]);

  if (!map) {
    return null;
  }
  
  if(process.env.NEXT_PUBLIC_MAP_DOWNLOAD_BUTTON_ENABLED !== 'true') {
    return null;
  }

  return (
    <button
      className={"absolute top-20 right-[10px]"}
      onClick={() => onDownload()}
    >
      <Card className={cn(
        "bg-white backdrop-blur-md p-[5px]",
        dashboardTypeToHoverColourClassnameMap[dashboardType]
      )}>
        <CloudDownload size={18} />
      </Card>
      <a className='hidden' id={linkId}></a>
    </button>
  )
}