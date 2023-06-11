import "../sass/pages/set.scss";

document.addEventListener("DOMContentLoaded", () => {
  const flashcards = document.querySelector(".flashcards");

  flashcards.addEventListener("click", (event) => {
    const flashcard = event.target.closest(".flashcards__card");
    if (flashcard) {
      flashcard.classList.toggle("flashcards__card-active");
    }
  });

  const flashcardData = {
    title: "",
    content: "",
    frontImages: [],
    frontAudio: null,
    backImages: [],
    backAudio: null,
  };
  const flashcardContructor = document.querySelector(".constructor");

  flashcardContructor
    .querySelectorAll(".flashcard-side__text")
    .forEach((textarea) => {
      textarea.addEventListener("input", (e) => {
        if (
          e.target.value.endsWith("\n\n") ||
          parseFloat(e.target.scrollHeight) -
            parseFloat(getComputedStyle(e.target).height) >
            5
        ) {
          e.target.value = e.target.value.slice(0, -1);
          return;
        }
        flashcardData[e.target.dataset.key] = e.target.value;
        console.log(flashcardData);
      });
    });

  flashcardContructor
    .querySelectorAll(".tool input[type=file]")
    .forEach((input) => {
      input.addEventListener("change", (e) => {
        uploadFile(e, flashcardData);
      });
    });

  flashcardContructor
    .querySelectorAll("button[data-text-btn]")
    .forEach((btn) => {
      btn.addEventListener("click", () => {
        const textEl =
          btn.parentElement.previousElementSibling.lastElementChild;
        textEl.classList.toggle("none");
        textEl.focus();
      });
    });

  flashcardContructor
    .querySelectorAll("button[data-upload-btn]")
    .forEach((btn) => {
      btn.addEventListener("click", () => {
        btn.lastElementChild.click();
      });
    });
});

const uploadFile = (event, flashcardData) => {
  const dataKey = event.target.dataset.key;

  if (dataKey.includes("Images")) {
    uploadImage(event, flashcardData, dataKey);
  } else if (dataKey.includes("Audio")) {
    uploadSound(event, flashcardData, dataKey);
  }
};
const uploadImage = (event, flashcardData, flashcardDataKey) => {
  const file = event.target.files[0];
  if (!file) {
    return;
  }
  if (!["image/jpeg", "image/png", "image/svg+xml"].includes(file.type)) {
    alert("Choose another format. (JPEG, PNG, SVG)");
    event.target.value = "";
    return;
  }
  const imagesContainer =
    event.target.parentElement.parentElement.previousElementSibling
      .firstElementChild;

  // Check if no more than 3 images
  if (imagesContainer.children.length >= 3) {
    alert("Image limit has been reached!");
    event.target.value = "";
    return;
  }
  const readerImage = new FileReader();
  readerImage.onload = (event) => {
    imagesContainer.insertAdjacentHTML(
      "beforeend",
      `
    <img
      class="flashcard-side__image"
      src="${event.target.result}"
    />
    `
    );
    flashcardData[flashcardDataKey].push(file);
  };
  readerImage.onerror = function (e) {
    alert("Error");
    console.log(e);
  };
  readerImage.readAsDataURL(file);
};

const uploadSound = (event, flashcardData, flashcardDataKey) => {
  const file = event.target.files[0];
  if (!file) {
    return;
  }
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
  const sideWorkspace =
    event.target.parentElement.parentElement.previousElementSibling;
  const playSound = sideWorkspace.querySelector(".flashcard-side__sound");
  // Check if no more than 1 audio
  if (playSound.children.length >= 1) {
    alert("Audio limit has been reached!");
    event.target.value = "";
    return;
  }

  const readerSound = new FileReader();
  readerSound.onload = (event) => {
    const audio = new Audio(readerSound.result);
    playSound.innerHTML = `<img src="./img/play-ico.svg" alt="Play">`;
    flashcardData[flashcardDataKey] = file;

    playSound.onclick = function () {
      if (audio.paused) {
        audio.play();
        playSound.innerHTML = `<img src="./img/pause-ico.svg" alt="Pause">`;
      } else {
        audio.pause();
        playSound.innerHTML = `<img src="./img/play-ico.svg" alt="Play">`;
      }
    };
  };
  readerSound.onerror = function (e) {
    alert("Error");
  };
  readerSound.readAsDataURL(file);
};

const submitFlashCard = (event, flashcardSides, flashCardAttachments) => {
  event.preventDefault();
  const formData = new FormData();

  const cardSetTitleEl = document.querySelector("h1");

  const cardsetId = +cardSetTitleEl.dataset.id;
  formData.append("cardset_id", cardsetId);

  let errors = 0;

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

    formData.append(textarea.id.replace("textarea-", ""), sideText);
    textarea.innerHTML = "";
    side.querySelector(".image-preview").innerHTML = "";
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
