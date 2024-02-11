import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card";
import { ArboActionType, ArboContext } from "@/contexts/arbo-context";
import { Checkbox } from "@/components/ui/checkbox";
import { useContext } from "react";
import { pathogenColorsTailwind } from "./ArbovirusMap";
import { Button } from "@/components/ui/button";

interface MapArbovirusFilterProps {
  records: unknown[];
  className?: string;
}

export const MapArbovirusFilter = ({ records, className }: MapArbovirusFilterProps) => {
  const state = useContext(ArboContext);

  const pathogenOrder = ["ZIKV", "DENV", "CHIKV", "YF", "WNV", "MAYV"];

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

  const clearAllHandler = () => {
    state.dispatch({
      type: ArboActionType.UPDATE_FILTER,
      payload: {
        data: records,
        filter: "pathogen",
        value: [],
      },
    });
  };

  return (
    <Card className={className}>
      <CardHeader className={"py-3"}>
        <p>Arboviruses</p>
      </CardHeader>
      <CardContent className={"flex justify-center flex-col pb-3"}>
        {pathogenOrder.map((pathogenAbbreviation: string) => {
          // Map abbreviations to full names
          const pathogenFullName =
            pathogenAbbreviation === "ZIKV"
              ? "Zika Virus"
              : pathogenAbbreviation === "DENV"
              ? "Dengue Virus"
              : pathogenAbbreviation === "CHIKV"
              ? "Chikungunya Virus"
              : pathogenAbbreviation === "YF"
              ? "Yellow Fever"
              : pathogenAbbreviation === "WNV"
              ? "West Nile Virus"
              : pathogenAbbreviation === "MAYV"
              ? "Mayaro Virus"
              : pathogenAbbreviation;

          return (
            <div
              key={pathogenAbbreviation}
              className="items-top flex space-x-2 my-1"
            >
              <Checkbox
                id={`checkbox-${pathogenAbbreviation}`}
                className={pathogenColorsTailwind[pathogenAbbreviation]}
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
                  {pathogenFullName}
                </label>
              </div>
            </div>
          );
        })}
        <Button className="mt-2" variant={'ghost'} onClick={clearAllHandler}>Clear all</Button>
      </CardContent>
    </Card>
  );
};
