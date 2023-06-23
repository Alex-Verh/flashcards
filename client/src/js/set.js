import "../sass/pages/set.scss";
import { initModals, useMessageModal } from "./modules/modals";
import { loadCategories } from "./modules/categories";
import playIco from "../img/icons/play-ico.svg";
import pauseIco from "../img/icons/pause-ico.svg";
import textIco from "../img/icons/text-ico.svg";
import removeTextIco from "../img/icons/remove-text-ico.svg";
import imageIco from "../img/icons/image-ico.svg";
import audioIco from "../img/icons/audio-ico.svg";
import removeAudioIco from "../img/icons/remove-audio-ico.svg";
import { createFlashcard } from "./api/queries";

class FlashCard {
  constructor(title = "", content = "", attachments = {}) {
    this.title = title;
    this.content = content;
    this.attachments = attachments;
  }
  validateSide(side) {
    if (!["front", "back"].includes(side)) {
      throw new Error("Invalid side parameter");
    }
  }
  setText(text, side) {
    this.validateSide(side);
    if (text && this.getImages(side).length > 2) {
      throw new Error("You can not have text with more than 2 images!");
    }
    if (side === "front") {
      this.title = text;
    } else if (side === "back") {
      this.content = text;
    }
  }
  getText(side) {
    if (side === "front") {
      return this.title;
    } else if (side === "back") {
      return this.content;
    }
  }
  getImages(side) {
    this.validateSide(side);
    return this.attachments[side + "side"]?.images || [];
  }
  setImages(images, side) {
    this.validateSide(side);
    const key = side + "side";
    if (this.attachments[key]) {
      this.attachments[key].images = images;
    } else {
      this.attachments[key] = { images };
    }
  }
  addImage(image, side) {
    const sideImages = this.getImages(side);

    if (!["image/jpeg", "image/png", "image/svg+xml"].includes(image.type)) {
      throw new Error("Choose another format. (JPEG, PNG, SVG)");
    }
    if (
      (this.getText(side) && sideImages.length >= 2) ||
      sideImages.length >= 4
    ) {
      throw new Error("Image limit has been reached!");
    }
    if (sideImages.some((img) => img.name === image.name)) {
      throw new Error("You can not add the same image twice!");
    }
    this.setImages([...sideImages, image], side);
  }
  removeImage(imageName, side) {
    this.setImages(
      this.getImages(side).filter((image) => image.name !== imageName),
      side
    );
  }
  getAudio(side) {
    this.validateSide(side);
    return this.attachments[side + "side"]?.audio;
  }
  setAudio(audio, side) {
    this.validateSide(side);
    if (!["audio/mpeg", "audio/wav", "audio/ogg"].includes(audio.type)) {
      throw new Error("Choose another format. (MP3, WAV, OGG)");
    }
    if (audio.size > 1024 * 1024 * 10) {
      throw new Error("File size must be less than 10 MB");
    }
    const key = side + "side";
    if (this.attachments[key]) {
      this.attachments[key].audio = audio;
    } else {
      this.attachments[key] = { audio };
    }
  }
  removeAudio(side) {
    this.validateSide(side);
    const key = side + "side";
    if (this.attachments[key]?.audio) {
      delete this.attachments[key].audio;
    }
  }
  getSideData(side) {
    return {
      text: this.getText(side),
      images: this.getImages(side),
      audio: this.getAudio(side),
    };
  }

  toFormData() {
    const formData = new FormData();
    formData.append("title", this.title);
    formData.append("content", this.content);
    ["front", "back"].forEach((side) => {
      this.getImages(side).forEach((image) =>
        formData.append(side + "_images", image)
      );
      const audio = this.getAudio(side);
      audio && formData.append(side + "_audio", audio);
    });
    return formData;
  }
  reset() {
    this.title = "";
    this.content = "";
    this.attachments = {};
  }
}

const renderText = (text, textarea) => {
  const textBtnIco =
    textarea.parentElement.nextElementSibling.firstElementChild
      .firstElementChild;
  if (!text) {
    textarea.classList.add("none");
    textBtnIco.src = textIco;
  } else {
    textarea.classList.remove("none");
    textarea.value = text;
    textBtnIco.src = removeTextIco;
  }
};

const renderImages = (images, container, onImageRemove) => {
  container.style.height =
    container.parentElement.lastElementChild.classList.contains("none")
      ? "80%"
      : images.length
      ? "50%"
      : "0";

  const containerWidth = container.clientWidth,
    containerHeight = container.clientHeight,
    imageWidth =
      (images.length > 1 ? containerWidth / 2 - 10 : containerWidth) + "px",
    imageHeight =
      (images.length > 2 ? containerHeight / 2 - 10 : containerHeight) + "px";

  let newImages = images.reduce(
    (prev, image) => prev.set(image.name, image),
    new Map()
  );

  container.querySelectorAll(".flashcard-side__image").forEach((imageEl) => {
    const imageName = imageEl.dataset.imageName;
    if (newImages.has(imageName)) {
      imageEl.lastElementChild.style.maxWidth = imageWidth;
      imageEl.lastElementChild.style.maxHeight = imageHeight;
      newImages.delete(imageName);
    } else {
      imageEl.remove();
    }
  });
  newImages.forEach((image, imageName) => {
    const imageEl = document.createElement("div");
    imageEl.classList.add("flashcard-side__image");
    imageEl.dataset.imageName = imageName;
    imageEl.innerHTML = `<button class="flashcard-side__remove-image">&#x2715;</button><img src="#" style="max-width: ${imageWidth}; max-height: ${imageHeight};"/>`;
    imageEl.firstElementChild.addEventListener("click", () => {
      onImageRemove(imageName);
    });
    const fileReader = new FileReader();
    fileReader.onload = (event) => {
      imageEl.lastElementChild.src = event.target.result;
      container.append(imageEl);
    };
    fileReader.onerror = (e) => {
      console.log(e);
    };
    fileReader.readAsDataURL(image);
  });
};

const renderAudio = (audioFile, audioBtn) => {
  if (!audioFile) {
    audioBtn.innerHTML = "";
    audioBtn.onclick = () => {};
    return;
  }
  const soundReader = new FileReader();
  soundReader.onload = (e) => {
    const audio = new Audio(e.target.result);
    audioBtn.innerHTML = `<img src="${playIco}" alt="Play">`;
    audioBtn.onclick = () => {
      if (audio.paused) {
        audio.play();
        audioBtn.innerHTML = `<img src="${pauseIco}" alt="Pause">`;
      } else {
        audio.pause();
        audioBtn.innerHTML = `<img src="${playIco}" alt="Play">`;
      }
    };
  };
  soundReader.onerror = function (e) {
    console.log(e);
  };
  soundReader.readAsDataURL(audioFile);
};

const initFlashcardCreation = () => {
  const container = document.querySelector(".constructor__parts .row");
  const flashcard = new FlashCard();

  const renderFlashcardSide = (sideName, sideWorkspace) => {
    const sideData = flashcard.getSideData(sideName);

    const textarea = sideWorkspace.children[2];
    renderText(sideData.text, textarea);

    const imagesContainer = sideWorkspace.children[0];
    renderImages(sideData.images, imagesContainer, (imageName) => {
      flashcard.removeImage(imageName, sideName);
      renderFlashcardSide(sideName, sideWorkspace);
    });

    const audioBtn = sideWorkspace.children[1];
    renderAudio(sideData.audio, audioBtn);
  };

  const createWorkspace = (sideName, sideEl) => {
    const workspace = document.createElement("div");
    workspace.classList.add("flashcard-side__workspace");
    workspace.innerHTML = `<div class="flashcard-side__images"></div><div class="flashcard-side__sound"></div><textarea class="flashcard-side__text flashcard-side__text_${
      sideName === "front" ? "title" : "content"
    } none"></textarea>`;
    workspace.lastElementChild.addEventListener("input", (e) => {
      if (
        e.target.value.endsWith("\n\n") ||
        parseFloat(e.target.scrollHeight) -
          parseFloat(getComputedStyle(e.target).height) >
          5
      ) {
        e.target.value = e.target.value.slice(0, -1);
        return;
      }
      try {
        flashcard.setText(e.target.value, sideName);
      } catch (e) {
        useMessageModal(e.message);
      }
    });
    sideEl.append(workspace);
  };
  const createTools = (sideName, sideEl) => {
    const tools = document.createElement("div");
    tools.classList.add("flashcard-side__tools");
    tools.innerHTML = `<button class="tool rnd-button" type="button"><img src="${textIco}" alt="#" /></button><label class="tool rnd-button"><img src="${imageIco}" alt="#" /><input class="none" type="file" accept=".jpg, .jpeg, .png, .svg" name="fileImages" /></label><label class="tool rnd-button"><img src="${audioIco}" alt="#" /><input class="none" type="file" accept=".mp3, .ogg, .wav" name="fileSound" /></label>`;
    tools.children[0].addEventListener("click", (e) => {
      const textarea = sideEl.firstElementChild.lastElementChild;
      if (textarea.classList.contains("none")) {
        try {
          flashcard.setText("Enter your text here", sideName);
          textarea.focus();
        } catch (e) {
          useMessageModal(e.message);
        }
      } else {
        flashcard.setText("", sideName);
      }
      renderFlashcardSide(sideName, sideEl.firstElementChild);
    });
    tools.children[1].lastElementChild.addEventListener("change", (e) => {
      const file = e.target.files[0];
      if (file) {
        try {
          flashcard.addImage(file, sideName);
          renderFlashcardSide(sideName, sideEl.firstElementChild);
        } catch (e) {
          useMessageModal(e.message);
        }
      }
      e.target.value = "";
    });
    tools.children[2].addEventListener("click", (e) => {
      if (e.currentTarget.lastElementChild.disabled) {
        e.preventDefault();
        flashcard.removeAudio(sideName);
        renderFlashcardSide(sideName, sideEl.firstElementChild);
        e.currentTarget.lastElementChild.disabled = false;
        e.currentTarget.firstElementChild.src = audioIco;
      }
    });
    tools.children[2].lastElementChild.addEventListener("change", (e) => {
      const file = e.target.files[0];
      if (file) {
        try {
          flashcard.setAudio(file, sideName);
          renderFlashcardSide(sideName, sideEl.firstElementChild);
          e.target.disabled = true;
          e.target.previousElementSibling.src = removeAudioIco;
        } catch (e) {
          useMessageModal(e.message);
        }
      }
      e.target.value = "";
    });
    sideEl.append(tools);
  };
  container.innerHTML = "";
  ["front", "back"].forEach((sideName) => {
    container.insertAdjacentHTML(
      "beforeend",
      '<div class="col-lg-6 col-md-12"><div class="flashcard-side"></div></div>'
    );
    const side = container.lastElementChild.lastElementChild;
    createWorkspace(sideName, side);
    createTools(sideName, side);
  });

  document.querySelector("#createFlashcard").addEventListener("click", () => {
    const formData = flashcard.toFormData();
    if (
      (!formData.get("title") &&
        !formData.getAll("front_images").length &&
        !formData.get("front_audio")) ||
      (!formData.get("content") &&
        !formData.getAll("back_images").length &&
        !formData.get("back_audio"))
    ) {
      useMessageModal("Flashcard side cannot be empty!");
      return;
    }
    const cardsetId = window.location.href.split("/").pop();
    formData.append("cardset_id", cardsetId);
    createFlashcard(formData).then(() => {
      flashcard.reset();
      renderFlashcardSide(
        "front",
        container.firstElementChild.firstElementChild.firstElementChild
      );
      renderFlashcardSide(
        "back",
        container.lastElementChild.firstElementChild.firstElementChild
      );
    });
  });
};

document.addEventListener("DOMContentLoaded", () => {
  initModals();
  loadCategories();
  const flashcards = document.querySelector(".flashcards");
  flashcards.addEventListener("click", (event) => {
    const flashcard = event.target.closest(".flashcards__card");
    if (flashcard) {
      flashcard.classList.toggle("flashcards__card-active");
    }
  });

  initFlashcardCreation();
});
