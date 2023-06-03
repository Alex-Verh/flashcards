import "../sass/pages/set.scss";

const flashcards = document.querySelector(".flashcards");

flashcards.addEventListener("click", (event) => {
    const flashcard = event.target.closest(".flashcards__card");
    if (flashcard) {
        flashcard.classList.toggle("flashcards__card-active");
    } 
})