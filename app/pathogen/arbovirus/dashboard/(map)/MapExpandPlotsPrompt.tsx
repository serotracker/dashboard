import { Card, CardContent } from "@/components/ui/card";

interface MapExpandPlotsPromptProps {
  onClick: () => void;
  hidden: boolean;
}

export const MapExpandPlotsPrompt = ({
  onClick,
  hidden,
}: MapExpandPlotsPromptProps) => {
  return (
    <Card className={hidden ? "hidden" : "inline-block"}>
      <CardContent className={"flex w-fit p-2 hover:bg-black/5 rounded-lg"}>
        <button onClick={onClick}> <p> See Graphs </p> </button>
      </CardContent>
    </Card>
  );
};
