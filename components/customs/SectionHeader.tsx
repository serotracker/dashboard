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
  const [showTooltip, setShowTooltip] = useState(false);

  return (
    <div className="flex items-center space-x-2 mb-2">
      <h2 className="text-lg">{header_text}</h2>
      <div className="relative inline-block">
        {/* Tooltip */}
        <TooltipProvider>
          <Tooltip>
            {/* Tooltip Trigger */}
            <TooltipTrigger>
              <div
                onMouseEnter={() => setShowTooltip(true)}
                onMouseLeave={() => setShowTooltip(false)}
                className="h-5 w-5 text-gray-500 cursor-pointer"
              >
                &#9432;
              </div>
            </TooltipTrigger>
            {/* Tooltip Content */}
            {showTooltip && (
              <TooltipContent
                style={{
                  position: "absolute",
                  top: "50px", // position below the trigger
                  left:"-120px",
                  minWidth: "230px", // Set a minimum width
                }}
              >
                <div
                  className="bg-background w-full p-4 rounded text-white"
                  // style={{ maxWidth: "250px" }}
                >
                  {tooltip_text}
                </div>
              </TooltipContent>
            )}
          </Tooltip>
        </TooltipProvider>
      </div>
    </div>
  );
};

export default SectionHeader;
