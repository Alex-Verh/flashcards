"use strict";

import "../sass/pages/login.scss";
import { resetUserPsw } from "./api/queries";
import { initInput } from "./modules/input";
import { initModals } from "./modules/modals";

document.addEventListener("DOMContentLoaded", () => {
  initModals();

  const loginContainer = document.querySelector(".register .container");
  const initLogin = () => {
    document.querySelectorAll(".input").forEach((input) => {
      input.addEventListener("change", () => {
        input.classList.remove("input_error");
        if (
          input.nextElementSibling &&
          input.nextElementSibling.matches(".input__error-msg")
        ) {
          input.nextElementSibling.remove();
        }
      });
    });
    document
      .querySelector(".register__forget-pass")
      .addEventListener("click", () => {
        const prevHTML = loginContainer.innerHTML;
        loginContainer.innerHTML = `<button>Back</button><h1 style="font-size: 2rem; margin-bottom: 30px">Reset Password</h1>`;
        const newForm = document.createElement("form");
        newForm.innerHTML = `
        <div class="register__field">
          <div style="text-align: left; margin-bottom: 20px; color; #4d4d4d;">Please, enter username or email of your account.<br>We will send you reset password instuctions.</div>
          <input autocomplete="off" class="input" id="email" name="username" type="text" placeholder="Username or email">
        </div>
        <input class="button" id="submit" type="submit" value="Next">
      `;
        const username = initInput(newForm.username, (username) => {
          if (!username) {
            return { isValid: false, detail: "This field is required" };
          } else {
            return { isValid: true };
          }
        });
        newForm.addEventListener("submit", (e) => {
          e.preventDefault();
          if (username.validate()) {
            const formData = new FormData(newForm);
            resetUserPsw(formData).then(
              (res) => (loginContainer.innerHTML = res.message)
            );
          }
        });
        loginContainer.append(newForm);
        loginContainer.firstElementChild.addEventListener("click", () => {
          loginContainer.innerHTML = prevHTML;
          initLogin();
        });
      });
  };
  initLogin();
});
