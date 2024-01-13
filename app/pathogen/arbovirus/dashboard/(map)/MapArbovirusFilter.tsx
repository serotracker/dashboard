import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { ArboActionType, ArboContext } from "@/contexts/arbo-context";
import { Checkbox } from "@/components/ui/checkbox";
import { useContext } from "react";
import { getAllKnownPathogens, getLongFormPathogen } from "../../constants";

interface MapArbovirusFilterProps {
  records: unknown[];
}

export const MapArbovirusFilter = ({ records }: MapArbovirusFilterProps) => {
  const state = useContext(ArboContext);
  const handleOnClickCheckbox = (pathogen: string, checked: boolean) => {
    const value = state.selectedFilters.pathogen;

    if (checked) {
      value.push(pathogen);
    } else {
      value.splice(value.indexOf(pathogen), 1);
    }

    state.dispatch({
      type: ArboActionType.UPDATE_FILTER,
      payload: {
        data: records,
        filter: "pathogen",
        value: value,
      },
    });
  };
  return (
    <Card className={"absolute bottom-1 right-1 "}>
      <CardHeader className={"py-3"}>
        <p>Arboviruses</p>
      </CardHeader>
      <CardContent className={"flex justify-center flex-col"}>
        {getAllKnownPathogens().map((pathogenAbbreviation: string) => {
          return (
            <div
              key={pathogenAbbreviation}
              className="items-top flex space-x-2 my-1"
            >
              <Checkbox
                id={`checkbox-${pathogenAbbreviation}`}
                className={`border-${pathogenAbbreviation.toLowerCase()} data-[state=checked]:bg-${pathogenAbbreviation.toLowerCase()}`}
                checked={
                  state.selectedFilters["pathogen"]
                    ? state.selectedFilters["pathogen"].includes(
                        pathogenAbbreviation
                      )
                    : false
                }
                onCheckedChange={(checked: boolean) => {
                  handleOnClickCheckbox(pathogenAbbreviation, checked);
                }}
              />
              <div className="grid gap-1.5 leading-none">
                <label
                  htmlFor={`checkbox-${pathogenAbbreviation}`}
                  className={
                    "text-sm leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                  }
                >
                  {getLongFormPathogen(pathogenAbbreviation)}
                </label>
              </div>
            </div>
          );
        })}
      </CardContent>
    </Card>
  );
};
