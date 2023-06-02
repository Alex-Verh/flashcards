const dropdowns = document.querySelectorAll(".dropdown__btn");
dropdowns.forEach((btn) => {
  btn.addEventListener("click", () => {
    btn.parentElement.focus();
  });
  btn.nextElementSibling.addEventListener("click", (e) => {
    const target = e.target.closest(".dropdown__item");
    if (target) {
      btn.classList.add("dropdown__btn_choosed");
      btn.textContent = target.textContent;
      btn.parentElement.blur();
    }
  });
});
