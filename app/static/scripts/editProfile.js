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

  const deleteBtn = editModal.querySelector('#deleteAccount')

  deleteBtn.addEventListener('click', event => {
    const userConfirm = confirm('Are you sure you want to delete your account?')
    if (userConfirm) {
      window.location.href = '/delete-profile'
    }
  })
}

export { initEditProfile };
