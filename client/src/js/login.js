"use strict";

import "../sass/pages/login.scss";

document.addEventListener("DOMContentLoaded", () => {
  document.querySelectorAll(".input").forEach((input) => {
    input.addEventListener("change", () => {
      input.classList.remove("input_error");
      if (input.nextElementSibling.matches(".input__error-msg")) {
        input.nextElementSibling.remove();
      }
    });
  });
});
