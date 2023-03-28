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

    document
      .getElementById("start_learning")
      .addEventListener("click", function (event) {
        event.preventDefault();
        learn_modal.classList.add("transition");
      });
  
    learn_modal
      .querySelector("#learn-close")
      .addEventListener("click", function (event) {
        event.preventDefault();
        learn_modal.classList.remove("transition");
      });
}

export { chooseLearn, learn_modal };