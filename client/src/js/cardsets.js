import "../sass/pages/cardsets.scss";
import { initCardsetsSection } from "./modules/cardsets";
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
});
