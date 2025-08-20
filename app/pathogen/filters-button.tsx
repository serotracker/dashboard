import React from "react";
import { cn } from "@/lib/utils";
import { ChevronsLeft, ChevronsRight } from "lucide-react";
import { DashboardType } from "./dashboard-enums";

interface FiltersButtonProps {
  dashboardType: DashboardType;
  isLargeScreen: boolean;
  areFiltersMinimized: boolean;
  setAreFiltersMinimized: (areFiltersMinimized: boolean) => void;
}

const dashboardTypeToColourClassnameMap = {
  [DashboardType.ARBOVIRUS]: 'bg-arbovirus',
  [DashboardType.MERS]: 'bg-mers',
  [DashboardType.SARS_COV_2]: 'bg-sc2virus',
  [DashboardType.NONE]: 'bg-slate-300',
}

export const FiltersButton = (props: FiltersButtonProps) => {
  const { dashboardType, isLargeScreen, areFiltersMinimized, setAreFiltersMinimized } = props;

  return (
    <button
      className={cn(
        "sticky top-[45vh] z-20 rounded-full w-12 h-12 ml-[-40px]",
        isLargeScreen ? '' : 'hidden',
        dashboardTypeToColourClassnameMap[dashboardType]
      )}
      onClick={() => setAreFiltersMinimized(!areFiltersMinimized)}
      aria-label={areFiltersMinimized ? "Expand filters" : "Minimize filters"}
    >
      <ChevronsLeft size={24} className={cn(
        'ml-[22px] text-white',
        areFiltersMinimized ? 'hidden' : ''
      )}/>
      <ChevronsRight size={24} className={cn(
        'ml-[22px] text-white',
        areFiltersMinimized ? '' : 'hidden'
      )}/>
    </button>
  )
}