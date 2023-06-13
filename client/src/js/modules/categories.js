import { getCategories } from "../api/queries";

export const loadCategories = async () => {
  const categories = await getCategories();
  const categoriesContainers = document.querySelectorAll(
    "[data-categories-dropdown]"
  );
  const categoriesHTML = categories.reduce(
    (prev, category) =>
      prev +
      `<li class="dropdown__item" data-category-id="${category.id}">${category.title}</li>`,
    ""
  );
  categoriesContainers.forEach((container) =>
    container.insertAdjacentHTML("beforeend", categoriesHTML)
  );
};
