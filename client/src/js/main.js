import "../sass/pages/main.scss";
import {
  handleCardsetSave,
  handleCardsetDelete,
  initCardsetCreation,
  initCardsetsSection,
} from "./modules/cardsets";
import { initModals } from "./modules/modals";
import { questionAnswer } from "./constants";
import { loadCategories } from "./modules/categories";
import { initLearn } from "./modules/learn";

document.addEventListener("DOMContentLoaded", () => {
  initModals();
  try {
    initCardsetCreation();
  } catch (e) {
    console.log(e);
  }
  initLearn();
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
    .addEventListener("click", (e) => {
      const saveBtn = e.target.closest(".card-set__save");
      const deleteBtn = e.target.closest(".card-set__delete");
      if (saveBtn) {
        handleCardsetSave(saveBtn);
      } else if (deleteBtn) {
        handleCardsetDelete(deleteBtn);
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
