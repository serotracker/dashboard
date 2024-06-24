import { ArboTrackerTutorialVideoFrame } from "@/components/customs/arbotracker-tutorial-video-frame";
import * as Separator from '@radix-ui/react-separator';
import Image from 'next/image'
import { cn } from "@/lib/utils";

interface ArboTrackerHelpModalImageProps {
  className?: string;
  src: string;
  alt: string;
  width: number;
  height: number;
}

const ArboTrackerHelpModalImage = (props: ArboTrackerHelpModalImageProps) => (
  <div className={cn(
    "mx-2 flex justify-center",
    props.className ?? ''
  )}>
    <Image
      className="rounded-lg border border-black"
      src={props.src}
      alt={props.alt}
      width={props.width}
      height={props.height}
    />
  </div>
)

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
    <p className="mb-2">The following tutorial shows the main functionalities of the ArboTracker dashboard.</p>
    <ArboTrackerTutorialVideoFrame className="mb-6" />
  </div>
);

interface ArboTrackerHelpModalMapInstructionsProps {
  className?: string;
}

const ArboTrackerHelpModalMapInstructions = (props: ArboTrackerHelpModalMapInstructionsProps) => (
  <div className={props.className}>
    <p className="mb-2">The top of the ArboTracker dashboard contains a map. Each cluster on the map is a collection of arbovirus estimates. The number on the cluster indicates how many seroprevalence estimates belong to that cluster. </p>
    <ArboTrackerHelpModalImage
      className="mb-2"
      src={"/ArboTrackerHelpModalImage0001.png"}
      alt={""}
      width={1511}
      height={871}
    />
    <p className="mb-2">Hovering over the cluster with your mouse will show you how many of those estimates correspond to each arbovirus. For example, the cluster in the image below contains 23 seroprevalence estimates for the Chikungunya Virus, 36 estimates for the Dengue Virus, 42 estimates for the Mayaro Virus, etc. </p>
    <ArboTrackerHelpModalImage
      className="mb-2"
      src={"/ArboTrackerHelpModalImage0002.png"}
      alt={""}
      width={578}
      height={536}
    />
    <p className="mb-2">Each colour in ArboTracker is associated with a specific arbovirus. For example, Dengue seroprevalence estimates are associated with red and Mayaro Virus estimates are associated with purple.</p>
    <p className="mb-2">In the cluster above, you can see that roughly a third of the pi chart is purple which indicates that roughly a third of the estimates correspond to the Mayaro Virus.</p>
    <p className="mb-2">Clicking on the cluster zooms in the map and allows you to see new clusters or individual estimates on the map. Individual estimates appear as single colour circles without numbers as seen in the image below.</p>
    <ArboTrackerHelpModalImage
      className="mb-2"
      src={"/ArboTrackerHelpModalImage0003.png"}
      alt={""}
      width={1111}
      height={742}
    />
    <p className="mb-2">The estimate circles have the same colour coding by arbovirus as the rest of the dashboard. Clicking on one of the estimates opens up a popup which allows you to see the seroprevalence along with many other helpful details as seen in the image below. The blue text in the popup is the name of the study where the seroprevalence estimate was extracted from. Clicking on that blue text will redirect you to a webpage where you can access the study.</p>
    <p className="mb-2">Not every estimate has a study which is widely available online. In cases where the study is not widely available online the blue text will be black and clicking on it will not open any webpage.</p>
    <ArboTrackerHelpModalImage
      className="mb-2"
      src={"/ArboTrackerHelpModalImage0004.png"}
      alt={""}
      width={541}
      height={507}
    />
    <p className="mb-2">Clicking on a country also provides some information about how much seroprevalence data our database contains for that country as seen in the image below.</p>
    <ArboTrackerHelpModalImage
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
    <p className="mb-2">If you choose to scroll down from the map, you&apos;ll be shown a table which contains all of our arbovirus seroprevalence data</p>
    <ArboTrackerHelpModalImage
      className="mb-2"
      src={"/ArboTrackerHelpModalImage0006.png"}
      alt={""}
      width={1519}
      height={902}
    />
    <p className="mb-2">The table can be downloaded as a CSV by clicking on the &quot;Download CSV&quot; button on the top right of the table. The &quot;Get Citation for CSV&quot; button in the top right corner allows you to get our recommended citation if your work makes use of our data.</p>
    <p className="mb-2">Colums can be removed from the table by clicking on the &quot;Columns&quot; button in the top right. From there, you can choose which columns should be included in the table. Downloaded CSVs only include the columns which are included in the table so this can be used to remove columns you&apos;re not interested in from your downloaded CSV.</p>
    <p className="mb-2">The table can only show 10 rows at a time. To view the following ten rows of the data, click on the &quot;Next&quot; button in the bottom right.</p>
    <p>Most columns can be sorted ascendingly or descendingly by clicking on the two arrows in the header of the column.</p>
  </div>
)

interface ArboTrackerHelpModalVisualizationInstructionsProps {
  className?: string;
}

const ArboTrackerHelpModalVisualizationInstructions = (props: ArboTrackerHelpModalVisualizationInstructionsProps) => (
  <div className={props.className}>
    <p className="mb-2">If you choose to scroll down from the table, you&apos;ll be shown several visualizations of our data.</p>
    <ArboTrackerHelpModalImage
      className="mb-2"
      src={"/ArboTrackerHelpModalImage0007.png"}
      alt={""}
      width={1527}
      height={444}
    />
    <p className="mb-2">Every visualization can be viewed in fullscreen by clicking on the magnifying glass in the top right corner of the visualization.</p>
    <p>Every visualization can also be downloaded as an image by clicking on the cloud icon in the top right corner of the visualization.</p>
  </div>
)

enum ArboTrackerHelpModalSection {
  INTRODUCTION = "INTRODUCTION",
  TUTORIAL = "TUTORIAL",
  MAP_INSTRUCTIONS = "MAP_INSTRUCTIONS",
  TABLE_INSTRUCTIONS = "TABLE_INSTRUCTIONS",
  VISUALIZATION_INSTRUCTIONS = "VISUALIZATION_INSTRUCTIONS"
}

const helpModalSectionToRenderingFunctionMap = {
  [ArboTrackerHelpModalSection.INTRODUCTION]: {sectionRenderingFunction: ArboTrackerHelpModalIntroductionSection},
  [ArboTrackerHelpModalSection.TUTORIAL]: {sectionRenderingFunction: ArboTrackerHelpModalTutorialSection},
  [ArboTrackerHelpModalSection.MAP_INSTRUCTIONS]: {sectionRenderingFunction: ArboTrackerHelpModalMapInstructions},
  [ArboTrackerHelpModalSection.TABLE_INSTRUCTIONS]: {sectionRenderingFunction: ArboTrackerHelpModalTableInstructions},
  [ArboTrackerHelpModalSection.VISUALIZATION_INSTRUCTIONS]: {sectionRenderingFunction: ArboTrackerHelpModalVisualizationInstructions},
}

const allSections = [
  ArboTrackerHelpModalSection.INTRODUCTION,
  ArboTrackerHelpModalSection.TUTORIAL,
  ArboTrackerHelpModalSection.MAP_INSTRUCTIONS,
  ArboTrackerHelpModalSection.TABLE_INSTRUCTIONS,
  ArboTrackerHelpModalSection.VISUALIZATION_INSTRUCTIONS
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
        const isLastSection = index === allSections.length - 1;

        return (
          <div key={section}>
            <sectionInformation.sectionRenderingFunction className={isLastSection ? "mb-2" : "mb-6"}/>
            <Separator.Root
              orientation="horizontal"
              hidden={isLastSection}
              className="bg-arbovirus h-px mb-2"
            />
          </div>
        )
      })}
    </div>
  );
}