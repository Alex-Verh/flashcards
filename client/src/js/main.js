import "../sass/pages/main.scss";
document.addEventListener("DOMContentLoaded", () => {
  const dropdowns = document.querySelectorAll(".dropdown__btn");
  dropdowns.forEach((btn) => {
    btn.addEventListener("click", () => {
      btn.parentElement.focus();
    });
  });
});
