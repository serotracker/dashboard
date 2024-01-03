/**
 * @file CardCollection Component
 * @description This component organizes and renders components inside cards of variable length.
 * The cards are all next to each other horizontally and occupy a certain number of columns that can vary as functions are called.
 * Please see card-collection-types.tsx for a list of all of the types of cards and how they behave.
 */

import { useEffect, useState } from 'react';

import { Card } from "../card";
import { CardConfiguration, CardInputData, CardStyle, isFixedCardConfiguration } from "./card-collection-types";
import { useCardCollectionConfiguration } from "./use-card-collection-configuration";

interface CardCollectionProps {
  cardInputData: CardInputData[];
  columnCountToFill: number;
}

interface CardContentProps {
  cardWidthClass: string;
  cardConfiguration: CardConfiguration;
  cardConfigurations: CardConfiguration[];
}

const CardContent = ({cardWidthClass, cardConfiguration, cardConfigurations}: CardContentProps) => {
  const [previousCardWidthClass, setPreviousCardWidthClass] = useState<string>(cardWidthClass);

  useEffect(() => {
    if(cardWidthClass !== previousCardWidthClass) {
      setPreviousCardWidthClass(cardWidthClass)

      if(isFixedCardConfiguration(cardConfiguration)) {
        return;
      }

      cardConfiguration.onCardSizeChange?.();
    }
  }, [previousCardWidthClass, cardWidthClass]);

  return cardConfiguration.renderCardContent({ cardConfigurations });
}

export const CardCollection = ({ cardInputData, columnCountToFill }: CardCollectionProps) => {
  const { cardConfigurations } = useCardCollectionConfiguration({
    cardInputData,
    columnCountToFill,
  });

  return (
    <>
      {cardConfigurations.sort((a, b) => a.order > b.order ? 1 : -1).map((card) => {
        const cardWidthClass = `span ${card.currentColumnCount} / span ${card.currentColumnCount}`;

        if(card.cardStyle === CardStyle.CARD) {
          return (
            <Card
              key={card.cardId}
              className={card.cardClassname}
              style={{gridColumn: cardWidthClass}}
              hidden={card.currentColumnCount <= 0}
            >
              <CardContent cardWidthClass={cardWidthClass} cardConfiguration={card} cardConfigurations={cardConfigurations} />
            </Card>
          )
        }

        return (
          <div
            key={card.cardId}
            className={card.cardClassname}
            style={{gridColumn: cardWidthClass}}
            hidden={card.currentColumnCount <= 0}
          >
            <CardContent cardWidthClass={cardWidthClass} cardConfiguration={card} cardConfigurations={cardConfigurations} />
          </div>
        )
      })}
    </>
  );
};
