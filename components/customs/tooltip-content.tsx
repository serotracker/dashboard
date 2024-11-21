import React from "react";
import Link from "next/link"

interface WHORegionsTooltipProps {
  children?: React.ReactNode;
}

export const WHORegionsTooltip = (props: WHORegionsTooltipProps) => (
  <div className="inline">
    <p className="text-sm">AFR: African Region</p>
    <p className="text-sm">AMR: Region of the Americas</p>
    <p className="text-sm">EMR: Eastern Mediterranean Region</p>
    <p className="text-sm">EUR: European Region</p>
    <p className="text-sm">SEAR: South-East Asia Region</p>
    <p className="text-sm">WPR: Western Pacific Region</p>
    <p className="inline text-sm">A webpage showing which country belongs to which WHO region can be found </p>
    <Link className="inline text-link text-sm" href="https://www.who.int/countries" target="__blank" rel="noopener noreferrer">here</Link>
    <p className="inline text-sm">.</p>
    {props.children ?? null}
  </div>
);

interface UNRegionsTooltipProps {
  children?: React.ReactNode;
}

export const UNRegionsTooltip = (props: UNRegionsTooltipProps) => (
  <div className="inline">
    <p className="inline text-sm">A webpage showing which country belongs to which UN region can be found </p>
    <Link className="inline text-link text-sm" href="https://unstats.un.org/unsd/methodology/m49/overview/" target="__blank" rel="noopener noreferrer">here</Link>
    <p className="inline text-sm">.</p>
    {props.children ?? null}
  </div>
);

interface ClopperPearsonConfidenceIntervalCalculationTooltipProps {
  children?: React.ReactNode;
}

export const ClopperPearsonConfidenceIntervalCalculationTooltip = (props: ClopperPearsonConfidenceIntervalCalculationTooltipProps) => (
  <div className="inline">
    <p className="text-sm">95% confidence intervals were calculated using the Clopper-Pearson method if not reported in the source.</p>
    {props.children ?? null}
  </div>
)

interface SampleSizeRestrictionTooltipProps {
  children?: React.ReactNode;
}

export const SampleSizeRestrictionTooltip = (props: SampleSizeRestrictionTooltipProps) => (
  <div className="inline">
    <p className="text-sm">Studies with a sample size under fifteen are excluded from this visualization.</p>
    {props.children ?? null}
  </div>
)

interface BarSizeRestrictionTooltipProps {
  children?: React.ReactNode;
}

export const BarSizeRestrictionTooltip = (props: BarSizeRestrictionTooltipProps) => (
  <div className="inline">
    <p className="text-sm">Bars which only include one study are excluded from this visualization. This may cause studies that appear in other parts of the dashboard to not appear in this visualization.</p>
    {props.children ?? null}
  </div>
)