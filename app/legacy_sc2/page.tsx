import { SarsCov2Map } from "../pathogen/sarscov2/dashboard/(map)/SarsCov2Map";
import { SarsCov2Filters } from "../pathogen/sarscov2/dashboard/filters";

export default async function Home() {
  return (
    <div className="col-span-12 grid gap-0 grid-cols-12 grid-rows-4 lg:grid-rows-2 row-span-2 grid-flow-col w-screen h-screen overflow-hidden border-box">
      <SarsCov2Filters className="p-4 border-background overflow-y-scroll col-start-11 col-end-13 row-span-1 lg:col-span-2 lg:row-span-2 border-b lg:border-b-0"/>
      <div className='w-full h-full scroll-smooth overflow-hidden relative row-span-2 border border-background col-start-1 col-end-11'>
        <SarsCov2Map />
      </div>
    </div>
  )
}