export enum DashboardType {
  ARBOVIRUS = 'ARBOVIRUS',
  SARS_COV_2 = 'SARS_COV_2',
  MERS = 'MERS',
  NONE = 'NONE'
}

export enum DashboardSectionId {
  MAP = 'MAP',
  TABLE = 'TABLE',
  VISUALIZATIONS = 'VISUALIZATIONS'
}

export const dashboardTypeToMapIdMap = {
  [DashboardType.ARBOVIRUS]: 'arboMap',
  [DashboardType.SARS_COV_2]: 'sarsCov2Map',
  [DashboardType.MERS]: 'mersMap',
  [DashboardType.NONE]: 'NONE',
}

export const dashboardTypeToHoverColourClassnameMap = {
  [DashboardType.ARBOVIRUS]: 'hover:bg-arbovirusHover/50',
  [DashboardType.SARS_COV_2]: 'hover:bg-sc2virusHover/50',
  [DashboardType.MERS]: 'hover:bg-mersHover/50',
  [DashboardType.NONE]: 'hover:bg-slate/50',
}
