import { Card, CardContent } from "@/components/ui/card";
import { ScrollText } from "lucide-react";

interface MapEstimateSummaryProps {
  filteredData: Array<{sourceSheetName?: string | undefined | null}>
}

export const MapEstimateSummary = (props: MapEstimateSummaryProps) => (
  <div className={"absolute top-1 left-1 p-2 "}>
    <Card className={"mb-1 bg-white/60 backdrop-blur-md"}>
      <CardContent className={"flex w-fit p-2"}>
        <p className={"ml-1 font-medium"}>
          <b>{props.filteredData.length}</b>
          &nbsp;Estimates&nbsp;(
          <ScrollText width={19} height={19} className="inline"/>
          )&nbsp;displayed from&nbsp;
          <b>
            {Array.from(new Set(props.filteredData
              .filter((item): item is Omit<typeof item, 'sourceSheetName'> & {sourceSheetName: NonNullable<(typeof item)['sourceSheetName']>} => !!item.sourceSheetName)
              .map((item) => item.sourceSheetName))).length
            }
          </b>
          &nbsp;unique sources
        </p>
      </CardContent>
    </Card>
  </div>
)