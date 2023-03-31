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
            new FlashCardsLearn(flashcards, "content", "#learn-content")
          );
        } else {
          learnTitle.innerHTML =
            "Guess title: &nbsp;&nbsp;&nbsp;&nbsp; <span id='card-count'>3/15</span>";
          getFlashcards().then((flashcards) =>
            new FlashCardsLearn(flashcards, "title", "#learn-content")
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
        learnModal.querySelector(".learning-flashcard").innerHTML = "";
        learnModal.querySelector("#correct").classList.add("hide");
        learnModal.querySelector("#incorrect").classList.add("hide");
      }
    });

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
      this.shuffleFlashcards()
      this.currentFlashcard = this.flashcards[this.flashcards.length - 1];
      this.mode = mode;
      this.totalCards = flashcards.length;
      this.learnModal = document.querySelector(learnModalSelector);
      this.bindButtonsClickEvents();
      this.displayCard();
      this.updateCounter();
    }

    displayCard() {
      const flashcardHTML = `
          <div class="learn-screen${this.mode === "content" ? "" : " disable"}">
          ${getFlashCardSideHTML(
            this.currentFlashcard.title,
            this.currentFlashcard.attachments.frontside,
            true
          )}
          </div>
          <div class="learn-screen${this.mode === "title" ? "" : " disable"}">
          ${getFlashCardSideHTML(
            this.currentFlashcard.content,
            this.currentFlashcard.attachments.backside,
            true
          )}
          </div>
      `;
      this.learnModal.querySelector(".learning-flashcard").innerHTML =
        flashcardHTML;
    }

    flipCard() {
      this.learnModal
        .querySelectorAll(".learn-screen")
        .forEach((screen) => screen.classList.toggle("disable"));
      this.learnModal
        .querySelectorAll(".learn-button")
        .forEach((button) => button.classList.remove("hide"));
    }

    markCorrect() {
      this.flashcards.pop();
      if (this.flashcards.length <= 0) {
        // TODO: make changes when finish learning
        return;
      }
      this.showNextCard()
    }

    markIncorrect() {
      this.flashcards.unshift(this.flashcards.pop())
      this.showNextCard()
    }

    updateCounter() {
      this.learnModal.querySelector("#card-count").textContent = `${
        this.totalCards - this.flashcards.length + 1
      }/${this.totalCards}`;
    }

    showNextCard() {
      this.currentFlashcard = this.flashcards[this.flashcards.length - 1];
      learnModal.querySelector("#correct").classList.add("hide");
      learnModal.querySelector("#incorrect").classList.add("hide");
      this.updateCounter();
      this.displayCard();
    }

    bindButtonsClickEvents() {
      this.learnModal.querySelector("#flip").onclick = this.flipCard.bind(this);
      this.learnModal.querySelector("#correct").onclick = this.markCorrect.bind(this);
      this.learnModal.querySelector("#incorrect").onclick = this.markIncorrect.bind(this);

    }

    shuffleFlashcards() {
      for (let i = this.flashcards.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [this.flashcards[i], this.flashcards[j]] = [this.flashcards[j], this.flashcards[i]];
      }
    }
  }
});
