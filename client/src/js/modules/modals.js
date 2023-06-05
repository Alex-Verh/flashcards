const profileModal = document.querySelector(".profile-modal")
const openCreateCardset = document.querySelector("#open-create-cardset");
const openModalLink = document.querySelectorAll("[data-modal-class]");

openModalLink.forEach(link => {
    link.addEventListener("click", () => {
        const modalClass = link.dataset.modalClass;
        const modal = document.querySelector(`.${modalClass}`);
        modal.classList.toggle("none");
    })
})

const profileButton = document.querySelector(".nav__profile");

if (profileButton) {
  profileButton.addEventListener("click", () => {
    profileButton.focus();
  });
}