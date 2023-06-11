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

    link.addEventListener("click", () => {
      openModal(modal);
      link.parentElement?.parentElement?.blur();
    });
  });

  closeModalBtns.forEach((closeBtn) => {
    closeBtn.addEventListener("click", () => {
      closeModal(closeBtn.parentElement);
    });
  });

  const profileButton = document.querySelector(".nav__profile");
  if (profileButton) {
    profileButton.addEventListener("click", () => {
      profileButton.parentElement.focus();
    });
  }
};
