import { useQuery } from "@tanstack/react-query";
import { gql } from "@apollo/client";
import { request } from 'graphql-request';
import { GroupedTeamMembersQuery } from "@/gql/graphql";

export const groupedTeamMembers = gql`
  query groupedTeamMembers {
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
        additionalSymbols
      }
    }
  }
`

export function useGroupedTeamMemberData() {
  return useQuery<GroupedTeamMembersQuery>({
    queryKey: ["groupedTeamMembersQuery"],
    queryFn: () => request(process.env.NEXT_PUBLIC_API_GRAPHQL_URL ?? '', groupedTeamMembers)
  });
}
