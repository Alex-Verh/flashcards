import "../sass/pages/main.scss";

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

  loadCardsets();
});
