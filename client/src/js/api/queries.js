import {
  CARDSETS_URL,
  CARDSET_URL,
  CATEGORIES_URL,
  FLASHCARDS_URL,
  FLASHCARD_URL,
  RESET_PSW_URL,
  SAVE_CARDSET_URL,
  USER_URL,
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
  try {
    const res = await customFetch(url);
    return await res.json();
  } catch (e) {
    throw e;
  }
};

export const getCategories = async () => {
  const res = await customFetch(CATEGORIES_URL);
  return await res.json();
};

export const getCardset = async (id) => {
  try {
    const res = await customFetch(`${CARDSET_URL}/${id}`);
    return res.json();
  } catch (e) {
    throw e;
  }
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

export const updateCardset = async (id, formData) => {
  try {
    const res = await customFetch(`${CARDSET_URL}/${id}`, {
      method: "PATCH",
      body: formData,
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

export const updateUser = async (formData) => {
  try {
    const res = await fetch(USER_URL, {
      method: "PATCH",
      body: formData,
    });
    const json = await res.json();
    if (!res.ok) {
      if (+res.status === 400 && json) {
        throw new Error(JSON.stringify({ ...json, status: 400 }));
      }
      throw new Error(JSON.stringify({ status: +e.message }));
    }
    return json;
  } catch (e) {
    throw e;
  }
};

export const deleteUser = async () => {
  try {
    const res = await fetch(USER_URL, {
      method: "DELETE",
    });
    return res.json();
  } catch (e) {
    throw e;
  }
};

export const resetUserPsw = async (formData) => {
  try {
    const res = await fetch(RESET_PSW_URL, {
      method: "POST",
      body: formData,
    });
    return res.json();
  } catch (e) {
    throw e;
  }
};

export const createFlashcard = async (formData) => {
  try {
    const res = await customFetch(`${FLASHCARD_URL}`, {
      method: "POST",
      body: formData,
    });
    return res.json();
  } catch (e) {
    throw e;
  }
};

export const deleteFlashcard = async (id) => {
  try {
    const res = await customFetch(`${FLASHCARD_URL}/${id}`, {
      method: "DELETE",
    });
    return res.json();
  } catch (e) {
    throw e;
  }
};
