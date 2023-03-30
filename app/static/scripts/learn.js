import { getFlashCardSideHTML } from "./flashcard.js";

function chooseLearn() {
  const learningSets = document.getElementsByClassName("set");

  for (var i = 0; i < learningSets.length; i++) {
    let setClasses = learningSets[i].classList;
    learningSets[i].addEventListener("click", function (event) {
      event.preventDefault();
      if (setClasses.contains("selected-set")) {
        setClasses.remove("selected-set");
      } else {
        setClasses.add("selected-set");
      }
    });
  }
}

function learnModal() {
  const learnModal = document.getElementById("learn_modal");
  const learnTitle = document.getElementById("learn-title");  
  const flipCard = document.querySelector("#flip");

  document
    .getElementById("start_learning")
    .addEventListener("click", function (event) {
      event.preventDefault();
      if (document.querySelector(".selected-set")) {
        learnModal.classList.add("transition");

        // Checks what mode is checked
        if (document.querySelector('input[name="mode"]:checked').value == 1) {
          learnTitle.innerHTML = "Guess content:&nbsp;&nbsp;&nbsp;&nbsp;<span id='card-count'>3/15</span>";
          getFlashcards().then((flashcards) =>
            beginLearning(flashcards, "content")
          );
        } else {
          learnTitle.innerHTML = "Guess title: &nbsp;&nbsp;&nbsp;&nbsp; <span id='card-count'>3/15</span>";
          getFlashcards().then((flashcards) =>
            beginLearning(flashcards, "title")
          );
        }
      } else {
        alert("Choose a set to start learning!");
      }
    });


    flipCard.addEventListener('click', function(event) {
      event.preventDefault();
    })
    

    learnModal
    .querySelector("#learn-close")
    .addEventListener("click", function (event) {
      event.preventDefault();
      const userConfirm = confirm(
        "Are you sure you want to quit learning process?"
      );
      if (userConfirm) {
        learnModal.classList.remove("transition");
        learnModal.querySelector(".learning-flashcard").remove();
      }
    });

}

function beginLearning(flashcards, mode) {
  const learnContainer = document.querySelector('#learn-content')
  const flashcardEl = document.createElement("div");
  flashcardEl.classList.add('learning-flashcard')
  if (mode === "content") {
    flashcardEl.innerHTML = `
    <div class="learn-screen">
      ${getFlashCardSideHTML(flashcards[0].title, flashcards[0].attachments.frontside)}
    </div>
    `;
  } else if (mode === "title") {
    flashcardEl.innerHTML = `
    <div class="learn-screen">
      ${getFlashCardSideHTML(flashcards[0].content, flashcards[0].attachments.backside)}
    </div>
    `;
  }
  
  learnContainer.append(flashcardEl)
}

async function getFlashcards() {
  const cardSetsIds = []
  document.querySelectorAll(".selected-set").forEach((set) => {
    const setId = +set.id.split("-")[1];
    cardSetsIds.push(setId)
  });
  const flashcards = [];
  for (let index = 0; index < cardSetsIds.length; index++) {
    const cardSetId = cardSetsIds[index];
    const formData = new FormData();
    formData.append("cardset_id", cardSetId);
    const response = await fetch("/api/flashcards", {
      method: "POST",
      body: formData,
    });
    const data = await response.json();
    flashcards.push(...data);
  }
  return flashcards;
}

export { chooseLearn, learnModal };
