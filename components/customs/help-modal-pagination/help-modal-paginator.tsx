import { ArrowLeft, ArrowRight } from "lucide-react";
import React, { useState, useMemo, useCallback } from "react"

interface HelpModalPage<TPageId extends string> {
  pageId: TPageId;
  pageIndex: number;
  pageRenderingFunction: () => React.ReactNode;
}

interface HelpModalPaginatorProps<TPageId extends string> {
  page: HelpModalPage<TPageId>;
}

const HelpModalPaginatorContent = <TPageId extends string>(props: HelpModalPaginatorProps<TPageId>) => {
  return <props.page.pageRenderingFunction/>
}

interface GoToPageIndexInput {
  newPageIndex: number;
}

interface HelpModalPageNavigatorProps<TPageId extends string> {
  currentPageIndex: number;
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

    console.log('currentPageIndex', currentPageIndex)
    console.log('newPageIndex', newPageIndex)

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
    <div>
      <button
        disabled={props.currentPageIndex === 0}
        onClick={() => {
          const newPageIndex = props.currentPageIndex - 1;

          goToPageIndex(newPageIndex);
        }}
      >
        <ArrowLeft />
      </button>
      <button
        disabled={props.currentPageIndex === props.maximumPageIndex}
        onClick={() => {
          const newPageIndex = props.currentPageIndex + 1; 

          const oldPage = pages.find((page) => page.pageIndex === currentPageIndex);
          const newPage = pages.find((page) => page.pageIndex === newPageIndex);

          console.log('currentPageIndex', currentPageIndex)
          console.log('newPageIndex', newPageIndex)

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
        }}
      >
        <ArrowRight />
      </button>
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
  setCurrentPageIndex: (newCurrentPageIndex: number) => void;
  onPageChange: (input: OnPageChangeInput<TPageId>) => void;
}

export const useHelpModalPaginator = <TPageId extends string>(input: UseHelpModalPaginatorInput<TPageId>) => {
  const { pages, onPageChange, currentPageIndex, setCurrentPageIndex } = input;

  const helpModalPaginatorContent = useCallback(() => {
    const page = pages.find((page) => page.pageIndex === currentPageIndex);

    if(!page) {
      return null;
    }

    return <HelpModalPaginatorContent page={page} />
  }, [ currentPageIndex, pages ])

  const helpModalPageNavigator = useCallback(() => {
    const maximumPageIndex = Math.max(...pages.map(({ pageIndex }) => pageIndex));

    return <HelpModalPageNavigator
      currentPageIndex={currentPageIndex}
      maximumPageIndex={maximumPageIndex}
      pages={pages}
      onPageChange={onPageChange}
      setCurrentPageIndex={setCurrentPageIndex}
    />
  }, [ currentPageIndex, setCurrentPageIndex, pages, onPageChange ])

  return {
    content: helpModalPaginatorContent,
    navigator: helpModalPageNavigator,
    currentPageIndex,
    setCurrentPageIndex
  }
}