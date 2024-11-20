import assertNever from "assert-never";
import { CustomizationSetting, CustomizationSettingType } from "./customization-settings";
import { DropdownCustomizationSetting } from "./dropdown-customization-setting";
import { SwitchCustomizationSetting } from "./switch-customization-settings";
import { ModalHeader } from "../modal-header";
import { MultiSelectDropdownCustomizationSetting } from "./multi-select-dropdown-customization-setting";
import { ColourPickerCustomizationSetting } from "./colour-picker-customization-setting";
import { useState } from "react";
import { usePaginator } from "@/components/customs/paginator/paginator";
import { cn } from "@/lib/utils";

export interface CustomizationModalContentProps<TDropdownOption extends string> {
  className?: string;
  customizationSettings: CustomizationSetting<TDropdownOption>[];
  paginationHoverClassname: string;
  paginationSelectedClassname: string;
  closeModal: () => void;
}

export const CustomizationModalContent = <
  TDropdownOption extends string
>(props: CustomizationModalContentProps<TDropdownOption>): React.ReactNode => {
  const [currentPageIndex, setCurrentPageIndex] = useState<number>(0)
  const totalPageCount = Math.floor((((props.customizationSettings.length - 1) / 4) + 1));

  const paginator = usePaginator({
    pages: Array.from({length: totalPageCount}, (_, index) => index).map((pageIndex) => ({
      pageId: `page-id-${pageIndex}`,
      pageIndex: pageIndex,
      pageHeader: 'Customize',
      pageRenderingFunction: () => (
        <div className="mx-4 mb-4">
          {props.customizationSettings.slice(pageIndex * 4, (pageIndex + 1) * 4).map((customizationSetting, index, customizationSettingsSubset) => {
            const isLastElement = index === customizationSettingsSubset.length - 1;

            if(customizationSetting.type === CustomizationSettingType.DROPDOWN) {
              return <DropdownCustomizationSetting className={isLastElement ? '' : 'mb-6'} key={customizationSetting.dropdownName} {...customizationSetting} />
            }

            if(customizationSetting.type === CustomizationSettingType.MULTI_SELECT_DROPDOWN) {
              return <MultiSelectDropdownCustomizationSetting className={isLastElement ? '' : 'mb-6'} key={customizationSetting.dropdownName} {...customizationSetting} />
            }

            if(customizationSetting.type === CustomizationSettingType.SWITCH) {
              return <SwitchCustomizationSetting className={isLastElement ? '' : 'mb-6'} key={customizationSetting.switchName} {...customizationSetting} />
            }

            if(customizationSetting.type === CustomizationSettingType.COLOUR_PICKER) {
              return <ColourPickerCustomizationSetting className={isLastElement ? '' : 'mb-6'} key={customizationSetting.colourPickerName} {...customizationSetting} />
            }

            assertNever(customizationSetting);
          })}
        </div>
      )
    })),
    currentPageIndex,
    hoverClassname: props.paginationHoverClassname,
    selectedClassname: props.paginationSelectedClassname,
    setCurrentPageIndex: (newCurrentPageIndex: number) => setCurrentPageIndex(newCurrentPageIndex),
    onPageChange: () => {}
  })

  return (
    <div className={props.className}>
      <ModalHeader header={"Customize"} closeModal={props.closeModal} />
      <paginator.content/>
      <div className={cn(
        "sticky bottom-0 bg-white w-full",
        totalPageCount <= 1 ? 'hidden': ''
      )}>
        <paginator.navigator className="mb-2" />
      </div>
    </div>
  )
}