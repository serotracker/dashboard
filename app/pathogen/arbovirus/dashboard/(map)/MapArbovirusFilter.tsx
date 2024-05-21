import { Checkbox } from "@/components/ui/checkbox";
import { pathogenColorsTailwind } from "./ArbovirusMap";
import { Button } from "@/components/ui/button";
import SectionHeader from "@/components/customs/SectionHeader";
import { PathogenContextType } from "@/contexts/pathogen-context/pathogen-context";
import { cn } from "@/lib/utils";
import { SendFilterChangeDispatch } from "@/components/customs/filters";
import { FilterableField } from "@/components/customs/filters/available-filters";

interface MapArbovirusFilterProps<TEstimate extends Record<string, unknown>> {
  className?: string;
  state: PathogenContextType<TEstimate>;
  data: TEstimate[];
  sendFilterChangeDispatch: SendFilterChangeDispatch;
}

export const MapArbovirusFilter = <TEstimate extends Record<string, unknown>>({
  className,
  state,
  data,
  sendFilterChangeDispatch
}: MapArbovirusFilterProps<TEstimate>) => {
  const pathogenOrder = ["ZIKV", "DENV", "CHIKV", "YF", "WNV", "MAYV"];

  const handleOnClickCheckbox = (pathogen: string, checked: boolean) => {
    const value = state.selectedFilters.pathogen;

    if (checked) {
      value.push(pathogen);
    } else {
      value.splice(value.indexOf(pathogen), 1);
    }

    sendFilterChangeDispatch({
      value: value,
      newFilter: FilterableField.pathogen,
      state: state,
      data: data
    })
  };

  const clearAllHandler = () => {
    sendFilterChangeDispatch({
      value: [],
      newFilter: FilterableField.pathogen,
      state: state,
      data: data
    })
  };

  return (
    <div className={cn('p-0', className)}>
      <SectionHeader header_text="Arboviruses" tooltip_text="Filter on arbovirus strain."/>
      <div className={"flex justify-between lg:justify-center flex-wrap lg:flex-col pb-3"}>
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
              className="items-top flex space-x-2 my-1 mb-2"
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
        <Button className="mt-2 w-full" variant={'ghost'} onClick={clearAllHandler}>Clear all viruses</Button>
      </div>
    </div>
  );
};
