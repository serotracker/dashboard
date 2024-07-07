import { useCallback, useMemo, useState } from "react";
import { CustomizationModalContent, CustomizationModalContentProps } from "./customization-modal/customization-modal-content";
import { assertNever } from "assert-never";
import { X } from "lucide-react";
import { cn } from "@/lib/utils";
import { ArboTrackerHelpModalContent } from "../../../app/pathogen/arbovirus/arbotracker-help-modal-content";

export enum ModalState {
  OPENED = "OPENED",
  CLOSED = "CLOSED"
}

export enum ModalType {
  CUSTOMIZATION_MODAL = "CUSTOMIZATION_MODAL",
  ARBOTRACKER_HELP_MODAL = "ARBOTRACKER_HELP_MODAL"
}

export interface ModalPropsBase {
  hidden: boolean;
  onClose: () => void;
}

type CustomizationModalProps<TDropdownOption extends string> = {
  modalType: ModalType.CUSTOMIZATION_MODAL;
  content: Omit<CustomizationModalContentProps<TDropdownOption>, 'closeModal'>
};
type ArboTrackerHelpModalProps = {
  modalType: ModalType.ARBOTRACKER_HELP_MODAL;
};

type ModalPropsBasedOnType<TDropdownOption extends string> =
  | CustomizationModalProps<TDropdownOption>
  | ArboTrackerHelpModalProps;

const isCustomizationModalProps = <TDropdownOption extends string>(
  props: ModalPropsBasedOnType<TDropdownOption>
): props is CustomizationModalProps<TDropdownOption> => props.modalType === ModalType.CUSTOMIZATION_MODAL;
const isArboTrackerHelpModalProps = <TDropdownOption extends string>(
  props: ModalPropsBasedOnType<TDropdownOption>
): props is ArboTrackerHelpModalProps => props.modalType === ModalType.ARBOTRACKER_HELP_MODAL;

type ModalProps<TDropdownOption extends string> = ModalPropsBase & ModalPropsBasedOnType<TDropdownOption>;

const Modal = <
  TDropdownOption extends string
>(props: ModalProps<TDropdownOption>): React.ReactNode => {
  return (
    <div className={cn(
      "absolute w-full h-full top-0 left-0 p-4 flex items-center justify-center bg-modal-background z-10",
      props.hidden ? 'hidden' : ''
    )}>
      <div className="w-full lg:w-1/2 bg-white rounded">
        <CustomizationModalContent
          closeModal={props.onClose}
          className={isCustomizationModalProps(props) ? '' : 'hidden'}
          customizationSettings={isCustomizationModalProps(props) ? props.content.customizationSettings : []}
        />
        <ArboTrackerHelpModalContent
          closeModal={props.onClose}
          className={isArboTrackerHelpModalProps(props) ? '' : 'hidden'}
        />
      </div>
    </div>
  )
}

type DisabledUseModalInput = {
  initialModalState: ModalState;
  disabled: true;
  modalType: undefined;
}

type EnabledUseModalInput<
  TDropdownOption extends string
> = {
  initialModalState: ModalState;
  disabled: false;
} & ModalPropsBasedOnType<TDropdownOption>;

export type UseModalInput<
  TDropdownOption extends string
> = 
  | DisabledUseModalInput
  | EnabledUseModalInput<TDropdownOption>

interface UseModalOutput {
  modalState: ModalState;
  setModalState: (modalState: ModalState) => void;
  modal: () => React.ReactNode;
}

export const useModal = <
  TDropdownOption extends string
>(input: UseModalInput<TDropdownOption>): UseModalOutput => {
  const [ modalState, setModalState ] = useState<ModalState>(input.initialModalState);

  const modal = useCallback(() => {
    if(input.disabled === true) {
      return null;
    }
    
    return (
      <Modal
        hidden={modalState === ModalState.CLOSED}
        {...(isCustomizationModalProps(input) ? {
          modalType: ModalType.CUSTOMIZATION_MODAL as const,
          content: input.content
        } : {
          modalType: ModalType.ARBOTRACKER_HELP_MODAL as const
        })}
        onClose={() => {
          setModalState(ModalState.CLOSED);
        }}
      />
    );
  }, [ input, modalState, setModalState ])

  return {
    modalState,
    setModalState,
    modal
  }
}