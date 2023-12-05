import React from "react";
import Translate from "../../utils/translate-util/translate-service";
import { Twitter, Linkedin, Mail } from "lucide-react";
import { Sponsors } from "./sponsors";

export default function About() {
  function renderBioBlock(
    name: string,
    description: string[],
    linkedIn: string | null = null,
    email: string | null = null,
    twitter: string | null = null
  ) {
    return (
      <div>
        <b>{name}</b>
        <br />
        {description.map((line) => {
          return (
            <div key={line}>
              {line}
              <br />
            </div>
          );
        })}
        <div className="flex flex-row mt-2">
            {linkedIn ? (
            <a className="pr-2" href={linkedIn} target="_blank" rel="noopener noreferrer">
                <Linkedin />
            </a>
            ) : null}
            {twitter ? (
            <a className="pr-2" href={twitter} target="_blank" rel="noopener noreferrer">
                <Twitter />
            </a>
            ) : null}
            {email ? (
            <a className="pr-2" href={`mailto:${email}`}>
                <Mail />
            </a>
            ) : null}
        </div>
      </div>
    );
  }
  return (
    <div className="flex flex-col col-12 items-center overflow-auto h-full pt-24">
      <div className={"prose pb-2"}>
        <h1>{Translate("AboutPage", ["Headers", "AboutSeroTracker"])}</h1>
        <p className="mb-4">
        <b>{Translate("AboutPage", ["AboutSection", "PartOne"])}</b>
          {Translate("AboutPage", ["AboutSection", "PartTwo"], null, [true, false])}
        </p>
        <Sponsors />
        <p className="mb-4">
          {Translate("AboutPage", ["AboutSection", "SupportedBy"])}
          <a target="_blank" rel="noreferrer noopener" href="https://www.canada.ca/en/public-health.html">
            {Translate("AboutPage", ["AboutSection", "PublicHealthAgency"], null, [true, true])}
          </a>
          {Translate("AboutPage", ["AboutSection", "Th roughThe"])}
          <a target="_blank" rel="noreferrer noopener" href="https://www.covid19immunitytaskforce.ca/">
            {Translate("AboutPage", ["AboutSection", "Covid19ImmunityTaskForce"], null, [true, true])}
          </a>
          {Translate("AboutPage", ["AboutSection", "HostedAt"])}
          <a
            href="https://cumming.ucalgary.ca/centres/centre-health-informatics"
            target="_blank" rel="noreferrer noopener"
          >
            {Translate("AboutPage", ["AboutSection", "HealthInformatics"], null, [true, true])}
          </a>
        </p>
        <p className="mb-4">
          {Translate("AboutPage", ["AboutSection", "WHO1"])}
          <a href="https://www.who.int/" target="_blank" rel="noreferrer noopener">
            {Translate("AboutPage", ["AboutSection", "WorldHealthOrganization"], null, [true, true])}
          </a>
          {Translate("AboutPage", ["AboutSection", "WHO2"])}
          <a target="_blank" rel="noreferrer noopener" href="https://www.who.int/emergencies/diseases/novel-coronavirus-2019/technical-guidance/early-investigations">
            {Translate("AboutPage", ["AboutSection", "UnityStudies"], null, [true, false])}
          </a>
          {Translate("AboutPage", ["AboutSection", "WHO3"], null, [true, true])}
        </p>
        <p className="mb-4">
          <a href="https://www.mapbox.com/" target="_blank" rel="noreferrer noopener">
            Mapbox
          </a>{" "}
          {Translate("AboutPage", ["Mapbox"])}
        </p>
        <h2>{Translate("AboutPage", ["Headers","ContactUs"])}</h2>
        <div>
          <p className="mb-4">
            {Translate("AboutPage", ["ContactSection", "BulletPointOne", "PartOne"], null, [true, true])}
            <a target="_blank" rel="noreferrer noopener" href="mailto:rahul.arora@balliol.ox.ac.uk">rahul.arora@balliol.ox.ac.uk</a>
            {Translate("AboutPage", ["ContactSection", "BulletPointOne", "PartTwo"], null, [true, true])}
            <a target="_blank" rel="noreferrer noopener" href="mailto:tingting.yan@mail.utoronto.ca">tingting.yan@mail.utoronto.ca</a>.
            {Translate("AboutPage", ["ContactSection", "BulletPointOne", "PartThree"], null, [true, true])}
            <a target="_blank" rel="noreferrer noopener" href="mailto:media@covid19immunitytaskforce.ca">media@covid19immunitytaskforce.ca</a>
            {Translate("AboutPage", ["ContactSection", "BulletPointOne", "PartFour"], null, [true, true])}
            <a target="_blank" rel="noreferrer noopener" href="mailto:kelly.johnston2@ucalgary.ca">kelly.johnston2@ucalgary.ca</a>.
          </p>
          <p className="mb-4">
            {Translate("AboutPage", ["ContactSection", "BulletPointFive", "PartOne"])}
            <b>{Translate("AboutPage", ["ContactSection", "BulletPointFive", "PartTwo"], null, [true, false])}</b>
            {Translate("AboutPage", ["ContactSection", "BulletPointFive", "PartThree"], null, [true, true])}
            <a
              rel="noopener noreferrer"
              target="_blank"
              href="https://forms.gle/XWHQ7QPjQnzQMXSz8"
            >
              {Translate("ThisForm")}
            </a>
            {Translate("AboutPage", ["ContactSection", "BulletPointFive", "PartFour"], null, [true, true])}
          </p>
        </div>
        <h1 className="mt-8">{Translate("AboutPage", ["Headers","OurTeam"])}</h1>
        <h2 className="font-normal italic">{Translate("AboutPage", ["SubHeaders", "TeamLead"])}</h2>
        <div className="inline-grid grid-cols-3 gap-x-6 gap-y-4 w-full">
          {renderBioBlock(
            "Rahul Arora",
            [Translate("UniversityOf", null, { NAME: "Oxford" }), Translate("UniversityOf", null, { NAME: "Calgary" })],
            "https://www.linkedin.com/in/rahularorayyc/",
            "rahularoradfs@gmail.com"
          )}
          {renderBioBlock(
            "Tingting Yan",
            [Translate("UniversityOf", null, { NAME: "Toronto" })],
            "https://www.linkedin.com/in/tingting-yan/",
            "",
            "https://twitter.com/TingtingYan_"
          )}
        </div>
        <h2 className="font-normal italic">{Translate("AboutPage", ["SubHeaders", "DataCuration"])}</h2>
        <div className="inline-grid grid-cols-3 gap-x-6 gap-y-4 w-full">
          {renderBioBlock(
              "Anabel Selemon",
              [Translate("UniversityOf", null, { NAME: "Calgary" })],
              null,
              "anabel.selemon@ucalgary.ca"
          )}
          {renderBioBlock(
              "Caseng Zhang",
              [Translate("BlankUniversity", null, { NAME: "McMaster" })],
              "www.linkedin.com/in/caseng",
              "zhangcaseng@gmail.com"
          )}
          {renderBioBlock(
              "Dayoung Kim",
              [Translate("UniversityOf", null, { NAME: "Calgary" })],
              "https://www.linkedin.com/in/dayoung-kim-448425198/",
              "dayoung.kim1@ucalgary.ca"
          )}
          {renderBioBlock(
              "Emma Loeschnik",
              [Translate("BlankUniversity", null, {NAME: "Western"}), Translate("BlankUniversity", null, { NAME: "Brock" })],
              "https://www.linkedin.com/in/emma-loeschnik-97bb48220",
              "eloeschn@uwo.ca",
              "https://twitter.com/emma_loeschnik"
          )}
          {renderBioBlock(
              "Kim Noël",
              [Translate("BlankUniversity", null, { NAME: "McGill" })],
              "https://www.linkedin.com/in/kim-noel-aa27821b8",
              "kim.noel@mail.mcgill.ca"
          )}
          {renderBioBlock(
              "Mercedes Yanes",
              [Translate("BlankUniversity", null, { NAME: "McGill" }), "Universidad Autonoma de San Luis Potosi"],
              "https://www.linkedin.com/in/mercedes-yanes-lane-64b25a19b",
              "mercedes.yaneslane@mcgill.ca",
              null
          )}
          {renderBioBlock(
            "Niklas Bobrovitz ",
            [Translate("UniversityOf", null, { NAME: "Oxford" }), Translate("UniversityOf", null, { NAME: "Toronto" })],
            "https://www.linkedin.com/in/nik-bobrovitz-19a117179/",
            "niklas.bobrovitz@mail.utoronto.ca",
            "https://twitter.com/nikbobrovitz"
          )}
          {renderBioBlock(
              "Sara Perlman-Arrow",
              [Translate("BlankUniversity", null, { NAME: "McGill" })],
              "https://www.linkedin.com/in/sara-perlman-arrow-5075421b6/",
              "sara.perlman-arrow@mail.mcgill.ca"
          )}
          {renderBioBlock(
              "Jane Yuan",
              [Translate("BlankUniversity", null, {NAME: "Western"})],
              "https://www.linkedin.com/in/jane-yuan-291682152/?originalSubdomain=ca",
              "jyuan58@uwo.ca"
          )}
          {renderBioBlock(
              "Sabah Shaikh",
              [Translate("BlankUniversity", null, {NAME: "New York"})],
              null,
              "sabah.nshaikh@gmail.com"
          )}
          {renderBioBlock(
              "Margaret Jamieson",
              [Translate("UniversityOf", null, {NAME: "Toronto"})],
              null,
              "margaret.jamieson@mail.utoronto.ca"
          )}
        </div>
        <h2 className="font-normal italic">{Translate("AboutPage", ["SubHeaders", "DataInfrastructure"])}</h2>
        <div className="inline-grid grid-cols-3 gap-x-6 gap-y-4 w-full">
          {renderBioBlock(
              "Christian Cao",
              [Translate("UniversityOf", null, { NAME: "Calgary" })],
              "https://ca.linkedin.com/in/christian-cao-275b78190",
              "ccao.canada@gmail.com"
          )}
          {renderBioBlock(
              "Harriet Ware",
              [Translate("UniversityOf", null, { NAME: "Toronto" }), Translate("BlankUniversity", null, { NAME: "Queen's"})],
              null,
              "ware.harriet@gmail.com"
          )}
          {renderBioBlock(
              "Judy Chen",
              [Translate("BlankUniversity", null, { NAME: "McGill" })],
              null,
              "judy.chen@mail.mcgill.ca"
          )}
        </div>
        <h2 className="font-normal italic">{Translate("AboutPage", ["SubHeaders", "GlobalPartnerships"])}</h2>
        <div className="inline-grid grid-cols-3 gap-x-6 gap-y-4 w-full">
          {renderBioBlock(
              "Harriet Ware",
              [Translate("UniversityOf", null, { NAME: "Toronto" }), Translate("BlankUniversity", null, { NAME: "Queen's"})],
              null,
              "ware.harriet@gmail.com"
          )}
          {renderBioBlock(
              "Mairéad Whelan",
              [Translate("UniversityOf", null, { NAME: "Oxford" }), Translate("UniversityOf", null, { NAME: "Calgary" })],
              "https://www.linkedin.com/in/mairead-whelan",
              "mairead.whelan@ucalgary.ca",
              "https://twitter.com/Mairead_GWhelan"
          )}
          {renderBioBlock(
              "Xiaomeng Ma",
              [Translate("UniversityOf", null, { NAME: "Toronto" })],
              "https://www.linkedin.com/in/xiaomeng-simone-ma-6a8156b9/",
              "xiaomeng.ma@mail.utoronto.ca"
          )}
          {renderBioBlock(
              "Zihan Li",
              [Translate("UniversityOf", null, {NAME: "Waterloo"})],
              "https://www.linkedin.com/in/zihanli/",
              "zihan.li@uwaterloo.ca",
              "https://twitter.com/emma_loeschnik"
          )}
          {renderBioBlock(
              "Brianna Cheng",
              [Translate("UniversityOf", null, { NAME: "Toronto"})],
              null,
              "brianna.cheng2@mail.mcgill.ca",
              null
          )}
        </div>
        <h2 className="font-normal italic">{Translate("AboutPage", ["SubHeaders", "DevelopmentTeam"])}</h2>

        <div className="inline-grid grid-cols-3 gap-x-6 gap-y-4 w-full">
          {renderBioBlock(
            "Austin Atmaja",
            [Translate("UniversityOf", null, { NAME: "Waterloo" })],
            "https://www.linkedin.com/in/austinatmaja",
            "atatmaja@uwaterloo.ca",
            "https://twitter.com/atatmaja_"
          )}
          {renderBioBlock(
              "Flora Guo",
              [Translate("UniversityOf", null, { NAME: "Waterloo" })],
              "https://www.linkedin.com/in/floraguolr/",
              "floraguolr@gmail.com"
          )}
          {renderBioBlock(
              "Himanshu Ranka",
              [Translate("BlankUniversity", null, { NAME: "McGill" })],
              "https://www.linkedin.com/in/himanshu-ranka-635a02181/",
              "himanshu.ranka@mail.mcgill.ca"
          )}
          {renderBioBlock(
            "Simona Rocco",
            [Translate("UniversityOf", null, { NAME: "Waterloo" })],
            "https://www.linkedin.com/in/simona-rocco/",
            "serocco@uwaterloo.ca"
          )}
          {renderBioBlock(
              "Gurman Brar",
              [Translate("UniversityOf", null, { NAME: "Waterloo" })],
              "https://www.linkedin.com/in/gurman-brar/",
              "g9brar@uwaterloo.ca"
          )}
        </div>
        <h2 className="font-normal italic">{Translate("AboutPage", ["SubHeaders", "Alumni"])}</h2>
        <div className="inline-grid grid-cols-3 gap-x-6 gap-y-4 w-full">
          {renderBioBlock(
              "Abel Joseph",
              [Translate("UniversityOf", null, { NAME: "Waterloo" })],
              "https://www.linkedin.com/in/abel-joseph/",
              "abel.joseph@uwaterloo.ca"
          )}
          {renderBioBlock(
              "Abhinav Pillai",
              [Translate("UniversityOf", null, { NAME: "Calgary" })],
              null,
              "abhinav.arunpillai@ucalgary.ca"
          )}
          {renderBioBlock(
              "Brett Dziedzic",
              [Translate("UniversityOf", null, { NAME: "Lethbridge" })],
              "https://www.linkedin.com/in/brett-dziedzic/",
              "brettdziedzic@gmail.com"
          )}
          {renderBioBlock(
              "Emily Boucher",
              [Translate("SchoolName", ["Cumming"]), Translate("UniversityOf", null, { NAME: "Calgary" })],
              null,
              "emily.boucher@ucalgary.ca"
          )}
          {renderBioBlock(
              "Ewan May",
              [Translate("SchoolName", ["Schulich"]), Translate("UniversityOf", null, { NAME: "Calgary" })],
              "https://www.linkedin.com/in/ewan-may",
              "ewan.may@ucalgary.ca"
          )}
          {renderBioBlock(
              "Hannah Rahim",
              [Translate("UniversityOf", null, { NAME: "Calgary" })],
              "https://www.linkedin.com/in/hannah-rahim/",
              "hannahrahim2@gmail.com",
              "https://twitter.com/Hannah_Rahim1"
          )}
          {renderBioBlock(
              "Jordan Van Wyk",
              [Translate("UniversityOf", null, { NAME: "Waterloo" })],
              "https://www.linkedin.com/in/jordanvanwyk/",
              "jordanvanwyk@outlook.com",
              "https://twitter.com/jordanvw_"
          )}
          {renderBioBlock(
              "Lucas Penny",
              [Translate("UniversityOf", null, { NAME: "Toronto" })],
              "https://www.linkedin.com/in/lucaspenny/",
              "lucas.penny@mail.utoronto.ca",
              "https://twitter.com/lucasjpenny"
          )}
          {renderBioBlock(
              "Michael Liu",
              [
                Translate("UniversityOf", null, { NAME: "Oxford" }),
                Translate("BlankUniversity", null, { NAME: "Harvard" }),
              ],
              "https://www.linkedin.com/in/michael-liu-8728249a/",
              "liu.michael222@gmail.com",
              "https://twitter.com/mliu_canada"
          )}
          {renderBioBlock(
              "Mitchell Segal",
              [Translate("UniversityOf", null, { NAME: "Toronto" })],
              null,
              "mitchell.segal@mail.utoronto.ca"
          )}
          {renderBioBlock(
              "Nathan Duarte",
              [Translate("BlankUniversity", null, { NAME: "McGill"}), Translate("UniversityOf", null, { NAME: "Waterloo" })],
              "https://www.linkedin.com/in/duartenathan/",
              "nathanduarte1@gmail.com",
              "https://twitter.com/niduarte_canada"
          )}
          {renderBioBlock(
              "Noel Loo",
              [Translate("UniversityOf", null, { NAME: "Cambridge" })],
              null,
              "noel.loo.188@gmail.com"
          )}
          {renderBioBlock(
              "Prannoy Lal",
              [Translate("UniversityOf", null, { NAME: "Waterloo" })],
              "https://www.linkedin.com/in/prannoylal/",
              "p4lal@uwaterloo.ca"
          )}
          {renderBioBlock(
              "Sean D'Mello",
              [Translate("UniversityOf", null, { NAME: "Waterloo" })],
              "https://www.linkedin.com/in/dmellosean/",
              "sean.dmello@uwaterloo.ca",
              "https://twitter.com/SeanDMello1"
          )}
          {renderBioBlock(
              "Natalie Duarte",
              [Translate("UniversityOf", null, { NAME: "Toronto" })],
              null,
              "natalieaduarte@gmail.com")}
          {renderBioBlock(
              "Natasha Ilincic",
              [Translate("UniversityOf", null, { NAME: "Toronto" }), Translate("UniversityOf", null, { NAME: "Guelph" })],
              "https://www.linkedin.com/in/natasha-ilincic/",
              "natasha.ilincic@gmail.com"
          )}
          {renderBioBlock(
              "Claire Donnici",
              [Translate("UniversityOf", null, { NAME: "Calgary" })],
              null,
              "claire.donnici@ucalgary.ca",
              "https://twitter.com/ClaireDonnici"
          )}
          {renderBioBlock(
              "Gabriel Deveaux",
              [Translate("MemorialUniversityOfNewfoundland")],
              "https://www.linkedin.com/in/grdeveaux/",
              "grbdeveaux@dal.ca"
          )}
        </div>
        <h2 className="font-normal italic">{Translate("AboutPage", ["SubHeaders", "ScientificAdvisors"])}</h2>
        <div className="inline-grid grid-cols-3 gap-x-6 gap-y-4 w-full">
          {renderBioBlock("Tim Evans", [
            Translate("BlankUniversity", null, {NAME: "McGill"}),
            Translate("COVIDImmunityTaskForce"),
          ])}
          {renderBioBlock("Tyler Williamson", [
            Translate("CentreHealthInformatics"),
            Translate("UniversityOf", null, {NAME: "Calgary"}),
          ])}
          {renderBioBlock("Matthew Cheng", [
            Translate("COVIDImmunityTaskForce"),
            Translate("BlankUniversity", null, {NAME: "McGill"}),
          ])}
          {renderBioBlock("David Naylor", [
            Translate("COVIDImmunityTaskForce"),
            Translate("UniversityOf", null, {NAME: "Toronto"}),
          ])}
          {renderBioBlock("David Buckeridge", [
            Translate("COVIDImmunityTaskForce"),
            Translate("BlankUniversity", null, {NAME: "McGill"}),
          ])}
          {renderBioBlock("Bruce Mazer", [
            Translate("COVIDImmunityTaskForce"),
            Translate("BlankUniversity", null, {NAME: "McGill"}),
          ])}
          {renderBioBlock("Jesse Papenburg", [
            Translate("COVIDImmunityTaskForce"),
            Translate("BlankUniversity", null, {NAME: "McGill"}),
          ])}
          {renderBioBlock("Catherine Hankins", [
            Translate("COVIDImmunityTaskForce"),
            Translate("BlankUniversity", null, {NAME: "McGill"}),
          ])}
        </div>
        <h2 className="font-normal italic">{Translate("AboutPage", ["SubHeaders", "ProjectStaff"])}</h2>
        <div className="inline-grid grid-cols-3 gap-x-6 gap-y-4 w-full mb-5">
          {renderBioBlock("Erin O'Connor", [
            Translate("CentreHealthInformatics"),
            Translate("UniversityOf", null, {NAME: "Calgary"}),
          ])}
          {renderBioBlock("Catherine Eastwood", [
            Translate("CentreHealthInformatics"),
            Translate("UniversityOf", null, {NAME: "Calgary"}),
          ])}
        </div>
      </div>
    </div>
  );
}