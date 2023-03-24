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
  
  export { chooseLearn };