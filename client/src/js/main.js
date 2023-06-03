import "../sass/pages/main.scss";

const questionAnswer = {
  "What is a flashcard?":
    "A flashcard is a double-sided tool used for learning, consisting of a question or term on one side and the corresponding explanation on the other side.",
  "Why flashcards are useful?":
    "Flashcards are used as a study tool to enhance memorization by promoting active repetition and reinforcement of information in a concise and portable format.",
  "How are flashcards grouped?":
    "Flashcards can be grouped based on various criteria such as topic, category, difficulty level, or any other classification that helps organize the flashcards within a card set.",
  "How do I study flashcards?":
    "To study flashcards, review each card by attempting to recall the answer, checking your response, and repeating the process while focusing on challenging cards.",
  "Can I share my flashcards?":
    "Yes, you can share flashcards by making the card set public and accessible to others.",
};

const categoryColor = {
  Math: "#41fdfe",
  Science: "#ff66ff",
  Language: "#00ff7c",
  History: "#9f00ff",
  Geography: "#87fd05",
  Literature: "#fe4164",
  Art: "#ff9889",
  Music: "#fedf08",
  Philosophy: "#fcfd74",
  Religion: "#ffa62b",
  Sports: "#fff000",
  Medicine: "#f4c430",
  Business: "#ff7fa7",
  Law: "#fe6700",
  Technology: "#08E8DE",
  Social: "#f0e681",
  Psychology: "#fe01b1",
  Education: "#ffc82a",
  Politics: "#ff878d",
  Environment: "#fff600",
  Other: "#bb1237",
};

const getCardsets = async (
  offset = 0,
  limit = 16,
  searchQ = "",
  categoryId = 0,
  sortBy = ""
) => {
  const res = await fetch(
    `http://localhost:5000/api/cardsets?limit=${limit}&offset=${offset}&categoryId=${categoryId}`
  );
  const cardsets = await res.json();
  return cardsets;
};

const loadCardsets = async () => {
  const cardsetsContainer = document.querySelector(".main__card-sets .row");
  const cardsets = await getCardsets();
  cardsets.forEach((cardset) => {
    cardsetsContainer.insertAdjacentHTML(
      "beforeend",
      `
    <div class="col-sm-6 col-md-4 col-lg-3">
      <div class="card-set">
        <div class="card-set__counter">
          <img src="../img/flashcard_counter.svg" alt="Nr" />
          <span>${cardset.flashcards_qty}</span>
        </div>
        <div class="card-set__category">${cardset.category}</div>
        <div class="card-set__name">${cardset.title}</div>
        <div class="card-set__author">${cardset.author}</div>
        <div class="card-set__saved">
          <img src="../img/saved_counter.svg" alt="Nr" />
          <span>${cardset.saves}</span>
        </div>
      </div>
    </div>
    `
    );
  });
};

document.addEventListener("DOMContentLoaded", () => {
  import("./modules/dropdown");

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

  loadCardsets();
});
