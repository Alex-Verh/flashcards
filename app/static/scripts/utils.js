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

function slideDown(dropdown, step) {
  dropdown.style.cssText = "display: block; overflow: hidden;";

  const targetHeight = parseFloat(window.getComputedStyle(dropdown).height);
  let currentHeight = 0

  dropdown.style.height = '0px'
  requestAnimationFrame(frame)

  function frame() {
    currentHeight += step
    dropdown.style.height = currentHeight + "px";
    if (currentHeight < targetHeight) {
      requestAnimationFrame(frame)
    } else dropdown.style.cssText = "display: block;";
  }
}

function slideUp(dropdown, step) {
  dropdown.style.cssText = "display: block; overflow: hidden;";

  const targetHeight = 0
  let currentHeight = parseFloat(window.getComputedStyle(dropdown).height);

  requestAnimationFrame(frame)

  function frame() {
    currentHeight -= step
    dropdown.style.height = currentHeight + "px";
    if (currentHeight > targetHeight) {
      requestAnimationFrame(frame)
    } else dropdown.style.cssText = "display: none;";
  }
}

function slideToggle(dropdown, step) {
  if (
    parseFloat(window.getComputedStyle(dropdown).height) <= 0 ||
    window.getComputedStyle(dropdown).display === "none"
  ) {
    slideDown(dropdown, step);
  } else {
    slideUp(dropdown, step);
  }
}

function getFlashCardSideHTML(text, sideAttachments, onlyTextInDiv=false) {
  const imagesClass =
    sideAttachments.images.length <= 1
      ? "flash-card-image-single"
      : "flash-card-image-multiple";
  const imagesHTML = sideAttachments.images
    .map((image) => {
      return `<img src = "../../uploads/${image}" class = "${imagesClass}">`;
    })
    .join("\n");

  const textHTML =
    sideAttachments.images.length && text
      ? `<div class = "not-only-text">${text}</div>`
      : onlyTextInDiv ? `<div class = "only-text">${text}</div>` : text
  return imagesHTML + "\n" + textHTML;
};