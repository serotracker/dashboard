import { useState, useEffect, useMemo } from "react";
import sumBy from "lodash/sumBy";
import {
  CardState,
  CardConfiguration,
  CardInputData,
  isFixedCardState,
  isFillRemainingSpaceCardState,
  FixedCardState,
  ExpandableCardState,
  FillRemainingSpaceCardState,
  CardStateWithoutCurrentColumnCount,
  isFixedCardStateWithoutCurrentColumnCount,
  isExpandableCardStateWithoutCurrentColumnCount,
  isFillRemainingSpaceCardStateWithoutCurrentColumnCount,
  isFixedCardInputData,
  isFillRemainingSpaceCardInputData,
  isExpandableCardInputData,
} from "./card-collection-types";
import { useMap } from "react-map-gl";

const getCardStatesWithColumnCountsRecalculated = (input: {
  cardStates: CardStateWithoutCurrentColumnCount[];
  columnCountToFill: number;
}): CardState[] => {
  const { cardStates, columnCountToFill } = input;

  let newCardStates: CardState[] = [];
  const fixedCardStates = cardStates.filter((cardState): cardState is FixedCardState => isFixedCardStateWithoutCurrentColumnCount(cardState));
  const expandableCardStates = cardStates.filter((cardState): cardState is ExpandableCardState => isExpandableCardStateWithoutCurrentColumnCount(cardState));
  const fillRemainingSpaceCardStates = cardStates.filter((cardState): cardState is FillRemainingSpaceCardState => isFillRemainingSpaceCardStateWithoutCurrentColumnCount(cardState));

  newCardStates = [...newCardStates, ...fixedCardStates.map((cardState) => ({ ...cardState, currentColumnCount: cardState.columnCount }))];
  newCardStates = [...newCardStates, ...expandableCardStates.map((cardState) => ({ ...cardState, currentColumnCount: cardState.isExpanded ? cardState.expandedColumnCount : 0 }))];

  const remainingColumnCount = columnCountToFill - sumBy(newCardStates, (cardState) => cardState.currentColumnCount);
  const columnsPerRemainingFillRemainingSpaceCardStates = remainingColumnCount / fillRemainingSpaceCardStates.length;

  newCardStates = [ ...newCardStates, ...fillRemainingSpaceCardStates.map((cardState) => ({ ...cardState, currentColumnCount: columnsPerRemainingFillRemainingSpaceCardStates }))];

  return newCardStates;
};

const getCardStatesWithExpansionStatusChanged = (input: {
  cardStates: CardStateWithoutCurrentColumnCount[];
  cardId: string;
  isExpanded: boolean;
}): CardStateWithoutCurrentColumnCount[] => {
  const { cardStates, cardId } = input;

  const elementToChange = cardStates.find(
    (element) => element.cardId === cardId
  );

  if (!elementToChange) {
    return cardStates;
  }

  if (!isExpandableCardStateWithoutCurrentColumnCount(elementToChange)) {
    return cardStates;
  }

  const newElement = { ...elementToChange, isExpanded: input.isExpanded };

  const newCardStates = [ ...cardStates.filter((element) => element.cardId !== cardId), newElement ];

  return newCardStates;
};

const getCardStatesUpdatedFromCardData = (input: {
  cardStates: CardStateWithoutCurrentColumnCount[];
  cardInputData: CardInputData[];
}): CardStateWithoutCurrentColumnCount[] => {
  const { cardStates, cardInputData } = input;

  return cardInputData.map((cardInputData) => {
    if (isFixedCardInputData(cardInputData)) {
      return {
        ...cardInputData,
        currentColumnCount: cardInputData.columnCount,
      };
    }

    if (isFillRemainingSpaceCardInputData(cardInputData)) {
      return {
        ...cardInputData,
      };
    }

    const existingExpandableCardState = cardStates.find(
      (element) => element.cardId === cardInputData.cardId
    );

    if (existingExpandableCardState && isExpandableCardInputData(existingExpandableCardState)) {
      return {
        ...cardInputData,
        isExpanded: existingExpandableCardState.isExpanded,
      };
    }

    return {
      ...cardInputData,
      isExpanded: cardInputData.isExpandedByDefault,
    };
  });
};

interface UseCardCollectionConfigurationInput {
  cardInputData: CardInputData[];
  columnCountToFill: number;
}

interface UseCardCollectionConfigurationOutput {
  cardConfigurations: CardConfiguration[];
}

export const useCardCollectionConfiguration = (
  input: UseCardCollectionConfigurationInput
): UseCardCollectionConfigurationOutput => {
  const [cardStates, _setCardStates] = useState<CardState[]>([]);

  const setCardStates = (
    newCardStates: CardStateWithoutCurrentColumnCount[]
  ) => {
    const cardStatesWithColumnCountsRecalculated = getCardStatesWithColumnCountsRecalculated({
      cardStates: newCardStates,
      columnCountToFill: input.columnCountToFill,
    });
    _setCardStates(cardStatesWithColumnCountsRecalculated);
  };

  const generateCardConfigurationFromCardState = (
    cardState: CardState
  ): CardConfiguration => {
    if (isFixedCardState(cardState) || isFillRemainingSpaceCardState(cardState)) {
      return cardState;
    }

    return {
      ...cardState,
      minimizeCard: () => {
        setCardStates(
          getCardStatesWithExpansionStatusChanged({
            cardStates,
            cardId: cardState.cardId,
            isExpanded: false,
          })
        );
      },
      expandCard: () => {
        setCardStates(
          getCardStatesWithExpansionStatusChanged({
            cardStates,
            cardId: cardState.cardId,
            isExpanded: true,
          })
        );
      },
    };
  };

  useEffect(() => {
    const { cardInputData } = input;
    const newCardStates = getCardStatesUpdatedFromCardData({
      cardStates,
      cardInputData,
    });

    setCardStates(newCardStates);
  }, [input.cardInputData]);

  const cardConfigurations = useMemo(() => {
    return cardStates.map((cardState) => generateCardConfigurationFromCardState(cardState));
  },[cardStates])

  return {
    cardConfigurations,
  };
};
