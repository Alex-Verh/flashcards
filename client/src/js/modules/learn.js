import { getCardsets, getFlashcards } from "../api/queries";
import { closeModal, openModal } from "./modals";

const getCardsetsHtml = (cardsets, initialHtml = "") => {
  return cardsets.reduce(
    (prev, cardset) =>
      prev +
      `
      <div class="choose-modal__cardset" data-cardset-id="${cardset.id}">
        ${cardset.title}
      </div>
      `,
    initialHtml
  );
};

const initCardsetsChoice = async (onSubmit) => {
  const chooseCardsetModal = document.querySelector(".choose-modal");
  const cardsetsContainer = chooseCardsetModal.querySelector(
    ".choose-modal__cardsets"
  );
  const activeCardsets = new Map();

  const loadCardsets = async () => {
    const ownCardsets = await getCardsets({
      limit: 50,
      categoryId: 0,
      filter: "onlyOwn",
    });
    cardsetsContainer.insertAdjacentHTML(
      "beforeend",
      getCardsetsHtml(
        ownCardsets,
        '<div class="choose-modal__divider">Own card sets</div>'
      )
    );
    const savedCardsets = await getCardsets({
      limit: 50,
      categoryId: 0,
      filter: "onlySaved",
    });
    cardsetsContainer.insertAdjacentHTML(
      "beforeend",
      getCardsetsHtml(
        savedCardsets,
        '<div class="choose-modal__divider">Saved card sets</div>'
      )
    );
    return [...ownCardsets, ...savedCardsets];
  };
  const allCardsets = await loadCardsets();

  cardsetsContainer.addEventListener("click", (e) => {
    const cardset = e.target.closest(".choose-modal__cardset");
    if (cardset) {
      const cardsetId = +cardset.dataset.cardsetId;
      if (activeCardsets.has(cardsetId)) {
        activeCardsets.delete(cardsetId);
        cardset.classList.remove("choose-modal__cardset_active");
      } else {
        activeCardsets.set(cardsetId, {
          id: cardsetId,
          title: cardset.textContent.trim(),
        });
        cardset.classList.add("choose-modal__cardset_active");
      }
    }
  });
  cardsetsContainer.nextElementSibling.addEventListener("click", () => {
    onSubmit(Array.from(activeCardsets.values()));
    closeModal(chooseCardsetModal);
  });

  const initialCardsetsHtml = cardsetsContainer.innerHTML;
  chooseCardsetModal
    .querySelector("#searchLearningCardsets")
    .addEventListener("input", (e) => {
      const searchValue = e.target.value;
      if (!searchValue) {
        cardsetsContainer.innerHTML = initialCardsetsHtml;
        return;
      }
      const filteredCardsets = allCardsets.filter((cardset) =>
        cardset.title.toLowerCase().includes(searchValue.toLowerCase())
      );
      if (filteredCardsets.length) {
        cardsetsContainer.innerHTML = getCardsetsHtml(filteredCardsets);
      } else {
        cardsetsContainer.innerHTML = "<p>No such saved or own card sets</p>";
        const btn = document.createElement("button");
        btn.innerHTML = "Find globally";
        btn.addEventListener("click", () => {
          cardsetsContainer.insertAdjacentHTML(
            "beforeend",
            `
          <div style="display: flex; justify-content: center; margin-top: 30px">
            <div class="loading-spinner"></div>
          </div>
          `
          );
          getCardsets({ limit: 50, categoryId: 0, searchQ: searchValue }).then(
            (cardsets) => {
              cardsetsContainer.innerHTML = getCardsetsHtml(cardsets);
            }
          );
        });
        cardsetsContainer.append(btn);
      }
    });
};

const initLearnChoice = (initialCardset, onStart) => {
  const cardsets = [];
  initialCardset && cardsets.push(initialCardset);
  const modalEl = document.querySelector(".mode-choice");
  const cardsetsContainer = modalEl.querySelector(".cardsets");

  const showCardsets = (cardsets) => {
    const cardsetsHTML = cardsets.reduce(
      (prev, cardset) =>
        prev + `<div class="cardsets__cardset">${cardset.title}</div>`,
      " "
    );
    cardsetsContainer.lastElementChild.insertAdjacentHTML(
      "beforebegin",
      cardsetsHTML
    );
  };

  showCardsets(cardsets);

  initCardsetsChoice((selectedCardsets) => {
    cardsets.push(...selectedCardsets);
    showCardsets(selectedCardsets);
  });
  modalEl.querySelector("#startLearn").addEventListener("click", (e) => {
    e.stopPropagation();
    onStart({
      cardsets,
      mode: modalEl.querySelector('input[name="learningMode"]:checked').value,
    });
    closeModal(modalEl);
  });
};

export const initLearn = (initialCardset) => {
  const learningModal = document.querySelector(".learning.modal");
  initLearnChoice(initialCardset, async ({ cardsets, mode }) => {
    const flashcards = await getFlashcards(
      cardsets.map((cardset) => cardset.id)
    );
    console.log(flashcards);
    openModal(learningModal);
  });
};
