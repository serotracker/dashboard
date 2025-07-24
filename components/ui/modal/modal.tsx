import { useCallback, useState } from "react";
import { CustomizationModalContent, CustomizationModalContentProps } from "./customization-modal/customization-modal-content";
import { cn } from "@/lib/utils";
import { ArboTrackerHelpModalContent } from "../../../app/pathogen/arbovirus/arbotracker-help-modal-content";
import { MERSTrackerWelcomeModalContent } from "@/app/pathogen/mers/merstracker-welcome-modal-content";
import { Sc2TrackerWelcomeModalContent } from "@/app/pathogen/sarscov2/sc2-tracker-welcome-modal-content";

export enum ModalState {
  OPENED = "OPENED",
  CLOSED = "CLOSED"
}

export enum ModalType {
  CUSTOMIZATION_MODAL = "CUSTOMIZATION_MODAL",
  ARBOTRACKER_HELP_MODAL = "ARBOTRACKER_HELP_MODAL",
  MERSTRACKER_WELCOME_MODAL = "MERSTRACKER_WELCOME_MODAL",
  SC2TRACKER_WELCOME_MODAL = "SC2TRACKER_WELCOME_MODAL"
}

export interface ModalPropsBase {
  hidden: boolean;
  onClose: () => void;
  modalBackgroundClassname?: string;
  modalForegroundClassname?: string;
}

type CustomizationModalProps<TDropdownOption extends string> = {
  modalType: ModalType.CUSTOMIZATION_MODAL;
  content: Omit<CustomizationModalContentProps<TDropdownOption>, 'closeModal'>
};
type ArboTrackerHelpModalProps = {
  modalType: ModalType.ARBOTRACKER_HELP_MODAL;
};
type MersTrackerWelcomeModalProps = {
  modalType: ModalType.MERSTRACKER_WELCOME_MODAL;
};
type Sc2TrackerWelcomeModalProps = {
  modalType: ModalType.SC2TRACKER_WELCOME_MODAL;
};

type ModalPropsBasedOnType<TDropdownOption extends string> =
  | CustomizationModalProps<TDropdownOption>
  | ArboTrackerHelpModalProps
  | MersTrackerWelcomeModalProps
  | Sc2TrackerWelcomeModalProps;

const isCustomizationModalProps = <TDropdownOption extends string>(
  props: ModalPropsBasedOnType<TDropdownOption>
): props is CustomizationModalProps<TDropdownOption> => props.modalType === ModalType.CUSTOMIZATION_MODAL;
const isArboTrackerHelpModalProps = <TDropdownOption extends string>(
  props: ModalPropsBasedOnType<TDropdownOption>
): props is ArboTrackerHelpModalProps => props.modalType === ModalType.ARBOTRACKER_HELP_MODAL;
const isMersTrackerWelcomeModalProps = <TDropdownOption extends string>(
  props: ModalPropsBasedOnType<TDropdownOption>
): props is MersTrackerWelcomeModalProps => props.modalType === ModalType.MERSTRACKER_WELCOME_MODAL;
const isSc2TrackerWelcomeModalProps = <TDropdownOption extends string>(
  props: ModalPropsBasedOnType<TDropdownOption>
): props is Sc2TrackerWelcomeModalProps => props.modalType === ModalType.SC2TRACKER_WELCOME_MODAL;

type ModalProps<TDropdownOption extends string> = ModalPropsBase & ModalPropsBasedOnType<TDropdownOption>;

const Modal = <
  TDropdownOption extends string
>(props: ModalProps<TDropdownOption>): React.ReactNode => {
  return (
    <div
      className={cn(
        "absolute w-full h-full top-0 left-0 p-4 flex items-center justify-center bg-modal-background z-40 cursor-pointer",
        props.hidden ? 'hidden' : '',
        props.modalBackgroundClassname ?? ''
      )}
      onClick={() => props.onClose()}
    >
      <div
        className={cn(
          "w-full lg:w-1/2 bg-white rounded z-50 cursor-default",
          props.modalForegroundClassname ?? ''
        )}
        onClick={(e) => {e.stopPropagation();}}
      >
        <CustomizationModalContent
          closeModal={props.onClose}
          className={isCustomizationModalProps(props) ? '' : 'hidden'}
          customizationSettings={isCustomizationModalProps(props) ? props.content.customizationSettings : []}
          paginationHoverClassname={isCustomizationModalProps(props) ? props.content.paginationHoverClassname : ''}
          paginationSelectedClassname={isCustomizationModalProps(props) ? props.content.paginationSelectedClassname: ''}
        />
        <ArboTrackerHelpModalContent
          closeModal={props.onClose}
          className={isArboTrackerHelpModalProps(props) ? '' : 'hidden'}
        />
        <MERSTrackerWelcomeModalContent
          closeModal={props.onClose}
          className={isMersTrackerWelcomeModalProps(props) ? '' : 'hidden'}
        />
        <Sc2TrackerWelcomeModalContent
          closeModal={props.onClose}
          className={isSc2TrackerWelcomeModalProps(props) ? '' : 'hidden'}
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
  modalBackgroundClassname?: string;
  modalForegroundClassname?: string;
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
        modalBackgroundClassname={input.modalBackgroundClassname}
        modalForegroundClassname={input.modalForegroundClassname}
        {...(isCustomizationModalProps(input) ? {
          modalType: ModalType.CUSTOMIZATION_MODAL as const,
          content: input.content,
          paginationHoverClassname: input.content.paginationHoverClassname,
          paginationSelectedClassname: input.content.paginationSelectedClassname
        } : {
          modalType: input.modalType
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

export const ModalWrapper = <
  TDropdownOption extends string
>(props: UseModalInput<TDropdownOption> & {
  modalState: ModalState;
  setModalState: (newModalState: ModalState) => void;
}) => {
  if(props.disabled === true) {
    return null;
  }

  return (
    <Modal
      hidden={props.modalState === ModalState.CLOSED}
      modalBackgroundClassname={props.modalBackgroundClassname}
      modalForegroundClassname={props.modalForegroundClassname}
      {...(isCustomizationModalProps(props) ? {
        modalType: ModalType.CUSTOMIZATION_MODAL as const,
        content: props.content,
        paginationHoverClassname: props.content.paginationHoverClassname,
        paginationSelectedClassname: props.content.paginationSelectedClassname
      } : {
        modalType: ModalType.ARBOTRACKER_HELP_MODAL as const
      })}
      onClose={() => {
        props.setModalState(ModalState.CLOSED);
      }}
    />
  );
}
