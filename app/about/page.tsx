import Image from 'next/image'

export default function Home() {
    return (
        <div className="flex min-h-screen flex-col items-center justify-between">
            <div className={"h-half-screen flex flex-col justify-center items-center"}>
                <h1>ABOUT</h1>
                <h2>A global dashboard standardizing pathogen and seroprevalence data</h2>
            </div>
        </div>
    )
}
