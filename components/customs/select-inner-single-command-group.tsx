import { Command, CommandGroup, CommandItem } from "@/components/ui/command";
import { cn } from "@/lib/utils";

interface SelectInnerSingleCommandGroupProps {
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
}

export const SelectInnerSingleCommandGroup = (props: SelectInnerSingleCommandGroupProps) => {
  const { selectables, heading, setInputValue, handleOnChange, singleSelect, selected, className } = props;

  return (
    <CommandGroup
      className={cn("h-full overflow-auto", className)}
      heading={heading}
    >
      {selectables.map((option) => {
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
            className={"cursor-pointer"}
          >
            {option.label}
          </CommandItem>
        );
      })}
    </CommandGroup>
  )
}