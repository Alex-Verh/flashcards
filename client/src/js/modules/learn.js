import { getCardsets } from "../api/queries";
import { openModal } from "./modals";

export const initLearn = async () => {
  const chooseCardsetModal = document.querySelector(".choose-modal");
  const cardsetsContainer = chooseCardsetModal.querySelector(
    ".choose-modal__cardsets"
  );
  const getCardsetsHtml = (cardsets, initialHtml = "") => {
    return cardsets.reduce(
      (prev, cardset) =>
        prev +
        `
  <div class="choose-modal__cardset">
    ${cardset.title}
  </div>
  `,
      initialHtml
    );
  };
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
  const cardsets = await loadCardsets();
  const initialCardsetsHtml = cardsetsContainer.innerHTML;
  chooseCardsetModal
    .querySelector("#searchLearningCardsets")
    .addEventListener("input", (e) => {
      const searchValue = e.target.value;
      if (!searchValue) {
        cardsetsContainer.innerHTML = initialCardsetsHtml;
        return;
      }
      const filteredCardsets = cardsets.filter((cardset) =>
        cardset.title.toLowerCase().includes(searchValue.toLowerCase())
      );
      if (filteredCardsets.length) {
        cardsetsContainer.innerHTML = getCardsetsHtml(filteredCardsets);
      } else {
        cardsetsContainer.innerHTML = "<p>No such saved or own card sets</p>";
        const btn = document.createElement("button");
        // btn.classList.add("button");
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

  cardsetsContainer.addEventListener("click", (e) => {
    const cardset = e.target.closest(".choose-modal__cardset");
    if (cardset) {
      cardset.classList.toggle("choose-modal__cardset_active");
    }
  });
};
