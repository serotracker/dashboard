import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { X } from "lucide-react";
import { cn } from "@/lib/utils";
import Link from "next/link";

interface MersMapStudySubmissionPromptProps {
  className?: string;
  onClose: () => void;
  hidden: boolean;
}

export const MersMapStudySubmissionPrompt = ({
  className,
  onClose,
  hidden,
}: MersMapStudySubmissionPromptProps) => {
  return (
    <Card className={cn(className, hidden ? "hidden" : undefined)}>
      <CardHeader className={"p-2 pb-0 flex flex-row space-y-0"}>
        <p className={"w-full text-lg"}>
          Submit a source or feedback to us!
        </p>
        <button className={"rounded-full hover:bg-gray-100 m-0 absolute right-2 top-2 p-1"} onClick={() => onClose()} aria-label="Close pop-up">
          <X />
        </button>
      </CardHeader>
      <CardContent className={"p-2"}>
        <p className="inline"> Are we missing a MERS seroprevalence or viral prevalence study that we should include? Submit it to us via </p>
        <Link className="inline text-link underline text-end" target="_blank" rel="noopener noreferrer" href="https://forms.gle/ifwicQVVjj9CeNoA9">this form</Link>
        <p className="inline">. Any feedback on the dashboard or feature suggestions can be directed to </p>
        <Link className="inline text-link underline text-end" target="_blank" rel="noopener noreferrer" href="https://forms.gle/i2que2Rw3RRSQXum9">this form</Link>
        <p className="inline">.</p>
      </CardContent>
    </Card>
  );
};
