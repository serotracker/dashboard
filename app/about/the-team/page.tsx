"use client";
import { useContext, useEffect } from "react";
import { useGroupedTeamMemberData } from "@/hooks/useGroupedTeamMemberData";
import { Linkedin, Mail, Twitter } from "lucide-react";
import { useHydrate } from "@tanstack/react-query";

interface TeamInfo {
  label: string;
  teamMembers: TeamMember[];
}

interface TeamMember {
  firstName: string;
  lastName: string;
  email: string | null | undefined;
  linkedinUrl: string | null | undefined;
  twitterUrl: string | null | undefined;
  affiliations: Array<{
    label: string;
  }>
}

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
      <div className="flex flex-row mt-2">
        {props.teamMember.linkedinUrl ? (
        <a className="pr-2 text-link" href={props.teamMember.linkedinUrl} target="_blank" rel="noopener noreferrer">
            <Linkedin />
        </a>
        ) : null}
        {props.teamMember.twitterUrl ? (
        <a className="pr-2 text-link" href={props.teamMember.twitterUrl} target="_blank" rel="noopener noreferrer">
            <Twitter />
        </a>
        ) : null}
        {props.teamMember.email ? (
        <a className="pr-2 text-link" href={`mailto:${props.teamMember.email}`}>
            <Mail />
        </a>
        ) : null}
      </div>
    </div>
  )
}

interface TeamInfoCardProps {
  teamInfo: TeamInfo;
}

const TeamCard = (props: TeamInfoCardProps) => {
  return (
    <div>
      <h2 className="italic text-3xl my-8"> {props.teamInfo.label} </h2>
      <div className='grid grid-cols-3 gap-x-6 gap-y-8'>
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
