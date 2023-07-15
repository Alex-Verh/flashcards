"use strict";

import "../sass/pages/register.scss";
import {
  validateName,
  validateEmail,
  validatePassword,
} from "./modules/validation";
import { initInput } from "./modules/input";
import { initModals } from "./modules/modals";

document.addEventListener("DOMContentLoaded", () => {
  initModals();

  const registerForm = document.querySelector("#registerForm");
  const matchPasswords = () => {
    const areEqual =
      registerForm.password.value === registerForm.repeatPassword.value;
    const result = { isValid: areEqual };
    if (!areEqual) {
      result.detail = "Passwords must match";
    }
    return result;
  };
  const username = initInput(registerForm.username, validateName);
  const email = initInput(registerForm.email, validateEmail);
  const repeatPassword = initInput(registerForm.repeatPassword, matchPasswords);
  const password = initInput(registerForm.password, (password) => {
    registerForm.repeatPassword.value && repeatPassword.validate();
    const firstValidation = validatePassword(password);
    return !firstValidation.isValid
      ? firstValidation
      : registerForm.repeatPassword.value
      ? matchPasswords()
      : { isValid: true };
  });
  registerForm.addEventListener("submit", (e) => {
    e.preventDefault();
    if (
      username.validate() &&
      email.validate() &&
      password.validate() &&
      repeatPassword.validate()
    ) {
      registerForm.submit();
    }
  });
});
