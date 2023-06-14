export const openModal = (modal) => {
  const closeModalWhenClickOutside = (e) => {
    if (!e.target.closest(`.${modal.classList[0]}`)) {
      closeModal(modal);
      document.body.removeEventListener("click", closeModalWhenClickOutside);
    }
  };
  modal.classList.remove("none");
  modal.parentElement.classList.remove("none");
  document.body.style.overflow = "hidden";
  document.body.addEventListener("click", closeModalWhenClickOutside);
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

export const useConfirmModal = (message, onConfirm) => {
  const modalOverlay = document.createElement("div");
  modalOverlay.classList.add("overlay");

  const modal = document.createElement("div");
  modal.classList.add("modal");
  modal.insertAdjacentHTML(
    "afterbegin",
    `
      <div class="modal__line"></div>
      <p style="margin: 10px">${message}</p>
    `
  );
  modal.style.width = "400px";
  const closeModal = () => {
    modalOverlay.remove();
    document.body.style.overflow = "auto";
  };
  const closeBtn = document.createElement("div");
  closeBtn.classList.add("modal__close");
  closeBtn.innerHTML =
    '<img src="static/img/icons/close-ico.svg" alt="Close" />';
  closeBtn.addEventListener("click", closeModal);
  modal.prepend(closeBtn);

  const confirmBtn = document.createElement("button");
  confirmBtn.innerHTML = "Yes";
  confirmBtn.classList.add("button");
  confirmBtn.style.margin = "5px";
  confirmBtn.addEventListener("click", () => {
    onConfirm();
    closeModal();
  });
  modal.append(confirmBtn);

  const rejectBtn = document.createElement("button");
  rejectBtn.innerHTML = "No";
  rejectBtn.classList.add("button");
  rejectBtn.style.margin = "5px";
  rejectBtn.addEventListener("click", closeModal);
  modal.append(rejectBtn);

  modalOverlay.append(modal);
  document.body.append(modalOverlay);
  document.body.style.overflow = "hidden";
};

export const initModals = () => {
  const openModalLinks = document.querySelectorAll("[data-modal-class]");
  const closeModalBtns = document.querySelectorAll(
    ".modal__close, .menu__close"
  );
  openModalLinks.forEach((link) => {
    const modalClass = link.dataset.modalClass;
    const modal = document.querySelector(`.${modalClass}`);
    link.addEventListener("click", (e) => {
      e.stopPropagation();
      if (
        modal.classList.contains("none") ||
        modal.parentElement.classList.contains("none")
      ) {
        openModal(modal);
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
