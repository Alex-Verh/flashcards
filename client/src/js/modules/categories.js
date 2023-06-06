import { getCategories } from "../api/queries";

export const loadCategories = async () => {
  const categories = await getCategories();
  const categoriesContainer = document.querySelector("#categoriesDropdown");
  const categoriesHTML = categories.reduce(
    (prev, category) =>
      prev +
      `<li class="dropdown__item" data-category-id="${category.id}">${category.title}</li>`,
    ""
  );
  categoriesContainer.insertAdjacentHTML("beforeend", categoriesHTML);
};
