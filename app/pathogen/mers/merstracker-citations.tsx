import Link from "next/link";

export const shortenedMERSTrackerCitationText = 'SeroTracker Research Group (2024); MERSTracker Dashboard. Website, accessible via https://new.serotracker.com/';
export const suggestedMERSTrackerCitationText = 'Ware H*, Whelan M*, Kenny S, Ranka H, SeroTracker Research Team, Bobrovitz N, Arora RK. (2024); MERSTracker: A Dashboard and Data Platform for Middle East Respiratory Syndrome surveillance studies; Website, accessible via https://new.serotracker.com/';

export const SuggestedMERSTrackerCitation = () => (
  <div className="inline italic">
    <p className="inline italic">Ware H*, Whelan M*, Kenny S, Ranka H, SeroTracker Research Team, Bobrovitz N, Arora RK. (2024); MERSTracker: A Dashboard and Data Platform for Middle East Respiratory Syndrome surveillance studies; Website, accessible via </p>
    <Link className="inline text-link italic" href="https://new.serotracker.com/" target="__blank" rel="noopener noreferrer">https://new.serotracker.com/</Link>
  </div>
)

export const MERSTrackerCitationButtonContent = () => (
  <p className="inline">Cite Us</p>
)

export const MERSTrackerCitationToastMessage = () => (
  <>
    <p className="inline">Suggested citation copied to your clipboard! Cite our dashboard and/or data at </p>
    <SuggestedMERSTrackerCitation />
    <p className="inline">.</p>
  </>
)