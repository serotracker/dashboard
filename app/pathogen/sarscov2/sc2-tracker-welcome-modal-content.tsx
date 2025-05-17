import { ModalHeader } from "@/components/ui/modal/modal-header";
import * as Separator from '@radix-ui/react-separator';
import Link from "next/link";

interface Sc2TrackerWelcomeModalContentProps {
  className?: string;
  closeModal: () => void;
}

export const Sc2TrackerWelcomeModalContent = (props: Sc2TrackerWelcomeModalContentProps) => {
  return (
    <div className={props.className}>
      <ModalHeader header={"Welcome to SC2Tracker!"} closeModal={props.closeModal} />
      <Separator.Root
        orientation="horizontal"
        className="bg-mers h-px"
      />
      <div className="px-4 overflow-y-scroll flex flex-col mt-2">
        <div className="mb-2">
          <p className="inline">You&apos;re seeing our new version of our SARS-CoV-2 dashboard. Click </p>
          <Link className="inline text-link" href="https://sc2.serotracker.com" target="__blank" rel="noopener noreferrer">here</Link>
          <p className="inline"> for the original SeroTracker SARS-CoV-2 dashboard configuration.</p>
        </div>
      </div>
    </div>
  );
}