function edit_profile() {
    const edit_modal = document.getElementById("edit_profile_modal");

    try {
        document.getElementById("edit-profile").addEventListener('click', function(event) {
            event.preventDefault();
            edit_modal.classList.add('transition')
        });

        edit_modal.querySelector('#edit-close').addEventListener('click', function(event) {
            event.preventDefault();
            edit_modal.classList.remove('transition')
        });
    } catch (e) {console.log(e);}
}

export {edit_profile}