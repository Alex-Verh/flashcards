import "../sass/pages/cardsets.scss";

document.addEventListener("DOMContentLoaded", () => {
  import("./modules/dropdown");

  const profileButton = document.querySelector(".nav__profile");

  if (profileButton) {
    profileButton.addEventListener("click", () => {
      profileButton.focus();
    });
  }
});
