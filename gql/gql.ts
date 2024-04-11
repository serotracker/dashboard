/* eslint-disable */
import * as types from './graphql';
import { TypedDocumentNode as DocumentNode } from '@graphql-typed-document-node/core';

/**
 * Map of all GraphQL operations in the project.
 *
 * This map has several performance disadvantages:
 * 1. It is not tree-shakeable, so it will include all operations in the project.
 * 2. It is not minifiable, so the string of a GraphQL query will be multiple times inside the bundle.
 * 3. It does not support dead code elimination, so it will add unused operations.
 *
 * Therefore it is highly recommended to use the babel or swc plugin for production.
 */
const documents = {
    "\n  query arbovirusEstimatesQuery {\n    arbovirusEstimates {\n      ageGroup\n      ageMaximum\n      ageMinimum\n      antibodies\n      antigen\n      assay\n      assayOther\n      city\n      state\n      country\n      createdAt\n      estimateId\n      id\n      inclusionCriteria\n      latitude\n      longitude\n      pathogen\n      pediatricAgeGroup\n      producer\n      producerOther\n      sameFrameTargetGroup\n      sampleEndDate\n      sampleFrame\n      sampleNumerator\n      sampleSize\n      sampleStartDate\n      seroprevalence\n      seroprevalenceStudy95CILower\n      seroprevalenceStudy95CIUpper\n      seroprevalenceCalculated95CILower\n      seroprevalenceCalculated95CIUpper\n      serotype\n      sex\n      sourceSheetId\n      sourceSheetName\n      unRegion\n      url\n      whoRegion\n    }\n  }\n": types.ArbovirusEstimatesQueryDocument,
    "\n  query arbovirusFilterOptions {\n    arbovirusFilterOptions {\n      ageGroup\n      antibody\n      assay\n      country\n      pathogen\n      pediatricAgeGroup\n      producer\n      sampleFrame\n      serotype\n      sex\n      unRegion\n      whoRegion\n    }\n  }\n": types.ArbovirusFilterOptionsDocument,
    "\n  query arbovirusDataStatistics {\n    arbovirusDataStatistics {\n        patricipantCount,\n        sourceCount,\n        estimateCount,\n        countryCount\n    }\n  }\n": types.ArbovirusDataStatisticsDocument,
    "\n  query groupedTeamMembers {\n    groupedTeamMembers {\n      label\n      teamMembers {\n        firstName\n        lastName\n        email\n        linkedinUrl\n        twitterUrl\n        affiliations {\n          label\n        }\n        additionalSymbols\n      }\n    }\n  }\n": types.GroupedTeamMembersDocument,
};

/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 *
 *
 * @example
 * ```ts
 * const query = graphql(`query GetUser($id: ID!) { user(id: $id) { name } }`);
 * ```
 *
 * The query argument is unknown!
 * Please regenerate the types.
 */
export function graphql(source: string): unknown;

/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n  query arbovirusEstimatesQuery {\n    arbovirusEstimates {\n      ageGroup\n      ageMaximum\n      ageMinimum\n      antibodies\n      antigen\n      assay\n      assayOther\n      city\n      state\n      country\n      createdAt\n      estimateId\n      id\n      inclusionCriteria\n      latitude\n      longitude\n      pathogen\n      pediatricAgeGroup\n      producer\n      producerOther\n      sameFrameTargetGroup\n      sampleEndDate\n      sampleFrame\n      sampleNumerator\n      sampleSize\n      sampleStartDate\n      seroprevalence\n      seroprevalenceStudy95CILower\n      seroprevalenceStudy95CIUpper\n      seroprevalenceCalculated95CILower\n      seroprevalenceCalculated95CIUpper\n      serotype\n      sex\n      sourceSheetId\n      sourceSheetName\n      unRegion\n      url\n      whoRegion\n    }\n  }\n"): (typeof documents)["\n  query arbovirusEstimatesQuery {\n    arbovirusEstimates {\n      ageGroup\n      ageMaximum\n      ageMinimum\n      antibodies\n      antigen\n      assay\n      assayOther\n      city\n      state\n      country\n      createdAt\n      estimateId\n      id\n      inclusionCriteria\n      latitude\n      longitude\n      pathogen\n      pediatricAgeGroup\n      producer\n      producerOther\n      sameFrameTargetGroup\n      sampleEndDate\n      sampleFrame\n      sampleNumerator\n      sampleSize\n      sampleStartDate\n      seroprevalence\n      seroprevalenceStudy95CILower\n      seroprevalenceStudy95CIUpper\n      seroprevalenceCalculated95CILower\n      seroprevalenceCalculated95CIUpper\n      serotype\n      sex\n      sourceSheetId\n      sourceSheetName\n      unRegion\n      url\n      whoRegion\n    }\n  }\n"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n  query arbovirusFilterOptions {\n    arbovirusFilterOptions {\n      ageGroup\n      antibody\n      assay\n      country\n      pathogen\n      pediatricAgeGroup\n      producer\n      sampleFrame\n      serotype\n      sex\n      unRegion\n      whoRegion\n    }\n  }\n"): (typeof documents)["\n  query arbovirusFilterOptions {\n    arbovirusFilterOptions {\n      ageGroup\n      antibody\n      assay\n      country\n      pathogen\n      pediatricAgeGroup\n      producer\n      sampleFrame\n      serotype\n      sex\n      unRegion\n      whoRegion\n    }\n  }\n"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n  query arbovirusDataStatistics {\n    arbovirusDataStatistics {\n        patricipantCount,\n        sourceCount,\n        estimateCount,\n        countryCount\n    }\n  }\n"): (typeof documents)["\n  query arbovirusDataStatistics {\n    arbovirusDataStatistics {\n        patricipantCount,\n        sourceCount,\n        estimateCount,\n        countryCount\n    }\n  }\n"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n  query groupedTeamMembers {\n    groupedTeamMembers {\n      label\n      teamMembers {\n        firstName\n        lastName\n        email\n        linkedinUrl\n        twitterUrl\n        affiliations {\n          label\n        }\n        additionalSymbols\n      }\n    }\n  }\n"): (typeof documents)["\n  query groupedTeamMembers {\n    groupedTeamMembers {\n      label\n      teamMembers {\n        firstName\n        lastName\n        email\n        linkedinUrl\n        twitterUrl\n        affiliations {\n          label\n        }\n        additionalSymbols\n      }\n    }\n  }\n"];

export function graphql(source: string) {
  return (documents as any)[source] ?? {};
}

export type DocumentType<TDocumentNode extends DocumentNode<any, any>> = TDocumentNode extends DocumentNode<  infer TType,  any>  ? TType  : never;