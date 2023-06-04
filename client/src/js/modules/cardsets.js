import { categoryColor } from "../constants";

export const generateCardsetsHTML = (cardsets) => {
  const cardsetsHTML = cardsets.reduce(
    (prev, cardset) =>
      prev +
      `
    <div class="col-sm-6 col-md-4 col-lg-3">
      <div class="card-set">
        <div class="card-set__counter">
          <img src="../img/flashcard_counter.svg" alt="Nr" />
          <span>${cardset.flashcards_qty}</span>
        </div>
        <div class="card-set__category" style="background-color: ${
          categoryColor[cardset.category]
        }">${cardset.category}</div>
        <div class="card-set__name">${cardset.title}</div>
        <div class="card-set__author">${cardset.author}</div>
        <div class="card-set__saved">
          <img src="../img/saved_counter.svg" alt="Nr" />
          <span>${cardset.saves}</span>
        </div>
      </div>
    </div>
    `,
    ""
  );
  return cardsetsHTML;
};
