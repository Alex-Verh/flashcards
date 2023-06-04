export const initDropdown = (selector, onChange) => {
  const dropdown = document.querySelector(selector);
  const dropdownBtn = dropdown.firstElementChild;

  dropdownBtn.addEventListener("click", (e) => {
    dropdownBtn.parentElement.focus();
  });

  dropdown.lastElementChild.addEventListener("click", (e) => {
    const target = e.target.closest("li");
    if (target) {
      dropdownBtn.classList.add("dropdown__btn_choosed");
      dropdownBtn.textContent = target.textContent;
      dropdownBtn.parentElement.blur();
      onChange(target);
    }
  });
};
