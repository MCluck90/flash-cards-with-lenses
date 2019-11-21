import React from 'react';
import { FlashCard, AppState } from '../types';
import { connect, MapDispatchToProps } from 'react-redux';
import {
  getFlashCardsFromAppState,
  getSelectedCardIndexFromAppState,
  getSideToShowFromAppState
} from '../lenses';
import {
  flipCard,
  nextCard,
  shuffle,
  prevCard,
  loadFlashCards
} from './effects';

interface StateProps {
  flashCards: FlashCard[];
  selectedCardIndex: number;
  sideToShow: 'front' | 'back';
}

interface DispatchProps {
  flipCard(): void;
  prevCard(): void;
  nextCard(): void;
  shuffle(): void;
  loadFlashCards(flashCards: FlashCard[]): void;
}

type Props = StateProps & DispatchProps;

const FlashCardsComponent: React.FC<Props> = ({
  selectedCardIndex,
  sideToShow,
  flashCards,
  flipCard,
  prevCard,
  nextCard,
  shuffle,
  loadFlashCards
}) => {
  const onChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (!event.target.files || event.target.files.length !== 1) {
      return;
    }

    const file = event.target.files[0];
    const reader = new FileReader();
    reader.readAsText(file, 'UTF-8');
    reader.onload = evt => {
      if (!evt.target || typeof evt.target.result !== 'string') {
        return;
      }
      const flashCards: FlashCard[] = JSON.parse(evt.target.result);
      loadFlashCards(flashCards);
    };
  };
  return (
    <div>
      <h1>{flashCards[selectedCardIndex][sideToShow]}</h1>
      <i>{sideToShow}</i>
      <h3>
        {selectedCardIndex + 1} / {flashCards.length}
      </h3>
      <br />
      <button onClick={() => flipCard()}>Flip</button>
      <br />
      <button onClick={() => prevCard()}>Prev</button>
      <button onClick={() => nextCard()}>Next</button>
      <br />
      <button onClick={() => shuffle()}>Shuffle</button>
      <br />
      <input type="file" accept="application/json" onChange={onChange} />
    </div>
  );
};

const mapStateToProps = (state: AppState): StateProps => ({
  flashCards: getFlashCardsFromAppState.get(state),
  selectedCardIndex: getSelectedCardIndexFromAppState.get(state),
  sideToShow: getSideToShowFromAppState.get(state)
});

const mapDispatchToProps: MapDispatchToProps<DispatchProps, {}> = dispatch => ({
  flipCard: () => dispatch(flipCard()),
  prevCard: () => dispatch(prevCard()),
  nextCard: () => dispatch(nextCard()),
  shuffle: () => dispatch(shuffle()),
  loadFlashCards: (flashCards: FlashCard[]) =>
    dispatch(loadFlashCards(flashCards))
});

export const FlashCards = connect(
  mapStateToProps,
  mapDispatchToProps
)(FlashCardsComponent);
