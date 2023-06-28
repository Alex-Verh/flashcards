"use strict";

import "../sass/pages/login.scss";
import { initInput } from "./modules/input";
import { validateEmail } from "./modules/validation";

document.addEventListener("DOMContentLoaded", () => {
  const loginContainer = document.querySelector(".register .container");
  document.querySelectorAll(".input").forEach((input) => {
    input.addEventListener("change", () => {
      input.classList.remove("input_error");
      if (input.nextElementSibling.matches(".input__error-msg")) {
        input.nextElementSibling.remove();
      }
    });
  });

  document
    .querySelector(".register__forget-pass")
    .addEventListener("click", () => {
      const prevForm = loginContainer.firstElementChild.cloneNode(true);
      const prevEL = loginContainer.lastElementChild.cloneNode(true);
      loginContainer.innerHTML = "";
      const newForm = document.createElement("form");
      newForm.innerHTML = `
        <div class="register__field">
          <div style="text-align: left; margin-bottom: 20px; color; #4d4d4d;">Please, enter email of your account.<br>We will send you reset password instuctions.</div>
          <input autocomplete="off" class="input" id="email" name="email" type="email" placeholder="Email">
        </div>
        <input class="button" id="submit" type="submit" value="Next">
      `;
      initInput(newForm.email, validateEmail);
      newForm.addEventListener("submit", (e) => {
        e.preventDefault();
        if (validateEmail(newForm.email.value).isValid) {
          console.log("submit");
        }
      });
      loginContainer.append(newForm);
      loginContainer.insertAdjacentHTML(
        "afterbegin",
        `<button>Back</button><h1 style="font-size: 2rem; margin-bottom: 30px">Reset Password</h1>`
      );
      loginContainer.firstElementChild.addEventListener("click", () => {
        loginContainer.replaceChildren(prevForm);
        loginContainer.append(prevEL);
      });
    });
});
