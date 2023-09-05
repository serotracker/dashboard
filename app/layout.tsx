import './globals.css'
import type {Metadata} from 'next'
import {Inter} from 'next/font/google'
import {Header} from "@/components/customs/header";
import {Footer} from "@/components/customs/footer";

const inter = Inter({subsets: ['latin']})

export const metadata: Metadata = {
    title: 'Pathotracker',
    description: 'A collection of dashboards tracking global seroprevalence data for mutliple pathogens.',
}

export default function RootLayout({
                                       children,
                                   }: {
    children: React.ReactNode
}) {
    return (
        <html lang="en">
        <body className={inter.className}>
        <div>
            <Header/>
            <main className={"h-full-screen w-screen p-4 border-box bg-foreground"}>
                {children}
            </main>
            <Footer/>
        </div>
        </body>
        </html>
    )
}
