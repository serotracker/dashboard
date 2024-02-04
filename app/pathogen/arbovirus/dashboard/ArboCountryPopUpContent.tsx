import { typedGroupBy } from "@/lib/utils"
import { ShortformArbovirus, convertArboSFtoArbo } from "../analyze/recharts"
import { PopUpContentRow } from "./ArboStudyPopupContent";

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

export function ArboCountryPopupContent({ record }: ArboCountryPopupContentProps): React.ReactNode {
  const dataPointsGroupedByArbovirus = typedGroupBy(record.dataPoints, (dataPoint) => dataPoint.pathogen);

  return (
    <div className="w-[460px] bg-white pt-2">
      <div className={"py-2 px-4"}>
        <div className="text-lg font-bold text-center">
          {record.countryName}
        </div>
      </div>
      <div className={`bg-gray-200 w-full py-2 px-4`}>
        <PopUpContentRow
          title={"Total Estimates"}
          content={<b>{record.dataPoints.length.toString()} </b>}
        />
      </div>
      <div className={"py-2 px-4 max-h-[250px] overflow-auto"}>
        {Object.values(ShortformArbovirus).map((shortformArbovirus) => {
          const dataPointsForArbovirus = dataPointsGroupedByArbovirus[shortformArbovirus] ?? [];

          if(dataPointsForArbovirus.length === 0) {
            return null;
          }

          return <PopUpContentRow
            key={`pop-up-content-${shortformArbovirus}`}
            title={`${convertArboSFtoArbo(shortformArbovirus)} estimates`}
            content={dataPointsForArbovirus.length.toString()}
          />
        })}
      </div>
    </div>
  )
}