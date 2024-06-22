import { useMemo, useState } from "react";
import { CustomizationModalContent, CustomizationModalContentProps } from "./customization-modal/customization-modal-content";
import { assertNever } from "assert-never";
import { X } from "lucide-react";
import { cn } from "@/lib/utils";
import { HelpModalContent } from "./help-modal-content";

export enum ModalState {
  OPENED = "OPENED",
  CLOSED = "CLOSED"
}

export enum ModalType {
  CUSTOMIZATION_MODAL = "CUSTOMIZATION_MODAL",
  HELP_MODAL = "HELP_MODAL"
}

export interface ModalPropsBase {
  header: string;
  hidden: boolean;
  onClose: () => void;
}

type CustomizationModalProps<TDropdownOption extends string> = {
  modalType: ModalType.CUSTOMIZATION_MODAL;
  content: CustomizationModalContentProps<TDropdownOption>
};
type HelpModalProps = {
  modalType: ModalType.HELP_MODAL;
};

type ModalPropsBasedOnType<TDropdownOption extends string> =
  | CustomizationModalProps<TDropdownOption>
  | HelpModalProps;

const isCustomizationModalProps = <TDropdownOption extends string>(
  props: ModalPropsBasedOnType<TDropdownOption>
): props is CustomizationModalProps<TDropdownOption> => props.modalType === ModalType.CUSTOMIZATION_MODAL;
const isHelpModalProps = <TDropdownOption extends string>(
  props: ModalPropsBasedOnType<TDropdownOption>
): props is HelpModalProps => props.modalType === ModalType.HELP_MODAL;

type ModalProps<TDropdownOption extends string> = ModalPropsBase & ModalPropsBasedOnType<TDropdownOption>;

const Modal = <
  TDropdownOption extends string
>(props: ModalProps<TDropdownOption>): React.ReactNode => {
  const modalContent = useMemo(() => {
    if(isCustomizationModalProps(props)) {
      return <CustomizationModalContent customizationSettings={props.content.customizationSettings}/>
    }

    if(isHelpModalProps(props)) {
      return <HelpModalContent />
    }

    assertNever(props)
  }, [props])

  return (
    <div className={cn(
      "absolute w-full h-full top-0 left-0 p-4 flex items-center justify-center bg-modal-background z-10",
      props.hidden ? 'hidden' : ''
    )}>
      <div className="w-full lg:w-1/2 bg-white rounded">
        <div className="w-full flex justify-between p-2">
          <div/>
          <h3 className="flex items-center">{ props.header }</h3>
          <button
            className="mr-2 p-2 hover:bg-gray-100 rounded-full"
            onClick={() => props.onClose()}
            aria-label={`Close "${ props.header }" Modal`}
            title={`Close "${ props.header }" Modal`}
          >
            <X />
          </button>
        </div>
        {modalContent}
      </div>
    </div>
  )
}

type UseModalInput<
  TDropdownOption extends string
> = {
  initialModalState: ModalState;
  headerText: string;
} & ModalPropsBasedOnType<TDropdownOption>;

interface UseModalOutput {
  modalState: ModalState;
  setModalState: (modalState: ModalState) => void;
  modal: () => React.ReactNode;
}

export const useModal = <
  TDropdownOption extends string
>(input: UseModalInput<TDropdownOption>): UseModalOutput => {
  const [ modalState, setModalState ] = useState<ModalState>(input.initialModalState);

  return {
    modalState,
    setModalState,
    modal: () => (<Modal
      header={input.headerText}
      hidden={modalState === ModalState.CLOSED}
      {...(isCustomizationModalProps(input) ? {
        modalType: ModalType.CUSTOMIZATION_MODAL as const,
        content: input.content
      } : {
        modalType: ModalType.HELP_MODAL as const
      })}
      onClose={() => {
        setModalState(ModalState.CLOSED);
      }}
    />)
  }
}