import { useCallback, useRef, useState, createRef } from "react";
import { ScrollSection, ScrollSectionGroup, ScrollSectionGroupProps } from "./scroll-section-group";

interface MoveScrollSectionGroupToSectionInput<TSectionId extends string> {
  sectionId: TSectionId;
}

interface UseScrollSectionGroupInput<TSectionId extends string> {
  scrollSectionGroupProps: Omit<ScrollSectionGroupProps<TSectionId>, 'currentIndex' | 'setCurrentIndex' | 'sections' | 'hasEnoughTimePassedSinceLastScrollEventActioned' | 'setLastScrollEventActionedUnixEpochTimestampMilliseconds'> & {
    sections: Omit<ScrollSection<TSectionId>, 'ref'>[];
  };
}

interface UseScrollSectionGroupOutput<TSectionId extends string> {
  renderScrollSectionGroup: () => React.ReactNode;
  moveScrollSectionGroupToSection: (input: MoveScrollSectionGroupToSectionInput<TSectionId>) => void;
}

export const useScrollSectionGroup = <TSectionId extends string>(input: UseScrollSectionGroupInput<TSectionId>): UseScrollSectionGroupOutput<TSectionId> => {
  const [currentIndex, _setCurrentIndex] = useState<number>(0);
  const sectionRefs = useRef(Array.from({length: input.scrollSectionGroupProps.sections.length}, _ => createRef<HTMLElement>()));
  const [lastScrollEventActionedUnixEpochTimestampMilliseconds, setLastScrollEventActionedUnixEpochTimestampMilliseconds] = useState<number | undefined>(undefined);

  const hasEnoughTimePassedSinceLastScrollEventActioned = useCallback((unixEpochTimestampMilliseconds: number): boolean => {
    if(!lastScrollEventActionedUnixEpochTimestampMilliseconds) {
      return true;
    }

    return unixEpochTimestampMilliseconds - lastScrollEventActionedUnixEpochTimestampMilliseconds > input.scrollSectionGroupProps.scrollThrottleThresholdMilliseconds;
  }, [lastScrollEventActionedUnixEpochTimestampMilliseconds, input.scrollSectionGroupProps.scrollThrottleThresholdMilliseconds]);


  const setCurrentIndex = useCallback((newCurrentIndex: number) => {
    _setCurrentIndex(newCurrentIndex);

    sectionRefs.current.at(newCurrentIndex)?.current?.scrollIntoView();
  }, [])

  const renderScrollSectionGroup = useCallback(() => {
    return <ScrollSectionGroup
      className={input.scrollSectionGroupProps.className}
      hasEnoughTimePassedSinceLastScrollEventActioned={hasEnoughTimePassedSinceLastScrollEventActioned}
      setLastScrollEventActionedUnixEpochTimestampMilliseconds={setLastScrollEventActionedUnixEpochTimestampMilliseconds}
      scrollThrottleThresholdMilliseconds={input.scrollSectionGroupProps.scrollThrottleThresholdMilliseconds}
      sections={input.scrollSectionGroupProps.sections.map((section, index) => ({...section, ref:sectionRefs.current[index]}))}
      currentIndex={currentIndex}
      setCurrentIndex={setCurrentIndex}
    />
  }, [input.scrollSectionGroupProps, currentIndex, setCurrentIndex, hasEnoughTimePassedSinceLastScrollEventActioned]);

  const moveScrollSectionGroupToSection = useCallback(({ sectionId }: MoveScrollSectionGroupToSectionInput<TSectionId>) => {
    const indexOfSection = input.scrollSectionGroupProps.sections.findIndex(({id}) => id === sectionId);
    const timeEventOccurredMilliseconds = Date.now();

    if(hasEnoughTimePassedSinceLastScrollEventActioned(timeEventOccurredMilliseconds)) {
      setCurrentIndex(indexOfSection);

      setLastScrollEventActionedUnixEpochTimestampMilliseconds(timeEventOccurredMilliseconds);
    }
  }, [input.scrollSectionGroupProps.sections, setCurrentIndex, hasEnoughTimePassedSinceLastScrollEventActioned]);

  return {
    renderScrollSectionGroup,
    moveScrollSectionGroupToSection
  }
}