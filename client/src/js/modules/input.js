export const showInputError = (input, error) => {
  input.classList.add("input_error");
  input.nextElementSibling && input.nextElementSibling.remove();
  input.insertAdjacentHTML(
    "afterend",
    `
  <div class="input__error-msg">${error}</div>
  `
  );
};
export const hideInputError = (input) => {
  input.classList.remove("input_error");
  input.nextElementSibling && input.nextElementSibling.remove();
};

export const initInput = (input, validator) => {
  const validateInput = (value = input.value) => {
    const validation = validator(value);
    if (!validation.isValid) {
      showInputError(input, validation.detail);
    } else {
      hideInputError(input);
    }
    return validation.isValid;
  };
  input.addEventListener("change", (e) => {
    validateInput(e.target.value);
  });
  return { validate: validateInput };
};
