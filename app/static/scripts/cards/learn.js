"use strict";

document.addEventListener("DOMContentLoaded", () => {
  const learnModal = document.querySelector("#learn_modal");
  const learnTitle = document.querySelector("#learn-title");

  document.querySelector("#more-sets").addEventListener("click", (event) => {
    const cardSet = event.target.closest(".set");
    if (cardSet) {
      cardSet.classList.toggle("selected-set");
    }
  });

  document
    .querySelector("#start_learning")
    .addEventListener("click", function (event) {
      event.preventDefault();
      if (document.querySelector(".selected-set")) {
        learnModal.classList.add("transition");

        // Checks what mode is checked
        if (document.querySelector('input[name="mode"]:checked').value == 1) {
          learnTitle.innerHTML =
            "Guess content:&nbsp;&nbsp;&nbsp;&nbsp;<span id='card-count'>3/15</span>";
          getFlashcards().then((flashcards) =>
            beginLearning(flashcards, "content")
          );
        } else {
          learnTitle.innerHTML =
            "Guess title: &nbsp;&nbsp;&nbsp;&nbsp; <span id='card-count'>3/15</span>";
          getFlashcards().then((flashcards) =>
            beginLearning(flashcards, "title")
          );
        }
      } else {
        alert("Choose a set to start learning!");
      }
    });

  learnModal
    .querySelector("#learn-close")
    .addEventListener("click", function (event) {
      const userConfirm = confirm(
        "Are you sure you want to quit learning process?"
      );
      if (userConfirm) {
        learnModal.classList.remove("transition");
        learnModal.querySelector(".learning-flashcard").remove();
      }
    });

  function beginLearning(flashcards, mode) {
    new FlashCardsLearn(flashcards, mode, "#learn-content").start();
  }

  async function getFlashcards() {
    const cardSetsIds = [];
    document.querySelectorAll(".selected-set").forEach((set) => {
      const setId = +set.id.split("-")[1];
      cardSetsIds.push(setId);
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

  class FlashCardsLearn {
    constructor(flashcards, mode, learnModalSelector) {
      this.flashcards = flashcards;
      this.currentFlashcard = flashcards[flashcards.length-1]
      this.mode = mode;
      this.learnModal = document.querySelector(learnModalSelector);
      this.defineOpenAndClosedSide();
      this.learnModal.addEventListener("click", this.onLearnModalButtonsClick.bind(this));
    }

    start() {
      this.showFlashCard(this.currentFlashcard, 'open');
    }
    showFlashCard(flashcard, side) {
      const flashcardHTML = `
          <div class="learn-screen">
          ${getFlashCardSideHTML(
            flashcard[this[`${side}Text`]],
            flashcard.attachments[this[`${side}Side`]],
            true
          )}
          </div>
      `;
      this.learnModal.querySelector(".learning-flashcard").innerHTML =
        flashcardHTML;
    }
    onLearnModalButtonsClick(event) {
      const target = event.target;
      if (target.closest("#correct")) {
        // code for correct
        console.log("correct");
      } else if (target.closest("#incorrect")) {
        // code for incorrect
        console.log("incorrect");
      } else if (target.closest("#flip")) {
        // code for flip
        this.showFlashCard(this.currentFlashcard, 'closed')
      }
    }

    defineOpenAndClosedSide() {
      if (this.mode === "content") {
        this.openSide = "frontside";
        this.openText = "title";
        this.closedSide = "backside";
        this.closedText = "content";
      } else if (this.mode === "title") {
        this.openSide = "backside";
        this.openText = "content";
        this.closedSide = "frontside";
        this.closedText = "title";
      }
    }
  }
});
