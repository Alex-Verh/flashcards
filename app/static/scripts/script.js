// JavaScript for cursor visual effect
const blob = document.getElementById("blob");

document.body.onpointermove = event => {
    const {clientX , clientY } = event;

    blob.animate ({
        left : `${clientX}px`,
        top :`${clientY}px`
    }, { duration : 3000, fill: "forwards" });
}

function deleteConf() {
    let text = "Are you sure you want to delete this set?";
    if (confirm(text) == true) {
        text = "You have succesfully deleted it!";
      } else {
        text = "You canceled!";
      }
}
