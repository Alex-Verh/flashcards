import { getCardsets, getFlashcards } from "../api/queries";
import { generateFlashcardSideEl } from "./flashcards";
import { closeModal, openModal, useMessageModal } from "./modals";

class FlashcardsLearn {
  constructor(initialCardset) {
    this.cardsets = new Set();
    this.flashcards = [];
    initialCardset && this.cardsets.add(initialCardset);
  }
  addCardset(cardset) {
    if (this.cardsets.has()) {
      throw new Error();
    }
  }
}

const getCardsetsHtml = (cardsets, initialHtml = "") => {
  return cardsets.reduce(
    (prev, cardset) =>
      prev +
      `
      <button class="choose-modal__cardset" data-cardset-id="${cardset.id}">
        ${cardset.title}
      </button>
      `,
    initialHtml
  );
};

const initCardsetsChoice = async (onSubmit, disabledCardsets) => {
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
        cardsetsContainer.innerHTML =
          '<p style="margin-top: 45px">No such saved or own<br />card sets</p>';
        const btn = document.createElement("button");
        btn.classList.add("button", "button_small");
        btn.innerHTML = "Find globally";
        btn.style.marginTop = "10px";
        btn.addEventListener("click", () => {
          cardsetsContainer.insertAdjacentHTML(
            "beforeend",
            `
          <div style="display: flex; justify-content: center; margin-top: 20px">
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
  }, cardsets);
  modalEl.querySelector("#startLearn").addEventListener("click", (e) => {
    e.stopPropagation();
    closeModal(modalEl);
    onStart({
      cardsets,
      mode: modalEl.querySelector('input[name="learningMode"]:checked').value,
    });
  });
};

export const initLearn = (initialCardset) => {
  const learningModal = document.querySelector(".learning.modal");
  const cardWrapper = learningModal.querySelector(
    ".learning__flashcard-wrapper"
  );
  const toolsContainer = learningModal.querySelector(".learning__tools");

  const showFlashcardSide = (flashcard, side) => {
    const baseCardOptions = {
      containerClass: "learning__flashcard",
      imagesClass: "learning__flashcard-images",
      imageClass: "learning__flashcard-image",
      textClass: "learning__flashcard-text",
      audioClass: "learning__flashcard-audio",
    };
    if (side === "front") {
      cardWrapper.replaceChildren(
        generateFlashcardSideEl({
          ...baseCardOptions,
          text: flashcard.title,
          images: flashcard.attachments.frontside.images,
          audio: flashcard.attachments.frontside.audio,
        })
      );
      toolsContainer.children[1].onclick = () => {
        showFlashcardSide(flashcard, "back");
      };
    } else if (side === "back") {
      cardWrapper.replaceChildren(
        generateFlashcardSideEl({
          ...baseCardOptions,
          text: flashcard.content,
          images: flashcard.attachments.backside.images,
          audio: flashcard.attachments.backside.audio,
        })
      );
      toolsContainer.children[1].onclick = () => {
        showFlashcardSide(flashcard, "front");
      };
    }
  };
  const showFlashcard = (flashcards, side) => {
    const currentFlashcard = flashcards[0];
    if (!currentFlashcard) {
      useMessageModal("Final!!!");
      return;
    }
    if (side === "front") {
      showFlashcardSide(currentFlashcard, "front");
    } else if (side === "back") {
      showFlashcardSide(currentFlashcard, "back");
    }
    toolsContainer.children[0].onclick = () => {
      flashcards.push(flashcards.shift());
      showFlashcard(flashcards, side);
    };
    toolsContainer.children[2].onclick = () => {
      flashcards.shift();
      showFlashcard(flashcards, side);
    };
  };

  initLearnChoice(initialCardset, async ({ cardsets, mode }) => {
    openModal(learningModal);
    const flashcards = await getFlashcards(
      cardsets.map((cardset) => cardset.id)
    );
    for (let i = flashcards.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [flashcards[i], flashcards[j]] = [flashcards[j], flashcards[i]];
    }
    const side = mode === "quessContent" ? "front" : "back";
    const header = mode === "quessContent" ? "Guess Content" : "Guess Title";
    learningModal.querySelector(".learning__title").innerHTML = header;
    showFlashcard(flashcards, side);
  });
};
