import "../sass/pages/cardsets.scss";

document.addEventListener("DOMContentLoaded", () => {
  const dropdowns = document.querySelectorAll(".dropdown__btn");
  dropdowns.forEach((btn) => {
    btn.addEventListener("click", () => {
      btn.parentElement.focus();
    });
  });
});
