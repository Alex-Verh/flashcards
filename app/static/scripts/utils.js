async function sendDeleteCardSetRequest(cardSetId) {
  const response = await fetch(`/api/delete-cardset/${cardSetId}`, { method: "GET"})
  const json = await response.json()
  if (response.ok) {
    return json
  }
  throw new Error(json.error)
}

async function sendSaveCardSetRequest(cardSetId) {
  const response = await fetch(`/api/save-cardset/${cardSetId}`, { method: "GET" })
  const json = await response.json()
  if (response.ok) {
    return json
  }
  throw new Error(json.error)
}

async function sendDeleteFlashcardRequest() {

}

function slideDown(dropdown, speed) {
  dropdown.style.cssText = "display: block; overflow: hidden;";
  const targetHeight = parseFloat(window.getComputedStyle(dropdown).height);
  dropdown.style.height = "0px";

  const step = targetHeight / (speed / 4);
  const intervalId = setInterval(() => {
    const currentHeight = parseFloat(dropdown.style.height);
    if (currentHeight >= targetHeight) {
      dropdown.style.cssText = "display: block;";
      clearInterval(intervalId);
    } else {
      dropdown.style.height = currentHeight + step + "px";
    }
  });
}

function slideUp(dropdown, speed) {
  dropdown.style.cssText = "display: block; overflow: hidden;";
  let currentHeight = parseFloat(window.getComputedStyle(dropdown).height);
  const step = currentHeight / (speed / 4);
  const intervalId = setInterval(() => {
    if (currentHeight <= 0) {
      dropdown.style.cssText = "display: none;";
      clearInterval(intervalId);
    } else {
      currentHeight = currentHeight - step;
      dropdown.style.height = currentHeight + "px";
    }
  });
}

function slideToggle(dropdown, speed) {
  if (
    parseFloat(window.getComputedStyle(dropdown).height) <= 0 ||
    window.getComputedStyle(dropdown).display === "none"
  ) {
    slideDown(dropdown, speed);
  } else {
    slideUp(dropdown, speed);
  }
}
