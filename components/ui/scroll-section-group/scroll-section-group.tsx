import React, { useCallback, useMemo, useEffect, useState, useRef, RefObject } from "react";

export interface ScrollSection<TSectionId extends string> {
  id: TSectionId;
  renderScrollSectionContent: (input: {
    ref: RefObject<HTMLElement>,
    key: string
  }) => React.ReactNode;
  ref: RefObject<HTMLElement>
}

export interface ScrollSectionGroupProps<TSectionId extends string> {
  currentIndex: number;
  setCurrentIndex: (input: number) => void;
  className: string;
  scrollThrottleThresholdMilliseconds: number;
  sections: ScrollSection<TSectionId>[];
  hasEnoughTimePassedSinceLastScrollEventActioned: (unixEpochTimestampMilliseconds: number) => boolean
  setLastScrollEventActionedUnixEpochTimestampMilliseconds: (unixEpochTimestampMilliseconds: number) => void
}

enum ScrollDirection {
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
      className="overflow-y-scroll col-span-10 h-full row-span-2 snap-y scroll-smooth"
      onScroll={onScroll}
    >
      {props.sections.map((section) => section.renderScrollSectionContent({
        ref: section.ref,
        key: `scroll-section-${section.id}`
      }))}
    </div>
  )
}