import { ArbovirusStudyGeographicScope } from "@/gql/graphql";

export const cleanGeographicScope = (geographicScope: ArbovirusStudyGeographicScope): string => {
  const geographicScopeMap = {
    [ArbovirusStudyGeographicScope.Local]: 'Local',
    [ArbovirusStudyGeographicScope.Regional]: 'Regional',
    [ArbovirusStudyGeographicScope.National]: 'National',
  }

  return geographicScopeMap[geographicScope];
}

export const geographicScopeToColourClassnameMap: Record<string, string> = {
  'National': 'bg-blue-200',
  'Regional': 'bg-orange-200',
  'Local': 'bg-red-200'
}

