export const validateName = (name) => {
  const min = 3,
    max = 30,
    regEx = /^[-_a-zA-Z0-9]+$/;
  if (name.length < min || name.length > max) {
    return { isValid: false, detail: "Length must be between 3-30 characters" };
  }
  if (!regEx.test(name)) {
    return {
      isValid: false,
      detail: "Only letters, numbers and - _ are allowed ",
    };
  }
  return { isValid: true };
};

export const validateEmail = (email) => {
  const regEx =
    /^([\w-]+(?:\.[\w-]+)*)@((?:[\w-]+\.)*\w[\w-]{0,66})\.([a-z]{2,6}(?:\.[a-z]{2})?)$/i;

  if (!email) {
    return { isValid: false, detail: "This field is required" };
  }
  if (!regEx.test(email)) {
    return { isValid: false, detail: "Invalid email" };
  }
  return { isValid: true };
};

export const validatePassword = (password) => {
  const min = 6,
    max = 30,
    regEx = /^((?=\S*?[A-Z])(?=\S*?[a-z])(?=\S*?[0-9]).{6,})\S$/;

  if (password.length < min || password.length > max) {
    return { isValid: false, detail: "Length must be between 6-30 characters" };
  }
  if (!regEx.test(password)) {
    return {
      isValid: false,
      detail:
        "Must contain at least 1 uppercase letter, 1 lowercase letter, and 1 number with no spaces",
    };
  }
  return { isValid: true };
};

export const validateTitle = (title) => {
  const min = 3,
    max = 50;
  if (title.length < min || title.length > max) {
    return { isValid: false, detail: "Length must be between 3-50 characters" };
  }
  return { isValid: true };
};
