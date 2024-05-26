import { typedObjectEntries, typedObjectFromEntries } from "./utils";

export const countryNameToIso31661Alpha3CodeMap: Record<string, string> = {
  Afghanistan: "AFG",
  Angola: "AGO",
  Albania: "ALB",
  "United Arab Emirates": "ARE",
  Argentina: "ARG",
  Armenia: "ARM",
  Antarctica: "ATA",
  "French Southern Territories": "ATF",
  Australia: "AUS",
  Austria: "AUT",
  Azerbaijan: "AZE",
  Burundi: "BDI",
  Belgium: "BEL",
  Benin: "BEN",
  "Burkina Faso": "BFA",
  Bangladesh: "BGD",
  Bulgaria: "BGR",
  Barbados: "BRB",
  Bahamas: "BHS",
  "Bosnia and Herzegovina": "BIH",
  Belarus: "BLR",
  Belize: "BLZ",
  Bolivia: "BOL",
  Brazil: "BRA",
  Brunei: "BRN",
  Bhutan: "BTN",
  Botswana: "BWA",
  "Central African Republic": "CAF",
  Canada: "CAN",
  Switzerland: "CHE",
  Chile: "CHL",
  China: "CHN",
  "Ivory Coast": "CIV",
  Cameroon: "CMR",
  "Democratic Republic of the Congo": "COD",
  "Republic of Congo": "COG",
  Congo: "COG",
  Colombia: "COL",
  "Costa Rica": "CRI",
  Cuba: "CUB",
  Cyprus: "CYP",
  "Northern Cyprus": "CYP",
  "Czech Republic": "CZE",
  Germany: "DEU",
  Djibouti: "DJI",
  Denmark: "DNK",
  "Dominican Republic": "DOM",
  Algeria: "DZA",
  Ecuador: "ECU",
  Egypt: "EGY",
  Eritrea: "ERI",
  Spain: "ESP",
  "São Tomé and Príncipe": "STP",
  "Sao Tome and Principe": "STP",
  Estonia: "EST",
  Ethiopia: "ETH",
  Finland: "FIN",
  Fiji: "FJI",
  "Falkland Islands": "FLK",
  France: "FRA",
  Gabon: "GAB",
  "United Kingdom": "GBR",
  Georgia: "GEO",
  Ghana: "GHA",
  Guinea: "GIN",
  Gambia: "GMB",
  "Guinea Bissau": "GNB",
  "Equatorial Guinea": "GNQ",
  Greece: "GRC",
  Greenland: "GRL",
  Guatemala: "GTM",
  Guyana: "GUY",
  Honduras: "HND",
  Croatia: "HRV",
  Haiti: "HTI",
  Hungary: "HUN",
  Indonesia: "IDN",
  India: "IND",
  Ireland: "IRL",
  Iran: "IRN",
  "Iran (Islamic Republic of)": "IRN",
  Iraq: "IRQ",
  Iceland: "ISL",
  Israel: "ISR",
  Italy: "ITA",
  Jamaica: "JAM",
  Jordan: "JOR",
  Japan: "JPN",
  Kazakhstan: "KAZ",
  Kenya: "KEN",
  Kyrgyzstan: "KGZ",
  Cambodia: "KHM",
  "South Korea": "KOR",
  Kuwait: "KWT",
  "Lao People’s Democratic Republic": "LAO",
  "Lao People's Democratic Republic": "LAO",
  Lebanon: "LBN",
  Liberia: "LBR",
  Libya: "LBY",
  "Sri Lanka": "LKA",
  Lesotho: "LSO",
  Lithuania: "LTU",
  Luxembourg: "LUX",
  Latvia: "LVA",
  Morocco: "MAR",
  Moldova: "MDA",
  Madagascar: "MDG",
  Mexico: "MEX",
  Macedonia: "MKD",
  Mali: "MLI",
  Myanmar: "MMR",
  Montenegro: "MNE",
  Mongolia: "MNG",
  Mozambique: "MOZ",
  Mauritania: "MRT",
  Malawi: "MWI",
  Malaysia: "MYS",
  Namibia: "NAM",
  "New Caledonia": "NCL",
  Niger: "NER",
  Nigeria: "NGA",
  Nicaragua: "NIC",
  Netherlands: "NLD",
  Norway: "NOR",
  Nepal: "NPL",
  "New Zealand": "NZL",
  Oman: "OMN",
  Pakistan: "PAK",
  Panama: "PAN",
  Peru: "PER",
  Philippines: "PHL",
  "Papua New Guinea": "PNG",
  Poland: "POL",
  "Puerto Rico": "PRI",
  "North Korea": "PRK",
  Portugal: "PRT",
  Paraguay: "PRY",
  Qatar: "QAT",
  Romania: "ROU",
  Russia: "RUS",
  Rwanda: "RWA",
  "Saudi Arabia": "SAU",
  Singapore: "SGP",
  Sudan: "SDN",
  "South Sudan": "SSD",
  Senegal: "SEN",
  "Solomon islands": "SLB",
  "Sierra Leone": "SLE",
  "El Salvador": "SLV",
  Somalia: "SOM",
  Serbia: "SRB",
  Suriname: "SUR",
  Slovakia: "SVK",
  Slovenia: "SVN",
  Sweden: "SWE",
  Swaziland: "SWZ",
  Syria: "SYR",
  Chad: "TCD",
  Togo: "TGO",
  Thailand: "THA",
  Tajikistan: "TJK",
  Turkmenistan: "TKM",
  "East Timor": "TLS",
  "Trinidad and Tobago": "TTO",
  Tunisia: "TUN",
  Turkey: "TUR",
  Taiwan: "TWN",
  Tanzania: "TZA",
  "United Republic of Tanzania": "TZA",
  Uganda: "UGA",
  Ukraine: "UKR",
  Uruguay: "URY",
  USA: "USA",
  "United States of America": "USA",
  Uzbekistan: "UZB",
  Venezuela: "VEN",
  Vietnam: "VNM",
  "Viet Nam": "VNM",
  Vanuatu: "VUT",
  "West Bank": "ISR",
  Yemen: "YEM",
  "South Africa": "ZAF",
  Zambia: "ZMB",
  Zimbabwe: "ZWE",
  Micronesia: "FSM",
  "Micronesia (Federated States of)": "FSM",
  "French Polynesia": "PYF",
  "Saint Kitts and Nevis": "KNA",
  Seychelles: "SYC",
  "Northern Tanzania": "TZA",
  "French Guiana": "GUF",
  "St Lucia": "LCA",
  "Saint Lucia": "LCA",
};

export const iso31661Alpha3CodeToCountryNameMap: Record<string, string> = typedObjectFromEntries(
  typedObjectEntries(countryNameToIso31661Alpha3CodeMap).map(([key, value]) => [value, key])
);