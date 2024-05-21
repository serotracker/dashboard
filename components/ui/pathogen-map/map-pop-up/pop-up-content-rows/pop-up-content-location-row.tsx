import { useMemo } from "react";
import { GenericPopUpContentRow, PopUpContentRowBaseProps, PopUpContentRowType } from "../pop-up-content-rows";

export type PopUpContentLocationRowProps = PopUpContentRowBaseProps & {
  type: PopUpContentRowType.LOCATION,
  cityName: string | undefined;
  stateName: string | undefined;
  countryName: string;
}

export const PopUpContentLocationRow = (props: PopUpContentLocationRowProps) => {
  const { cityName, stateName, countryName } = props;

  const content = useMemo(() => {
    if(props.cityName && props.stateName) {
      return `${props.cityName.trim()}, ${props.stateName.trim()}, ${props.countryName.trim()}`
    }

    if(props.cityName && !props.stateName) {
      return `${props.cityName.trim()}, ${props.countryName.trim()}`
    }

    if(!props.cityName && props.stateName) {
      return `${props.stateName.trim()}, ${props.countryName.trim()}`
    }

    return `${props.countryName.trim()}`
  }, [cityName, stateName, countryName]);

  return (
    <GenericPopUpContentRow
      title={props.title}
      content={content}
    />
  )
}