import {
  CARDSETS_URL,
  CARDSET_URL,
  CATEGORIES_URL,
  FLASHCARDS_URL,
  SAVE_CARDSET_URL,
} from "./endpoints";

const stringifyQueryParams = (paramsObj) =>
  Object.entries(paramsObj)
    .reduce(
      (prev, param) => (param[1] ? [...prev, `${param[0]}=${param[1]}`] : prev),
      []
    )
    .join("&");

const customFetch = async (url, options = { method: "GET" }) => {
  const res = await fetch(url, options);
  if (!res.ok) {
    throw new Error(res.status);
  }
  return res;
};

export const getCardsets = async (params) => {
  const { filter, ...otherParams } = params;
  const url = `${CARDSETS_URL}?${stringifyQueryParams(otherParams)}${
    filter ? "&" + filter + "=true" : ""
  }`;

  const res = await customFetch(url);
  const cardsets = await res.json();
  return cardsets;
};

export const getCategories = async () => {
  const res = await customFetch(CATEGORIES_URL);
  return await res.json();
};

export const saveCardset = async (id) => {
  try {
    const res = await customFetch(`${SAVE_CARDSET_URL}/${id}`, {
      method: "PATCH",
    });
    return res.json();
  } catch (e) {
    throw e;
  }
};

export const deleteCardset = async (id) => {
  try {
    const res = await customFetch(`${CARDSET_URL}/${id}`, {
      method: "DELETE",
    });
    return res.json();
  } catch (e) {
    throw e;
  }
};

export const getFlashcards = async (cardsetsIds) => {
  try {
    const res = await customFetch(
      `${FLASHCARDS_URL}?cardsetsIds=${cardsetsIds.join(",")}`
    );
    return res.json();
  } catch (e) {
    throw e;
  }
};
