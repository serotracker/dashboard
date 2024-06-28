/* eslint-disable */
import { TypedDocumentNode as DocumentNode } from '@graphql-typed-document-node/core';
export type Maybe<T> = T | null;
export type InputMaybe<T> = Maybe<T>;
export type Exact<T extends { [key: string]: unknown }> = { [K in keyof T]: T[K] };
export type MakeOptional<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]?: Maybe<T[SubKey]> };
export type MakeMaybe<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]: Maybe<T[SubKey]> };
export type MakeEmpty<T extends { [key: string]: unknown }, K extends keyof T> = { [_ in K]?: never };
export type Incremental<T> = T | { [P in keyof T]?: P extends ' $fragmentName' | '__typename' ? T[P] : never };
/** All built-in and custom scalars, mapped to their actual values */
export type Scalars = {
  ID: { input: string; output: string; }
  String: { input: string; output: string; }
  Boolean: { input: boolean; output: boolean; }
  Int: { input: number; output: number; }
  Float: { input: number; output: number; }
};

export type Affiliation = {
  __typename?: 'Affiliation';
  label: Scalars['String']['output'];
};

export type AnimalMersEvent = MersEventInterface & {
  __typename?: 'AnimalMersEvent';
  animalSpecies: MersEventAnimalSpecies;
  animalType: MersEventAnimalType;
  city: Scalars['String']['output'];
  country: CountryIdentifiers;
  diagnosisSource: MersDiagnosisSource;
  diagnosisStatus: MersDiagnosisStatus;
  id: Scalars['String']['output'];
  latitude: Scalars['Float']['output'];
  longitude: Scalars['Float']['output'];
  observationDate?: Maybe<Scalars['String']['output']>;
  reportDate: Scalars['String']['output'];
  state: Scalars['String']['output'];
  type: MersEventType;
  whoRegion?: Maybe<WhoRegion>;
};

export enum Arbovirus {
  Chikv = 'CHIKV',
  Denv = 'DENV',
  Mayv = 'MAYV',
  Wnv = 'WNV',
  Yf = 'YF',
  Zikv = 'ZIKV'
}

export type ArbovirusDataStatistics = {
  __typename?: 'ArbovirusDataStatistics';
  countryCount: Scalars['Int']['output'];
  estimateCount: Scalars['Int']['output'];
  patricipantCount: Scalars['Int']['output'];
  sourceCount: Scalars['Int']['output'];
};

export type ArbovirusEstimate = {
  __typename?: 'ArbovirusEstimate';
  ageGroup?: Maybe<Scalars['String']['output']>;
  ageMaximum?: Maybe<Scalars['Int']['output']>;
  ageMinimum?: Maybe<Scalars['Int']['output']>;
  antibodies: Array<Scalars['String']['output']>;
  antigen?: Maybe<Scalars['String']['output']>;
  assay?: Maybe<Scalars['String']['output']>;
  assayOther?: Maybe<Scalars['String']['output']>;
  city?: Maybe<Scalars['String']['output']>;
  country: Scalars['String']['output'];
  countryAlphaThreeCode: Scalars['String']['output'];
  countryAlphaTwoCode: Scalars['String']['output'];
  createdAt: Scalars['String']['output'];
  estimateId?: Maybe<Scalars['String']['output']>;
  id: Scalars['String']['output'];
  inclusionCriteria?: Maybe<Scalars['String']['output']>;
  latitude: Scalars['Float']['output'];
  longitude: Scalars['Float']['output'];
  pathogen: Arbovirus;
  pediatricAgeGroup?: Maybe<Scalars['String']['output']>;
  producer?: Maybe<Scalars['String']['output']>;
  producerOther?: Maybe<Scalars['String']['output']>;
  sameFrameTargetGroup?: Maybe<Scalars['String']['output']>;
  sampleEndDate?: Maybe<Scalars['String']['output']>;
  sampleFrame?: Maybe<Scalars['String']['output']>;
  sampleNumerator?: Maybe<Scalars['Int']['output']>;
  sampleSize: Scalars['Int']['output'];
  sampleStartDate?: Maybe<Scalars['String']['output']>;
  seroprevalence: Scalars['Float']['output'];
  seroprevalenceCalculated95CILower?: Maybe<Scalars['Float']['output']>;
  seroprevalenceCalculated95CIUpper?: Maybe<Scalars['Float']['output']>;
  seroprevalenceStudy95CILower?: Maybe<Scalars['Float']['output']>;
  seroprevalenceStudy95CIUpper?: Maybe<Scalars['Float']['output']>;
  serotype: Array<Scalars['String']['output']>;
  sex?: Maybe<Scalars['String']['output']>;
  sourceSheetId?: Maybe<Scalars['String']['output']>;
  sourceSheetName?: Maybe<Scalars['String']['output']>;
  state?: Maybe<Scalars['String']['output']>;
  unRegion?: Maybe<UnRegion>;
  url?: Maybe<Scalars['String']['output']>;
  whoRegion?: Maybe<Scalars['String']['output']>;
};

export type ArbovirusFilterOptions = {
  __typename?: 'ArbovirusFilterOptions';
  ageGroup: Array<Scalars['String']['output']>;
  antibody: Array<Scalars['String']['output']>;
  assay: Array<Scalars['String']['output']>;
  country: Array<Scalars['String']['output']>;
  countryIdentifiers: Array<CountryIdentifiers>;
  pathogen: Array<Scalars['String']['output']>;
  pediatricAgeGroup: Array<Scalars['String']['output']>;
  producer: Array<Scalars['String']['output']>;
  sampleFrame: Array<Scalars['String']['output']>;
  serotype: Array<Scalars['String']['output']>;
  sex: Array<Scalars['String']['output']>;
  unRegion: Array<Scalars['String']['output']>;
  whoRegion: Array<Scalars['String']['output']>;
};

export type CountryIdentifiers = {
  __typename?: 'CountryIdentifiers';
  alphaThreeCode: Scalars['String']['output'];
  alphaTwoCode: Scalars['String']['output'];
  name: Scalars['String']['output'];
};

export type FaoMersEventFilterOptions = {
  __typename?: 'FaoMersEventFilterOptions';
  animalSpecies: Array<MersEventAnimalSpecies>;
  animalType: Array<MersEventAnimalType>;
  diagnosisSource: Array<MersDiagnosisSource>;
};

export enum GbdSubRegion {
  CentralEuropeEasternEuropeAndCentralAsiaSubregionCentralAsia = 'CENTRAL_EUROPE_EASTERN_EUROPE_AND_CENTRAL_ASIA_SUBREGION_CENTRAL_ASIA',
  CentralEuropeEasternEuropeAndCentralAsiaSubregionCentralEurope = 'CENTRAL_EUROPE_EASTERN_EUROPE_AND_CENTRAL_ASIA_SUBREGION_CENTRAL_EUROPE',
  CentralEuropeEasternEuropeAndCentralAsiaSubregionEasternEurope = 'CENTRAL_EUROPE_EASTERN_EUROPE_AND_CENTRAL_ASIA_SUBREGION_EASTERN_EUROPE',
  HighIncomeSubregionAsiaPacific = 'HIGH_INCOME_SUBREGION_ASIA_PACIFIC',
  HighIncomeSubregionAustralasia = 'HIGH_INCOME_SUBREGION_AUSTRALASIA',
  HighIncomeSubregionNorthAmerica = 'HIGH_INCOME_SUBREGION_NORTH_AMERICA',
  HighIncomeSubregionSouthernLatinAmerica = 'HIGH_INCOME_SUBREGION_SOUTHERN_LATIN_AMERICA',
  HighIncomeSubregionWesternEurope = 'HIGH_INCOME_SUBREGION_WESTERN_EUROPE',
  LatinAmericaAndCaribbeanSubregionAndean = 'LATIN_AMERICA_AND_CARIBBEAN_SUBREGION_ANDEAN',
  LatinAmericaAndCaribbeanSubregionCaribbean = 'LATIN_AMERICA_AND_CARIBBEAN_SUBREGION_CARIBBEAN',
  LatinAmericaAndCaribbeanSubregionCentral = 'LATIN_AMERICA_AND_CARIBBEAN_SUBREGION_CENTRAL',
  LatinAmericaAndCaribbeanSubregionTropical = 'LATIN_AMERICA_AND_CARIBBEAN_SUBREGION_TROPICAL',
  NorthAfricaAndMiddleEastSubregionNorthAfricaAndMiddleEast = 'NORTH_AFRICA_AND_MIDDLE_EAST_SUBREGION_NORTH_AFRICA_AND_MIDDLE_EAST',
  SouthAsiaSubregionSouthAsia = 'SOUTH_ASIA_SUBREGION_SOUTH_ASIA',
  SouthEastAsiaEastAsiaAndOceaniaSubregionEastAsia = 'SOUTH_EAST_ASIA_EAST_ASIA_AND_OCEANIA_SUBREGION_EAST_ASIA',
  SouthEastAsiaEastAsiaAndOceaniaSubregionOceania = 'SOUTH_EAST_ASIA_EAST_ASIA_AND_OCEANIA_SUBREGION_OCEANIA',
  SouthEastAsiaEastAsiaAndOceaniaSubregionSouthEastAsia = 'SOUTH_EAST_ASIA_EAST_ASIA_AND_OCEANIA_SUBREGION_SOUTH_EAST_ASIA',
  SubSaharanAfricaSubregionCentral = 'SUB_SAHARAN_AFRICA_SUBREGION_CENTRAL',
  SubSaharanAfricaSubregionEastern = 'SUB_SAHARAN_AFRICA_SUBREGION_EASTERN',
  SubSaharanAfricaSubregionSouthern = 'SUB_SAHARAN_AFRICA_SUBREGION_SOUTHERN',
  SubSaharanAfricaSubregionWestern = 'SUB_SAHARAN_AFRICA_SUBREGION_WESTERN'
}

export enum GbdSuperRegion {
  CentralEuropeEasternEuropeAndCentralAsia = 'CENTRAL_EUROPE_EASTERN_EUROPE_AND_CENTRAL_ASIA',
  HighIncome = 'HIGH_INCOME',
  LatinAmericaAndCaribbean = 'LATIN_AMERICA_AND_CARIBBEAN',
  NorthAfricaAndMiddleEast = 'NORTH_AFRICA_AND_MIDDLE_EAST',
  SouthAsia = 'SOUTH_ASIA',
  SouthEastAsiaEastAsiaAndOceania = 'SOUTH_EAST_ASIA_EAST_ASIA_AND_OCEANIA',
  SubSaharanAfrica = 'SUB_SAHARAN_AFRICA'
}

export type HumanMersEvent = MersEventInterface & {
  __typename?: 'HumanMersEvent';
  city: Scalars['String']['output'];
  country: CountryIdentifiers;
  diagnosisSource: MersDiagnosisSource;
  diagnosisStatus: MersDiagnosisStatus;
  humanDeaths: Scalars['Int']['output'];
  humansAffected: Scalars['Int']['output'];
  id: Scalars['String']['output'];
  latitude: Scalars['Float']['output'];
  longitude: Scalars['Float']['output'];
  observationDate?: Maybe<Scalars['String']['output']>;
  reportDate: Scalars['String']['output'];
  state: Scalars['String']['output'];
  type: MersEventType;
  whoRegion?: Maybe<WhoRegion>;
};

export enum MersDiagnosisSource {
  FaoFieldOfficer = 'FAO_FIELD_OFFICER',
  Media = 'MEDIA',
  NationalAuthorities = 'NATIONAL_AUTHORITIES',
  Publications = 'PUBLICATIONS',
  WorldHealthOrganization = 'WORLD_HEALTH_ORGANIZATION',
  WorldOrganisationForAnimalHealth = 'WORLD_ORGANISATION_FOR_ANIMAL_HEALTH'
}

export enum MersDiagnosisStatus {
  Confirmed = 'CONFIRMED',
  Denied = 'DENIED'
}

export type MersEstimate = {
  __typename?: 'MersEstimate';
  country: Scalars['String']['output'];
  countryAlphaThreeCode: Scalars['String']['output'];
  countryAlphaTwoCode: Scalars['String']['output'];
  id: Scalars['String']['output'];
  latitude: Scalars['Float']['output'];
  longitude: Scalars['Float']['output'];
  whoRegion?: Maybe<WhoRegion>;
};

export type MersEvent = AnimalMersEvent | HumanMersEvent;

export enum MersEventAnimalSpecies {
  Bat = 'BAT',
  Camel = 'CAMEL'
}

export enum MersEventAnimalType {
  Domestic = 'DOMESTIC',
  Wild = 'WILD'
}

export type MersEventInterface = {
  city: Scalars['String']['output'];
  country: CountryIdentifiers;
  diagnosisSource: MersDiagnosisSource;
  diagnosisStatus: MersDiagnosisStatus;
  id: Scalars['String']['output'];
  latitude: Scalars['Float']['output'];
  longitude: Scalars['Float']['output'];
  observationDate?: Maybe<Scalars['String']['output']>;
  reportDate: Scalars['String']['output'];
  state: Scalars['String']['output'];
  type: MersEventType;
  whoRegion?: Maybe<WhoRegion>;
};

export enum MersEventType {
  Animal = 'ANIMAL',
  Human = 'HUMAN'
}

export type MersFilterOptions = {
  __typename?: 'MersFilterOptions';
  countryIdentifiers: Array<CountryIdentifiers>;
  whoRegion: Array<WhoRegion>;
};

export enum Month {
  April = 'APRIL',
  August = 'AUGUST',
  December = 'DECEMBER',
  February = 'FEBRUARY',
  January = 'JANUARY',
  July = 'JULY',
  June = 'JUNE',
  March = 'MARCH',
  May = 'MAY',
  November = 'NOVEMBER',
  October = 'OCTOBER',
  September = 'SEPTEMBER'
}

export type MonthlySarsCov2CountryInformationEntry = {
  __typename?: 'MonthlySarsCov2CountryInformationEntry';
  alphaThreeCode: Scalars['String']['output'];
  alphaTwoCode: Scalars['String']['output'];
  gbdSubRegion?: Maybe<GbdSubRegion>;
  gbdSuperRegion?: Maybe<GbdSuperRegion>;
  month: Month;
  peopleFullyVaccinatedPerHundred?: Maybe<Scalars['Float']['output']>;
  peopleVaccinatedPerHundred?: Maybe<Scalars['Float']['output']>;
  population?: Maybe<Scalars['Int']['output']>;
  positiveCasesPerMillionPeople?: Maybe<Scalars['Float']['output']>;
  unRegion?: Maybe<UnRegion>;
  whoRegion?: Maybe<WhoRegion>;
  year: Scalars['Int']['output'];
};

export type PartitionedFaoMersEventsInput = {
  partitionKey: Scalars['Int']['input'];
};

export type PartitionedFeoMersEventsOutput = {
  __typename?: 'PartitionedFeoMersEventsOutput';
  mersEvents: Array<MersEvent>;
  partitionKey: Scalars['Int']['output'];
};

export type PartitionedMonthlySarsCov2CountryInformationInput = {
  partitionKey: Scalars['Int']['input'];
};

export type PartitionedMonthlySarsCov2CountryInformationOutput = {
  __typename?: 'PartitionedMonthlySarsCov2CountryInformationOutput';
  monthlySarsCov2CountryInformation: Array<MonthlySarsCov2CountryInformationEntry>;
  partitionKey: Scalars['Int']['output'];
};

export type PartitionedSarsCov2EstimatesInput = {
  partitionKey: Scalars['Int']['input'];
};

export type PartitionedSarsCov2EstimatesOutput = {
  __typename?: 'PartitionedSarsCov2EstimatesOutput';
  partitionKey: Scalars['Int']['output'];
  sarsCov2Estimates: Array<SarsCov2Estimate>;
};

export type PartitionedYearlyFaoCamelPopulationDataInput = {
  partitionKey: Scalars['Int']['input'];
};

export type PartitionedYearlyFaoCamelPopulationDataOutput = {
  __typename?: 'PartitionedYearlyFaoCamelPopulationDataOutput';
  partitionKey: Scalars['Int']['output'];
  yearlyFaoCamelPopulationData: Array<YearlyFaoCamelPopulationDataEntry>;
};

export type Query = {
  __typename?: 'Query';
  allFaoMersEventPartitionKeys: Array<Scalars['Int']['output']>;
  allMonthlySarsCov2CountryInformationPartitionKeys: Array<Scalars['Int']['output']>;
  allSarsCov2EstimatePartitionKeys: Array<Scalars['Int']['output']>;
  arbovirusDataStatistics: ArbovirusDataStatistics;
  arbovirusEstimates: Array<ArbovirusEstimate>;
  arbovirusFilterOptions: ArbovirusFilterOptions;
  faoMersEventFilterOptions: FaoMersEventFilterOptions;
  groupedTeamMembers: Array<TeamMemberGroup>;
  mersEstimates: Array<MersEstimate>;
  mersFilterOptions: MersFilterOptions;
  monthlySarsCov2CountryInformation: Array<MonthlySarsCov2CountryInformationEntry>;
  partitionedFaoMersEvents: PartitionedFeoMersEventsOutput;
  partitionedMonthlySarsCov2CountryInformation: PartitionedMonthlySarsCov2CountryInformationOutput;
  partitionedSarsCov2Estimates: PartitionedSarsCov2EstimatesOutput;
  partitionedYearlyFaoCamelPopulationData: PartitionedYearlyFaoCamelPopulationDataOutput;
  sarsCov2Estimates: Array<SarsCov2Estimate>;
  sarsCov2FilterOptions: SarsCov2FilterOptions;
  yearlyFaoCamelPopulationDataPartitionKeys: Array<Scalars['Int']['output']>;
};


export type QueryPartitionedFaoMersEventsArgs = {
  input: PartitionedFaoMersEventsInput;
};


export type QueryPartitionedMonthlySarsCov2CountryInformationArgs = {
  input: PartitionedMonthlySarsCov2CountryInformationInput;
};


export type QueryPartitionedSarsCov2EstimatesArgs = {
  input: PartitionedSarsCov2EstimatesInput;
};


export type QueryPartitionedYearlyFaoCamelPopulationDataArgs = {
  input: PartitionedYearlyFaoCamelPopulationDataInput;
};

export type SarsCov2Estimate = {
  __typename?: 'SarsCov2Estimate';
  ageGroup?: Maybe<Scalars['String']['output']>;
  antibodies: Array<Scalars['String']['output']>;
  city?: Maybe<Scalars['String']['output']>;
  country: Scalars['String']['output'];
  countryAlphaThreeCode: Scalars['String']['output'];
  countryAlphaTwoCode: Scalars['String']['output'];
  countryPeopleFullyVaccinatedPerHundred?: Maybe<Scalars['Float']['output']>;
  countryPeopleVaccinatedPerHundred?: Maybe<Scalars['Float']['output']>;
  countryPositiveCasesPerMillionPeople?: Maybe<Scalars['Float']['output']>;
  denominatorValue?: Maybe<Scalars['Int']['output']>;
  estimateName?: Maybe<Scalars['String']['output']>;
  gbdSubRegion?: Maybe<GbdSubRegion>;
  gbdSuperRegion?: Maybe<GbdSuperRegion>;
  id: Scalars['String']['output'];
  isWHOUnityAligned: Scalars['Boolean']['output'];
  isotypes: Array<Scalars['String']['output']>;
  latitude: Scalars['Float']['output'];
  longitude: Scalars['Float']['output'];
  numeratorValue?: Maybe<Scalars['Int']['output']>;
  populationGroup?: Maybe<Scalars['String']['output']>;
  publicationDate?: Maybe<Scalars['String']['output']>;
  riskOfBias?: Maybe<Scalars['String']['output']>;
  samplingEndDate?: Maybe<Scalars['String']['output']>;
  samplingMidDate?: Maybe<Scalars['String']['output']>;
  samplingStartDate?: Maybe<Scalars['String']['output']>;
  scope?: Maybe<Scalars['String']['output']>;
  seroprevalence?: Maybe<Scalars['Float']['output']>;
  sex?: Maybe<Scalars['String']['output']>;
  sourceType?: Maybe<Scalars['String']['output']>;
  state?: Maybe<Scalars['String']['output']>;
  studyName: Scalars['String']['output'];
  testType: Array<Scalars['String']['output']>;
  unRegion?: Maybe<UnRegion>;
  url?: Maybe<Scalars['String']['output']>;
  whoRegion?: Maybe<WhoRegion>;
};

export type SarsCov2FilterOptions = {
  __typename?: 'SarsCov2FilterOptions';
  ageGroup: Array<Scalars['String']['output']>;
  antibodies: Array<Scalars['String']['output']>;
  country: Array<Scalars['String']['output']>;
  countryIdentifiers: Array<CountryIdentifiers>;
  isotypes: Array<Scalars['String']['output']>;
  populationGroup: Array<Scalars['String']['output']>;
  riskOfBias: Array<Scalars['String']['output']>;
  scope: Array<Scalars['String']['output']>;
  sex: Array<Scalars['String']['output']>;
  sourceType: Array<Scalars['String']['output']>;
  testType: Array<Scalars['String']['output']>;
  unRegion: Array<UnRegion>;
  whoRegion: Array<WhoRegion>;
};

export type TeamMember = {
  __typename?: 'TeamMember';
  additionalSymbols: Array<TeamMemberSymbol>;
  affiliations: Array<Affiliation>;
  email?: Maybe<Scalars['String']['output']>;
  firstName: Scalars['String']['output'];
  lastName: Scalars['String']['output'];
  linkedinUrl?: Maybe<Scalars['String']['output']>;
  twitterUrl?: Maybe<Scalars['String']['output']>;
};

export type TeamMemberGroup = {
  __typename?: 'TeamMemberGroup';
  label: Scalars['String']['output'];
  teamMembers: Array<TeamMember>;
};

export enum TeamMemberSymbol {
  ArbotrackerSymbol = 'ARBOTRACKER_SYMBOL'
}

export enum UnRegion {
  AustraliaAndNewZealand = 'AUSTRALIA_AND_NEW_ZEALAND',
  Caribbean = 'CARIBBEAN',
  CentralAmerica = 'CENTRAL_AMERICA',
  CentralAsia = 'CENTRAL_ASIA',
  EasternAfrica = 'EASTERN_AFRICA',
  EasternAsia = 'EASTERN_ASIA',
  EasternEurope = 'EASTERN_EUROPE',
  Melanesia = 'MELANESIA',
  Micronesia = 'MICRONESIA',
  MiddleAfrica = 'MIDDLE_AFRICA',
  NorthernAfrica = 'NORTHERN_AFRICA',
  NorthernAmerica = 'NORTHERN_AMERICA',
  NorthernEurope = 'NORTHERN_EUROPE',
  Polynesia = 'POLYNESIA',
  SouthernAfrica = 'SOUTHERN_AFRICA',
  SouthernAsia = 'SOUTHERN_ASIA',
  SouthernEurope = 'SOUTHERN_EUROPE',
  SouthAmerica = 'SOUTH_AMERICA',
  SouthEasternAsia = 'SOUTH_EASTERN_ASIA',
  WesternAfrica = 'WESTERN_AFRICA',
  WesternAsia = 'WESTERN_ASIA',
  WesternEurope = 'WESTERN_EUROPE'
}

export enum WhoRegion {
  Afr = 'AFR',
  Amr = 'AMR',
  Emr = 'EMR',
  Eur = 'EUR',
  Sear = 'SEAR',
  Wpr = 'WPR'
}

export type YearlyFaoCamelPopulationDataEntry = {
  __typename?: 'YearlyFaoCamelPopulationDataEntry';
  camelCount: Scalars['Int']['output'];
  camelCountPerCapita?: Maybe<Scalars['Float']['output']>;
  country: CountryIdentifiers;
  countryAlphaThreeCode: Scalars['String']['output'];
  id: Scalars['String']['output'];
  note: Scalars['String']['output'];
  whoRegion?: Maybe<WhoRegion>;
  year: Scalars['Int']['output'];
};

export type AllFaoMersEventPartitionKeysQueryVariables = Exact<{ [key: string]: never; }>;


export type AllFaoMersEventPartitionKeysQuery = { __typename?: 'Query', allFaoMersEventPartitionKeys: Array<number> };

export type PartitionedFaoMersEventsQueryVariables = Exact<{
  input: PartitionedFaoMersEventsInput;
}>;


export type PartitionedFaoMersEventsQuery = { __typename?: 'Query', partitionedFaoMersEvents: { __typename?: 'PartitionedFeoMersEventsOutput', partitionKey: number, mersEvents: Array<{ __typename: 'AnimalMersEvent', id: string, type: MersEventType, diagnosisStatus: MersDiagnosisStatus, diagnosisSource: MersDiagnosisSource, state: string, city: string, latitude: number, longitude: number, whoRegion?: WhoRegion | null, observationDate?: string | null, reportDate: string, animalType: MersEventAnimalType, animalSpecies: MersEventAnimalSpecies, country: { __typename?: 'CountryIdentifiers', name: string, alphaTwoCode: string, alphaThreeCode: string } } | { __typename: 'HumanMersEvent', id: string, type: MersEventType, diagnosisStatus: MersDiagnosisStatus, diagnosisSource: MersDiagnosisSource, state: string, city: string, latitude: number, longitude: number, whoRegion?: WhoRegion | null, observationDate?: string | null, reportDate: string, humansAffected: number, humanDeaths: number, country: { __typename?: 'CountryIdentifiers', name: string, alphaTwoCode: string, alphaThreeCode: string } }> } };

export type MersEstimatesQueryVariables = Exact<{ [key: string]: never; }>;


export type MersEstimatesQuery = { __typename?: 'Query', mersEstimates: Array<{ __typename: 'MersEstimate', id: string, country: string, countryAlphaTwoCode: string, countryAlphaThreeCode: string, latitude: number, longitude: number, whoRegion?: WhoRegion | null }> };

export type MersFilterOptionsQueryVariables = Exact<{ [key: string]: never; }>;


export type MersFilterOptionsQuery = { __typename?: 'Query', mersFilterOptions: { __typename?: 'MersFilterOptions', whoRegion: Array<WhoRegion>, countryIdentifiers: Array<{ __typename?: 'CountryIdentifiers', name: string, alphaTwoCode: string, alphaThreeCode: string }> } };

export type ArbovirusEstimatesQueryQueryVariables = Exact<{ [key: string]: never; }>;


export type ArbovirusEstimatesQueryQuery = { __typename?: 'Query', arbovirusEstimates: Array<{ __typename?: 'ArbovirusEstimate', ageGroup?: string | null, ageMaximum?: number | null, ageMinimum?: number | null, antibodies: Array<string>, antigen?: string | null, assay?: string | null, assayOther?: string | null, city?: string | null, state?: string | null, country: string, countryAlphaTwoCode: string, countryAlphaThreeCode: string, createdAt: string, estimateId?: string | null, id: string, inclusionCriteria?: string | null, latitude: number, longitude: number, pathogen: Arbovirus, pediatricAgeGroup?: string | null, producer?: string | null, producerOther?: string | null, sameFrameTargetGroup?: string | null, sampleEndDate?: string | null, sampleFrame?: string | null, sampleNumerator?: number | null, sampleSize: number, sampleStartDate?: string | null, seroprevalence: number, seroprevalenceStudy95CILower?: number | null, seroprevalenceStudy95CIUpper?: number | null, seroprevalenceCalculated95CILower?: number | null, seroprevalenceCalculated95CIUpper?: number | null, serotype: Array<string>, sex?: string | null, sourceSheetId?: string | null, sourceSheetName?: string | null, unRegion?: UnRegion | null, url?: string | null, whoRegion?: string | null }> };

export type ArbovirusFilterOptionsQueryVariables = Exact<{ [key: string]: never; }>;


export type ArbovirusFilterOptionsQuery = { __typename?: 'Query', arbovirusFilterOptions: { __typename?: 'ArbovirusFilterOptions', ageGroup: Array<string>, antibody: Array<string>, assay: Array<string>, pathogen: Array<string>, pediatricAgeGroup: Array<string>, producer: Array<string>, sampleFrame: Array<string>, serotype: Array<string>, sex: Array<string>, unRegion: Array<string>, whoRegion: Array<string>, countryIdentifiers: Array<{ __typename?: 'CountryIdentifiers', name: string, alphaTwoCode: string, alphaThreeCode: string }> } };

export type ArbovirusDataStatisticsQueryVariables = Exact<{ [key: string]: never; }>;


export type ArbovirusDataStatisticsQuery = { __typename?: 'Query', arbovirusDataStatistics: { __typename?: 'ArbovirusDataStatistics', patricipantCount: number, sourceCount: number, estimateCount: number, countryCount: number } };

export type GroupedTeamMembersQueryVariables = Exact<{ [key: string]: never; }>;


export type GroupedTeamMembersQuery = { __typename?: 'Query', groupedTeamMembers: Array<{ __typename?: 'TeamMemberGroup', label: string, teamMembers: Array<{ __typename?: 'TeamMember', firstName: string, lastName: string, email?: string | null, linkedinUrl?: string | null, twitterUrl?: string | null, additionalSymbols: Array<TeamMemberSymbol>, affiliations: Array<{ __typename?: 'Affiliation', label: string }> }> }> };

export type SarsCov2EstimatesQueryVariables = Exact<{ [key: string]: never; }>;


export type SarsCov2EstimatesQuery = { __typename?: 'Query', sarsCov2Estimates: Array<{ __typename?: 'SarsCov2Estimate', antibodies: Array<string>, isotypes: Array<string>, isWHOUnityAligned: boolean, testType: Array<string>, sourceType?: string | null, riskOfBias?: string | null, populationGroup?: string | null, sex?: string | null, ageGroup?: string | null, country: string, countryAlphaTwoCode: string, countryAlphaThreeCode: string, whoRegion?: WhoRegion | null, unRegion?: UnRegion | null, gbdSuperRegion?: GbdSuperRegion | null, gbdSubRegion?: GbdSubRegion | null, state?: string | null, studyName: string, scope?: string | null, city?: string | null, id: string, latitude: number, longitude: number, samplingStartDate?: string | null, samplingEndDate?: string | null, samplingMidDate?: string | null, publicationDate?: string | null, countryPeopleVaccinatedPerHundred?: number | null, countryPeopleFullyVaccinatedPerHundred?: number | null, countryPositiveCasesPerMillionPeople?: number | null, denominatorValue?: number | null, numeratorValue?: number | null, seroprevalence?: number | null, estimateName?: string | null, url?: string | null }> };

export type SarsCov2FilterOptionsQueryVariables = Exact<{ [key: string]: never; }>;


export type SarsCov2FilterOptionsQuery = { __typename?: 'Query', sarsCov2FilterOptions: { __typename?: 'SarsCov2FilterOptions', ageGroup: Array<string>, scope: Array<string>, sourceType: Array<string>, sex: Array<string>, populationGroup: Array<string>, riskOfBias: Array<string>, unRegion: Array<UnRegion>, whoRegion: Array<WhoRegion>, antibodies: Array<string>, isotypes: Array<string>, testType: Array<string>, countryIdentifiers: Array<{ __typename?: 'CountryIdentifiers', name: string, alphaTwoCode: string, alphaThreeCode: string }> } };


export const AllFaoMersEventPartitionKeysDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"allFaoMersEventPartitionKeys"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"allFaoMersEventPartitionKeys"}}]}}]} as unknown as DocumentNode<AllFaoMersEventPartitionKeysQuery, AllFaoMersEventPartitionKeysQueryVariables>;
export const PartitionedFaoMersEventsDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"partitionedFaoMersEvents"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"input"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"PartitionedFaoMersEventsInput"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"partitionedFaoMersEvents"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"input"},"value":{"kind":"Variable","name":{"kind":"Name","value":"input"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"partitionKey"}},{"kind":"Field","name":{"kind":"Name","value":"mersEvents"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"InlineFragment","typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"AnimalMersEvent"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"__typename"}},{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"type"}},{"kind":"Field","name":{"kind":"Name","value":"diagnosisStatus"}},{"kind":"Field","name":{"kind":"Name","value":"diagnosisSource"}},{"kind":"Field","name":{"kind":"Name","value":"country"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"alphaTwoCode"}},{"kind":"Field","name":{"kind":"Name","value":"alphaThreeCode"}}]}},{"kind":"Field","name":{"kind":"Name","value":"state"}},{"kind":"Field","name":{"kind":"Name","value":"city"}},{"kind":"Field","name":{"kind":"Name","value":"latitude"}},{"kind":"Field","name":{"kind":"Name","value":"longitude"}},{"kind":"Field","name":{"kind":"Name","value":"whoRegion"}},{"kind":"Field","name":{"kind":"Name","value":"observationDate"}},{"kind":"Field","name":{"kind":"Name","value":"reportDate"}},{"kind":"Field","name":{"kind":"Name","value":"animalType"}},{"kind":"Field","name":{"kind":"Name","value":"animalSpecies"}}]}},{"kind":"InlineFragment","typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"HumanMersEvent"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"__typename"}},{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"type"}},{"kind":"Field","name":{"kind":"Name","value":"diagnosisStatus"}},{"kind":"Field","name":{"kind":"Name","value":"diagnosisSource"}},{"kind":"Field","name":{"kind":"Name","value":"country"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"alphaTwoCode"}},{"kind":"Field","name":{"kind":"Name","value":"alphaThreeCode"}}]}},{"kind":"Field","name":{"kind":"Name","value":"state"}},{"kind":"Field","name":{"kind":"Name","value":"city"}},{"kind":"Field","name":{"kind":"Name","value":"latitude"}},{"kind":"Field","name":{"kind":"Name","value":"longitude"}},{"kind":"Field","name":{"kind":"Name","value":"whoRegion"}},{"kind":"Field","name":{"kind":"Name","value":"observationDate"}},{"kind":"Field","name":{"kind":"Name","value":"reportDate"}},{"kind":"Field","name":{"kind":"Name","value":"humansAffected"}},{"kind":"Field","name":{"kind":"Name","value":"humanDeaths"}}]}}]}}]}}]}}]} as unknown as DocumentNode<PartitionedFaoMersEventsQuery, PartitionedFaoMersEventsQueryVariables>;
export const MersEstimatesDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"mersEstimates"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"mersEstimates"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"__typename"}},{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"country"}},{"kind":"Field","name":{"kind":"Name","value":"countryAlphaTwoCode"}},{"kind":"Field","name":{"kind":"Name","value":"countryAlphaThreeCode"}},{"kind":"Field","name":{"kind":"Name","value":"latitude"}},{"kind":"Field","name":{"kind":"Name","value":"longitude"}},{"kind":"Field","name":{"kind":"Name","value":"whoRegion"}}]}}]}}]} as unknown as DocumentNode<MersEstimatesQuery, MersEstimatesQueryVariables>;
export const MersFilterOptionsDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"mersFilterOptions"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"mersFilterOptions"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"countryIdentifiers"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"alphaTwoCode"}},{"kind":"Field","name":{"kind":"Name","value":"alphaThreeCode"}}]}},{"kind":"Field","name":{"kind":"Name","value":"whoRegion"}}]}}]}}]} as unknown as DocumentNode<MersFilterOptionsQuery, MersFilterOptionsQueryVariables>;
export const ArbovirusEstimatesQueryDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"arbovirusEstimatesQuery"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"arbovirusEstimates"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"ageGroup"}},{"kind":"Field","name":{"kind":"Name","value":"ageMaximum"}},{"kind":"Field","name":{"kind":"Name","value":"ageMinimum"}},{"kind":"Field","name":{"kind":"Name","value":"antibodies"}},{"kind":"Field","name":{"kind":"Name","value":"antigen"}},{"kind":"Field","name":{"kind":"Name","value":"assay"}},{"kind":"Field","name":{"kind":"Name","value":"assayOther"}},{"kind":"Field","name":{"kind":"Name","value":"city"}},{"kind":"Field","name":{"kind":"Name","value":"state"}},{"kind":"Field","name":{"kind":"Name","value":"country"}},{"kind":"Field","name":{"kind":"Name","value":"countryAlphaTwoCode"}},{"kind":"Field","name":{"kind":"Name","value":"countryAlphaThreeCode"}},{"kind":"Field","name":{"kind":"Name","value":"createdAt"}},{"kind":"Field","name":{"kind":"Name","value":"estimateId"}},{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"inclusionCriteria"}},{"kind":"Field","name":{"kind":"Name","value":"latitude"}},{"kind":"Field","name":{"kind":"Name","value":"longitude"}},{"kind":"Field","name":{"kind":"Name","value":"pathogen"}},{"kind":"Field","name":{"kind":"Name","value":"pediatricAgeGroup"}},{"kind":"Field","name":{"kind":"Name","value":"producer"}},{"kind":"Field","name":{"kind":"Name","value":"producerOther"}},{"kind":"Field","name":{"kind":"Name","value":"sameFrameTargetGroup"}},{"kind":"Field","name":{"kind":"Name","value":"sampleEndDate"}},{"kind":"Field","name":{"kind":"Name","value":"sampleFrame"}},{"kind":"Field","name":{"kind":"Name","value":"sampleNumerator"}},{"kind":"Field","name":{"kind":"Name","value":"sampleSize"}},{"kind":"Field","name":{"kind":"Name","value":"sampleStartDate"}},{"kind":"Field","name":{"kind":"Name","value":"seroprevalence"}},{"kind":"Field","name":{"kind":"Name","value":"seroprevalenceStudy95CILower"}},{"kind":"Field","name":{"kind":"Name","value":"seroprevalenceStudy95CIUpper"}},{"kind":"Field","name":{"kind":"Name","value":"seroprevalenceCalculated95CILower"}},{"kind":"Field","name":{"kind":"Name","value":"seroprevalenceCalculated95CIUpper"}},{"kind":"Field","name":{"kind":"Name","value":"serotype"}},{"kind":"Field","name":{"kind":"Name","value":"sex"}},{"kind":"Field","name":{"kind":"Name","value":"sourceSheetId"}},{"kind":"Field","name":{"kind":"Name","value":"sourceSheetName"}},{"kind":"Field","name":{"kind":"Name","value":"unRegion"}},{"kind":"Field","name":{"kind":"Name","value":"url"}},{"kind":"Field","name":{"kind":"Name","value":"whoRegion"}}]}}]}}]} as unknown as DocumentNode<ArbovirusEstimatesQueryQuery, ArbovirusEstimatesQueryQueryVariables>;
export const ArbovirusFilterOptionsDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"arbovirusFilterOptions"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"arbovirusFilterOptions"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"ageGroup"}},{"kind":"Field","name":{"kind":"Name","value":"antibody"}},{"kind":"Field","name":{"kind":"Name","value":"assay"}},{"kind":"Field","name":{"kind":"Name","value":"pathogen"}},{"kind":"Field","name":{"kind":"Name","value":"pediatricAgeGroup"}},{"kind":"Field","name":{"kind":"Name","value":"producer"}},{"kind":"Field","name":{"kind":"Name","value":"sampleFrame"}},{"kind":"Field","name":{"kind":"Name","value":"serotype"}},{"kind":"Field","name":{"kind":"Name","value":"sex"}},{"kind":"Field","name":{"kind":"Name","value":"unRegion"}},{"kind":"Field","name":{"kind":"Name","value":"whoRegion"}},{"kind":"Field","name":{"kind":"Name","value":"countryIdentifiers"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"alphaTwoCode"}},{"kind":"Field","name":{"kind":"Name","value":"alphaThreeCode"}}]}}]}}]}}]} as unknown as DocumentNode<ArbovirusFilterOptionsQuery, ArbovirusFilterOptionsQueryVariables>;
export const ArbovirusDataStatisticsDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"arbovirusDataStatistics"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"arbovirusDataStatistics"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"patricipantCount"}},{"kind":"Field","name":{"kind":"Name","value":"sourceCount"}},{"kind":"Field","name":{"kind":"Name","value":"estimateCount"}},{"kind":"Field","name":{"kind":"Name","value":"countryCount"}}]}}]}}]} as unknown as DocumentNode<ArbovirusDataStatisticsQuery, ArbovirusDataStatisticsQueryVariables>;
export const GroupedTeamMembersDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"groupedTeamMembers"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"groupedTeamMembers"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"label"}},{"kind":"Field","name":{"kind":"Name","value":"teamMembers"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"firstName"}},{"kind":"Field","name":{"kind":"Name","value":"lastName"}},{"kind":"Field","name":{"kind":"Name","value":"email"}},{"kind":"Field","name":{"kind":"Name","value":"linkedinUrl"}},{"kind":"Field","name":{"kind":"Name","value":"twitterUrl"}},{"kind":"Field","name":{"kind":"Name","value":"affiliations"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"label"}}]}},{"kind":"Field","name":{"kind":"Name","value":"additionalSymbols"}}]}}]}}]}}]} as unknown as DocumentNode<GroupedTeamMembersQuery, GroupedTeamMembersQueryVariables>;
export const SarsCov2EstimatesDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"sarsCov2Estimates"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"sarsCov2Estimates"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"antibodies"}},{"kind":"Field","name":{"kind":"Name","value":"isotypes"}},{"kind":"Field","name":{"kind":"Name","value":"isWHOUnityAligned"}},{"kind":"Field","name":{"kind":"Name","value":"testType"}},{"kind":"Field","name":{"kind":"Name","value":"sourceType"}},{"kind":"Field","name":{"kind":"Name","value":"riskOfBias"}},{"kind":"Field","name":{"kind":"Name","value":"populationGroup"}},{"kind":"Field","name":{"kind":"Name","value":"sex"}},{"kind":"Field","name":{"kind":"Name","value":"ageGroup"}},{"kind":"Field","name":{"kind":"Name","value":"country"}},{"kind":"Field","name":{"kind":"Name","value":"countryAlphaTwoCode"}},{"kind":"Field","name":{"kind":"Name","value":"countryAlphaThreeCode"}},{"kind":"Field","name":{"kind":"Name","value":"whoRegion"}},{"kind":"Field","name":{"kind":"Name","value":"unRegion"}},{"kind":"Field","name":{"kind":"Name","value":"gbdSuperRegion"}},{"kind":"Field","name":{"kind":"Name","value":"gbdSubRegion"}},{"kind":"Field","name":{"kind":"Name","value":"state"}},{"kind":"Field","name":{"kind":"Name","value":"studyName"}},{"kind":"Field","name":{"kind":"Name","value":"scope"}},{"kind":"Field","name":{"kind":"Name","value":"city"}},{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"latitude"}},{"kind":"Field","name":{"kind":"Name","value":"longitude"}},{"kind":"Field","name":{"kind":"Name","value":"samplingStartDate"}},{"kind":"Field","name":{"kind":"Name","value":"samplingEndDate"}},{"kind":"Field","name":{"kind":"Name","value":"samplingMidDate"}},{"kind":"Field","name":{"kind":"Name","value":"publicationDate"}},{"kind":"Field","name":{"kind":"Name","value":"countryPeopleVaccinatedPerHundred"}},{"kind":"Field","name":{"kind":"Name","value":"countryPeopleFullyVaccinatedPerHundred"}},{"kind":"Field","name":{"kind":"Name","value":"countryPositiveCasesPerMillionPeople"}},{"kind":"Field","name":{"kind":"Name","value":"denominatorValue"}},{"kind":"Field","name":{"kind":"Name","value":"numeratorValue"}},{"kind":"Field","name":{"kind":"Name","value":"seroprevalence"}},{"kind":"Field","name":{"kind":"Name","value":"estimateName"}},{"kind":"Field","name":{"kind":"Name","value":"url"}}]}}]}}]} as unknown as DocumentNode<SarsCov2EstimatesQuery, SarsCov2EstimatesQueryVariables>;
export const SarsCov2FilterOptionsDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"sarsCov2FilterOptions"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"sarsCov2FilterOptions"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"ageGroup"}},{"kind":"Field","name":{"kind":"Name","value":"scope"}},{"kind":"Field","name":{"kind":"Name","value":"sourceType"}},{"kind":"Field","name":{"kind":"Name","value":"sex"}},{"kind":"Field","name":{"kind":"Name","value":"populationGroup"}},{"kind":"Field","name":{"kind":"Name","value":"riskOfBias"}},{"kind":"Field","name":{"kind":"Name","value":"unRegion"}},{"kind":"Field","name":{"kind":"Name","value":"whoRegion"}},{"kind":"Field","name":{"kind":"Name","value":"antibodies"}},{"kind":"Field","name":{"kind":"Name","value":"isotypes"}},{"kind":"Field","name":{"kind":"Name","value":"testType"}},{"kind":"Field","name":{"kind":"Name","value":"countryIdentifiers"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"alphaTwoCode"}},{"kind":"Field","name":{"kind":"Name","value":"alphaThreeCode"}}]}}]}}]}}]} as unknown as DocumentNode<SarsCov2FilterOptionsQuery, SarsCov2FilterOptionsQueryVariables>;