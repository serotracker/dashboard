import { Card } from "../card";
import { CardConfiguration } from "./card-collection-types";

interface CardCollectionProps {
  cardConfiguration: CardConfiguration[];
}

export const CardCollection = (input: CardCollectionProps) => {
  const { cardConfiguration } = input;

  return (
    <>
      {cardConfiguration.sort((a, b) => a.order > b.order ? 1 : -1).map((card) => (
        <Card
          className={card.cardClassname}
          style={{gridColumn: `span ${card.currentColumnCount} / span ${card.currentColumnCount}`}}
          hidden={card.currentColumnCount <= 0}
        >
          {card.renderCardContent({ cardConfiguration })}
        </Card>
      ))}
    </>
  );
};
