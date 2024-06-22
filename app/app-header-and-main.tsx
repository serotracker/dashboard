"use client";
import { Header } from "@/components/customs/header";
import { ModalState, ModalType, useModal } from "@/components/ui/modal/modal";

interface AppHeaderAndMainProps {
  children: React.ReactNode;
}

export const AppHeaderAndMain = (props: AppHeaderAndMainProps) => {
  const helpModal = useModal({
    initialModalState: ModalState.OPENED,
    headerText: 'Help',
    modalType: ModalType.HELP_MODAL
  });

  return (
    <>
      <Header onHelpButtonClick={() => helpModal.setModalState(ModalState.OPENED)} />
      <main className={"h-full-screen w-screen bg-foreground top-14 fixed"}>
        {props.children}
        <helpModal.modal />
      </main>
    </>
  )
}