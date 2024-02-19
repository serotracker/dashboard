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

export function useGroupedTeamMemberData() {
  return useQuery<any>({
    queryKey: ["groupedTeamMembersQuery"],
    queryFn: () => request(process.env.NEXT_PUBLIC_API_GRAPHQL_URL ?? '', groupedTeamMembersQuery)
  });
}
