import { Button } from "@/components/ui/button";
import { cn, generateRange } from "@/lib/utils";
import { ArrowLeft, ArrowRight } from "lucide-react";
import React, { useState, useMemo, useCallback } from "react"

interface HelpModalPage<TPageId extends string> {
  pageId: TPageId;
  pageIndex: number;
  pageHeader: string;
  pageRenderingFunction: () => React.ReactNode;
}

interface HelpModalPaginatorProps<TPageId extends string> {
  page: HelpModalPage<TPageId>;
}

const HelpModalPaginatorContent = <TPageId extends string>(props: HelpModalPaginatorProps<TPageId>) => {
  return <props.page.pageRenderingFunction/>
}

interface RoundedButtonProps {
  children: React.ReactNode;
  hoverClassname: string;
  selectedClassname: string;
  selected: boolean;
  disabled?: boolean;
  className?: string;
  onClick: () => void;
}

const RoundedButton = (props: RoundedButtonProps) => (
  <div
    className={cn(
      props.disabled !== true ? props.hoverClassname : 'bg-gray-400',
      props.selected === true ? props.selectedClassname : '',
      "w-8 h-8 rounded-full",
      props.className
    )}
  >
    <button
      className="w-full h-full flex justify-center items-center"
      onClick={props.onClick}
      disabled={props.disabled}
    >
      {props.children}
    </button>
  </div>
)

enum HelpModalPageNavigatorButtonDirection {
  NEXT_PAGE = 'NEXT_PAGE',
  PREVIOUS_PAGE = 'PREVIOUS_PAGE'
}

interface HelpModalPageNavigatorButtonProps {
  direction: HelpModalPageNavigatorButtonDirection;
  className?: string;
  hoverClassname: string;
  selectedClassname: string;
  currentPageIndex: number;
  minimumPageIndex: number;
  maximumPageIndex: number;
  goToPageIndex: (newPageIndex: number) => void;
}

const HelpModalPageNavigatorButton = (props: HelpModalPageNavigatorButtonProps) => (
  <RoundedButton
    disabled={props.direction === HelpModalPageNavigatorButtonDirection.NEXT_PAGE
      ? props.currentPageIndex >= props.maximumPageIndex
      : props.currentPageIndex <= props.minimumPageIndex
    }
    hoverClassname={props.hoverClassname}
    selectedClassname={props.selectedClassname}
    selected={false}
    className={props.className}
    onClick={() => {
      const newPageIndex = props.direction === HelpModalPageNavigatorButtonDirection.NEXT_PAGE
        ? props.currentPageIndex + 1
        : props.currentPageIndex - 1;

      props.goToPageIndex(newPageIndex);
    }}
  >
    <ArrowLeft className={props.direction === HelpModalPageNavigatorButtonDirection.PREVIOUS_PAGE ? '' : 'hidden'} />
    <ArrowRight className={props.direction === HelpModalPageNavigatorButtonDirection.NEXT_PAGE ? '' : 'hidden'} />
  </RoundedButton>
)

interface HelpModalPageNavigatorProps<TPageId extends string> {
  currentPageIndex: number;
  className?: string;
  selectedClassname: string;
  hoverClassname: string;
  minimumPageIndex: number;
  maximumPageIndex: number;
  setCurrentPageIndex: (input: number) => void;
  pages: HelpModalPage<TPageId>[];
  onPageChange?: (input: OnPageChangeInput<TPageId>) => void;
}

const HelpModalPageNavigator = <TPageId extends string>(props: HelpModalPageNavigatorProps<TPageId>) => {
  const { pages, currentPageIndex, setCurrentPageIndex, onPageChange } = props;

  const goToPageIndex = useCallback((newPageIndex: number) => {
    const oldPage = pages.find((page) => page.pageIndex === currentPageIndex);
    const newPage = pages.find((page) => page.pageIndex === newPageIndex);

    if(!oldPage || !newPage) {
      return;
    }

    if(onPageChange) {
      onPageChange({
        oldPage,
        newPage
      })
    }

    setCurrentPageIndex(newPageIndex);
  }, [ pages, currentPageIndex, setCurrentPageIndex, onPageChange ]);

  return (
    <div className={cn("flex w-fit mx-auto", props.className)}>
      <HelpModalPageNavigatorButton
        direction={HelpModalPageNavigatorButtonDirection.PREVIOUS_PAGE}
        hoverClassname={props.hoverClassname}
        selectedClassname={props.selectedClassname}
        currentPageIndex={props.currentPageIndex}
        minimumPageIndex={props.minimumPageIndex}
        maximumPageIndex={props.maximumPageIndex}
        goToPageIndex={goToPageIndex}
      />
      {generateRange({
        startInclusive: props.minimumPageIndex,
        endInclusive: props.maximumPageIndex,
        stepSize: 1
      }).map((pageIndex) => (
        <RoundedButton
          className="mx-1"
          hoverClassname={props.hoverClassname}
          selected={props.currentPageIndex === pageIndex}
          selectedClassname={props.selectedClassname}
          onClick={() => goToPageIndex(pageIndex)}
        >
          <p> {(pageIndex + 1).toString()} </p>
        </RoundedButton>
      ))}
      <HelpModalPageNavigatorButton
        direction={HelpModalPageNavigatorButtonDirection.NEXT_PAGE}
        hoverClassname={props.hoverClassname}
        selectedClassname={props.selectedClassname}
        currentPageIndex={props.currentPageIndex}
        minimumPageIndex={props.minimumPageIndex}
        maximumPageIndex={props.maximumPageIndex}
        goToPageIndex={goToPageIndex}
      />
    </div>
  )
}

export interface OnPageChangeInput<TPageId extends string> {
  oldPage: HelpModalPage<TPageId>;
  newPage: HelpModalPage<TPageId>;
}

interface UseHelpModalPaginatorInput<TPageId extends string> {
  pages: HelpModalPage<TPageId>[];
  currentPageIndex: number;
  hoverClassname: string;
  selectedClassname: string;
  setCurrentPageIndex: (newCurrentPageIndex: number) => void;
  onPageChange: (input: OnPageChangeInput<TPageId>) => void;
}

export const useHelpModalPaginator = <TPageId extends string>(input: UseHelpModalPaginatorInput<TPageId>) => {
  const { pages, onPageChange, currentPageIndex, hoverClassname, setCurrentPageIndex, selectedClassname  } = input;

  const helpModalPaginatorContent = useCallback(() => {
    const page = pages.find((page) => page.pageIndex === currentPageIndex);

    if(!page) {
      return null;
    }

    return <HelpModalPaginatorContent page={page} />
  }, [ currentPageIndex, pages ])

  const helpModalPageNavigator = useCallback((props: {className?: string}) => {
    const maximumPageIndex = Math.max(...pages.map(({ pageIndex }) => pageIndex));

    return <HelpModalPageNavigator
      currentPageIndex={currentPageIndex}
      hoverClassname={hoverClassname}
      className={props.className}
      selectedClassname={selectedClassname}
      minimumPageIndex={0}
      maximumPageIndex={maximumPageIndex}
      pages={pages}
      onPageChange={onPageChange}
      setCurrentPageIndex={setCurrentPageIndex}
    />
  }, [ currentPageIndex, setCurrentPageIndex, pages, onPageChange, hoverClassname, selectedClassname ])

  return {
    content: helpModalPaginatorContent,
    navigator: (props: {className?: string}) => helpModalPageNavigator(props),
    currentPageIndex,
    setCurrentPageIndex
  }
}