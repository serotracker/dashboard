import React, { useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faInfoCircle } from "@fortawesome/free-solid-svg-icons";

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
    <div className="flex items-center space-x-2">
      <h2 className="text-xl font-semibold">{header_text}</h2>
      <div className="relative inline-block">
        {/* Information icon */}
        <FontAwesomeIcon
          icon={faInfoCircle}
          className="h-5 w-5 text-gray-500 cursor-pointer"
          onMouseEnter={() => setShowTooltip(true)}
          onMouseLeave={() => setShowTooltip(false)}
        />
        {/* Tooltip */}
        {showTooltip && (
          <div className="absolute bg-gray-800 text-white rounded p-2 text-sm">
            {tooltip_text}
          </div>
        )}
      </div>
    </div>
  );
};

export default SectionHeader;
