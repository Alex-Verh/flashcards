import "../sass/pages/main.scss";

const questionAnswer = {
  "What is a flashcard?" : "Dura pumba aloha",
  "What is a pumba?" : "Dura xoxo aloha",
  "What is a moris?" : "Dura dsx aloha",
  "What is a denchik?" : "Dura slayy aloha",
  "What is a guzgan?" : "Dura pumb!!!a aloha",
}

document.addEventListener("DOMContentLoaded", () => {
  import("./modules/dropdown");

  const questionCard = document.querySelector("#question-card");
  const answerCard = document.querySelector("#answer-card");
  const questionsContainer = document.querySelector(".help__questions");
  const questions = Object.keys(questionAnswer);

  questions.forEach((question) => {
    questionsContainer.insertAdjacentHTML("beforeend", `
    <div class="help__question">${question}</div>
    `)
  })

  questionCard.innerHTML = questions[0];
  answerCard.innerHTML = questionAnswer[questions[0]];

  questionsContainer.addEventListener("click", (event) => {
    const question = event.target.closest(".help__question");
    if (question) {
      questionCard.innerHTML = question.innerHTML;
      answerCard.innerHTML = questionAnswer[question.innerHTML];
    }
  })
});
