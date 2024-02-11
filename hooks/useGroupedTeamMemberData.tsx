import { useQuery } from "@tanstack/react-query";
import { gql } from "@apollo/client";
import { request } from 'graphql-request';

export const groupedTeamMembersQuery = gql`
  query groupedTeamMembersQuery {
    groupedTeamMembers {
      label
      teamMembers {
        firstName
        lastName
        email
        linkedinUrl
        twitterUrl
        affiliations {
          label
        }
      }
    }
  }
`

interface GroupedTeamMembersQuery {
  groupedTeamMembers: Array<{
    label: string;
    teamMembers: Array<{
      firstName: string;
      lastName: string;
      email: string | null | undefined;
      linkedinUrl: string | null | undefined;
      twitterUrl: string | null | undefined;
      affiliations: Array<{
        label: string;
      }>
    }>
  }>
}

export function useGroupedTeamMemberData() {
  return useQuery<GroupedTeamMembersQuery>({
    queryKey: ["groupedTeamMembersQuery"],
    queryFn: () => request(process.env.NEXT_PUBLIC_API_GRAPHQL_URL ?? '', groupedTeamMembersQuery)
  });
}
