import { ArboTrackerTutorialVideoFrame } from "@/components/customs/arbotracker-tutorial-video-frame";
import { cn } from "@/lib/utils";
import * as Separator from '@radix-ui/react-separator';
import Image from 'next/image'

interface ArboTrackerHelpModalIntroductionSectionProps {
  className?: string;
}

const ArboTrackerHelpModalIntroductionSection = (props: ArboTrackerHelpModalIntroductionSectionProps) => (
  <div className={props.className ?? ''}>
    <p>ArboTracker is a dashboard which compiles findings from thousands of arbovirus seroprevalence studies worldwide.</p>
  </div>
);

interface ArboTrackerHelpModalTutorialSectionProps {
  className?: string;
}

const ArboTrackerHelpModalTutorialSection = (props: ArboTrackerHelpModalTutorialSectionProps) => (
  <div className={props.className ?? ''}>
    <p>The following tutorial shows the main functionalities of the ArboTracker dashboard.</p>
    <ArboTrackerTutorialVideoFrame className="mb-6" />
  </div>
);

interface ArboTrackerHelpModalMapInstructionsProps {
  className?: string;
}

const ArboTrackerHelpModalMapInstructions = (props: ArboTrackerHelpModalMapInstructionsProps) => (
  <div className={props.className}>
    <p>The top of the ArboTracker dashboard contains a map. Each cluster on the map is a collection of arbovirus estimates. The number on the cluster indicates how many seroprevalence estimates belong to that cluster. </p>
    <Image
      className={"mx-2"}
      src={"/ArboTrackerHelpModalImage0001.png"}
      alt={""}
      width={1511}
      height={871}
    />
    <p>Hovering over the cluster with your mouse will show you how many of those estimates correspond to each arbovirus. For example, the cluster in the image below contains 23 seroprevalence estimates for the Chikungunya Virus, 36 estimates for the Dengue Virus, 42 estimates for the Mayaro Virus, etc. </p>
    <Image
      className={"mx-2"}
      src={"/ArboTrackerHelpModalImage0002.png"}
      alt={""}
      width={578}
      height={536}
    />
    <p>Each colour in ArboTracker is associated with a specific arbovirus. For example, Dengue seroprevalence estimates are associated with red and Mayaro Virus estimates are associated with purple.</p>
    <p>In the cluster above, you can see that roughly a third of the pi chart is purple which indicates that roughly a third of the estimates correspond to the Mayaro Virus.</p>
    <p>Clicking on the cluster zooms in the map and allows you to see new clusters or individual estimates on the map. Individual estimates appear as single colour circles without numbers as seen in the image below.</p>
    <Image
      className={"mx-2"}
      src={"/ArboTrackerHelpModalImage0003.png"}
      alt={""}
      width={1111}
      height={742}
    />
    <p>The estimate circles have the same colour coding by arbovirus as the rest of the dashboard. Clicking on one of the estimates opens up a popup which allows you to see the seroprevalence along with many other helpful details as seen in the image below. The blue text in the popup is the name of the study where the seroprevalence estimate was extracted from. Clicking on that blue text will redirect you to a webpage where you can access the study.</p>
    <p>Not every estimate has a study which is widely available online. In cases where the study is not widely available online the blue text will be black and clicking on it will not open any webpage.</p>
    <Image
      className={"mx-2"}
      src={"/ArboTrackerHelpModalImage0004.png"}
      alt={""}
      width={541}
      height={507}
    />
    <p>Clicking on a country also provides some information about how much seroprevalence data our database contains for that country as seen in the image below.</p>
    <Image
      className={"mx-2 mb-6"}
      src={"/ArboTrackerHelpModalImage0005.png"}
      alt={""}
      width={541}
      height={507}
    />
  </div>
)

interface ArboTrackerHelpModalTableInstructionsProps {
  className?: string;
}

const ArboTrackerHelpModalTableInstructions = (props: ArboTrackerHelpModalTableInstructionsProps) => (
  <div className={props.className}>
    <p>If you choose to scroll down from the map, you'll be shown a table which contains all of our arbovirus seroprevalence data</p>
    <Image
      className={"mx-2"}
      src={"/ArboTrackerHelpModalImage0006.png"}
      alt={""}
      width={1519}
      height={902}
    />
    <p>The table can be downloaded as a CSV by clicking on the "Download CSV" button on the top right of the table. The "Get Citation for CSV" button in the top right corner allows you to get our recommended citation if your work makes use of our data.</p>
    <p>The table can only show 10 rows at a time. To view the following ten rows of the data, click on the "Next" button in the bottom right.</p>
  </div>
)

enum ArboTrackerHelpModalSection {
  INTRODUCTION = "INTRODUCTION",
  TUTORIAL = "TUTORIAL",
  MAP_INSTRUCTIONS = "MAP_INSTRUCTIONS",
  TABLE_INSTRUCTIONS = "TABLE_INSTRUCTIONS",
}

const helpModalSectionToRenderingFunctionMap = {
  [ArboTrackerHelpModalSection.INTRODUCTION]: {sectionRenderingFunction: ArboTrackerHelpModalIntroductionSection},
  [ArboTrackerHelpModalSection.TUTORIAL]: {sectionRenderingFunction: ArboTrackerHelpModalTutorialSection},
  [ArboTrackerHelpModalSection.MAP_INSTRUCTIONS]: {sectionRenderingFunction: ArboTrackerHelpModalMapInstructions},
  [ArboTrackerHelpModalSection.TABLE_INSTRUCTIONS]: {sectionRenderingFunction: ArboTrackerHelpModalTableInstructions},
}

const allSections = [
  ArboTrackerHelpModalSection.INTRODUCTION,
  ArboTrackerHelpModalSection.TUTORIAL,
  ArboTrackerHelpModalSection.MAP_INSTRUCTIONS,
  ArboTrackerHelpModalSection.TABLE_INSTRUCTIONS
];

export const ArboTrackerHelpModalContent = () => {
  return (
    <div className="px-4 overflow-y-scroll max-h-3/4-screen">
      <Separator.Root
        orientation="horizontal"
        className="bg-arbovirus h-px mb-2"
      />
      {allSections.map((section, index) => {
        const sectionInformation = helpModalSectionToRenderingFunctionMap[section];

        return (
          <div key={section}>
            <sectionInformation.sectionRenderingFunction className="mb-6" />
            <Separator.Root
              orientation="horizontal"
              hidden={index === allSections.length - 1}
              className="bg-arbovirus h-px mb-2"
            />
          </div>
        )
      })}
    </div>
  );
}