import React, { useState, RefObject } from "react";
import { cn } from "@/lib/utils";
import { ScrollSection } from "./scroll-section";

export type RenderScrollSectionContentFunction = (input: {
  ref: RefObject<HTMLElement>,
  onScroll: React.UIEventHandler<HTMLDivElement>
}) => React.ReactNode;

export interface ScrollSectionInformation<TSectionId extends string> {
  id: TSectionId;
  renderScrollSectionContent: RenderScrollSectionContentFunction;
  ref: RefObject<HTMLElement>
}

export interface ScrollSectionGroupProps<TSectionId extends string> {
  currentIndex: number;
  setCurrentIndex: (input: number) => void;
  className: string;
  scrollThrottleThresholdMilliseconds: number;
  sections: ScrollSectionInformation<TSectionId>[];
  hasEnoughTimePassedSinceLastScrollEventActioned: (unixEpochTimestampMilliseconds: number) => boolean
  setLastScrollEventActionedUnixEpochTimestampMilliseconds: (unixEpochTimestampMilliseconds: number) => void
}

export enum ScrollDirection {
  UP = 'UP',
  DOWN = 'DOWN',
}

export const ScrollSectionGroup = <TSectionId extends string>(props: ScrollSectionGroupProps<TSectionId>): React.ReactNode => {
  const [oldScrollTop, setOldScrollTop] = useState<number | undefined>(undefined);
  
  const changeViewedSectionBasedOnScroll = (currentIndex: number, scrollDirection: ScrollDirection) => {
    const nextIndex = scrollDirection === ScrollDirection.UP ? currentIndex - 1 : currentIndex + 1;

    if(nextIndex < 0 || nextIndex >= props.sections.length) {
      return;
    }

    props.setCurrentIndex(nextIndex);
  }

  const onScroll = (event: React.UIEvent<HTMLDivElement, UIEvent>) => {
    if(!('scrollTop' in event.target)) {
      return;
    }

    if(typeof event.target.scrollTop !== 'number'){
      return;
    }
    
    const newScrollTop = event.target.scrollTop;
    
    if(oldScrollTop === undefined) {
      setOldScrollTop(newScrollTop);

      return;
    }

    if(newScrollTop !== oldScrollTop) {
      const direction = newScrollTop - oldScrollTop > 0 ? ScrollDirection.DOWN : ScrollDirection.UP;
      const timeEventOccurredMilliseconds = Date.now();
      
      if(props.hasEnoughTimePassedSinceLastScrollEventActioned(timeEventOccurredMilliseconds)) {
        changeViewedSectionBasedOnScroll(props.currentIndex, direction);

        props.setLastScrollEventActionedUnixEpochTimestampMilliseconds(timeEventOccurredMilliseconds);
      }

      setOldScrollTop(newScrollTop);
    }
  }

  return (
    <div
      className={cn("overflow-y-scroll snap-y scroll-smooth", props.className)}
    >
      {props.sections.map((section) => <ScrollSection
        currentIndex={props.currentIndex}
        section={section}
        key={`scroll-section-${section.id}`}
        changeViewedSectionBasedOnScroll={changeViewedSectionBasedOnScroll}
        hasEnoughTimePassedSinceLastScrollEventActioned={props.hasEnoughTimePassedSinceLastScrollEventActioned}
        setLastScrollEventActionedUnixEpochTimestampMilliseconds={props.setLastScrollEventActionedUnixEpochTimestampMilliseconds}
      />)}
    </div>
  )
}