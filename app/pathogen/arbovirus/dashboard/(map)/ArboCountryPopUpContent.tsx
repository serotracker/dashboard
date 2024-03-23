import { typedGroupBy } from "@/lib/utils"
import { ShortformArbovirus, convertArboSFtoArbo } from "../(visualizations)/recharts"
import { PopUpContentRow } from "./ArboStudyPopupContent";
import { pathogenColors } from "./ArbovirusMap";

interface ArboCountryPopupContentProps {
  record: {
    id: string,
    alpha3CountryCode: string,
    countryName: string,
    latitude: string,
    longitude: string,
    dataPoints: { pathogen: ShortformArbovirus }[],
  }
}

function sortArbovirus(a: ShortformArbovirus, b: ShortformArbovirus) {
  const arbovirusOrder = [
    ShortformArbovirus.ZIKV,
    ShortformArbovirus.DENV,
    ShortformArbovirus.CHIKV,
    ShortformArbovirus.YF,
    ShortformArbovirus.WNV,
    ShortformArbovirus.MAYV,
  ];

  return arbovirusOrder.indexOf(a) - arbovirusOrder.indexOf(b);
}

interface CountryPopUpContentRowProps {
  title: string,
  content: JSX.Element | string | string[] | null | undefined
}

const CountryPopUpContentRow = (props: CountryPopUpContentRowProps): React.ReactNode => {
  return (
    <div className={"flex justify-between items-center w-full"}>
      <div className={"text-md font-semibold"}>{props.title}</div>
      <div className="text-semibold">{props.content}</div>
    </div>
  );
}

export function ArboCountryPopupContent({ record }: ArboCountryPopupContentProps): React.ReactNode {
  const dataPointsGroupedByArbovirus = typedGroupBy(record.dataPoints, (dataPoint) => dataPoint.pathogen);

  return (
    <div className="w-[260px] bg-white/60 backdrop-blur-md pt-2">
      <div className={"py-2 px-4"}>
        <div className="text-lg font-bold text-center">
          {record.countryName}
        </div>
      </div>
      <div className={`bg-gray-200 w-full py-2 px-4`}>
        <CountryPopUpContentRow
          title={"Total Estimates"}
          content={<b>{record.dataPoints.length.toString()} </b>}
        />
      </div>
      <div className={"py-2 px-4 max-h-[250px] overflow-auto"}>
        {Object.values(ShortformArbovirus).sort(sortArbovirus).map((shortformArbovirus) => {
          const dataPointsForArbovirus = dataPointsGroupedByArbovirus[shortformArbovirus] ?? [];

          if(dataPointsForArbovirus.length === 0) {
            return null;
          }

          
          return (
            <div className="flex w-full mb-2" key={`pop-up-content-${shortformArbovirus}`}>
              <div className={`w-2 mr-2`} style={{backgroundColor: pathogenColors[shortformArbovirus]}}/>
              <CountryPopUpContentRow
                title={`${convertArboSFtoArbo(shortformArbovirus)} estimates`}
                content={dataPointsForArbovirus.length.toString()} />
            </div>
          ) 
        })}
      </div>
    </div>
  )
}