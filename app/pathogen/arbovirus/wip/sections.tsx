import { RefObject } from "react";
import { ArbovirusMap } from "../dashboard/(map)/ArbovirusMap";
import { ArboDataTable } from "@/app/pathogen/arbovirus/analyze/ArboDataTable";
import { VisualizationId, addToVisualizationInformation } from "../visualizations/visualizations";
import { ZoomIn } from "lucide-react";
import { useRouter } from "next/navigation";
import { VisualizationsSection } from "./visualizations-section";
import { RenderScrollSectionContentFunction } from "@/components/ui/scroll-section-group/scroll-section-group";

export enum RedesignedArbovirusPageSectionId {
  MAP = 'MAP',
  TABLE = 'TABLE',
  VISUALIZATIONS = 'VISUALIZATIONS'
}

export enum RedesignedArbovirusPageSectionUrlParam {
  map = 'map',
  table = 'table',
  visualizations = 'visualizations'
}

const isRedesignedArbovirusPageSectionUrlParam = (urlParam: string): urlParam is RedesignedArbovirusPageSectionUrlParam => {
  return Object.values(RedesignedArbovirusPageSectionUrlParam).some((element) => element === urlParam);
}

export const redesignedArbovirusPageSections: Array<{id: RedesignedArbovirusPageSectionId, renderScrollSectionContent: RenderScrollSectionContentFunction}> = [{
  id: RedesignedArbovirusPageSectionId.MAP,
  renderScrollSectionContent: (input) => (
    <section
      ref={input.ref}
      className="w-full h-[95%] snap-start snap-always scroll-smooth overflow-hidden relative row-span-2 border-black border-b-2"
    >
      <ArbovirusMap />
    </section>
  )
}, {
  id: RedesignedArbovirusPageSectionId.TABLE,
  renderScrollSectionContent: (input) => (
    <section
      ref={input.ref}
      className="w-full h-[95%] snap-start snap-always scroll-smooth overflow-scroll border-black border-b-2"
    >
      <ArboDataTable />
    </section>
  )
}, {
  id: RedesignedArbovirusPageSectionId.VISUALIZATIONS,
  renderScrollSectionContent: (input) => (
    <section
      ref={input.ref}
      className="w-full h-full snap-start snap-always scroll-smooth grid-cols-2 grid-rows-1 grid overflow-y-scroll gap-y-6 pr-4"
    >
      <VisualizationsSection />
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