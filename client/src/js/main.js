import "../sass/pages/main.scss";
import { questionAnswer } from "./constants";
import { loadCardsets } from "./modules/cardsets";

document.addEventListener("DOMContentLoaded", () => {
  import("./modules/dropdown");

  loadCardsets();

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
