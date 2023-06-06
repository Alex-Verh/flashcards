import { CARDSETS_URL, CATEGORIES_URL } from "./endpoints";

export const getCardsets = async ({
  offset = 0,
  limit = 16,
  searchQ = "",
  categoryId = 0,
  sortBy = "",
  filter,
}) => {
  const url = `${CARDSETS_URL}?limit=${limit}&offset=${offset}&categoryId=${categoryId}&searchQuery=${searchQ}&sortBy=${sortBy}${
    filter ? "&" + filter + "=true" : ""
  }`;

  const res = await fetch(url);
  const cardsets = await res.json();
  return cardsets;
};

export const getCategories = async () => {
  const res = await fetch(CATEGORIES_URL);
  return await res.json();
};
