'use client'

import React, { useState } from 'react'
import Link from 'next/link'
import Image from "next/image";
import {Select, SelectContent, SelectItem, SelectTrigger, SelectValue} from "@/components/ui/select";

export const Header = () => {
    const [tab, setTab] = useState("");

    const [language, setLanguage] = useState<"en" | "fr" | "de">("en");

    const getTabClass = (tabName: string) => {
        return 'text-md non-italic text-white h-100 p-2 flex items-center' +( tab.includes(tabName) ? 'font-bold' : 'font-medium');
    }

    return (
        <header className="bg-background flex items-center justify-between h-12 w-screen px-2">
            <div className="cursor-pointer py-5 pl-2">
                <Link href={("Explore")} className="flex items-center">
                    <Image src={"./SerotrackerLogo.svg"} alt={"Serotracker Logo"} width={23} height={23} />
                </Link>
            </div>
            <div className={`flex items-center justify-around p-0`}>
                <div className={getTabClass('/Explore')}>
                    <Link href={"/pathogen/sarscov2/dashboard"}>
                        SEROTRACKER
                    </Link>
                </div>
                <div className={getTabClass('/Analyze')}>
                    <Link href={"/pathogen/arbovirus/dashboard"}>
                        ARBOTRACKER
                    </Link>
                </div>
                <div className={getTabClass('/Data')}>
                    <Link href={"/docs"}>
                        DOCS
                    </Link>
                </div>
                <div className={getTabClass('/Publications')}>
                    <Link href={"/about"}>
                        ABOUT
                    </Link>
                </div>
                {/* TODO: The partnerships dropdown was removed and needs to be added back in when we know where it goes */}
            </div>
            <div className={"text-md font-header non-italic text-white h-100 flex justify-end items-center cursor-pointer"} >
                <Select defaultValue={language} onValueChange={(value) => setLanguage(value as "en"|"fr"|"de")}>
                    <SelectTrigger className="w-[180px]">
                        <SelectValue placeholder="EN" />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectItem value="en">EN</SelectItem>
                        <SelectItem value="fr">FR</SelectItem>
                        <SelectItem value="de">DE</SelectItem>
                    </SelectContent>
                </Select>
            </div>
        </header >
    )
}
