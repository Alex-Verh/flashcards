const profileButton = document.querySelector(".nav__profile")
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

if (profileButton) {
  profileButton.addEventListener("click", () => {
    profileModal.classList.toggle("none");
  });
  document.addEventListener("click", (event) => {
    if (!profileModal.contains(event.target) && !profileButton.contains(event.target)) {
      profileModal.classList.add("none");
    }
  });
}