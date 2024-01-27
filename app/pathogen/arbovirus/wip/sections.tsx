import { RefObject } from "react";
import { ArbovirusMap } from "../dashboard/(map)/ArbovirusMap";
import { ArboDataTable } from "@/app/pathogen/arbovirus/analyze/ArboDataTable";

export enum RedesignedArbovirusPageSectionId {
  MAP = 'MAP',
  TABLE = 'TABLE',
  VISUALIZATIONS = 'VISUALIZATIONS'
}

enum RedesignedArbovirusPageSectionUrlParam {
  map = 'map',
  table = 'table',
  visualizations = 'visualizations'
}

const isRedesignedArbovirusPageSectionUrlParam = (urlParam: string): urlParam is RedesignedArbovirusPageSectionUrlParam => {
  return Object.values(RedesignedArbovirusPageSectionUrlParam).some((element) => element === urlParam);
}

export const redesignedArbovirusPageSections = [{
  id: RedesignedArbovirusPageSectionId.MAP,
  renderScrollSectionContent: (input: { ref: RefObject<HTMLElement>, key: string}) => (
    <section
      key={input.key}
      ref={input.ref}
      className="w-full h-[95%] snap-start snap-always scroll-smooth overflow-hidden relative row-span-2 border-black border-b-2"
    >
      <ArbovirusMap />
    </section>
  )
}, {
  id: RedesignedArbovirusPageSectionId.TABLE,
  renderScrollSectionContent: (input: { ref: RefObject<HTMLElement>, key: string}) => (
    <section
      key={input.key}
      ref={input.ref}
      className="w-full h-[95%] snap-start snap-always scroll-smooth overflow-scroll"
    >
      <ArboDataTable />
    </section>
  )
}, {
  id: RedesignedArbovirusPageSectionId.VISUALIZATIONS,
  renderScrollSectionContent: (input: { ref: RefObject<HTMLElement>, key: string}) => (
    <section
      key={input.key}
      ref={input.ref}
      className="w-full h-full bg-red-500 snap-start snap-always scroll-smooth"
    >
      placeholder for visualizations
    </section>
  )
}]

const sectionUrlParamToSectionIdMap = {
  [RedesignedArbovirusPageSectionUrlParam.map]: RedesignedArbovirusPageSectionId.MAP,
  [RedesignedArbovirusPageSectionUrlParam.table]: RedesignedArbovirusPageSectionId.TABLE,
  [RedesignedArbovirusPageSectionUrlParam.visualizations]: RedesignedArbovirusPageSectionId.VISUALIZATIONS,
}

export const sectionUrlParameterToSectionId = (input: {urlParam: string | null}): RedesignedArbovirusPageSectionId | undefined => {
  if(!input.urlParam) {
    return;
  }

  if(!isRedesignedArbovirusPageSectionUrlParam(input.urlParam)) {
    return;
  }

  return sectionUrlParamToSectionIdMap[input.urlParam];
}