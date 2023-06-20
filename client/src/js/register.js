import "../sass/pages/register.scss";
import {
  validateName,
  validateEmail,
  validatePassword,
} from "./modules/validation";
import { showInputError, hideInputError, initInput } from "./modules/input";

document.addEventListener("DOMContentLoaded", () => {
  const registerForm = document.querySelector("#registerForm");
  initInput(registerForm.username, validateName);
  initInput(registerForm.email, validateEmail);
  initInput(registerForm.password, validatePassword);

  registerForm.repeatPassword.addEventListener("change", (e) => {
    const target = e.target;
    const isValid = target.value === registerForm.password.value;
    if (!isValid) {
      showInputError(target, "Passwords must match");
    } else {
      hideInputError(target);
    }
  });
  registerForm.addEventListener("submit", (e) => {
    e.preventDefault();
    if (
      validateName(registerForm.username.value).isValid &&
      validateEmail(registerForm.email.value).isValid &&
      validatePassword(registerForm.password.value).isValid &&
      registerForm.repeatPassword.value === registerForm.password.value
    ) {
      registerForm.submit();
    }
  });
});
