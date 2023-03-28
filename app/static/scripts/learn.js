function chooseLearn() {
    const learningSets = document.getElementsByClassName("set");
  
    for (var i = 0; i < learningSets.length; i++) {
        let setClasses = learningSets[i].classList;
        learningSets[i].addEventListener("click", function (event) {
            event.preventDefault();
            if (setClasses.contains("selected-set")) {
                setClasses.remove("selected-set");
            } else {
                setClasses.add("selected-set")
            }
        });
    }
}

function learn_modal() {
    const learn_modal = document.getElementById("learn_modal");
    const learn_title = document.getElementById("learn-title");


    document
      .getElementById("start_learning")
      .addEventListener("click", function (event) {
        event.preventDefault();
        if (document.querySelector(".selected-set")) {
          learn_modal.classList.add("transition");

          // Checks what mode is checked
          if(document.querySelector('input[name="mode"]:checked').value == 1) {
            learn_title.innerHTML = "Guess content:"
          } else {
              learn_title.innerHTML = "Guess title:"
          }

        } else {
          alert("Choose a set to start learning!")
        }
      });
  
    learn_modal
      .querySelector("#learn-close")
      .addEventListener("click", function (event) {
        event.preventDefault();
        const userConfirm = confirm('Are you sure you want to quit learning process?')
        if (userConfirm) {
          learn_modal.classList.remove("transition");
        }
      });

}

export { chooseLearn, learn_modal };