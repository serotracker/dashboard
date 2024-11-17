"use client";
import { Header } from "@/components/customs/header";
import { ModalState, ModalType, useModal } from "@/components/ui/modal/modal";
import { usePathname } from "next/navigation";
import { useMemo } from "react";

interface AppHeaderAndMainProps {
  children: React.ReactNode;
}

export enum DashboardType {
  ARBOVIRUS = 'ARBOVIRUS',
  SARS_COV_2 = 'SARS_COV_2',
  MERS = 'MERS',
  NONE = 'NONE'
}

const dashboardTypeToHelpModalType = {
  [DashboardType.ARBOVIRUS]: ModalType.ARBOTRACKER_HELP_MODAL,
  [DashboardType.SARS_COV_2]: undefined,
  [DashboardType.MERS]: undefined,
  [DashboardType.NONE]: undefined,
} as const

export const dashboardTypeToRouteName = {
  [DashboardType.ARBOVIRUS]: 'arbovirus',
  [DashboardType.SARS_COV_2]: 'sarscov2',
  [DashboardType.MERS]: 'mers'
} as const

export const AppHeaderAndMain = (props: AppHeaderAndMainProps) => {
  const pathname = usePathname();

  const dashboardType = useMemo(() => {
    if (pathname.includes("arbovirus")) {
      return DashboardType.ARBOVIRUS;
    }
    if (pathname.includes("sarscov2")) {
      return DashboardType.SARS_COV_2;
    }
    if (pathname.includes("mers")) {
      return DashboardType.MERS;
    }

    return DashboardType.NONE;
  }, [pathname])

  const useHelpModalInput = useMemo(() => {
    const modalType = dashboardTypeToHelpModalType[dashboardType];

    return !!modalType
      ? {
        initialModalState: ModalState.CLOSED,
        disabled: false as const,
        modalType: modalType
      }
      : {
        initialModalState: ModalState.CLOSED,
        disabled: true as const,
        modalType: undefined
      }
  }, [ dashboardType ])

  const useWelcomeModalInput = useMemo(() => {
    if(dashboardType === DashboardType.MERS) {
      return {
        initialModalState: ModalState.OPENED,
        disabled: false as const,
        modalType: ModalType.MERSTRACKER_WELCOME_MODAL as const
      }
    }

    return {
      initialModalState: ModalState.CLOSED,
      disabled: true as const,
      modalType: undefined
    }
  }, [ dashboardType ]);

  const helpModal = useModal(useHelpModalInput);
  const welcomeModal = useModal(useWelcomeModalInput);

  console.log('useWelcomeModalInput', useWelcomeModalInput);
  console.log('welcomeModal', welcomeModal);

  return (
    <>
      <Header
        dashboardType={dashboardType}
        helpButtonConfiguration={ !!useHelpModalInput.modalType ? {
          enabled: true,
          onHelpButtonClick:() => helpModal.setModalState(ModalState.OPENED)
        } : {
          enabled: false
        }}
      />
      <main className={"h-full-screen w-screen bg-foreground top-14 fixed"}>
        {props.children}
        <helpModal.modal />
        <welcomeModal.modal />
      </main>
    </>
  )
}