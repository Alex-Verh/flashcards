import "../sass/pages/main.scss";
import { handleCardsetSave, initCardsetsSection } from "./modules/cardsets";
import { initModals, openModal } from "./modules/modals";
import { questionAnswer } from "./constants";
import { loadCategories } from "./modules/categories";
import { saveCardset } from "./api/queries";

document.addEventListener("DOMContentLoaded", () => {
  initModals();
  loadCategories();
  initCardsetsSection(
    {
      offset: 0,
      limit: 16,
      searchQ: "",
      categoryId: 0,
      sortBy: "",
    },
    ".main__card-sets .row",
    "#loadMoreBtn",
    "#search",
    "#category",
    "#sortBy"
  );

  document
    .querySelector(".main__card-sets .row")
    .addEventListener("click", async (e) => {
      const saveBtn = e.target.closest(".card-set__save");
      if (saveBtn) {
        handleCardsetSave(saveBtn);
      }
    });
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
