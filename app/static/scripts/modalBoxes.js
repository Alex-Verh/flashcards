function initModalBoxes() {
  const modal = document.getElementById("loginRegisterModal");
  try {
    document.querySelector(".close-modal").onclick = function () {
      modal.style.display = "none";
    };
  } catch (e) {
    console.log(e);
  }
  window.onclick = function (event) {
    if (event.target === modal) {
      modal.style.display = "none";
    }
  };
}

export { initModalBoxes };
