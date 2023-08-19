'use client'

import { PAGE_HASHES } from '@/app/(constants)/constants'
import Link from 'next/link';
import './footer.scss';
import NewsletterEmailInput from "./newsletter-email-input";
import Image from 'next/image';


//TODO: update footer design for mobile
export const Footer = () => {

    return (
        <footer className={'mx-0 pt-4 bg-sero-dark-blue font-md text-white'}>
            <div className="w-1/2 flex justify-center mt-3">
                <div className={"flex w-8/12"}>
                    <PageLinks/>
                </div>
                <div className={"flex w-4/12"}>
                    <h5 className={"mb-2"}>MAP DISCLAIMER</h5>
                    <WhoDisclaimer/>
                </div>
            </div>
            <div className="w-1/2 justify-content-center mt-5">
                <div className={"w-8/12"}>
                    <h5 className={"mb-2"}>OUR AFFILIATIONS</h5>
                    <div className="bg-white rounded-xl p-4">
                        <Sponsers/>
                    </div>
                </div>
                <div className={"w-4/12 flex flex-col"}>
                    <NewsletterEmailInput />
                </div>
            </div>
            {/* TODO: Need to add these pages back to the website once they are successfully updated */}
            {/*<div className="row justify-content-center py-5 text-center">*/}
            {/*    <Link className="footer__link px-1" to={withLocaleUrl("PrivacyPolicy")}>{Translate('PrivacyPolicy')}</Link>*/}
            {/*    |*/}
            {/*    <Link className="footer__link px-1" to={withLocaleUrl("CookiePolicy")}>{Translate('CookiePolicy')}</Link>*/}
            {/*    |*/}
            {/*    <Link className="footer__link px-1" to={withLocaleUrl("TermsOfUse")}>{Translate('TermsOfUse')}</Link>*/}
            {/*</div>*/}
        </footer>
    )
}

const WhoDisclaimer = () => (
    <p>
        {"The designations employed and the presentation of the material available on this platform does not imply the expression of any opinion whatsoever on the part of WHO, SeroTracker, or SeroTracker's partners concerning the legal status of any country, territory, city or area or of its authorities, or concerning the delimitation of its frontiers or boundaries. Dotted and dashed lines on maps represent approximate border lines for which there may not yet be full agreement."}
    </p>
)

export const Sponsers = () => (
    <div className="flex justify-around">
        <a href="https://www.covid19immunitytaskforce.ca/" target="__blank" rel="noopener noreferrer" className="flex my-4 justify-center">
            <Image src={"https://www.covid19immunitytaskforce.ca/wp-content/themes/pena-lite-child/CITF_logo_ENG.svg"} alt={"COVID-19 Immunity Task Force Logo"} className="flex w-full h-full max-w-xs object-contain" width={23} height={23}/>
        </a>
        <a href="https://cumming.ucalgary.ca/centres/centre-health-informatics" target="__blank" rel="noopener noreferrer" className="flex my-4 justify-center">
            <Image width={23} height={23} src={"/University-of-Calgary-Logo.png"} alt={"Centre for Health Informatics logo"} className="flex w-full h-full max-w-xs object-contain"/>
        </a>
        <a href="https://www.canada.ca/en/public-health.html/" target="__blank" rel="noopener noreferrer" className="flex my-4 justify-center">
            <Image width={23} height={23} src={"/public-health-agency.svg"} alt={"Public Health Agency Logo"} className="flex w-full h-full max-w-xs object-contain"/>
        </a>
        <a href="https://www.who.int/" target="__blank" rel="noopener noreferrer" className="flex my-4 justify-center">
            <Image width={23} height={23} src={"/WHO-EN-C-H.png"} alt={"World Health Organization Logo"} className="flex w-full h-full max-w-xs object-contain"/>
        </a>
        <a href="https://joulecma.ca/" target="__blank" rel="noopener noreferrer" className="flex my-4 justify-center">
            <Image width={23} height={23} src={"/amc-joule.png"} alt={"AMC Joule logo"} className="flex w-full h-full max-w-xs object-contain"/>
        </a>
    </div>
)

const PageLinks = () => (
    //TODO: update page links to be dynamic
    <div className="flex flex-row justify-between w-full max-h-80" >
        {
            Object.keys(PAGE_HASHES).map((page) => {
                return(
                    <div key={page} className="flex flex-col mr-1" style={{flexGrow: 1, flexBasis: 0}}>
                        <h5>{page.toUpperCase()}</h5>
                        {
                            Object.keys(PAGE_HASHES[page]).map(h =>
                                <Link key={`${page}-${h}`} href={"/pathogen/arbovirus/dashboard"}>{h}</Link>
                                )
                        }
                    </div>)})
        }
    </div>)

