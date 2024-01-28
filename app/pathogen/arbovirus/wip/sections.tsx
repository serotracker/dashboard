import { RefObject } from "react";

enum RedesignedArbovirusPageSectionId {
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
      className="w-full h-[95%] bg-blue-500 snap-start snap-always scroll-smooth"
    >
      placeholder for map
    </section>
  )
}, {
  id: RedesignedArbovirusPageSectionId.TABLE,
  renderScrollSectionContent: (input: { ref: RefObject<HTMLElement>, key: string}) => (
    <section
      key={input.key}
      ref={input.ref}
      className="w-full h-[95%] bg-yellow-500 snap-start snap-always scroll-smooth"
    >
      placeholder for table
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