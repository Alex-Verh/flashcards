import { CARDSETS_URL, CATEGORIES_URL } from "./endpoints";

const stringifyQueryParams = (paramsObj) =>
  Object.entries(paramsObj)
    .reduce(
      (prev, param) => (param[1] ? [...prev, `${param[0]}=${param[1]}`] : prev),
      []
    )
    .join("&");

export const getCardsets = async (params) => {
  const { filter, ...otherParams } = params;
  const url = `${CARDSETS_URL}?${stringifyQueryParams(otherParams)}${
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
