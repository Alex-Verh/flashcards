export const initDropdown = (selector, onChange, initialValue) => {
  const dropdown = document.querySelector(selector);
  const dropdownBtn = dropdown.firstElementChild;
  let isOpen = false;

  if (initialValue) {
    dropdownBtn.classList.add("dropdown__btn_choosed");
    dropdownBtn.textContent = initialValue;
  }

  dropdownBtn.addEventListener("click", (e) => {
    if (isOpen) {
      dropdownBtn.parentElement.blur();
      isOpen = false;
    } else {
      dropdownBtn.parentElement.focus();
      isOpen = true;
    }
  });

  dropdown.lastElementChild.addEventListener("click", (e) => {
    const target = e.target.closest("li");
    if (target) {
      dropdownBtn.classList.add("dropdown__btn_choosed");
      dropdownBtn.textContent = target.textContent;
      dropdownBtn.parentElement.blur();
      isOpen = false;
      onChange(target);
    }
  });
};
