import { Card, CardContent } from "@/components/ui/card";

interface MapEstimateSummaryProps {
  filteredData: Array<{sourceSheetName: string}>
}

export const MapEstimateSummary = (props: MapEstimateSummaryProps) => (
  <div className={"absolute top-1 left-1 p-2 "}>
    <Card className={"mb-1 bg-white/60 backdrop-blur-md"}>
      <CardContent className={"flex w-fit p-2"}>
        <p className={"ml-1 font-medium"}>
          <b>{props.filteredData.length}</b>
          &nbsp;Estimates displayed from&nbsp;
          <b>{Array.from(new Set(props.filteredData.map((item: {sourceSheetName: string}) => item.sourceSheetName))).length}</b>
          &nbsp;unique sources
        </p>
      </CardContent>
    </Card>
  </div>
)