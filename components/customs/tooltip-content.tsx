import React from "react";
import Link from "next/link"

interface WHORegionsTooltipProps {
  children?: React.ReactNode;
}

export const WHORegionsTooltip = (props: WHORegionsTooltipProps) => (
  <div className="inline">
    <p>AFR: African Region</p>
    <p>AMR: Region of the Americas</p>
    <p>EMR: Eastern Mediterranean Region</p>
    <p>EUR: European Region</p>
    <p>SEAR: South-East Asia Region</p>
    <p>WPR: Western Pacific Region</p>
    <p className="inline">A webpage showing which country belongs to which WHO region can be found </p>
    <Link className="inline text-link" href="https://www.who.int/countries" target="__blank" rel="noopener noreferrer">here</Link>
    <p className="inline">.</p>
    {props.children ?? null}
  </div>
);

interface UNRegionsTooltipProps {
  children?: React.ReactNode;
}

export const UNRegionsTooltip = (props: UNRegionsTooltipProps) => (
  <div className="inline">
    <p className="inline">A webpage showing which country belongs to which UN region can be found </p>
    <Link className="inline text-link" href="https://unstats.un.org/unsd/methodology/m49/overview/" target="__blank" rel="noopener noreferrer">here</Link>
    <p className="inline">.</p>
    {props.children ?? null}
  </div>
);

interface ClopperPearsonConfidenceIntervalCalculationTooltipProps {
  children?: React.ReactNode;
}

export const ClopperPearsonConfidenceIntervalCalculationTooltip = (props: ClopperPearsonConfidenceIntervalCalculationTooltipProps) => (
  <div className="inline">
    <p>95% confidence intervals were calculated using the Clopper-Pearson method if not reported in the source.</p>
    {props.children ?? null}
  </div>
)

interface SampleSizeRestrictionTooltipProps {
  children?: React.ReactNode;
}

export const SampleSizeRestrictionTooltip = (props: SampleSizeRestrictionTooltipProps) => (
  <div className="inline">
    <p>Studies with a sample size under five are excluded from this visualization.</p>
    {props.children ?? null}
  </div>
)