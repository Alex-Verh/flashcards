function edit_profile() {
    const edit_modal = document.getElementById("edit_profile_modal");


    document.getElementById("edit-profile").addEventListener('click', function(event) {
        event.preventDefault();
        edit_modal.classList.add('transit')
    });

    edit_modal.querySelector('#edit-close').addEventListener('click', function(event) {
        event.preventDefault();
        edit_modal.classList.remove('transit')
    });
}

export {edit_profile}