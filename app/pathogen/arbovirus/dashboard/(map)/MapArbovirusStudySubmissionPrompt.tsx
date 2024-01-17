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
          Don&apos;t see an arbovirus study listed?
        </h3>
        <button className={"rounded-full hover:bg-gray-100 m-0 absolute right-2 top-2 p-1"} onClick={() => onClose()} aria-label="Close pop-up">
          <X />
        </button>
      </CardHeader>
      <CardContent className={"p-2 pt-0"}>
        <p className="inline"> Please fill out the </p>
        <Link className="inline text-link underline" target="_blank" href="https://forms.gle/pKNiMiMYr6hiKnXx8"> following form </Link>
        <p className="inline"> so that we can add to our dataset. </p>
      </CardContent>
    </Card>
  );
};
