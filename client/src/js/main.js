import "../sass/pages/main.scss";
import { getCardsets, getCategories } from "./api/queries";
import { generateCardsetsHTML } from "./modules/cardsets";
import { questionAnswer } from "./constants";
import { initDropdown } from "./modules/dropdown";

document.addEventListener("DOMContentLoaded", () => {
  /// Categories loading ///
  getCategories().then((categories) => {
    const categoriesContainer = document.querySelector("#categoriesDropdown");
    const categoriesHTML = categories.reduce(
      (prev, category) =>
        prev +
        `<li class="dropdown__item" data-category-id="${category.id}">${category.title}</li>`,
      ""
    );
    categoriesContainer.insertAdjacentHTML("beforeend", categoriesHTML);
  });

  /// Card Sets section ///
  const cardsetsParams = {
    offset: 0,
    limit: 16,
    searchQ: "",
    categoryId: 0,
    sortBy: "",
  };
  const cardsetsContainer = document.querySelector(".main__card-sets .row");

  const loadCardsets = async () => {
    const cardsets = await getCardsets(cardsetsParams);
    cardsetsContainer.insertAdjacentHTML(
      "beforeend",
      generateCardsetsHTML(cardsets)
    );
    if (cardsets.length < cardsetsParams.limit) {
      document.querySelector("#loadMoreBtn").classList.add("none");
    } else {
      document.querySelector("#loadMoreBtn").classList.remove("none");
    }
  };

  loadCardsets(cardsetsParams, cardsetsContainer);

  document.querySelector("#loadMoreBtn").addEventListener("click", () => {
    cardsetsParams.offset += cardsetsParams.limit;
    loadCardsets();
  });

  document.querySelector("#search").addEventListener("change", (e) => {
    cardsetsParams.searchQ = e.target.value;
    cardsetsParams.offset = 0;
    cardsetsContainer.innerHTML = "";
    loadCardsets();
  });

  initDropdown("#category", (clickedItem) => {
    cardsetsParams.categoryId = clickedItem.dataset.categoryId;
    cardsetsParams.offset = 0;
    cardsetsContainer.innerHTML = "";
    loadCardsets();
  });

  initDropdown("#sortBy", (clickedItem) => {
    cardsetsParams.sortBy = clickedItem.dataset.sortId;
    cardsetsParams.offset = 0;
    cardsetsContainer.innerHTML = "";
    loadCardsets();
  });

  /// END Card Sets section ///

  ///  FAQ section ///
  const questionCard = document.querySelector("#question-card");
  const answerCard = document.querySelector("#answer-card");
  const questionsContainer = document.querySelector(".help__questions");
  const questions = Object.keys(questionAnswer);

  questions.forEach((question) => {
    questionsContainer.insertAdjacentHTML(
      "beforeend",
      `
    <div class="help__question">${question}</div>
    `
    );
  });

  questionCard.innerHTML = questions[0];
  answerCard.innerHTML = questionAnswer[questions[0]];

  questionsContainer.addEventListener("click", (event) => {
    const question = event.target.closest(".help__question");
    if (question) {
      questionCard.innerHTML = question.innerHTML;
      answerCard.innerHTML = questionAnswer[question.innerHTML];
    }
  });
  ///  END FAQ section ///
});
