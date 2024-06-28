import Link from "next/link"

export const WHORegionsTooltip = () => (
  <div>
    <p>AFR: African Region</p>
    <p>AMR: Region of the Americas</p>
    <p>EMR: Eastern Mediterranean Region</p>
    <p>EUR: European Region</p>
    <p>SEAR: South-East Asia Region</p>
    <p>WPR: Western Pacific Region</p>
    <p className="inline">A webpage showing which country belongs to which WHO region can be found </p>
    <Link className="inline text-link" href="https://www.who.int/countries" target="__blank" rel="noopener noreferrer">here</Link>
    <p className="inline">.</p>
  </div>
);

export const UNRegionsTooltip = () => (
  <div>
    <p className="inline">A webpage showing which country belongs to which UN region can be found </p>
    <Link className="inline text-link" href="https://unstats.un.org/unsd/methodology/m49/overview/" target="__blank" rel="noopener noreferrer">here</Link>
    <p className="inline">.</p>
  </div>
);