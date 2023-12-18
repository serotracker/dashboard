import { Card } from "../card";
import { CardConfiguration, CardInputData } from "./card-collection-types";
import { useCardCollectionConfiguration } from "./use-card-collection-configuration";

interface CardCollectionProps {
  cardInputData: CardInputData[];
  columnCountToFill: number;
}

export const CardCollection = ({ cardInputData, columnCountToFill }: CardCollectionProps) => {
  const { cardConfigurations } = useCardCollectionConfiguration({
    cardInputData,
    columnCountToFill,
  });

  return (
    <>
      {cardConfigurations.sort((a, b) => a.order > b.order ? 1 : -1).map((card) => (
        <Card
          className={card.cardClassname}
          style={{gridColumn: `span ${card.currentColumnCount} / span ${card.currentColumnCount}`}}
          hidden={card.currentColumnCount <= 0}
        >
          {card.renderCardContent({ cardConfigurations })}
        </Card>
      ))}
    </>
  );
};
