import "../sass/pages/register.scss";
import {
  validateName,
  validateEmail,
  validatePassword,
} from "./modules/validation";

const showInputError = (input, error) => {
  input.classList.add("input_error");
  input.nextElementSibling && input.nextElementSibling.remove();
  input.insertAdjacentHTML(
    "afterend",
    `
  <div class="register__error">${error}</div>
  `
  );
};
const hideInputError = (input) => {
  input.classList.remove("input_error");
  input.nextElementSibling && input.nextElementSibling.remove();
};

document.addEventListener("DOMContentLoaded", () => {
  const registerForm = document.querySelector("#registerForm");
  registerForm.username.addEventListener("change", (e) => {
    const target = e.target;
    const validation = validateName(target.value);
    if (!validation.isValid) {
      showInputError(target, validation.detail);
    } else {
      hideInputError(target);
    }
  });
  registerForm.email.addEventListener("change", (e) => {
    const target = e.target;
    const validation = validateEmail(target.value);
    if (!validation.isValid) {
      showInputError(target, validation.detail);
    } else {
      hideInputError(target);
    }
  });
  registerForm.password.addEventListener("change", (e) => {
    const target = e.target;
    const validation = validatePassword(target.value);
    if (!validation.isValid) {
      showInputError(target, validation.detail);
    } else {
      hideInputError(target);
    }
  });
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
