import { Button } from "@/components/ui/button";
import { cn, generateRange } from "@/lib/utils";
import { ArrowLeft, ArrowRight } from "lucide-react";
import React, { useState, useMemo, useCallback } from "react"

interface Page<TPageId extends string> {
  pageId: TPageId;
  pageIndex: number;
  pageHeader: string;
  pageRenderingFunction: () => React.ReactNode;
}

interface PaginatorProps<TPageId extends string> {
  page: Page<TPageId>;
}

const PaginatorContent = <TPageId extends string>(props: PaginatorProps<TPageId>) => {
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

enum PageNavigatorButtonDirection {
  NEXT_PAGE = 'NEXT_PAGE',
  PREVIOUS_PAGE = 'PREVIOUS_PAGE'
}

interface PageNavigatorButtonProps {
  direction: PageNavigatorButtonDirection;
  className?: string;
  hoverClassname: string;
  selectedClassname: string;
  currentPageIndex: number;
  minimumPageIndex: number;
  maximumPageIndex: number;
  goToPageIndex: (newPageIndex: number) => void;
}

const PageNavigatorButton = (props: PageNavigatorButtonProps) => (
  <RoundedButton
    disabled={props.direction === PageNavigatorButtonDirection.NEXT_PAGE
      ? props.currentPageIndex >= props.maximumPageIndex
      : props.currentPageIndex <= props.minimumPageIndex
    }
    hoverClassname={props.hoverClassname}
    selectedClassname={props.selectedClassname}
    selected={false}
    className={props.className}
    onClick={() => {
      const newPageIndex = props.direction === PageNavigatorButtonDirection.NEXT_PAGE
        ? props.currentPageIndex + 1
        : props.currentPageIndex - 1;

      props.goToPageIndex(newPageIndex);
    }}
  >
    <ArrowLeft className={props.direction === PageNavigatorButtonDirection.PREVIOUS_PAGE ? '' : 'hidden'} />
    <ArrowRight className={props.direction === PageNavigatorButtonDirection.NEXT_PAGE ? '' : 'hidden'} />
  </RoundedButton>
)

interface PageNavigatorProps<TPageId extends string> {
  currentPageIndex: number;
  className?: string;
  selectedClassname: string;
  hoverClassname: string;
  minimumPageIndex: number;
  maximumPageIndex: number;
  setCurrentPageIndex: (input: number) => void;
  pages: Page<TPageId>[];
  onPageChange?: (input: OnPageChangeInput<TPageId>) => void;
}

const PageNavigator = <TPageId extends string>(props: PageNavigatorProps<TPageId>) => {
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
      <PageNavigatorButton
        direction={PageNavigatorButtonDirection.PREVIOUS_PAGE}
        hoverClassname={props.hoverClassname}
        selectedClassname={props.selectedClassname}
        currentPageIndex={props.currentPageIndex}
        minimumPageIndex={props.minimumPageIndex}
        maximumPageIndex={props.maximumPageIndex}
        goToPageIndex={goToPageIndex}
      />
      {pages
        .sort((pageA, pageB) => pageA.pageIndex - pageB.pageIndex)
        .map(({ pageIndex, pageId }) => (
        <RoundedButton
          className="mx-1"
          key={pageId}
          hoverClassname={props.hoverClassname}
          selected={props.currentPageIndex === pageIndex}
          selectedClassname={props.selectedClassname}
          onClick={() => goToPageIndex(pageIndex)}
        >
          <p> {(pageIndex + 1).toString()} </p>
        </RoundedButton>
      ))}
      <PageNavigatorButton
        direction={PageNavigatorButtonDirection.NEXT_PAGE}
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
  oldPage: Page<TPageId>;
  newPage: Page<TPageId>;
}

interface UsePaginatorInput<TPageId extends string> {
  pages: Page<TPageId>[];
  currentPageIndex: number;
  hoverClassname: string;
  selectedClassname: string;
  setCurrentPageIndex: (newCurrentPageIndex: number) => void;
  onPageChange: (input: OnPageChangeInput<TPageId>) => void;
}

export const usePaginator = <TPageId extends string>(input: UsePaginatorInput<TPageId>) => {
  const { pages, onPageChange, currentPageIndex, hoverClassname, setCurrentPageIndex, selectedClassname  } = input;

  const paginatorContent = useCallback(() => {
    const page = pages.find((page) => page.pageIndex === currentPageIndex);

    if(!page) {
      return null;
    }

    return <PaginatorContent page={page} />
  }, [ currentPageIndex, pages ])

  const pageNavigator = useCallback((props: {className?: string}) => {
    const maximumPageIndex = Math.max(...pages.map(({ pageIndex }) => pageIndex));

    return <PageNavigator
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
    content: paginatorContent,
    navigator: (props: {className?: string}) => pageNavigator(props),
    currentPageIndex,
    setCurrentPageIndex
  }
}