import { Card, CardContent } from "@/components/ui/card";

interface MapExpandPlotsPromptProps {
  onClick: () => void;
  hidden?: boolean;
  text: string;
}

export const MapExpandPlotsPrompt = ({
  onClick,
  hidden,
  text,
}: MapExpandPlotsPromptProps) => {
  return (
    <Card className={hidden ? "hidden" : "inline-block"}>
      <CardContent className={"flex w-fit p-2 hover:bg-black/5 rounded-lg"}>
        <button onClick={onClick}> <p> {text} </p> </button>
      </CardContent>
    </Card>
  );
};
