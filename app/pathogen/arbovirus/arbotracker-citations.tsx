import { cn } from "@/lib/utils";
import Link from "next/link";

export const suggestedArboTrackerCitationText = "Mairead G Whelan, Harriet Ware, Himanshu Ranka, Sean Kenny, Sabah Shaikh, Yannik Roell, Shaila Akter, Anabel Selemon, Emilie Toews, May Chu, Niklas Bobrovitz, Rahul K Arora, Thomas Jaenisch, ArboTracker: a multipathogen dashboard and data platform for arbovirus seroprevalence studies, The Lancet Infectious Diseases, 2024, ISSN 1473-3099, https://doi.org/10.1016/S1473-3099(24)00585-1. (https://www.sciencedirect.com/science/article/pii/S1473309924005851)";

export const SuggestedArboTrackerCitation = () => (
  <div className="inline italic">
    <p className="inline italic">Mairead G Whelan, Harriet Ware, Himanshu Ranka, Sean Kenny, Sabah Shaikh, Yannik Roell, Shaila Akter, Anabel Selemon, Emilie Toews, May Chu, Niklas Bobrovitz, Rahul K Arora, Thomas Jaenisch, ArboTracker: a multipathogen dashboard and data platform for arbovirus seroprevalence studies, The Lancet Infectious Diseases, 2024, ISSN 1473-3099, </p>
    <Link className="inline text-link italic" href="https://doi.org/10.1016/S1473-3099(24)00585-1" target="__blank" rel="noopener noreferrer">https://doi.org/10.1016/S1473-3099(24)00585-1</Link>
    <p className="inline italic">. (</p>
    <Link className="inline text-link italic" href="https://www.sciencedirect.com/science/article/pii/S1473309924005851" target="__blank" rel="noopener noreferrer">https://www.sciencedirect.com/science/article/pii/S1473309924005851</Link>
    <p className="inline italic">)</p>
  </div>
)

export const ArboTrackerCitationButtonContent = () => (
  <div className="inline">
    <p className="inline">How to cite us: </p>
    <Link className="inline text-link bg-stone-300 px-2 py-1 rounded-md" href="https://doi.org/10.1016/S1473-3099(24)00585-1" target="__blank" rel="noopener noreferrer" onClick={(event) => { event.stopPropagation(); }}>

      Lancet Inf. Dis.
    </Link>
  </div>
)

export const ArboTrackerCitationToastMessage = () => (
  <>
    <p className="inline">Suggested citation copied to your clipboard! Cite our dashboard and/or data at </p>
    <SuggestedArboTrackerCitation />
    <p className="inline">.</p>
  </>
)