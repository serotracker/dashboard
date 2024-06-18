import { Card, CardContent } from "@/components/ui/card";
import { Settings } from "lucide-react";

interface MapCustomizeButtonProps {
  onClick: () => void;
}

export const MapCustomizeButton = (props: MapCustomizeButtonProps) => (
  <div className={"absolute top-0 right-10 p-2 "}>
    <Card className={"mb-1 bg-white/60 backdrop-blur-md"}>
      <CardContent className={"flex w-fit p-0"}>
        <button className="flex w-fit p-2" onClick={() => props.onClick()}>
          <Settings className="mr-2" />
          <p>Customize</p>
        </button>
      </CardContent>
    </Card>
  </div>
)