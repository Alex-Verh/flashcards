"use strict";

document.addEventListener("DOMContentLoaded", () => {
  const learnModal = document.querySelector("#learn_modal");
  const learnTitle = document.querySelector("#learn-title");
  const flipButton = learnModal.querySelector("#flip");
  const correctButton = learnModal.querySelector("#correct");
  const incorrectButton = learnModal.querySelector("#incorrect")
  const restartButton = learnModal.querySelector("#restart");

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
            "Guess content &nbsp;&nbsp;&nbsp;&nbsp;<span id='card-count'>3/15</span>";
          getFlashcards().then((flashcards) =>
            new FlashCardsLearn(flashcards, "content", "#learn-content")
          );
        } else {
          learnTitle.innerHTML =
            "Guess title &nbsp;&nbsp;&nbsp;&nbsp; <span id='card-count'>3/15</span>";
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
        flipButton.classList.remove("hide");
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
      this.remainingCards = this.flashcards.map((_, index) => index)
      this.shuffleFlashcards()
      this.currentFlashcard = this.flashcards[this.remainingCards.slice(-1)[0]];
      this.mode = mode;
      this.learnModal = document.querySelector(learnModalSelector);
      this.statistics = {correct: 0, incorrect: 0}
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
      this.hideButtons();

      this.statistics.correct++
      this.remainingCards.pop();
      if (this.remainingCards.length <= 0) {
        this.finishLearn();
        return;
      }
      this.showNextCard()
    }

    markIncorrect() {
      this.hideButtons();

      this.statistics.incorrect++
      this.remainingCards.unshift(this.remainingCards.pop());
      this.showNextCard();
    }

    updateCounter() {
      this.learnModal.querySelector("#card-count").textContent = `${
        this.flashcards.length - this.remainingCards.length + 1
      }/${this.flashcards.length}`;
    }

    showNextCard() {
      const currentCardIndex = this.remainingCards.slice(-1)[0]
      this.currentFlashcard = this.flashcards[currentCardIndex];
      this.updateCounter();
      this.displayCard();
    }
   
    hideButtons() {
      correctButton.classList.add("hide");
      incorrectButton.classList.add("hide");
    }

    finishLearn() {
      learnModal.querySelectorAll(".learn-button").forEach(element => element.classList.add("hide"));
      restartButton.classList.remove("disable")

      const totalAnswers = this.statistics.correct + this.statistics.incorrect
      const correctness = Math.round(this.statistics.correct / totalAnswers * 100)
      this.learnModal.querySelector(".learning-flashcard").innerHTML = `
        <div class = "only-text">
          <h3>The learning has finished.</h3>
          <h2>Your correctness is ${correctness}%</h2>
          <br>
          <p>You can restart or exit current process.</p>
        </div>
      `
    }

    restartLearn() {
      restartButton.classList.add("disable");
      flipButton.classList.remove("hide");
      this.remainingCards = this.flashcards.map((_, index) => index)
      this.shuffleFlashcards()
      this.currentFlashcard = this.flashcards[this.remainingCards.slice(-1)[0]];
      this.statistics = {correct: 0, incorrect: 0}
      this.displayCard();
      this.updateCounter();
    }

    bindButtonsClickEvents() {
      flipButton.onclick = this.flipCard.bind(this);
      correctButton.onclick = this.markCorrect.bind(this);
      incorrectButton.onclick = this.markIncorrect.bind(this);
      restartButton.onclick = this.restartLearn.bind(this)

    }

    shuffleFlashcards() {
      for (let i = this.remainingCards.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [this.remainingCards[i], this.remainingCards[j]] = [this.remainingCards[j], this.remainingCards[i]];
      }
    }
  }
});
