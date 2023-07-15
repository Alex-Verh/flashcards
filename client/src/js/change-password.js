"use strict";

import "../sass/pages/change-password.scss";

import { validatePassword } from "./modules/validation";
import { initInput } from "./modules/input";
import { initModals } from "./modules/modals";

document.addEventListener("DOMContentLoaded", () => {
  initModals();

  const changePswForm = document.querySelector("#changePswForm");
  const matchPasswords = () => {
    const areEqual =
      changePswForm.password.value === changePswForm.repeatPassword.value;
    const result = { isValid: areEqual };
    if (!areEqual) {
      result.detail = "Passwords must match";
    }
    return result;
  };
  const repeatPassword = initInput(
    changePswForm.repeatPassword,
    matchPasswords
  );
  const password = initInput(changePswForm.password, (password) => {
    changePswForm.repeatPassword.value && repeatPassword.validate();
    const firstValidation = validatePassword(password);
    return !firstValidation.isValid
      ? firstValidation
      : changePswForm.repeatPassword.value
      ? matchPasswords()
      : { isValid: true };
  });
  changePswForm.addEventListener("submit", (e) => {
    e.preventDefault();
    if (password.validate() && repeatPassword.validate()) {
      changePswForm.submit();
    }
  });
});
