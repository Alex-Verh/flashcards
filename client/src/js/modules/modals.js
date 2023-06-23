import { initDropdown } from "./dropdown";
import { validateEmail, validateName, validateTitle } from "./validation";
import { showInputError, initInput } from "./input";
import { updateUser } from "../api/queries";

import closeIco from "../../img/icons/close-ico.svg";

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
  modal.classList.add("modal", "modal__small");
  modal.insertAdjacentHTML(
    "afterbegin",
    `
      <div class="modal__line"></div>
      <p style="margin: 10px; font-size: 18px">${message}</p>
    `
  );
  modal.style.width = "400px";
  modal.style.paddingBottom = "20px";
  const closeModal = () => {
    modalOverlay.remove();
    document.body.style.overflow = "auto";
  };
  const closeBtn = document.createElement("div");
  closeBtn.classList.add("modal__close");
  closeBtn.innerHTML = `<img src="${closeIco}" alt="Close" />`;
  closeBtn.addEventListener("click", closeModal);
  modal.prepend(closeBtn);

  const confirmBtn = document.createElement("button");
  confirmBtn.innerHTML = "YES";
  confirmBtn.classList.add("button");
  confirmBtn.style.margin = "5px";
  confirmBtn.addEventListener("click", () => {
    onConfirm();
    closeModal();
  });
  modal.append(confirmBtn);

  const rejectBtn = document.createElement("button");
  rejectBtn.innerHTML = "NO";
  rejectBtn.classList.add("button");
  rejectBtn.style.marginTop = "5px";
  rejectBtn.addEventListener("click", closeModal);
  modal.append(rejectBtn);

  modalOverlay.append(modal);
  document.body.append(modalOverlay);
  document.body.style.overflow = "hidden";
};

export const useMessageModal = (message) => {
  const modalOverlay = document.createElement("div");
  modalOverlay.classList.add("overlay");

  const modal = document.createElement("div");
  modal.classList.add("modal", "modal__small");
  modal.insertAdjacentHTML(
    "afterbegin",
    `
      <div class="modal__line"></div>
      <p style="margin: 10px; font-size: 18px">${message}</p>
    `
  );
  modal.style.width = "400px";
  modal.style.paddingBottom = "20px";
  const closeModal = () => {
    modalOverlay.remove();
    document.body.style.overflow = "auto";
  };
  const closeBtn = document.createElement("div");
  closeBtn.classList.add("modal__close");
  closeBtn.innerHTML = `<img src="${closeIco}" alt="Close" />`;
  closeBtn.addEventListener("click", closeModal);
  modal.prepend(closeBtn);

  const confirmBtn = document.createElement("button");
  confirmBtn.innerHTML = "OK";
  confirmBtn.classList.add("button");
  confirmBtn.style.marginTop = "5px";
  confirmBtn.addEventListener("click", closeModal);
  modal.append(confirmBtn);

  modalOverlay.append(modal);
  document.body.append(modalOverlay);
  document.body.style.overflow = "hidden";
};

const initCardsetCreation = () => {
  initDropdown("#categoryForNewSet", (clickedItem) => {
    clickedItem.parentElement.parentElement.nextElementSibling.value =
      clickedItem.dataset.categoryId;
  });
  const cardsetForm = document.querySelector("#cardsetCreationForm");
  const title = initInput(cardsetForm.title, validateTitle);

  cardsetForm.addEventListener("submit", (e) => {
    e.preventDefault();
    let errors = 0;
    if (!cardsetForm.category.value) {
      document
        .querySelector("#categoryForNewSet .dropdown__btn")
        .classList.add("input_error");
      errors++;
    } else {
      document
        .querySelector("#categoryForNewSet .dropdown__btn")
        .classList.remove("input_error");
    }
    if (!title.validate(cardsetForm.title.value)) {
      errors++;
    }
    !errors && cardsetForm.submit();
  });
};
const initAccountSettings = () => {
  const settingsForm = document.querySelector("#accountSettings");
  const username = settingsForm.username.value;
  const email = settingsForm.email.value;
  initInput(settingsForm.username, validateName);
  initInput(settingsForm.email, validateEmail);
  settingsForm.addEventListener("submit", async (e) => {
    e.preventDefault();
    if (
      formData.get("username") === username &&
      formData.get("email") === email
    ) {
      return;
    }
    if (
      validateName(settingsForm.username.value).isValid &&
      validateEmail(settingsForm.email.value).isValid
    ) {
      const formData = new FormData(settingsForm);
      formData.get("username") === username && formData.delete("username");
      formData.get("email") === email && formData.delete("email");
      settingsForm.lastElementChild.disabled = true;
      settingsForm.insertAdjacentHTML(
        "beforeend",
        `
        <div
          style="position: relative; top: -200px; right: 0; left: 0; border-width: 20px;"
          class="loading-spinner"
        ></div>
      `
      );
      try {
        const res = await updateUser(formData);
        if (res.updated_fields.includes("email")) {
          settingsForm.insertAdjacentHTML(
            "afterend",
            `
            <p>Verification link has been send to your new email</p>
            `
          );
        }
      } catch (e) {
        const errData = JSON.parse(e.message);
        if (+errData.status === 400) {
          showInputError(
            settingsForm[errData.error.field],
            errData.error.message
          );
        }
      }
      settingsForm.lastElementChild.remove();
      settingsForm.lastElementChild.disabled = false;
    }
  });
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

  try {
    initCardsetCreation();
    initAccountSettings();
  } catch (error) {
    console.log(error);
  }
};
