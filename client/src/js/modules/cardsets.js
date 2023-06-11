import { getCardsets, saveCardset } from "../api/queries";
import { categoryColor } from "../constants";
import { initDropdown } from "./dropdown";
import { openModal } from "./modals";

import flashcardsIco from "../../img/icons/counter-ico.svg";
import saveIco from "../../img/icons/save-ico.svg";
import savedIco from "../../img/icons/saved-ico.svg";
import deleteIco from "../../img/icons/delete-ico.svg";

export const generateCardsetsHTML = (cardsets) => {
  const cardsetsHTML = cardsets.reduce(
    (prev, cardset) =>
      prev +
      `
    <div class="col-sm-6 col-md-4 col-lg-3">
      <div class="card-set">
        <div class="card-set__counter">
          <img src=${flashcardsIco} alt="Nr" />
          <span>${cardset.flashcards_qty}</span>
        </div>
        <div class="card-set__category" style="background-color: ${
          categoryColor[cardset.category]
        }">${cardset.category}</div>
        <div class="card-set__name">${cardset.title}</div>
        <div class="card-set__author">${cardset.author}</div>
        <div class="card-set__saved" data-cardset-id="${cardset.id}">
          <img src=${cardset.is_saved ? savedIco : saveIco} alt="Nr"/>
          <span>${cardset.saves}</span>
        </div>
      </div>
    </div>
    `,
    ""
  );
  return cardsetsHTML;
};

export const handleCardsetSave = async (saveBtn) => {
  const cardsetId = saveBtn.dataset.cardsetId;
  const prevContent = saveBtn.innerHTML;
  try {
    saveBtn.innerHTML = `
        <div style="border: 10px solid; transform: translateX(-8px);" class="loading-spinner"></div>
        `;
    const res = await saveCardset(cardsetId);

    saveBtn.innerHTML = `
          <img src=${res.saved ? savedIco : saveIco} alt="Nr"/>
          <span>${res.saves}</span>
          `;
  } catch (e) {
    if (+e.message === 401) {
      openModal(document.querySelector(".unauthorized-modal"));
      saveBtn.innerHTML = prevContent;
    }
  }
};

export const initCardsetsSection = (
  queryParams,
  cardsetsContainerSelector,
  loadMoreBtnSelector,
  searchSelector,
  categorySelector,
  sortBySelector,
  typeSelector
) => {
  const cardsetsContainer = document.querySelector(cardsetsContainerSelector);
  const loadMoreBtn = document.querySelector(loadMoreBtnSelector);

  const loadCardsets = async () => {
    cardsetsContainer.insertAdjacentHTML(
      "afterend",
      `
      <div style="display: flex; justify-content: center; margin-top: 30px">
        <div class="loading-spinner"></div>
      </div>
    `
    );
    const cardsets = await getCardsets(queryParams);
    cardsetsContainer.insertAdjacentHTML(
      "beforeend",
      generateCardsetsHTML(cardsets)
    );

    cardsetsContainer.nextElementSibling.remove();
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

  typeSelector &&
    initDropdown(typeSelector, (clickedItem) => {
      queryParams.filter = clickedItem.dataset.filter;
      queryParams.offset = 0;
      cardsetsContainer.innerHTML = "";
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
