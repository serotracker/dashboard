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
    queryFn: () => request('http://99.79.39.159:3000/api/graphql' ?? '', groupedTeamMembers)
  });
}
