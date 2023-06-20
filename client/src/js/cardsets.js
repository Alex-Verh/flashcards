import "../sass/pages/cardsets.scss";
import {
  initCardsetsSection,
  handleCardsetSave,
  handleCardsetDelete,
} from "./modules/cardsets";
import { initModals } from "./modules/modals";
import { loadCategories } from "./modules/categories";

document.addEventListener("DOMContentLoaded", () => {
  initModals();
  loadCategories();
  initCardsetsSection(
    {
      offset: 0,
      limit: 50,
      searchQ: "",
      categoryId: 0,
      sortBy: "",
      filter: "onlyOwn",
    },
    ".main__card-sets .row",
    null,
    "#search",
    "#category",
    "#sortBy",
    "#cardsetsType"
  );
  document
    .querySelector(".main__card-sets .row")
    .addEventListener("click", (e) => {
      e.stopPropagation();
      const saveBtn = e.target.closest(".card-set__save");
      const deleteBtn = e.target.closest(".card-set__delete");
      if (saveBtn) {
        handleCardsetSave(saveBtn, (response) => {
          if (!response.saved) {
            saveBtn.parentElement.parentElement.remove();
          }
        });
      } else if (deleteBtn) {
        handleCardsetDelete(deleteBtn);
      }
    });
});
