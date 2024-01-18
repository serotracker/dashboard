import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { X } from "lucide-react";
import { cn } from "@/lib/utils";
import Link from "next/link";

interface MapArbovirusStudySubmissionPromptProps {
  className?: string;
  onClose: () => void;
  hidden: boolean;
}

export const MapArbovirusStudySubmissionPrompt = ({
  className,
  onClose,
  hidden,
}: MapArbovirusStudySubmissionPromptProps) => {
  return (
    <Card className={cn(className, hidden ? "hidden" : undefined)}>
      <CardHeader className={"p-2 flex flex-row space-y-0"}>
        <h3 className={"w-full text-center text-lg"}>
          Submit a source to us!
        </h3>
        <button className={"rounded-full hover:bg-gray-100 m-0 absolute right-2 top-2 p-1"} onClick={() => onClose()} aria-label="Close pop-up">
          <X />
        </button>
      </CardHeader>
      <CardContent className={"p-2 pt-0"}>
        <p className="inline"> Are we missing an arbovirus seroprevalence study that we should include? Submit it to us via </p>
        <Link className="inline text-link underline" target="_blank" href="https://forms.gle/pKNiMiMYr6hiKnXx8">this form</Link>
      </CardContent>
    </Card>
  );
};
