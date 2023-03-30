"use strict";

document.addEventListener("DOMContentLoaded", () => {
  initEditProfile()
  
  document
    .querySelector("[data-own-sets-list]")
    .addEventListener("click", (event) => {
      const cardSet = event.target.closest(".flashcard-unit-image");
      if (cardSet) {
        deleteCardSet(cardSet.parentElement);
      }
    });

  document
    .querySelector("[data-saved-sets-list]")
    .addEventListener("click", (event) => {
      const cardSet = event.target.closest(".flashcard-unit-image");
      if (cardSet) {
        deleteCardSetFromSaved(cardSet.parentElement);
      }
    });

  const deleteCardSet = (cardSetElement) => {
    if (confirm("Are you sure you want to delete this set?") !== true) {
      return;
    }

    const cardSetId = +cardSetElement.dataset.id;
    sendDeleteCardSetRequest(cardSetId)
      .then((response) => {
        cardSetElement.remove();
      })
      .catch((error) => alert(error.message));
  };


  const deleteCardSetFromSaved = (cardSetElement) => {
    const cardSetId = +cardSetElement.dataset.id;
    const saveButton = cardSetElement.querySelector("img");
    sendSaveCardSetRequest(cardSetId)
      .then((response) => {
        if (response.saved) {
          saveButton.src = "../../static/images/save1.png";
        } else {
          saveButton.src = "../../static/images/save2.png";
          cardSetElement.remove();
        }
      })
      .catch((error) => alert(error.message));
  };

  function initEditProfile() {
    const editModal = document.getElementById("edit_profile_modal");

    document
      .getElementById("edit-profile")
      .addEventListener("click", function (event) {
        event.preventDefault();
        editModal.classList.add("transition");
      });

    editModal
      .querySelector("#edit-close")
      .addEventListener("click", function (event) {
        event.preventDefault();
        editModal.classList.remove("transition");
      });

    const deleteBtn = editModal.querySelector("#deleteAccount");

    deleteBtn.addEventListener("click", (event) => {
      const userConfirm = confirm(
        "Are you sure you want to delete your account?"
      );
      if (userConfirm) {
        window.location.href = "/delete-profile";
      }
    });
  }
});
