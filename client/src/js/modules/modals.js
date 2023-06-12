export const openModal = (modal) => {
  modal.classList.remove("none");
  modal.parentElement.classList.remove("none");
  document.body.style.overflow = "hidden";
};

export const closeModal = (modal) => {
  const overlay = modal.parentElement;
  if (overlay.matches(".overlay")) {
    overlay.classList.add("none");
  } else {
    modal.classList.add("none");
  }
  document.body.style.overflow = "auto";
};

export const initModals = () => {
  const openModalLinks = document.querySelectorAll("[data-modal-class]");
  const closeModalBtns = document.querySelectorAll(
    ".modal__close, .menu__close"
  );
  openModalLinks.forEach((link) => {
    const modalClass = link.dataset.modalClass;
    const modal = document.querySelector(`.${modalClass}`);

    const closeModalWhenClickOutside = (e) => {
      console.log(modalClass);
      if (!e.target.closest(`.${modalClass}`)) {
        console.log("click");
        closeModal(modal);
        document.body.removeEventListener("click", closeModalWhenClickOutside);
      }
    };

    link.addEventListener("click", (e) => {
      e.stopPropagation();
      if (
        modal.classList.contains("none") ||
        modal.parentElement.classList.contains("none")
      ) {
        openModal(modal);
        document.body.addEventListener("click", closeModalWhenClickOutside);
      } else {
        closeModal(modal);
      }
    });
  });

  closeModalBtns.forEach((closeBtn) => {
    closeBtn.addEventListener("click", () => {
      closeModal(closeBtn.parentElement);
    });
  });
};
