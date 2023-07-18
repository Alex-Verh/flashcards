import { getCardsets, getFlashcards } from "../api/queries";
import { generateFlashcardSideEl } from "./flashcards";
import { closeModal, openModal, useMessageModal } from "./modals";

const initCardsetsChoice = async (onSubmit, initialActiveCardsets = []) => {
  const chooseCardsetModal = document.querySelector(".choose-modal");
  const cardsetsContainer = chooseCardsetModal.querySelector(
    ".choose-modal__cardsets"
  );
  const searchInput = chooseCardsetModal.querySelector(
    "#searchLearningCardsets"
  );
  const activeCardsets = new Map(
    initialActiveCardsets.map((cardset) => [
      cardset.id,
      { id: cardset.id, title: cardset.title },
    ])
  );

  const getCardsetsHtml = (cardsets, initialHtml = "") => {
    return cardsets.reduce((prev, cardset) => {
      const isActive = activeCardsets.has(cardset.id);
      return (
        prev +
        `
      <button class="choose-modal__cardset${
        isActive ? "  choose-modal__cardset_active" : ""
      }" data-cardset-id="${cardset.id}">
        ${cardset.title}
      </button>
      `
      );
    }, initialHtml);
  };

  const loadCardsets = async () => {
    try {
      const ownCardsets = await getCardsets({
        limit: 50,
        filter: "onlyOwn",
      });
      const savedCardsets = await getCardsets({
        limit: 50,
        filter: "onlySaved",
      });
      return { own: ownCardsets, saved: savedCardsets };
    } catch (e) {
      if (+e.message === 401) {
        return await getCardsets({
          limit: 20,
        });
      }
    }
  };
  const separatedCardsets = await loadCardsets();
  const showInitialCardsets = () => {
    cardsetsContainer.innerHTML =
      separatedCardsets.own && separatedCardsets.saved
        ? getCardsetsHtml(
            separatedCardsets.own,
            '<div class="choose-modal__divider">Own card sets</div>'
          ) +
          getCardsetsHtml(
            separatedCardsets.saved,
            '<div class="choose-modal__divider">Saved card sets</div>'
          )
        : getCardsetsHtml(separatedCardsets);
  };

  showInitialCardsets();
  const allCardsets =
    separatedCardsets.own && separatedCardsets.saved
      ? [...separatedCardsets.own, ...separatedCardsets.saved]
      : separatedCardsets;

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
    showInitialCardsets();
    searchInput.value = "";
  });
  searchInput.addEventListener("input", (e) => {
    const searchValue = e.target.value;
    if (!searchValue) {
      showInitialCardsets();
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
  let cardsets = [];
  initialCardset && cardsets.push(initialCardset);
  const modalEl = document.querySelector(".mode-choice");
  const cardsetsContainer = modalEl.querySelector(".cardsets");
  const showCardsets = (cardsets) => {
    cardsetsContainer
      .querySelectorAll(".cardsets__cardset")
      .forEach((set) => set.remove());
    cardsets.forEach((cardset) => {
      const set = document.createElement("div");
      set.classList.add("cardsets__cardset");

      set.innerHTML = `<button class="cardsets__cardset-remove">&#x2715;</button>${cardset.title}`;
      set.firstElementChild.addEventListener("click", (e) => {
        e.stopPropagation();
        cardsets.forEach((set, index) => {
          if (+set.id === +cardset.id) {
            cardsets.splice(index, 1);
          }
        });
        showCardsets(cardsets);
      });
      cardsetsContainer.lastElementChild.insertAdjacentElement(
        "beforebegin",
        set
      );
    });
  };

  showCardsets(cardsets);

  initCardsetsChoice((selectedCardsets) => {
    cardsets.fill();
    cardsets = selectedCardsets;
    showCardsets(cardsets);
  }, cardsets);

  modalEl.querySelector("#startLearn").addEventListener("click", (e) => {
    e.stopPropagation();
    closeModal(modalEl);
    onStart({
      cardsets,
      mode: modalEl.querySelector('input[name="learningMode"]:checked').value,
      shuffleMode: modalEl.querySelector('input[name="shuffleMode"]:checked')
        .value,
    });
  });
};

export const initLearn = (initialCardset) => {
  const learningModal = document.querySelector(".learning.modal");
  const cardWrapper = learningModal.querySelector(
    ".learning__flashcard-wrapper"
  );
  const toolsContainer = learningModal.querySelector(".learning__tools");

  const showFlashcardSide = (flashcard, side, counterInnerHTML) => {
    if (!["front", "back"].includes(side)) {
      return;
    }
    cardWrapper.replaceChildren(
      generateFlashcardSideEl({
        containerClass: "learning__flashcard",
        imagesClass: "learning__flashcard-images",
        imageClass: "learning__flashcard-image",
        textClass: `learning__flashcard-text learning__flashcard-text_${side}`,
        audioClass: "learning__flashcard-audio",
        text: side === "front" ? flashcard.title : flashcard.content,
        images: flashcard.attachments[side + "side"].images,
        audio: flashcard.attachments[side + "side"].audio,
        extraHTML: `<div class="learning__counter">${counterInnerHTML}</div>`,
      })
    );
    const flipBtn = toolsContainer.children[1];
    flipBtn.onclick = () => {
      showFlashcardSide(
        flashcard,
        side === "front" ? "back" : "front",
        counterInnerHTML
      );
      flipBtn.previousElementSibling.classList.remove("none");
      flipBtn.nextElementSibling.classList.remove("none");
    };
  };
  const showFlashcard = (flashcards, side, statistics) => {
    const currentFlashcard = flashcards[0];
    if (!currentFlashcard) {
      closeModal(learningModal);
      useMessageModal(`
      <h1 style="font-size: 26px;font-weight: 600;margin: 20px;">Your learn statistics:</h1>
      <div style="margin-bottom: 20px;font-size: 18px;font-weight: 600;">
      Correct answers: ${statistics.correct}<br>
      Incorrect answers: ${statistics.incorrect}<br>
      Total attempts: ${statistics.totalAttempts}</div>
      `);
      return;
    }
    showFlashcardSide(
      currentFlashcard,
      side,
      `${statistics.totalCards - flashcards.length + 1}/${
        statistics.totalCards
      }`
    );

    const incorrectBtn = toolsContainer.children[0];
    incorrectBtn.classList.add("none");
    incorrectBtn.onclick = () => {
      flashcards.push(flashcards.shift());
      statistics.incorrect++;
      statistics.totalAttempts++;
      showFlashcard(flashcards, side, statistics);
    };
    const correctBtn = toolsContainer.children[2];
    correctBtn.classList.add("none");
    correctBtn.onclick = () => {
      flashcards.shift();
      statistics.correct++;
      statistics.totalAttempts++;
      showFlashcard(flashcards, side, statistics);
    };
  };

  initLearnChoice(initialCardset, async ({ cardsets, mode, shuffleMode }) => {
    openModal(learningModal);
    const flashcards = await getFlashcards(
      cardsets.map((cardset) => cardset.id)
    );
    if (shuffleMode === "shuffle") {
      for (let i = flashcards.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [flashcards[i], flashcards[j]] = [flashcards[j], flashcards[i]];
      }
    }
    const statistics = {
      totalCards: flashcards.length,
      totalAttempts: 0,
      correct: 0,
      incorrect: 0,
    };
    const side = mode === "guessContent" ? "front" : "back";
    const header = mode === "guessContent" ? "Guess Content" : "Guess Title";
    learningModal.querySelector(".learning__title").innerHTML = header;
    showFlashcard(flashcards, side, statistics);
  });
};
