import React, { useState } from "react";

import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

//interface of expected props
interface SectionHeaderProps {
  header_text: string;
  tooltip_text: string;
}

const SectionHeader: React.FC<SectionHeaderProps> = ({
  header_text,
  tooltip_text,
}) => {
  return (
    <div className="flex items-center space-x-2 mb-2">
      <h2 className="text-lg">{header_text}</h2>
      <div className="relative inline-block">
        <TooltipProvider delayDuration={0}>
          <Tooltip>
            <TooltipTrigger asChild>
              <div
                className="h-5 w-5 text-gray-500 cursor-pointer"
              >
                &#9432;
              </div>
            </TooltipTrigger>
            <TooltipContent
              style={{
                position: "absolute",
                top: "50px", // position below the trigger
                left:"-120px",
                minWidth: "230px", // Set a minimum width
                paddingTop: 0,
                paddingBottom: 0,
              }}
            >
              <div
                className="bg-background w-full p-4 rounded text-white"
              >
                {tooltip_text}
              </div>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
      </div>
    </div>
  );
};

export default SectionHeader;
