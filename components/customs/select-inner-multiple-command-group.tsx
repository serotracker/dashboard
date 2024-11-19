import { Command, CommandGroup, CommandItem } from "@/components/ui/command";
import { cn, typedGroupBy } from "@/lib/utils";
import uniq from "lodash/uniq";
import { useMemo } from "react";

interface SelectInnerMultipleCommandGroupProps {
  selectables: Array<{
    label: string;
    value: string;
  }>
  heading: string;
  setInputValue: (input: string) => void;
  handleOnChange: (selected: string[]) => void;
  singleSelect: boolean | undefined;
  selected: string[];
  className: string;
  optionToSuperOptionFunction?: (option: string) => string;
  superOptionToLabelMap?: (superOption: string) => string;
}

export const SelectInnerMultipleCommandGroup = (props: SelectInnerMultipleCommandGroupProps) => {
  const { selectables, heading, setInputValue, handleOnChange, singleSelect, selected, className, optionToSuperOptionFunction, superOptionToLabelMap } = props;

  const selectablesWithSuperOptions = useMemo(() => {
    if(!optionToSuperOptionFunction) {
      return selectables.map(({ label, value }) => ({
        label,
        value,
        superOption: 'Uncategorized'
      }));
    }

    return selectables.map(({ label, value }) => ({
      label,
      value,
      superOption: optionToSuperOptionFunction(value)
    }));
  }, [ selectables, optionToSuperOptionFunction ]);

  const allSuperOptions = useMemo(() => {
    return uniq(selectablesWithSuperOptions.map((selectable) => selectable.superOption));
  }, [ selectablesWithSuperOptions ]);

  return (
    <div
      className={cn("h-full overflow-auto", className)}
    >
      {allSuperOptions.map((superOption) => (
        <CommandGroup
          heading={superOptionToLabelMap ? superOptionToLabelMap(superOption) : superOption}
          className="bg-neutral-200"
          key={superOption}
        >
          {selectablesWithSuperOptions
            .filter((option) => option.superOption === superOption)
            .map((option) => {
              return (
                <CommandItem
                  key={option.value}
                  onMouseDown={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                  }}
                  onSelect={(value) => {
                    setInputValue("");
                    const newValue = selectables.find(
                      // CommandItem appears to strip starting and ending whitespace from the value given as a key
                      // so the trim() fixes a situation where the value has some starting or trailing whitespace
                      // and isn't recognized as a selectable option as a result. This is the same for the toLowerCase().
                      (option) => option.label.trim().toLowerCase() === value.trim().toLowerCase(),
                    );
                    if (newValue) {
                      singleSelect ? handleOnChange([newValue.value]) : handleOnChange([...selected, newValue.value]);
                    }
                  }}
                  className={"cursor-pointer bg-white"}
                >
                  {option.label}
                </CommandItem>
              );
            })
          }
        </CommandGroup>
      ))}
    </div>
  )
}