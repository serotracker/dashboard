export enum CardType {
  FIXED = 'FIXED',
  EXPANDABLE = 'EXPANDABLE',
  FILL_REMAINING_SPACE = 'FILL_REMAINING_SPACE'
}

export interface FixedCardInputData {
  type: CardType.FIXED,
  order: number,
  columnCount: number,
  cardId: string,
  renderCardContent: (input: {cardConfiguration: CardConfiguration[]}) => React.ReactNode,
  cardClassname: string,
}

export interface ExpandableCardInputData {
  type: CardType.EXPANDABLE,
  order: number,
  expandedColumnCount: number,
  isExpandedByDefault: boolean,
  cardId: string,
  renderCardContent: (input: {cardConfiguration: CardConfiguration[]}) => React.ReactNode,
  cardClassname: string,
}

export interface FillRemainingSpaceCardInputData {
  type: CardType.FILL_REMAINING_SPACE,
  order: number,
  cardId: string,
  renderCardContent: (input: {cardConfiguration: CardConfiguration[]}) => React.ReactNode,
  cardClassname: string,
}

export type CardInputData = FixedCardInputData | ExpandableCardInputData | FillRemainingSpaceCardInputData;

interface CardStateExtraFields {
  currentColumnCount: number;
}
export type FixedCardState = FixedCardInputData & CardStateExtraFields;
export type ExpandableCardState = ExpandableCardInputData & CardStateExtraFields & { isExpanded: boolean };
export type FillRemainingSpaceCardState = FillRemainingSpaceCardInputData & CardStateExtraFields;
export type CardState = FixedCardState | ExpandableCardState | FillRemainingSpaceCardState;
export type CardStateWithoutCurrentColumnCount = Omit<FixedCardState, 'currentColumnCount'> | Omit<ExpandableCardState, 'currentColumnCount'> | Omit<FillRemainingSpaceCardState, 'currentColumnCount'>;

interface CardConfigurationExtraFields {}
export type FixedCardConfiguration = FixedCardState & CardConfigurationExtraFields;
export type ExpandableCardConfiguration = ExpandableCardState & CardConfigurationExtraFields & { minimizeCard: () => void, expandCard: () => void }
export type FillRemainingSpaceCardConfiguration = FillRemainingSpaceCardState & CardConfigurationExtraFields;
export type CardConfiguration = FixedCardConfiguration | ExpandableCardConfiguration | FillRemainingSpaceCardConfiguration;

export const isFixedCardInputData = (cardInputData: CardInputData): cardInputData is FixedCardInputData => cardInputData.type === CardType.FIXED;
export const isExpandableCardInputData = (cardInputData: CardInputData): cardInputData is ExpandableCardInputData => cardInputData.type === CardType.EXPANDABLE;
export const isFillRemainingSpaceCardInputData = (cardInputData: CardInputData): cardInputData is FillRemainingSpaceCardInputData => cardInputData.type === CardType.FILL_REMAINING_SPACE;

export const isFixedCardState = (cardState: CardState): cardState is FixedCardState => cardState.type === CardType.FIXED;
export const isExpandableCardState = (cardState: CardState): cardState is ExpandableCardState => cardState.type === CardType.EXPANDABLE;
export const isFillRemainingSpaceCardState = (cardState: CardState): cardState is FillRemainingSpaceCardState => cardState.type === CardType.FILL_REMAINING_SPACE;

export const isFixedCardStateWithoutCurrentColumnCount = (cardState: CardStateWithoutCurrentColumnCount): cardState is Omit<FixedCardState, 'currentColumnCount'> => cardState.type === CardType.FIXED;
export const isExpandableCardStateWithoutCurrentColumnCount = (cardState: CardStateWithoutCurrentColumnCount): cardState is Omit<ExpandableCardState,'currentColumnCount'> => cardState.type === CardType.EXPANDABLE;
export const isFillRemainingSpaceCardStateWithoutCurrentColumnCount = (cardState: CardStateWithoutCurrentColumnCount): cardState is Omit<FillRemainingSpaceCardState,'currentColumnCount'> => cardState.type === CardType.FILL_REMAINING_SPACE;

export const isFixedCardConfiguration = (cardConfiguration: CardConfiguration): cardConfiguration is FixedCardConfiguration => cardConfiguration.type === CardType.FIXED;
export const isExpandableCardConfiguration = (cardConfiguration: CardConfiguration): cardConfiguration is ExpandableCardConfiguration => cardConfiguration.type === CardType.EXPANDABLE;
export const isFillRemainingSpaceCardConfiguration = (cardConfiguration: CardConfiguration): cardConfiguration is FillRemainingSpaceCardConfiguration => cardConfiguration.type === CardType.FILL_REMAINING_SPACE;