const unselectSide = (flashCardSideEl) => {
  const textArea = flashCardSideEl.querySelector(".textarea");
  if (!textArea.innerHTML.trim()) {
    textArea.style.display = "none";
  }
  flashCardSideEl.classList.remove("selected");
  textArea.setAttribute("contenteditable", "false");
};

const selectSide = (flashCardSideEl) => {
  const selectedEl = document.querySelector(".selected");
  if (selectedEl && flashCardSideEl !== selectedEl) {
    unselectSide(selectedEl);
  }
  flashCardSideEl.classList.add("selected");
};

const onTextAreaClick = (textArea) => {
  textArea.style = "";
  textArea.setAttribute("contenteditable", "true");
  textArea.focus();
};

const addImageToCardSide = (imageUrl, cardSide) => {
  const imagePreview = cardSide.querySelector(".image-preview");
  const textArea = cardSide.querySelector(".textarea");
  const imagesQty = imagePreview.children.length;
  // Guards
  if (textArea.innerHTML.trim() && imagesQty > 1) {
    alert("You cannot add more picture while having a text.");
    return;
  } else if (imagesQty > 3) {
    alert("You can not upload more photos.");
    return;
  }
  textArea.classList.replace("only-text", "not-only-text");
  // Create image element
  let imageClass = "constructor-image-multiple";

  switch (imagesQty) {
    case 0:
      imageClass = "constructor-image-single";
      if (!textArea.innerHTML.trim()) {
        textArea.style.display = "none";
      }
      break;
    case 2:
      textArea.style.display = "none";
    default:
      imagePreview
        .querySelectorAll(".constructor-image-single")
        .forEach((el) => {
          el.classList.replace(
            "constructor-image-single",
            "constructor-image-multiple"
          );
        });
  }

  const imageEl = document.createElement("div");
  imageEl.innerHTML = `<div class = "constImage">
  <img src="${imageUrl}" alt="Image" class="constructor-image ${imageClass}">
  <button type="button" class="remove-image">×</button>
  </div>`;

  imagePreview.appendChild(imageEl.firstChild);

  return true;
};

const removeImageFromCardSide = (imageEl, cardSide) => {
  const imagePreview = cardSide.querySelector(".image-preview");
  const textArea = cardSide.querySelector(".textarea");
  const imagesQty = imagePreview.children.length;
  switch (imagesQty) {
    case 1:
      textArea.classList.replace("not-only-text", "only-text");
      break;
    case 2:
      imagePreview
        .querySelectorAll(".constructor-image-multiple")
        .forEach((el) => {
          el.classList.replace(
            "constructor-image-multiple",
            "constructor-image-single"
          );
        });
      break;
    case 3:
      textArea.style = "";
      break;
  }
  imagePreview.removeChild(imageEl);
};

const onImageRemove = (removeButton, flashCardSide, flashCardAttachments) => {
  const sideType = flashCardSide.dataset.type + "Side";
  const elToRemove = removeButton.closest(".constImage");
  const imageIndex = [...elToRemove.parentElement.children].indexOf(elToRemove);
  flashCardAttachments[sideType].images.splice(imageIndex, 1);

  removeImageFromCardSide(removeButton.parentNode, flashCardSide);
};

const uploadSound = (event, flashCardAttachments) => {
  const file = event.target.files[0];
  if (!["audio/mpeg", "audio/wav", "audio/ogg"].includes(file.type)) {
    alert("Choose another format. (MP3, WAV, OGG)");
    event.target.value = "";
    return;
  }
  if (file.size > 1024 * 1024 * 10) {
    alert("File size must be less than 10 MB");
    audioInput.value = "";
    return;
  }
  const readerSound = new FileReader();
  readerSound.onload = (event) => {
    const selectedSide = document.querySelector(".selected");
    // Check for flashcard side selected
    if (selectedSide) {
      const sideType = selectedSide.dataset.type + "Side";
      flashCardAttachments[sideType].audio = file;

      const audio = new Audio(readerSound.result);
      const playSound = selectedSide.querySelector(".sound");
      playSound.innerHTML = `<img src = "../static/images/play.png" alt="Sound">`;
      playSound.onclick = function () {
        if (audio.paused) {
          audio.play();
          playSound.innerHTML = `<img src = "../static/images/pause.png" alt="Sound">`;
        } else {
          audio.pause();
          playSound.innerHTML = `<img src = "../static/images/play.png" alt="Sound">`;
        }
      };
    } else {
      alert("Select a part to upload your image on.");
    }
  };
  readerSound.onerror = function (e) {
    alert("Error");
  };
  readerSound.readAsDataURL(file);
};

const uploadImage = (event, flashCardAttachments) => {
  const file = event.target.files[0];

  if (!["image/jpeg", "image/png", "image/svg+xml"].includes(file.type)) {
    alert("Choose another format. (JPEG, PNG, SVG)");
    event.target.value = "";
    return;
  }
  const readerImage = new FileReader();
  readerImage.onload = (event) => {
    const selectedSide = document.querySelector(".selected");
    // Check for flashcard side selected
    if (selectedSide) {
      if (addImageToCardSide(event.target.result, selectedSide)) {
        const sideType = selectedSide.dataset.type + "Side";
        flashCardAttachments[sideType].images.push(file);
      }
    } else {
      alert("Select a part to upload your image on.");
    }
  };
  readerImage.onerror = function (e) {
    alert("Error");
  };
  readerImage.readAsDataURL(file);
};

const submitFlashCard = (event, flashcardSides, flashCardAttachments) => {
  event.preventDefault();
  const formData = new FormData();

  const cardSetTitleEl = document.querySelector("h1");

  const cardsetId = +cardSetTitleEl.dataset.id;
  formData.append("cardset_id", cardsetId);

  let errors = 0;
  const isPublicCardSet = !!+cardSetTitleEl.dataset.is_public;
  const isOnlyEnglishRegEx =
    /^[a-z0-9!" #\$%&'\(\)\*\+,-\./:;<=>\?@\[\\\]\^_`\{\|\}~]*$/i;

  flashcardSides.forEach((side) => {
    const sideName = side.dataset.type + "Side";
    const textarea = side.querySelector(".textarea");
    const sideText = textarea.textContent.trim();

    if (
      !sideText &&
      !flashCardAttachments[sideName].images.length &&
      !flashCardAttachments[sideName].audio
    ) {
      alert("Flash card side can not be empty!");
      errors += 1;
      return;
    }

    if (isPublicCardSet && !isOnlyEnglishRegEx.test(sideText)) {
      alert("You must use English in public card sets");
      errors += 1;
      return;
    }

    formData.append(textarea.id.replace("textarea-", ""), sideText);
    textarea.innerHTML = ''
  });

  if (errors) {
    return;
  }

  flashCardAttachments.frontSide.images.forEach((image) => {
    formData.append("front_images", image);
  });
  flashCardAttachments.backSide.images.forEach((image) => {
    formData.append("back_images", image);
  });
  flashCardAttachments.frontSide.audio &&
    formData.append("front_audio", flashCardAttachments.frontSide.audio);
  flashCardAttachments.backSide.audio &&
    formData.append("back_audio", flashCardAttachments.backSide.audio);

  fetch("/api/create-flashcard", { method: "POST", body: formData }).then(
    (response) => loadFlashCards(cardsetId)
  );

  event.target.reset();
  for (const side in flashCardAttachments) {
    flashCardAttachments[side] = {
      images: [],
      audio: null,
    };
  }
  event.target.parentElement.classList.remove("transit");
};

function initFlashCardConstructor() {
  const flashCardAttachments = {
    frontSide: {
      images: [],
      audio: null,
    },
    backSide: {
      images: [],
      audio: null,
    },
  };

  const flashCardCreationBox = document.querySelector("#constructor");
  const flashcardSides =
    flashCardCreationBox.querySelectorAll(".flashcard-part");
  const uploadSoundEl = flashCardCreationBox.querySelector("#uploadSound");
  const uploadImageEl = flashCardCreationBox.querySelector("#uploadImage");

  document.querySelector("#create-flashcard").addEventListener("click", (e) => {
    e.preventDefault();
    flashCardCreationBox.classList.add("transit");
  });
  flashCardCreationBox
    .querySelector("#close-addition")
    .addEventListener("click", (e) => {
      e.preventDefault();
      flashCardCreationBox.classList.remove("transit");
    });

  // Constructor Selected Side
  flashCardCreationBox.querySelector("form").addEventListener("click", (e) => {
    const flashCardSide = e.target.closest(".flashcard-part");
    if (flashCardSide) {
      const removeButton = e.target.closest(".remove-image");
      if (removeButton) {
        onImageRemove(removeButton, flashCardSide, flashCardAttachments);
      }

      // Unlock text area
      if (
        flashCardSide.classList.contains("selected") &&
        flashCardSide.querySelectorAll(".constructor-image").length <= 2
      ) {
        const textArea = flashCardSide.querySelector(".textarea");
        onTextAreaClick(textArea);
      }

      selectSide(flashCardSide);

      // Unselect the side if user clicks arround the flashcard
    } else if (!e.target.closest("input") && !e.target.closest(".button")) {
      flashcardSides.forEach((side) => {
        unselectSide(side);
      });
    }
  });

  const textareas = document.querySelectorAll(".textarea");
  textareas.forEach((area) => {
    area.addEventListener("keydown", (event) => {
      if (event.key === "Enter") {
        event.preventDefault();
        const selection = window.getSelection();
        const range = selection.getRangeAt(0);
        const br = document.createElement("br");
        range.deleteContents();
        range.insertNode(br);
        range.setStartAfter(br);
        range.setEndAfter(br);
        selection.removeAllRanges();
        selection.addRange(range);
      }
    });
  });

  uploadSoundEl.addEventListener("change", (e) => {
    uploadSound(e, flashCardAttachments);
  });

  uploadImageEl.addEventListener("change", (e) => {
    uploadImage(e, flashCardAttachments);
  });

  flashCardCreationBox.querySelector("form").addEventListener("submit", (e) => {
    submitFlashCard(e, flashcardSides, flashCardAttachments);
  });
}

const getFlashCardSideHTML = (text, sideAttachments) => {
  const imagesClass =
    sideAttachments.images.length <= 1
      ? "flash-card-image-single"
      : "flash-card-image-multiple";
  const imagesHTML = sideAttachments.images
    .map((image) => {
      return `<img src = "../../uploads/${image}" class = "${imagesClass}">`;
    })
    .join("\n");

  const textHTML = sideAttachments.images.length && text
    ? `<div class = "not-only-text">${text}</div>`
    : `<div class = "only-text">${text}</div>`;
  return imagesHTML + "\n" + textHTML;
};

function loadFlashCards(cardSetId) {
  const sentinel = document.createElement('div');
  sentinel.id = "sentinel"
  sentinel.innerHTML = '<img id="loading-gif" src="{{url_for("static", filename="images/loading.gif")}}" width="70vh">'
  const flashcardsDiv = document.querySelector('#flashcards')
  flashcardsDiv.append(sentinel)

  const formData = new FormData();
  formData.append("cardset_id", cardSetId);
  fetch("/api/flashcards", { method: "POST", body: formData })
    .then((response) => response.json())
    .then((data) => {
      flashcardsDiv.innerHTML = ''
      data.forEach((flashcard) => {
        const flashcardEl = document.createElement("div");
        flashcardEl.classList.add("flashcard");
        flashcardEl.innerHTML = `
        <div class="flash-screen">
          <div class="flash-card-front">
            ${getFlashCardSideHTML(flashcard.title, flashcard.attachments.frontside)}
          </div>
          <div class="flash-card-back">
            ${getFlashCardSideHTML(flashcard.content, flashcard.attachments.backside)}
          </div>
        </div>
        `;
        flashcardsDiv.append(flashcardEl)
      });
    });
}

export { initFlashCardConstructor, loadFlashCards, getFlashCardSideHTML };
