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

export const getTextHeightInTextara = (textarea) => {
  const prevHeight = textarea.style.height;
  textarea.style.height = "1px";
  const textHeight = textarea.scrollHeight;
  textarea.style.height = prevHeight || null;
  return textHeight;
};

export const centerTextInTextarea = (textarea, isRenderedBeforeImages) => {
  const textHeight = getTextHeightInTextara(textarea);
  const height = textarea.clientHeight;
  const verticalPadding = `${(height - textHeight) / 2}px`;
  textarea.style.paddingTop = verticalPadding;
  textarea.style.paddingBottom = verticalPadding;
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
