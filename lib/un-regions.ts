import defaultColours from 'tailwindcss/colors'
import { UnRegion } from "@/gql/graphql";

const countryAlphaTwoCodeToUNRegionsMap: Partial<Record<string, UnRegion>> = {
  AF: UnRegion.SouthernAsia,
  AL: UnRegion.SouthernEurope,
  DZ: UnRegion.NorthernAfrica,
  AS: UnRegion.Polynesia,
  AD: UnRegion.SouthernEurope,
  AO: UnRegion.MiddleAfrica,
  AI: UnRegion.Caribbean,
  AG: UnRegion.Caribbean,
  AR: UnRegion.SouthAmerica,
  AM: UnRegion.WesternAsia,
  AW: UnRegion.Caribbean,
  AU: UnRegion.AustraliaAndNewZealand,
  AT: UnRegion.WesternEurope,
  AZ: UnRegion.WesternAsia,
  BS: UnRegion.Caribbean,
  BH: UnRegion.WesternAsia,
  BD: UnRegion.SouthernAsia,
  BB: UnRegion.Caribbean,
  BY: UnRegion.EasternEurope,
  BE: UnRegion.WesternEurope,
  BZ: UnRegion.CentralAmerica,
  BJ: UnRegion.WesternAfrica,
  BM: UnRegion.NorthernAmerica,
  BT: UnRegion.SouthernAsia,
  BO: UnRegion.SouthAmerica,
  BQ: UnRegion.Caribbean,
  BA: UnRegion.SouthernEurope,
  BW: UnRegion.SouthernAfrica,
  BR: UnRegion.SouthAmerica,
  VG: UnRegion.Caribbean,
  BN: UnRegion.SouthEasternAsia,
  BG: UnRegion.EasternEurope,
  BF: UnRegion.WesternAfrica,
  BI: UnRegion.EasternAfrica,
  CV: UnRegion.WesternAfrica,
  KH: UnRegion.SouthEasternAsia,
  CM: UnRegion.MiddleAfrica,
  CA: UnRegion.NorthernAmerica,
  KY: UnRegion.Caribbean,
  CF: UnRegion.MiddleAfrica,
  TD: UnRegion.MiddleAfrica,
  CL: UnRegion.SouthAmerica,
  CN: UnRegion.EasternAsia,
  CX: UnRegion.AustraliaAndNewZealand,
  CC: UnRegion.AustraliaAndNewZealand,
  CO: UnRegion.SouthAmerica,
  KM: UnRegion.EasternAfrica,
  CG: UnRegion.MiddleAfrica,
  CK: UnRegion.Polynesia,
  CR: UnRegion.CentralAmerica,
  HR: UnRegion.SouthernEurope,
  CU: UnRegion.Caribbean,
  CW: UnRegion.Caribbean,
  CY: UnRegion.WesternAsia,
  CZ: UnRegion.EasternEurope,
  CI: UnRegion.WesternAfrica,
  KP: UnRegion.EasternAsia,
  CD: UnRegion.MiddleAfrica,
  DK: UnRegion.NorthernEurope,
  DJ: UnRegion.EasternAfrica,
  DM: UnRegion.Caribbean,
  DO: UnRegion.Caribbean,
  EC: UnRegion.SouthAmerica,
  EG: UnRegion.NorthernAfrica,
  SV: UnRegion.CentralAmerica,
  GQ: UnRegion.MiddleAfrica,
  ER: UnRegion.EasternAfrica,
  EE: UnRegion.NorthernEurope,
  SZ: UnRegion.SouthernAfrica,
  ET: UnRegion.EasternAfrica,
  FK: UnRegion.SouthAmerica,
  FO: UnRegion.NorthernEurope,
  FJ: UnRegion.Melanesia,
  FI: UnRegion.NorthernEurope,
  FR: UnRegion.WesternEurope,
  GF: UnRegion.SouthAmerica,
  PF: UnRegion.Polynesia,
  GA: UnRegion.MiddleAfrica,
  GM: UnRegion.WesternAfrica,
  GE: UnRegion.WesternAsia,
  DE: UnRegion.WesternEurope,
  GH: UnRegion.WesternAfrica,
  GI: UnRegion.SouthernEurope,
  GR: UnRegion.SouthernEurope,
  GL: UnRegion.NorthernAmerica,
  GD: UnRegion.Caribbean,
  GP: UnRegion.Caribbean,
  GU: UnRegion.Micronesia,
  GT: UnRegion.CentralAmerica,
  GG: UnRegion.NorthernEurope,
  GN: UnRegion.WesternAfrica,
  GW: UnRegion.WesternAfrica,
  GY: UnRegion.SouthAmerica,
  HT: UnRegion.Caribbean,
  VA: UnRegion.SouthernEurope,
  HN: UnRegion.CentralAmerica,
  HU: UnRegion.EasternEurope,
  IS: UnRegion.NorthernEurope,
  IN: UnRegion.SouthernAsia,
  ID: UnRegion.SouthEasternAsia,
  IR: UnRegion.SouthernAsia,
  IQ: UnRegion.WesternAsia,
  IE: UnRegion.NorthernEurope,
  IM: UnRegion.NorthernEurope,
  IL: UnRegion.WesternAsia,
  IT: UnRegion.SouthernEurope,
  JM: UnRegion.Caribbean,
  JP: UnRegion.EasternAsia,
  JE: UnRegion.NorthernEurope,
  JO: UnRegion.WesternAsia,
  KZ: UnRegion.CentralAsia,
  KE: UnRegion.EasternAfrica,
  KI: UnRegion.Micronesia,
  XK: undefined,
  KW: UnRegion.WesternAsia,
  KG: UnRegion.CentralAsia,
  LA: UnRegion.SouthEasternAsia,
  LV: UnRegion.NorthernEurope,
  LB: UnRegion.WesternAsia,
  LS: UnRegion.SouthernAfrica,
  LR: UnRegion.WesternAfrica,
  LY: UnRegion.NorthernAfrica,
  LI: UnRegion.WesternEurope,
  LT: UnRegion.NorthernEurope,
  LU: UnRegion.WesternEurope,
  MG: UnRegion.EasternAfrica,
  MW: UnRegion.EasternAfrica,
  MY: UnRegion.SouthEasternAsia,
  MV: UnRegion.SouthernAsia,
  ML: UnRegion.WesternAfrica,
  MT: UnRegion.SouthernEurope,
  MH: UnRegion.Micronesia,
  MQ: UnRegion.Caribbean,
  MR: UnRegion.WesternAfrica,
  MU: UnRegion.EasternAfrica,
  YT: UnRegion.EasternAfrica,
  MX: UnRegion.CentralAmerica,
  FM: UnRegion.Micronesia,
  MC: UnRegion.WesternEurope,
  MN: UnRegion.EasternAsia,
  ME: UnRegion.SouthernEurope,
  MS: UnRegion.Caribbean,
  MA: UnRegion.NorthernAfrica,
  MZ: UnRegion.EasternAfrica,
  MM: UnRegion.SouthEasternAsia,
  NA: UnRegion.SouthernAfrica,
  NR: UnRegion.Micronesia,
  NP: UnRegion.SouthernAsia,
  NL: UnRegion.WesternEurope,
  NC: UnRegion.Melanesia,
  NZ: UnRegion.AustraliaAndNewZealand,
  NI: UnRegion.CentralAmerica,
  NE: UnRegion.WesternAfrica,
  NG: UnRegion.WesternAfrica,
  NU: UnRegion.Polynesia,
  NF: UnRegion.AustraliaAndNewZealand,
  MK: UnRegion.SouthernEurope,
  MP: UnRegion.Micronesia,
  NO: UnRegion.NorthernEurope,
  PS: UnRegion.WesternAsia,
  OM: UnRegion.WesternAsia,
  PK: UnRegion.SouthernAsia,
  PW: UnRegion.Micronesia,
  PA: UnRegion.CentralAmerica,
  PG: UnRegion.Melanesia,
  PY: UnRegion.SouthAmerica,
  PE: UnRegion.SouthAmerica,
  PH: UnRegion.SouthEasternAsia,
  PN: UnRegion.Polynesia,
  PL: UnRegion.EasternEurope,
  PT: UnRegion.SouthernEurope,
  PR: UnRegion.Caribbean,
  QA: UnRegion.WesternAsia,
  KR: UnRegion.EasternAsia,
  MD: UnRegion.EasternEurope,
  RO: UnRegion.EasternEurope,
  RU: UnRegion.EasternEurope,
  RW: UnRegion.EasternAfrica,
  RE: UnRegion.EasternAfrica,
  BL: UnRegion.Caribbean,
  SH: UnRegion.WesternAfrica,
  KN: UnRegion.Caribbean,
  LC: UnRegion.Caribbean,
  MF: UnRegion.Caribbean,
  PM: UnRegion.NorthernAmerica,
  VC: UnRegion.Caribbean,
  WS: UnRegion.Polynesia,
  SM: UnRegion.SouthernEurope,
  ST: UnRegion.MiddleAfrica,
  SA: UnRegion.WesternAsia,
  SN: UnRegion.WesternAfrica,
  RS: UnRegion.SouthernEurope,
  SC: UnRegion.EasternAfrica,
  SL: UnRegion.WesternAfrica,
  SG: UnRegion.SouthEasternAsia,
  SX: UnRegion.Caribbean,
  SK: UnRegion.EasternEurope,
  SI: UnRegion.SouthernEurope,
  SB: UnRegion.Melanesia,
  SO: UnRegion.EasternAfrica,
  ZA: UnRegion.SouthernAfrica,
  SS: UnRegion.EasternAfrica,
  ES: UnRegion.SouthernEurope,
  LK: UnRegion.SouthernAsia,
  SD: UnRegion.NorthernAfrica,
  SR: UnRegion.SouthAmerica,
  SJ: UnRegion.NorthernEurope,
  SE: UnRegion.NorthernEurope,
  CH: UnRegion.WesternEurope,
  SY: UnRegion.WesternAsia,
  TJ: UnRegion.CentralAsia,
  TW: undefined,
  TH: UnRegion.SouthEasternAsia,
  GB: UnRegion.NorthernEurope,
  TL: UnRegion.SouthEasternAsia,
  TG: UnRegion.WesternAfrica,
  TK: UnRegion.Polynesia,
  TO: UnRegion.Polynesia,
  TT: UnRegion.Caribbean,
  TN: UnRegion.NorthernAfrica,
  TR: UnRegion.WesternAsia,
  TM: UnRegion.CentralAsia,
  TC: UnRegion.Caribbean,
  TV: UnRegion.Polynesia,
  UG: UnRegion.EasternAfrica,
  UA: UnRegion.EasternEurope,
  AE: UnRegion.WesternAsia,
  TZ: UnRegion.EasternAfrica,
  VI: UnRegion.Caribbean,
  US: UnRegion.NorthernAmerica,
  UY: UnRegion.SouthAmerica,
  UZ: UnRegion.CentralAsia,
  VU: UnRegion.Melanesia,
  VE: UnRegion.SouthAmerica,
  VN: UnRegion.SouthEasternAsia,
  WF: UnRegion.Polynesia,
  EH: UnRegion.NorthernAfrica,
  YE: UnRegion.WesternAsia,
  ZM: UnRegion.EasternAfrica,
  ZW: UnRegion.EasternAfrica,
};

export const unRegionEnumToLabelMap = {
  [UnRegion.NorthernAfrica]: "Northern Africa",
  [UnRegion.EasternAfrica]: "Eastern Africa",
  [UnRegion.MiddleAfrica]: "Middle Africa",
  [UnRegion.SouthernAfrica]: "Southern Africa",
  [UnRegion.WesternAfrica]: "Western Africa",
  [UnRegion.Caribbean]: "Caribbean",
  [UnRegion.CentralAmerica]: "Central America",
  [UnRegion.SouthAmerica]: "South America",
  [UnRegion.NorthernAmerica]: "Northern America",
  [UnRegion.CentralAsia]: "Central Asia",
  [UnRegion.EasternAsia]: "Eastern Asia",
  [UnRegion.SouthEasternAsia]: "South-Eastern Asia",
  [UnRegion.SouthernAsia]: "Southern Asia",
  [UnRegion.WesternAsia]: "Western Asia",
  [UnRegion.EasternEurope]: "Eastern Europe",
  [UnRegion.NorthernEurope]: "Northern Europe",
  [UnRegion.SouthernEurope]: "Southern Europe",
  [UnRegion.WesternEurope]: "Western Europe",
  [UnRegion.AustraliaAndNewZealand]: "Australia and New Zealand",
  [UnRegion.Melanesia]: "Melanesia",
  [UnRegion.Micronesia]: "Micronesia",
  [UnRegion.Polynesia]: "Polynesia",
};

export const defaultColoursForUnRegions: Record<UnRegion, string> = {
  [UnRegion.AustraliaAndNewZealand]: defaultColours.amber[200],
  [UnRegion.Caribbean]: defaultColours.fuchsia[200],
  [UnRegion.CentralAmerica]: defaultColours.blue[200],
  [UnRegion.CentralAsia]: defaultColours.purple[200],
  [UnRegion.EasternAfrica]: defaultColours.emerald[200],
  [UnRegion.EasternAsia]: defaultColours.rose[200],
  [UnRegion.EasternEurope]: defaultColours.orange[200],
  [UnRegion.Melanesia]: defaultColours.lime[200],
  [UnRegion.Micronesia]: defaultColours.red[200],
  [UnRegion.MiddleAfrica]: defaultColours.teal[200],
  [UnRegion.NorthernAfrica]: defaultColours.indigo[200],
  [UnRegion.NorthernAmerica]: defaultColours.amber[400],
  [UnRegion.NorthernEurope]: defaultColours.fuchsia[400],
  [UnRegion.Polynesia]: defaultColours.blue[400],
  [UnRegion.SouthernAfrica]: defaultColours.purple[400],
  [UnRegion.SouthernAsia]: defaultColours.emerald[400],
  [UnRegion.SouthernEurope]: defaultColours.rose[400],
  [UnRegion.SouthAmerica]: defaultColours.orange[400],
  [UnRegion.SouthEasternAsia]: defaultColours.lime[400],
  [UnRegion.WesternAfrica]: defaultColours.red[400],
  [UnRegion.WesternAsia]: defaultColours.teal[400],
  [UnRegion.WesternEurope]: defaultColours.indigo[400]
}

export const defaultBackgroundColourClassnamesForUnRegions: Record<UnRegion, string> = {
  [UnRegion.AustraliaAndNewZealand]: 'bg-amber-200',
  [UnRegion.Caribbean]: 'bg-fuchsia-200',
  [UnRegion.CentralAmerica]: 'bg-blue-200',
  [UnRegion.CentralAsia]: 'bg-purple-200',
  [UnRegion.EasternAfrica]: 'bg-emerald-200',
  [UnRegion.EasternAsia]: 'bg-rose-200',
  [UnRegion.EasternEurope]: 'bg-orange-200',
  [UnRegion.Melanesia]: 'bg-lime-200',
  [UnRegion.Micronesia]: 'bg-red-200',
  [UnRegion.MiddleAfrica]: 'bg-teal-200',
  [UnRegion.NorthernAfrica]: 'bg-indigo-200',
  [UnRegion.NorthernAmerica]: 'bg-amber-400',
  [UnRegion.NorthernEurope]: 'bg-fuchsia-400',
  [UnRegion.Polynesia]: 'bg-blue-400',
  [UnRegion.SouthernAfrica]: 'bg-purple-400',
  [UnRegion.SouthernAsia]: 'bg-emerald-400',
  [UnRegion.SouthernEurope]: 'bg-rose-400',
  [UnRegion.SouthAmerica]: 'bg-orange-400',
  [UnRegion.SouthEasternAsia]: 'bg-lime-400',
  [UnRegion.WesternAfrica]: 'bg-red-400',
  [UnRegion.WesternAsia]: 'bg-teal-400',
  [UnRegion.WesternEurope]: 'bg-indigo-400'
}

export const getLabelForUNRegion = (unRegion: UnRegion) => {
  return unRegionEnumToLabelMap[unRegion];
}

interface GetCountryCodesInUNRegionInput {
  unRegion: UnRegion;
}

export const getCountryCodesInUNRegion = (
  input: GetCountryCodesInUNRegionInput
): string[] => {
  return Object.entries(countryAlphaTwoCodeToUNRegionsMap)
    .map(([key, value]) => ({ countryCode: key, unRegion: value }))
    .filter(({ unRegion }) => unRegion === input.unRegion)
    .map(({ countryCode }) => countryCode);
};

export const isUNRegion = (unRegion: string): unRegion is UnRegion =>
  Object.values(UnRegion).some((element) => element === unRegion);
