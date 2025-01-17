"use strict";

import "../sass/pages/set.scss";
import {
  initModals,
  useConfirmModal,
  useMessageModal,
  useUploadModal,
} from "./modules/modals";
import { loadCategories } from "./modules/categories";
import {
  createFlashcard,
  deleteCardset,
  deleteFlashcard,
  getCardset,
  updateCardset,
} from "./api/queries";
import { generateFlashcardEl } from "./modules/flashcards";
import { initLearn } from "./modules/learn";
import { centerTextInTextarea } from "./modules/input";

import playIco from "../img/icons/play-ico.svg";
import pauseIco from "../img/icons/pause-ico.svg";
import textIco from "../img/icons/text-ico.svg";
import removeTextIco from "../img/icons/remove-text-ico.svg";
import imageIco from "../img/icons/image-ico.svg";
import audioIco from "../img/icons/audio-ico.svg";
import removeAudioIco from "../img/icons/remove-audio-ico.svg";
import deleteIco from "../img/icons/delete-ico.svg";
import acceptIco from "../img/icons/accept-ico.svg";

document.addEventListener("DOMContentLoaded", () => {
  const cardsetId = parseInt(window.location.href.split("/").pop());
  const flashcardsList = document.querySelector(".flashcards__list .row");
  let isOwnCardset = false;
  const showFlashcard = (data) => {
    const flashcardEl = generateFlashcardEl({
      data: {
        ...data,
        content:
          data.content.length > 170
            ? data.content.slice(0, 171) + ".."
            : data.content,
        title:
          data.title.length > 120
            ? data.title.slice(0, 121) + ".."
            : data.title,
      },
      wrapperClass: "col-sm-6 col-md-4 col-lg-3 flashcards__card-wrapper",
    });
    if (isOwnCardset) {
      const deleteBtn = document.createElement("button");
      deleteBtn.classList.add("flashcards__card-delete-btn");
      deleteBtn.innerHTML = `<img src="${deleteIco}" alt="delete flashcard" />`;
      deleteBtn.addEventListener("click", () => {
        useConfirmModal(
          "Are you sure you want to delete this flashcard?",
          () => {
            const prevContent = deleteBtn.innerHTML;
            deleteBtn.innerHTML = `
                  <div style="display:block; border: 10px solid;" class="loading-spinner"></div>
                  `;
            deleteBtn.disabled = true;
            deleteFlashcard(data.id)
              .then(() => {
                flashcardEl.remove();
              })
              .catch((e) => {
                console.log(e);
                deleteBtn.innerHTML = prevContent;
                deleteBtn.disabled = false;
              });
          }
        );
      });
      flashcardEl.append(deleteBtn);
    }
    flashcardsList.append(flashcardEl);
  };
  const loadFlashcards = () => {
    getCardset(cardsetId).then((cardset) => {
      initLearn({ id: cardset.id, title: cardset.title });
      isOwnCardset = cardset.is_own;
      if (!cardset.flashcards || !cardset.flashcards.length) {
        flashcardsList.innerHTML = `
          <div style="font-size: 20px; text-align: center; margin-top: 100px; margin-bottom: 100px; color: #6b6b6b">
            There is no flashcards now
          </div>`;
        return;
      }
      flashcardsList.innerHTML = "";
      cardset.flashcards.forEach((flashcard) => {
        showFlashcard(flashcard);
      });
    });
    flashcardsList.addEventListener("click", (event) => {
      const flashcard = event.target.closest(".flashcards__card");
      if (flashcard) {
        flashcard.classList.toggle("flashcards__card-active");
      }
    });
  };
  const initCardsetActions = () => {
    const editCardsetBtn = document.querySelector("#editCardsetBtn");
    editCardsetBtn.addEventListener("click", () => {
      const cardsetTitle = document.querySelector("#cardsetTitle");
      if (cardsetTitle.tagName === "H1") {
        const titleInput = document.createElement("input");
        const title = cardsetTitle.textContent;
        titleInput.value = title;
        titleInput.style.width = title.length + "ch";
        titleInput.id = "cardsetTitle";
        cardsetTitle.replaceWith(titleInput);
        const prevIco = editCardsetBtn.firstElementChild.src;
        editCardsetBtn.firstElementChild.src = acceptIco;
        editCardsetBtn.firstElementChild.style.filter = "brightness(0%)";
        const updateCardsetTitle = () => {
          if (title !== titleInput.value) {
            const formData = new FormData();
            formData.append("title", titleInput.value);
            updateCardset(cardsetId, formData).then((res) =>
              console.log(res.title)
            );
          }
          editCardsetBtn.firstElementChild.src = prevIco;
          editCardsetBtn.firstElementChild.style.filter = null;
          editCardsetBtn.removeEventListener("click", updateCardsetTitle);
        };
        editCardsetBtn.addEventListener("click", updateCardsetTitle);
      } else {
        const titleH1 = document.createElement("h1");
        titleH1.id = "cardsetTitle";
        titleH1.innerHTML = cardsetTitle.value;
        cardsetTitle.replaceWith(titleH1);
      }
    });

    const deleteCardsetBtn = document.querySelector("#deleteCardsetBtn");
    deleteCardsetBtn.addEventListener("click", () => {
      useConfirmModal("Are you sure you want to delete this cardset?", () => {
        deleteCardsetBtn.disabled = true;
        document.body.insertAdjacentHTML(
          "beforeend",
          `<div class="overlay"><div style="position: absolute; top: 50%; left: 50%; transform: translateX(-50%) translateY(-50%)"><div class="loading-spinner"></div></div></div>`
        );
        document.body.style.overflow = "hidden";
        deleteCardset(cardsetId)
          .then(() => {
            window.location.href = document.referrer || "/cardsets";
          })
          .catch((e) => {
            console.log(e);
            deleteCardsetBtn.disabled = false;
            document.body.style.overflow = "auto";
          });
      });
    });
  };
  const initFlashcardCreation = (onCreation) => {
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
        this[side === "front" ? "title" : "content"] =
          typeof text === "string" ? text : "";
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
      addImages(images, side) {
        const sideImages = this.getImages(side);
        if (
          (this.getText(side) && sideImages.length + images.length > 2) ||
          sideImages.length + images.length > 4
        ) {
          throw new Error("Image limit has been reached!");
        }
        for (let i = 0; i < images.length; i++) {
          const image = images[i];
          if (
            !["image/jpeg", "image/png", "image/svg+xml"].includes(image.type)
          ) {
            throw new Error("Choose another format. (JPEG, PNG, SVG)");
          }
          if (sideImages.some((img) => img.name === image.name)) {
            throw new Error("You can not add the same image twice!");
          }
        }
        this.setImages([...sideImages, ...images], side);
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
    const renderText = (show, textarea, withImages, text) => {
      const textBtnIco =
        textarea.parentElement.nextElementSibling.firstElementChild
          .firstElementChild;
      textarea.value = text;
      if (!show) {
        textarea.classList.add("none");
        textBtnIco.src = textIco;
      } else {
        if (withImages) {
          textarea.style.height = null;
        } else {
          textarea.style.height = "80%";
        }
        textarea.classList.remove("none");
        textBtnIco.src = removeTextIco;
        textarea.style.paddingTop = null;
        textarea.style.paddingBottom = null;
        centerTextInTextarea(textarea);
      }
    };
    const renderImages = (images, container, onImageRemove) => {
      const containerWidth = container.clientWidth,
        containerHeight = container.clientHeight,
        imageWidth =
          (images.length > 1 ? containerWidth / 2 - 10 : containerWidth) + "px",
        imageHeight =
          (images.length > 2 ? containerHeight / 2 - 10 : containerHeight) +
          "px";

      let newImages = images.reduce(
        (prev, image) => prev.set(image.name, image),
        new Map()
      );
      container
        .querySelectorAll(".flashcard-side__image")
        .forEach((imageEl) => {
          const imageName = imageEl.dataset.imageName;
          if (newImages.has(imageName)) {
            imageEl.lastElementChild.style.maxHeight = imageHeight;
            newImages.delete(imageName);
            imageEl.lastElementChild.style.maxWidth = imageWidth;
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
      const addAudioBtn =
        audioBtn.parentElement.nextElementSibling.lastElementChild;
      if (!audioFile) {
        audioBtn.dataset.audioName = null;
        audioBtn.lastElementChild && audioBtn.lastElementChild.pause();
        audioBtn.innerHTML = "";
        audioBtn.onclick = () => {};
        addAudioBtn.dataset.remove = "";
        addAudioBtn.firstElementChild.src = audioIco;
        return;
      }
      addAudioBtn.dataset.remove = true;
      addAudioBtn.firstElementChild.src = removeAudioIco;
      if (audioBtn.dataset.audioName !== audioFile.name) {
        audioBtn.dataset.audioName = audioFile.name;
        const soundReader = new FileReader();
        soundReader.onload = (e) => {
          audioBtn.innerHTML = `<img src="${playIco}" alt="Play"><audio><source src="${e.target.result}" type="${audioFile.type}"></audio>`;
          const audioEl = audioBtn.lastElementChild;
          audioBtn.onclick = () => {
            if (audioEl.paused) {
              audioBtn.firstElementChild.src = pauseIco;
              audioEl.play();
            } else {
              audioBtn.firstElementChild.src = playIco;
              audioEl.pause();
            }
          };
        };
        soundReader.onerror = function (e) {
          console.log(e);
        };
        soundReader.readAsDataURL(audioFile);
      }
    };
    const createWorkspace = (sideName, sideEl) => {
      const workspace = document.createElement("div");
      workspace.classList.add("flashcard-side__workspace");
      workspace.innerHTML = `<div class="flashcard-side__images"></div><div class="flashcard-side__sound"></div><textarea class="flashcard-side__text flashcard-side__text_${
        sideName === "front" ? "title" : "content"
      } none" placeholder="Enter your text here"></textarea>`;
      workspace.lastElementChild.addEventListener("input", (e) => {
        const prevValue = flashcard.getText(sideName);
        e.target.style.paddingTop = null;
        e.target.style.paddingBottom = null;
        if (e.target.scrollHeight - e.target.clientHeight > 5) {
          e.target.value = prevValue;
          centerTextInTextarea(e.target);
          return;
        }
        centerTextInTextarea(e.target);
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
      tools.innerHTML = `<button class="tool rnd-button" type="button"><img src="${textIco}" alt="#" /></button><button class="tool rnd-button"><img src="${imageIco}" alt="#" /></button><button class="tool rnd-button"><img src="${audioIco}" alt="#" /></button>`;
      tools.children[0].addEventListener("click", (e) => {
        const textarea = sideEl.firstElementChild.lastElementChild;
        try {
          const showText = textarea.classList.contains("none");
          flashcard.setText(showText, sideName);
          renderFlashcardSide(sideName, sideEl.firstElementChild, showText);
          showText && textarea.focus();
        } catch (e) {
          useMessageModal(e.message);
        }
      });
      tools.children[1].addEventListener("click", (e) => {
        e.stopPropagation();
        useUploadModal((files) => {
          if (files && files.length) {
            try {
              flashcard.addImages(files, sideName);
              renderFlashcardSide(sideName, sideEl.firstElementChild);
              return true;
            } catch (e) {
              useMessageModal(e.message);
            }
          }
        });
      });
      tools.children[2].addEventListener("click", (e) => {
        e.stopPropagation();
        if (e.currentTarget.dataset.remove) {
          flashcard.removeAudio(sideName);
          renderFlashcardSide(sideName, sideEl.firstElementChild);
          return;
        }
        useUploadModal((files) => {
          if (files && files.length) {
            try {
              flashcard.setAudio(files[0], sideName);
              renderFlashcardSide(sideName, sideEl.firstElementChild);
              return true;
            } catch (e) {
              useMessageModal(e.message);
            }
          }
        });
      });
      sideEl.append(tools);
    };
    const flashcard = new FlashCard();
    const renderFlashcardSide = (sideName, sideWorkspace, showTextarea) => {
      const sideData = flashcard.getSideData(sideName);

      const imagesContainer = sideWorkspace.children[0];
      imagesContainer.style.height = !(showTextarea || sideData.text)
        ? "80%"
        : sideData.images.length
        ? sideName === "front"
          ? "50%"
          : "40%"
        : "0";
      const textarea = sideWorkspace.children[2];
      renderText(
        showTextarea || sideData.text,
        textarea,
        !!sideData.images.length,
        sideData.text
      );
      renderImages(sideData.images, imagesContainer, (imageName) => {
        flashcard.removeImage(imageName, sideName);
        renderFlashcardSide(sideName, sideWorkspace);
      });
      const audioBtn = sideWorkspace.children[1];
      renderAudio(sideData.audio, audioBtn);
      if (
        sideData.images.length &&
        textarea.scrollHeight - textarea.clientHeight > 5
      ) {
        flashcard.setImages([], sideName);
        useMessageModal(
          "It feels like you have filled this card with text and there is no space for image. Remove some text and try again."
        );
        setTimeout(() => {
          renderFlashcardSide(sideName, sideWorkspace);
        }, 100);
      }
    };

    const container = document.querySelector(".constructor__parts .row");
    container.innerHTML = "";
    ["front", "back"].forEach((sideName) => {
      container.insertAdjacentHTML(
        "beforeend",
        '<div class="col-lg-6 col-md-12"><div class="flashcard-side"></div></div>'
      );
      const side = container.lastElementChild.lastElementChild;
      new ResizeObserver((entries) => {
        renderFlashcardSide(sideName, entries[0].target.firstElementChild);
      }).observe(side);
      createWorkspace(sideName, side);
      createTools(sideName, side);
    });
    const submitBtn = document.querySelector("#createFlashcard");
    submitBtn.addEventListener("click", () => {
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
      const prevBtnText = submitBtn.innerHTML;
      submitBtn.disabled = true;
      submitBtn.innerHTML = `<div style="border: 10px solid;" class="loading-spinner"></div>`;
      const cardsetId = parseInt(window.location.href.split("/").pop());
      formData.append("cardset_id", cardsetId);
      createFlashcard(formData).then((res) => {
        flashcard.reset();
        renderFlashcardSide(
          "front",
          container.firstElementChild.firstElementChild.firstElementChild
        );
        renderFlashcardSide(
          "back",
          container.lastElementChild.firstElementChild.firstElementChild
        );
        onCreation(res);
        submitBtn.disabled = false;
        submitBtn.innerHTML = prevBtnText;
      });
    });
  };
  try {
    initModals(false);
    loadCategories();
    loadFlashcards();
    initCardsetActions();
    initFlashcardCreation((flashcard) => {
      if (!flashcardsList.querySelector(".flashcards__card")) {
        flashcardsList.innerHTML = "";
      }
      showFlashcard(flashcard);
    });
  } catch (e) {
    console.log(e);
  }
});
