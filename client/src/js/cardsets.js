import "../sass/pages/cardsets.scss";

document.addEventListener("DOMContentLoaded", () => {
  import("./modules/dropdown");

  const profileButton = document.querySelector(".nav__profile")
  const profileModal = document.querySelector(".profile-modal")

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
});