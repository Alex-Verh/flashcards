import { deleteCardset, getCardsets, saveCardset } from "../api/queries";
import { categoryColor } from "../constants";
import { initDropdown } from "./dropdown";
import { openModal, useConfirmModal } from "./modals";

import flashcardsIco from "../../img/icons/counter-ico.svg";
import saveIco from "../../img/icons/save-ico.svg";
import savedIco from "../../img/icons/saved-ico.svg";
import deleteIco from "../../img/icons/delete-ico.svg";

export const generateCardsetsHTML = (cardsets) => {
  const cardsetsHTML = cardsets.reduce((prev, cardset) => {
    const saveOrDeleteHTML = cardset.is_own
      ? `
     <div class="card-set__delete" data-cardset-id="${cardset.id}">
        <img src=${deleteIco} alt="delete"/>
      </div>
     `
      : `
      <div class="card-set__save" data-cardset-id="${cardset.id}">
        <img src=${cardset.is_saved ? savedIco : saveIco} alt="save"/>
        <span>${cardset.saves}</span>
      </div>
     `;

    return (
      prev +
      `
    <div class="col-sm-6 col-md-4 col-lg-3">
      <div class="card-set">
        <div class="card-set__counter">
          <img src=${flashcardsIco} alt="flashcards" />
          <span>${cardset.flashcards_qty}</span>
        </div>
        <div class="card-set__category" style="background-color: ${
          categoryColor[cardset.category.title]
        }">${cardset.category.title}</div>
        <a href="/cardset/${cardset.id}" class="card-set__name">${
        cardset.title
      }</a>
        <div class="card-set__author">${cardset.author.username}</div>
       ${saveOrDeleteHTML}
      </div>
    </div>
    `
    );
  }, "");
  return cardsetsHTML;
};

export const handleCardsetSave = async (saveBtn, onSuccess) => {
  const cardsetId = saveBtn.dataset.cardsetId;
  const prevContent = saveBtn.innerHTML;
  if (!(onSuccess instanceof Function)) {
    onSuccess = (response) => {
      saveBtn.innerHTML = `
          <img src=${response.saved ? savedIco : saveIco} alt="Nr"/>
          <span>${response.saves}</span>
          `;
    };
  }
  try {
    saveBtn.innerHTML = `
        <div style="border: 10px solid; transform: translateX(-8px);" class="loading-spinner"></div>
        `;
    const res = await saveCardset(cardsetId);
    onSuccess(res);
  } catch (e) {
    if (+e.message === 401) {
      openModal(document.querySelector(".unauthorized-modal"));
      saveBtn.innerHTML = prevContent;
    }
  }
};

export const handleCardsetDelete = (deleteBtn) => {
  useConfirmModal("Delete cardset?", () => {
    const cardsetId = deleteBtn.dataset.cardsetId;
    deleteBtn.innerHTML = `
            <div style="border: 10px solid; transform: translateX(-8px);" class="loading-spinner"></div>
            `;
    deleteCardset(cardsetId)
      .then(() => deleteBtn.parentElement.parentElement.remove())
      .catch((e) => {
        console.log(e);
        deleteBtn.innerHTML = prevContent;
      });
  });
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
    cardsetsContainer.nextElementSibling &&
      cardsetsContainer.nextElementSibling.remove();
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
    cardsetsContainer.nextElementSibling &&
      cardsetsContainer.nextElementSibling.remove();

    if (!cardsetsContainer.childElementCount) {
      cardsetsContainer.insertAdjacentHTML(
        "afterend",
        `
        <div style="text-align: center; font-size: 20px; margin-top: 50px; color: #6b6b6b">
          There is no cardsets now
        </div>
      `
      );
    }
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
    initDropdown(
      typeSelector,
      (clickedItem) => {
        queryParams.filter = clickedItem.dataset.filter;
        queryParams.offset = 0;
        cardsetsContainer.innerHTML = "";
        loadCardsets();
      },
      document.querySelector(`[data-filter=${queryParams.filter}]`).textContent
    );

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
