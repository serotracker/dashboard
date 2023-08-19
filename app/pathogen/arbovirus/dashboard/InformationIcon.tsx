import React from "react";
import {Icon, Popup} from "semantic-ui-react";

interface InformationIconProps {
  color: string;
  size: "xs" | "lg" | "sm" | "1x" | "2x" | "3x" | "4x" | "5x" | "6x" | "7x" | "8x" | "9x" | "10x" | undefined,
  position?: "top left" | "top right" | "bottom right" | "bottom left" | "right center" | "left center" | "top center" | "bottom center" | undefined,
  tooltip: string | React.ReactNode;
  tooltipHeader?: string;
  offset: [number, (number | undefined)?] | undefined;
  popupSize?: "mini" | "tiny" | "small" | "large" | "huge";
}

export default function InformationIcon(props: InformationIconProps) {
  const { color, size, tooltip, tooltipHeader, offset, position, popupSize = "small" } = props;
  
  return (
    <div className="px-2">
      <Popup
        key={Math.random()}
        offset={offset}
        position={position}
        size={popupSize}
        hoverable
        trigger={
          <Icon name={"info"} />
        }>
        {tooltipHeader && (

          <Popup.Header className="flex left">{tooltipHeader}</Popup.Header>
        )}
        <Popup.Content className="flex left">{tooltip}</Popup.Content>
      </Popup>
    </div>
  );
}
