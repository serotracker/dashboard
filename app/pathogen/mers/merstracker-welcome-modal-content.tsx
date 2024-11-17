import { ModalHeader } from "@/components/ui/modal/modal-header";
import * as Separator from '@radix-ui/react-separator';
import Link from "next/link";

interface MERSTrackerWelcomeModalContentProps {
  className?: string;
  closeModal: () => void;
}

export const MERSTrackerWelcomeModalContent = (props: MERSTrackerWelcomeModalContentProps) => {
  return (
    <div className={props.className}>
      <ModalHeader header={"Welcome to MERSTracker!"} closeModal={props.closeModal} />
      <Separator.Root
        orientation="horizontal"
        className="bg-mers h-px"
      />
      <div className="px-4 overflow-y-scroll flex flex-col mt-2">
        <div className="mb-4">
          <p className="inline"> MERSTracker (by the SeroTracker group) is a dashboard displaying published MERS-CoV serosurveys, viral testing, and genomic sequencing studies. We compile and centralize resources on MERS-CoV via a systematic review of available literature. Our database is not comprehensive and we continue to add studies with new searches. You can see more information on our review methods </p>
          <Link href="/about/about-our-data" className="underline text-link inline">here</Link>
          <p className='inline'>.</p>
        </div>
        <div className="mb-2">
          <p className="inline">The data on our dashboard are extracted from publicly available independent research and do not reflect validation of the findings on behalf of SeroTracker or any of our funding or collaborating partners. Research studies are heterogeneous and vary in their quality, design, methodology, assay performance, and reporting, and results should be interpreted and compared with caution.</p>
        </div>
      </div>
    </div>
  );
}