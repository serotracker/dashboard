import { RefObject, useState } from "react";
import { ScrollDirection, ScrollSectionInformation } from "./scroll-section-group";

export interface ScrollSectionProps<TSectionId extends string> {
  currentIndex: number;
  section: ScrollSectionInformation<TSectionId>;
  changeViewedSectionBasedOnScroll: (currentIndex: number, scrollDirection: ScrollDirection) => void,
  hasEnoughTimePassedSinceLastScrollEventActioned: (unixEpochTimestampMilliseconds: number) => boolean
  setLastScrollEventActionedUnixEpochTimestampMilliseconds: (unixEpochTimestampMilliseconds: number) => void
}

export const ScrollSection = <TSectionId extends string>(props: ScrollSectionProps<TSectionId>): React.ReactNode => {
  /*
  oldScrollTop is used to make the scrolling less sensitive.
  Basically, we want someone to be able to scroll to the bottom of the table without jumping to the next section
  but also want to make scrolling to sections above and below still possible.
  */
  const [oldScrollTop, setOldScrollTop] = useState<number | undefined>(undefined);

  const onScroll = (event: React.UIEvent<HTMLDivElement, UIEvent>) => {
    if(!('scrollTop' in event.target) || !('scrollTopMax' in event.target)) {
      return;
    }

    if(typeof event.target.scrollTop !== 'number' || typeof event.target.scrollTopMax !== 'number'){
      return;
    }
    
    let direction = undefined;

    //See comment on oldScrollTop
    if(event.target.scrollTop <= 0 && oldScrollTop !== undefined && oldScrollTop <= 0) {
      direction = ScrollDirection.UP;
    }

    //See comment on oldScrollTop
    if(event.target.scrollTop >= event.target.scrollTopMax && oldScrollTop !== undefined && oldScrollTop >= event.target.scrollTopMax) {
      direction = ScrollDirection.DOWN;
    }

    if(direction) {
      const timeEventOccurredMilliseconds = Date.now();

      if(props.hasEnoughTimePassedSinceLastScrollEventActioned(timeEventOccurredMilliseconds)) {
        props.changeViewedSectionBasedOnScroll(props.currentIndex, direction);

        props.setLastScrollEventActionedUnixEpochTimestampMilliseconds(timeEventOccurredMilliseconds);
      }
    }

    setOldScrollTop(event.target.scrollTop);
  }

  return props.section.renderScrollSectionContent({
    ref: props.section.ref,
    onScroll: onScroll
  });
}