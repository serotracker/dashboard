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
  countryAlphaTwoCode: Scalars['String']['output'];
  createdAt: Scalars['String']['output'];
  estimateId?: Maybe<Scalars['String']['output']>;
  id: Scalars['String']['output'];
  inclusionCriteria?: Maybe<Scalars['String']['output']>;
  latitude: Scalars['Float']['output'];
  longitude: Scalars['Float']['output'];
  pathogen: Scalars['String']['output'];
  pediatricAgeGroup?: Maybe<Scalars['String']['output']>;
  producer?: Maybe<Scalars['String']['output']>;
  producerOther?: Maybe<Scalars['String']['output']>;
  sameFrameTargetGroup?: Maybe<Scalars['String']['output']>;
  sampleEndDate?: Maybe<Scalars['String']['output']>;
  sampleFrame?: Maybe<Scalars['String']['output']>;
  sampleNumerator?: Maybe<Scalars['Int']['output']>;
  sampleSize: Scalars['Int']['output'];
  sampleStartDate?: Maybe<Scalars['String']['output']>;
  seroprevalence?: Maybe<Scalars['Float']['output']>;
  seroprevalenceCalculated95CILower?: Maybe<Scalars['Float']['output']>;
  seroprevalenceCalculated95CIUpper?: Maybe<Scalars['Float']['output']>;
  seroprevalenceStudy95CILower?: Maybe<Scalars['Float']['output']>;
  seroprevalenceStudy95CIUpper?: Maybe<Scalars['Float']['output']>;
  serotype: Array<Scalars['String']['output']>;
  sex?: Maybe<Scalars['String']['output']>;
  sourceSheetId?: Maybe<Scalars['String']['output']>;
  sourceSheetName?: Maybe<Scalars['String']['output']>;
  state?: Maybe<Scalars['String']['output']>;
  unRegion?: Maybe<Scalars['String']['output']>;
  url?: Maybe<Scalars['String']['output']>;
  whoRegion?: Maybe<Scalars['String']['output']>;
};

export type ArbovirusFilterOptions = {
  __typename?: 'ArbovirusFilterOptions';
  ageGroup: Array<Scalars['String']['output']>;
  antibody: Array<Scalars['String']['output']>;
  assay: Array<Scalars['String']['output']>;
  country: Array<Scalars['String']['output']>;
  pathogen: Array<Scalars['String']['output']>;
  pediatricAgeGroup: Array<Scalars['String']['output']>;
  producer: Array<Scalars['String']['output']>;
  sampleFrame: Array<Scalars['String']['output']>;
  serotype: Array<Scalars['String']['output']>;
  sex: Array<Scalars['String']['output']>;
  unRegion: Array<Scalars['String']['output']>;
  whoRegion: Array<Scalars['String']['output']>;
};

export type Query = {
  __typename?: 'Query';
  arbovirusDataStatistics: ArbovirusDataStatistics;
  arbovirusEstimates: Array<ArbovirusEstimate>;
  arbovirusFilterOptions?: Maybe<ArbovirusFilterOptions>;
  groupedTeamMembers: Array<TeamMemberGroup>;
};

export type TeamMember = {
  __typename?: 'TeamMember';
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

export type ArbovirusEstimatesQueryQueryVariables = Exact<{ [key: string]: never; }>;


export type ArbovirusEstimatesQueryQuery = { __typename?: 'Query', arbovirusEstimates: Array<{ __typename?: 'ArbovirusEstimate', ageGroup?: string | null, ageMaximum?: number | null, ageMinimum?: number | null, antibodies: Array<string>, antigen?: string | null, assay?: string | null, assayOther?: string | null, city?: string | null, state?: string | null, country: string, createdAt: string, estimateId?: string | null, id: string, inclusionCriteria?: string | null, latitude: number, longitude: number, pathogen: string, pediatricAgeGroup?: string | null, producer?: string | null, producerOther?: string | null, sameFrameTargetGroup?: string | null, sampleEndDate?: string | null, sampleFrame?: string | null, sampleNumerator?: number | null, sampleSize: number, sampleStartDate?: string | null, seroprevalence?: number | null, seroprevalenceStudy95CILower?: number | null, seroprevalenceStudy95CIUpper?: number | null, seroprevalenceCalculated95CILower?: number | null, seroprevalenceCalculated95CIUpper?: number | null, serotype: Array<string>, sex?: string | null, sourceSheetId?: string | null, sourceSheetName?: string | null, unRegion?: string | null, url?: string | null, whoRegion?: string | null }> };

export type ArbovirusFilterOptionsQueryVariables = Exact<{ [key: string]: never; }>;


export type ArbovirusFilterOptionsQuery = { __typename?: 'Query', arbovirusFilterOptions?: { __typename?: 'ArbovirusFilterOptions', ageGroup: Array<string>, antibody: Array<string>, assay: Array<string>, country: Array<string>, pathogen: Array<string>, pediatricAgeGroup: Array<string>, producer: Array<string>, sampleFrame: Array<string>, serotype: Array<string>, sex: Array<string>, unRegion: Array<string>, whoRegion: Array<string> } | null };

export type ArbovirusDataStatisticsQueryVariables = Exact<{ [key: string]: never; }>;


export type ArbovirusDataStatisticsQuery = { __typename?: 'Query', arbovirusDataStatistics: { __typename?: 'ArbovirusDataStatistics', patricipantCount: number, sourceCount: number, estimateCount: number, countryCount: number } };

export type GroupedTeamMembersQueryVariables = Exact<{ [key: string]: never; }>;


export type GroupedTeamMembersQuery = { __typename?: 'Query', groupedTeamMembers: Array<{ __typename?: 'TeamMemberGroup', label: string, teamMembers: Array<{ __typename?: 'TeamMember', firstName: string, lastName: string, email?: string | null, linkedinUrl?: string | null, twitterUrl?: string | null, affiliations: Array<{ __typename?: 'Affiliation', label: string }> }> }> };


export const ArbovirusEstimatesQueryDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"arbovirusEstimatesQuery"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"arbovirusEstimates"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"ageGroup"}},{"kind":"Field","name":{"kind":"Name","value":"ageMaximum"}},{"kind":"Field","name":{"kind":"Name","value":"ageMinimum"}},{"kind":"Field","name":{"kind":"Name","value":"antibodies"}},{"kind":"Field","name":{"kind":"Name","value":"antigen"}},{"kind":"Field","name":{"kind":"Name","value":"assay"}},{"kind":"Field","name":{"kind":"Name","value":"assayOther"}},{"kind":"Field","name":{"kind":"Name","value":"city"}},{"kind":"Field","name":{"kind":"Name","value":"state"}},{"kind":"Field","name":{"kind":"Name","value":"country"}},{"kind":"Field","name":{"kind":"Name","value":"createdAt"}},{"kind":"Field","name":{"kind":"Name","value":"estimateId"}},{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"inclusionCriteria"}},{"kind":"Field","name":{"kind":"Name","value":"latitude"}},{"kind":"Field","name":{"kind":"Name","value":"longitude"}},{"kind":"Field","name":{"kind":"Name","value":"pathogen"}},{"kind":"Field","name":{"kind":"Name","value":"pediatricAgeGroup"}},{"kind":"Field","name":{"kind":"Name","value":"producer"}},{"kind":"Field","name":{"kind":"Name","value":"producerOther"}},{"kind":"Field","name":{"kind":"Name","value":"sameFrameTargetGroup"}},{"kind":"Field","name":{"kind":"Name","value":"sampleEndDate"}},{"kind":"Field","name":{"kind":"Name","value":"sampleFrame"}},{"kind":"Field","name":{"kind":"Name","value":"sampleNumerator"}},{"kind":"Field","name":{"kind":"Name","value":"sampleSize"}},{"kind":"Field","name":{"kind":"Name","value":"sampleStartDate"}},{"kind":"Field","name":{"kind":"Name","value":"seroprevalence"}},{"kind":"Field","name":{"kind":"Name","value":"seroprevalenceStudy95CILower"}},{"kind":"Field","name":{"kind":"Name","value":"seroprevalenceStudy95CIUpper"}},{"kind":"Field","name":{"kind":"Name","value":"seroprevalenceCalculated95CILower"}},{"kind":"Field","name":{"kind":"Name","value":"seroprevalenceCalculated95CIUpper"}},{"kind":"Field","name":{"kind":"Name","value":"serotype"}},{"kind":"Field","name":{"kind":"Name","value":"sex"}},{"kind":"Field","name":{"kind":"Name","value":"sourceSheetId"}},{"kind":"Field","name":{"kind":"Name","value":"sourceSheetName"}},{"kind":"Field","name":{"kind":"Name","value":"unRegion"}},{"kind":"Field","name":{"kind":"Name","value":"url"}},{"kind":"Field","name":{"kind":"Name","value":"whoRegion"}}]}}]}}]} as unknown as DocumentNode<ArbovirusEstimatesQueryQuery, ArbovirusEstimatesQueryQueryVariables>;
export const ArbovirusFilterOptionsDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"arbovirusFilterOptions"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"arbovirusFilterOptions"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"ageGroup"}},{"kind":"Field","name":{"kind":"Name","value":"antibody"}},{"kind":"Field","name":{"kind":"Name","value":"assay"}},{"kind":"Field","name":{"kind":"Name","value":"country"}},{"kind":"Field","name":{"kind":"Name","value":"pathogen"}},{"kind":"Field","name":{"kind":"Name","value":"pediatricAgeGroup"}},{"kind":"Field","name":{"kind":"Name","value":"producer"}},{"kind":"Field","name":{"kind":"Name","value":"sampleFrame"}},{"kind":"Field","name":{"kind":"Name","value":"serotype"}},{"kind":"Field","name":{"kind":"Name","value":"sex"}},{"kind":"Field","name":{"kind":"Name","value":"unRegion"}},{"kind":"Field","name":{"kind":"Name","value":"whoRegion"}}]}}]}}]} as unknown as DocumentNode<ArbovirusFilterOptionsQuery, ArbovirusFilterOptionsQueryVariables>;
export const ArbovirusDataStatisticsDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"arbovirusDataStatistics"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"arbovirusDataStatistics"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"patricipantCount"}},{"kind":"Field","name":{"kind":"Name","value":"sourceCount"}},{"kind":"Field","name":{"kind":"Name","value":"estimateCount"}},{"kind":"Field","name":{"kind":"Name","value":"countryCount"}}]}}]}}]} as unknown as DocumentNode<ArbovirusDataStatisticsQuery, ArbovirusDataStatisticsQueryVariables>;
export const GroupedTeamMembersDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"groupedTeamMembers"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"groupedTeamMembers"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"label"}},{"kind":"Field","name":{"kind":"Name","value":"teamMembers"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"firstName"}},{"kind":"Field","name":{"kind":"Name","value":"lastName"}},{"kind":"Field","name":{"kind":"Name","value":"email"}},{"kind":"Field","name":{"kind":"Name","value":"linkedinUrl"}},{"kind":"Field","name":{"kind":"Name","value":"twitterUrl"}},{"kind":"Field","name":{"kind":"Name","value":"affiliations"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"label"}}]}}]}}]}}]}}]} as unknown as DocumentNode<GroupedTeamMembersQuery, GroupedTeamMembersQueryVariables>;