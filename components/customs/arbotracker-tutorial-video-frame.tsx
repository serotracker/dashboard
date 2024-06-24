import { cn } from "@/lib/utils";

interface ArboTrackerTutorialVideoFrameProps {
  className?: string;
}

export const ArboTrackerTutorialVideoFrame = (props: ArboTrackerTutorialVideoFrameProps) => (
  <iframe
    src="https://drive.google.com/file/d/1cLslLkwI57f2oKI45utkKdOtlW9ZCWpm/preview"
    className={cn("aspect-video w-full", props.className ?? '')}
    allow="autoplay"
    allowFullScreen={true}
  />
) 