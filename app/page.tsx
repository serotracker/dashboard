import Image from 'next/image'

export default function Home() {
    return (
        <div className="flex flex-col items-center justify-between">
            <div className={"h-half-screen flex flex-col justify-center items-center"}>
                <h1>This is SeroTracker</h1>
                <h2>A global dashboard standardizing pathogen and seroprevalence data</h2>
            </div>
            <div className={"h-half-screen flex w-full"}>
                <div className={"w-1/2 h-full flex justify-center items-center"}>
                    <h2>SeroTracker</h2>
                </div>
                <div className={"w-1/2 h-full flex justify-center items-center"}>
                    <h2>ArboTracker</h2>
                </div>
            </div>
        </div>
    )
}
