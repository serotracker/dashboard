"use client";
import { GroupedTeamMembersQuery } from "@/gql/graphql";
import { useGroupedTeamMemberData } from "@/hooks/useGroupedTeamMemberData";
import { faLinkedin, faTwitter } from "@fortawesome/free-brands-svg-icons";
import { faEnvelope } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Linkedin, Mail, Twitter } from "lucide-react";
import Image from "next/image";
import Link from "next/link";

type TeamMember = GroupedTeamMembersQuery['groupedTeamMembers'][number]["teamMembers"][number]
type TeamMemberGroup = GroupedTeamMembersQuery['groupedTeamMembers'][number]

interface TeamMemberInfoCardProps {
  teamMember: TeamMember;
}

const TeamMemberInfoCard = (props: TeamMemberInfoCardProps) => {
  return (
    <div> 
      <b> {`${props.teamMember.firstName} ${props.teamMember.lastName}`} </b>
      {props.teamMember.affiliations.map((affiliation) => 
        <p key={`${props.teamMember.firstName}-${props.teamMember.lastName}-${affiliation.label}`}> {affiliation.label} </p>
      )}
      <div className="flex flex-row">
        {props.teamMember.linkedinUrl ? (
        <Link className="mr-2" href={props.teamMember.linkedinUrl} target="_blank" rel="noopener noreferrer">
          <FontAwesomeIcon icon={faLinkedin} className="text-linkedin-icon"/>
        </Link>
        ) : null}
        {props.teamMember.twitterUrl ? (
        <Link className="mr-2" href={props.teamMember.twitterUrl} target="_blank" rel="noopener noreferrer">
          <FontAwesomeIcon icon={faTwitter} className="text-twitter-icon"/>
        </Link>
        ) : null}
        {props.teamMember.email ? (
        <Link className="mr-2" href={`mailto:${props.teamMember.email}`}>
          <FontAwesomeIcon icon={faEnvelope} className="text-email-icon"/>
        </Link>
        ) : null}
      </div>
    </div>
  )
}

interface TeamInfoCardProps {
  teamInfo: TeamMemberGroup;
}

const TeamCard = (props: TeamInfoCardProps) => {
  return (
    <div className="mb-6">
      <h2 className="italic text-3xl mt-7 mb-5"> {props.teamInfo.label} </h2>
      <div className='grid grid-cols-3 gap-x-4 gap-y-6'>
        {props.teamInfo.teamMembers.map((teamMember) =>
          <TeamMemberInfoCard key={`${teamMember.firstName}-${teamMember.lastName}`} teamMember={teamMember} />
        )}
      </div>
    </div>
  )
}

export default function TeamPage() {
  const { data } = useGroupedTeamMemberData();

  return (
    <div className='mb-6'>
      <h1 className="font-bold text-4xl mt-4"> Our Team </h1>
      {(data?.groupedTeamMembers ?? []).map((team) => 
        <TeamCard teamInfo={team} key={team.label} />
      )}
    </div>
  );
}
