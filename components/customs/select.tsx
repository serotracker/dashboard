"use client";

import * as React from "react";
import { X } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Command } from "@/components/ui/command";
import { Command as CommandPrimitive } from "cmdk";
import { cn } from "@/lib/utils";
import { BooleanSelectOptionString } from "./filters/select-filter";
import { SelectInnerSingleCommandGroup } from "./select-inner-single-command-group";
import { SelectInnerMultipleCommandGroup } from "./select-inner-multiple-command-group";

export type SelectOption = {
  label: string; // As we see
  value: string; // All lower case
};

export interface SelectProps {
  heading: string;
  options: string[];
  optionToLabelMap: Record<string, string | undefined>;
  selected: (string | boolean)[];
  handleOnChange: (selected: string[]) => void;
  singleSelect?: boolean; // Multi is the default
  className?: string;
  borderedAreaClassname?: string;
  optionToSuperOptionFunction?: (option: string) => string;
  superOptionToLabelMap?: (superOption: string) => string;
}

const createSelectOptionList = (options: (string)[], optionToLabelMap: Record<string, string | undefined>) => {
  return options.map((option: string) => ({
    label: optionToLabelMap[option] ?? option,
    value: option,
  }));
};

export function Select(props: SelectProps) {
  // TODO: I wonder if there is a way to make the background color dynamic based on the page we are on so this does not need to prop drilled
  const { heading, handleOnChange, optionToLabelMap, singleSelect, optionToSuperOptionFunction, superOptionToLabelMap } = props;
  const options = createSelectOptionList(props.options, optionToLabelMap);
  const selected = props.selected
    .map((selectedOption) => selectedOption === true ? BooleanSelectOptionString.TRUE : selectedOption) 
    .map((selectedOption) => selectedOption === false ? BooleanSelectOptionString.FALSE : selectedOption)

  const inputRef = React.useRef<HTMLInputElement>(null);
  const [open, setOpen] = React.useState(false);
  const [inputValue, setInputValue] = React.useState("");

  const handleUnselect = (option: SelectOption) => {
    handleOnChange(
      selected.filter((s) => {
        return s !== option.value;
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
    [handleOnChange, selected],
  );

  const selectables = options.filter(
    (option) => !selected.includes(option.label),
  );

  return (
    <>
      <Command
        onKeyDown={handleKeyDown}
        className={cn("overflow-visible bg-transparent", props.className)}
      >
        <div className={cn(
          "group border border-b-2 border-background px-3 py-2 text-sm ring-offset-background rounded-md focus-within:ring-1 focus-within:ring-ring",
          props.borderedAreaClassname
        )}>
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
              {createSelectOptionList(selected, optionToLabelMap).map((selectedOption) => {
              return (
                <Badge className={cn("rounded-sm hover:bg-backgroundHover p-1 bg-background")} key={selectedOption.value}>
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
                    <X className={cn("h-3 w-3 p-0.5 rounded-sm text-foreground hover:bg-background")} />
                  </button>
                </Badge>
              );
            })}
              </div>
          </div>
        </div>
        <div className="relative mt-2">
          {open && selectables.length > 0 ? (
            <div className="absolute w-full z-10 top-0 rounded-md border bg-popover text-popover-foreground shadow-md outline-none animate-in overflow-y-scroll max-h-96">
              <SelectInnerSingleCommandGroup
                selectables={selectables}
                heading={heading}
                setInputValue={setInputValue}
                handleOnChange={handleOnChange}
                singleSelect={singleSelect}
                selected={selected}
                className={!!optionToSuperOptionFunction ? 'hidden' : ''}
              />
              <SelectInnerMultipleCommandGroup
                selectables={selectables}
                heading={heading}
                setInputValue={setInputValue}
                handleOnChange={handleOnChange}
                singleSelect={singleSelect}
                selected={selected}
                className={!optionToSuperOptionFunction ? 'hidden' : ''}
                optionToSuperOptionFunction={optionToSuperOptionFunction}
                superOptionToLabelMap={superOptionToLabelMap}
              />
            </div>
          ) : null}
        </div>
      </Command>
    </>
  );
}
