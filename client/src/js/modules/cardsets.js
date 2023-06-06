import { getCardsets } from "../api/queries";
import { categoryColor } from "../constants";
import { initDropdown } from "./dropdown";

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

export const initCardsetsSection = (
  queryParams,
  cardsetsContainerSelector,
  loadMoreBtnSelector,
  searchSelector,
  categorySelector,
  sortBySelector
) => {
  const cardsetsContainer = document.querySelector(cardsetsContainerSelector);
  const loadMoreBtn = document.querySelector(loadMoreBtnSelector);

  const loadCardsets = async () => {
    const cardsets = await getCardsets(queryParams);
    cardsetsContainer.insertAdjacentHTML(
      "beforeend",
      generateCardsetsHTML(cardsets)
    );
    if (loadMoreBtn) {
      if (cardsets.length < queryParams.limit) {
        loadMoreBtn.classList.add("none");
      } else {
        loadMoreBtn.classList.remove("none");
      }
    }
  };

  loadCardsets(queryParams, cardsetsContainer);

  loadMoreBtn &&
    loadMoreBtn.addEventListener("click", () => {
      queryParams.offset += queryParams.limit;
      loadCardsets();
    });

  document.querySelector(searchSelector).addEventListener("change", (e) => {
    queryParams.searchQ = e.target.value;
    queryParams.offset = 0;
    cardsetsContainer.innerHTML = "";
    loadCardsets();
  });

  initDropdown(categorySelector, (clickedItem) => {
    queryParams.categoryId = clickedItem.dataset.categoryId;
    queryParams.offset = 0;
    cardsetsContainer.innerHTML = "";
    loadCardsets();
  });

  initDropdown(sortBySelector, (clickedItem) => {
    queryParams.sortBy = clickedItem.dataset.sortId;
    queryParams.offset = 0;
    cardsetsContainer.innerHTML = "";
    loadCardsets();
  });
};
