"use client";

import React from "react";
import { GroupedTeamMembersQuery, TeamMemberSymbol } from "@/gql/graphql";
import { useGroupedTeamMemberData } from "@/hooks/useGroupedTeamMemberData";
import { faLinkedin, faTwitter } from "@fortawesome/free-brands-svg-icons";
import { IconDefinition, faEnvelope } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faMosquito,
} from "@fortawesome/free-solid-svg-icons";
import Link from "next/link";

type TeamMember = GroupedTeamMembersQuery['groupedTeamMembers'][number]["teamMembers"][number]
type TeamMemberGroup = GroupedTeamMembersQuery['groupedTeamMembers'][number]

interface TeamMemberInfoCardProps {
  teamMember: TeamMember;
}

const teamMemberSymbolToFontAwesomeIconMap: {[key in TeamMemberSymbol]: IconDefinition} = {
  [TeamMemberSymbol.ArbotrackerSymbol]: faMosquito
}

const TeamMemberInfoCard = (props: TeamMemberInfoCardProps) => {
  return (
    <div className="mb-4 lg:mb-0 mr-4"> 
      <div className="flex justify-between">
        <p className="font-semibold"> {`${props.teamMember.firstName} ${props.teamMember.lastName}`} </p>
        <div>
          {props.teamMember.additionalSymbols.map((symbolName) => (
            <div className="rounded-full bg-arbovirus" key={`${props.teamMember.firstName}-${props.teamMember.lastName}-${symbolName}`}>
              <FontAwesomeIcon
                icon={teamMemberSymbolToFontAwesomeIconMap[symbolName]}
                width={24}
                height={24}
                className={"text-white"}
              />
            </div>
          ))}
        </div>
      </div>
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
    <div className="mb-0 lg:mb-4 py-2">
      <h3 className="my-4 border-b border-background"> {props.teamInfo.label} </h3>
      <div className='flex-col flex lg:grid lg:grid-cols-4 lg:gap-x-2 lg:gap-y-6'>
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
    <>
      <h2 className="mb-4"> SeroTracker Team </h2>
      {(data?.groupedTeamMembers ?? []).map((team) => 
        <TeamCard teamInfo={team} key={team.label} />
      )}
    </>
  );
}
