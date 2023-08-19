'use client'

import React, { useState } from 'react'
import { Dropdown } from "semantic-ui-react";
import Link from 'next/link'
import Image from "next/image";

export const Header = () => {
    const [tab, setTab] = useState("");

    // TODO: Currently not actually being used to change language. Placeholder for future implementation.
    //  This would be put in a context so it can be accessed from accross the application
    const [language, setLanguage] = useState<"en" | "fr" | "de">("en");

    const getTabClass = (tabName: string) => {
        return 'text-md font-header non-italic text-white h-100 flex items-center' +( tab.includes(tabName) ? 'font-bold' : 'font-medium');
    }

    return (
        <header className="bg-sero-dark-blue flex items-center justify-between h-12 w-screen px-2">
            <div className="cursor-pointer py-5 pl-2">
                <Link href={("Explore")} className="flex items-center">
                    <Image src={"./SerotrackerLogo.svg"} alt={"Serotracker Logo"} width={23} height={23} />
                </Link>
            </div>
            <div className={`flex items-center justify-around w-full p-0`}>
                <div className={getTabClass('/Explore')}>
                    <Link href={"/pathogen/sarscov2/dashboard"}>
                        Serotracker
                    </Link>
                </div>
                <div className={getTabClass('/Analyze')}>
                    <Link href={"/pathogen/arbovirus/dashboard"}>
                        Arbotracker
                    </Link>
                </div>
                <div className={getTabClass('/Data')}>
                    <Link href={"/docs"}>
                        Docs
                    </Link>
                </div>
                <div className={getTabClass('/Publications')}>
                    <Link href={"/about"}>
                        About
                    </Link>
                </div>
                {/* TODO: The partnerships dropdown was removed and needs to be added back in when we know where it goes */}
            </div>
            <div className={"text-md font-header non-italic text-white h-100 flex justify-end items-center cursor-pointer"} >
                <Dropdown text={language.toUpperCase()}>
                    <Dropdown.Menu >
                        {language !== "en" ?
                            <Dropdown.Item onClick={() => {setLanguage("en")}}>
                                { "EN" }
                            </Dropdown.Item> : ""}
                        {language !== "fr" ?
                            <Dropdown.Item onClick={() => {setLanguage("fr")}}>
                                { "FR" }
                            </Dropdown.Item> : ""}
                        {language !== "de" ?
                            <Dropdown.Item onClick={() => {setLanguage("de")}}  >
                                { "DE" }
                            </Dropdown.Item> : ""}
                    </Dropdown.Menu>
                </Dropdown>
            </div>
        </header >
    )
}
