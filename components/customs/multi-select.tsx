"use client";

import * as React from "react";
import { X } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Command, CommandGroup, CommandItem } from "@/components/ui/command";
import { Command as CommandPrimitive } from "cmdk";

export type MultiSelectOption = {
  label: string; // As we see
  value: string; // All lower case
};

interface MultiSelectProps {
  heading: string;
  options: string[];
  selected: string[];
  handleOnChange: (selected: string[]) => void;
}

const createMultiSelectOptionList = (options: string[]) => {
  return options.map((option: string) => {
    return {
      label: option,
      value: option.toLowerCase(),
    };
  });
};

export function MultiSelect(props: MultiSelectProps) {
  const { heading, selected, handleOnChange } = props;
  const options = createMultiSelectOptionList(props.options);

  const inputRef = React.useRef<HTMLInputElement>(null);
  const [open, setOpen] = React.useState(false);
  const [inputValue, setInputValue] = React.useState("");

  const handleUnselect = (option: MultiSelectOption) => {
    handleOnChange(
      selected.filter((s) => {
        return s !== option.label;
      }),
    );
  };

  const handleKeyDown = React.useCallback(
    (e: React.KeyboardEvent<HTMLDivElement>) => {
      const input = inputRef.current;
      if (input) {
        if (e.key === "Delete" || e.key === "Backspace") {
          if (input.value === "") {
            handleOnChange(selected.slice(0, -1));
          }
        }
        // This is not a default behaviour of the <input /> field
        if (e.key === "Escape") {
          input.blur();
        }
      }
    },
    [],
  );

  const selectables = options.filter(
    (option) => !selected.includes(option.label),
  );

  return (
    <>
      <Command
        onKeyDown={handleKeyDown}
        className="overflow-visible bg-transparent"
      >
        <div className="group border border-input px-3 py-2 text-sm ring-offset-background rounded-md focus-within:ring-2 focus-within:ring-ring focus-within:ring-offset-2">
          <div className="flex flex-col gap-1 flex-wrap">
            {/* Avoid having the "Search" Icon */}
            {selectables.length > 0 && <CommandPrimitive.Input
                ref={inputRef}
                value={inputValue}
                onValueChange={setInputValue}
                onBlur={() => setOpen(false)}
                onFocus={() => setOpen(true)}
                placeholder={heading}
                className="bg-transparent outline-none placeholder:text-muted-foreground w-full flex-1 inline pb-1 mb-1 border-b-2"
              />}
              <div className="flex gap-1 flex-wrap">
              {createMultiSelectOptionList(selected).map((selectedOption) => {
              return (
                <Badge className="rounded-sm bg-background hover:bg-backgroundHover p-1" key={selectedOption.value}>
                  {selectedOption.label}
                  <button
                    className="ml-1 ring-offset-background outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2"
                    onKeyDown={(e) => {
                      if (e.key === "Enter") {
                        handleUnselect(selectedOption);
                      }
                    }}
                    onMouseDown={(e) => {
                      e.preventDefault();
                      e.stopPropagation();
                    }}
                    onClick={() => handleUnselect(selectedOption)}
                  >
                    <X className="h-3 w-3 text-foreground hover:bg-background" />
                  </button>
                </Badge>
              );
            })}
              </div>

          </div>
        </div>
        <div className="relative mt-2">
          {open && selectables.length > 0 ? (
            <div className="absolute w-full z-10 top-0 rounded-md border bg-popover text-popover-foreground shadow-md outline-none animate-in">
              <CommandGroup className="h-full overflow-auto" heading={heading}>
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
                          // and isn't recognized as a selectable option as a result.
                          (option) => option.value.trim() === value,
                        );
                        if (newValue)
                          handleOnChange([...selected, newValue.label]);
                      }}
                      className={"cursor-pointer"}
                    >
                      {option.label}
                    </CommandItem>
                  );
                })}
              </CommandGroup>
            </div>
          ) : null}
        </div>
      </Command>
    </>
  );
}
