const openModalLinks = document.querySelectorAll("[data-modal-class]");
const closeModalBtns = document.querySelectorAll(".modal__close");

openModalLinks.forEach((link) => {
    const modalClass = link.dataset.modalClass;
    const modal = document.querySelector(`.${modalClass}`);

    link.addEventListener("click", () => {
      modal.parentElement.classList.remove("none");
      link.parentElement.parentElement.blur();
      document.body.style.overflow = "hidden";
    })
})

closeModalBtns.forEach((closeBtn) => {
  closeBtn.addEventListener("click", () => {
    closeBtn.parentElement.parentElement.classList.add("none");
    document.body.style.overflow = "auto";
  })
})


const profileModal = document.querySelector(".profile-modal")
const profileButton = document.querySelector(".nav__profile");

if (profileButton) {
  profileButton.addEventListener("click", () => {
    profileButton.parentElement.focus();
  });
}