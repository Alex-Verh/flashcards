import playIco from "../../img/icons/play-ico.svg";
import pauseIco from "../../img/icons/pause-ico.svg";

export const generateFlashcardSideEl = ({
  text = "",
  images = [],
  audio = null,
  containerClass = "card-side",
  imagesClass = "card-side__images",
  imageClass = "card-side__image",
  textClass = "card-side__text",
  audioClass = "card-side__audio",
}) => {
  const side = document.createElement("div");
  side.className = containerClass;

  const imagesStyle = `height: ${!text ? "90%" : images.length ? "60%" : "0"}`;
  const imageStyle = `max-height: ${
    (images.length > 2 ? 95 / 2 - 10 : 95) + "%"
  }; max-width: ${(images.length > 1 ? 95 / 2 - 10 : 95) + "%"}`;
  const imagesHTML = images.reduce(
    (prev, imageName) =>
      prev +
      `<img class="${imageClass}" style="${imageStyle}" src="${imageName}" />`,
    ""
  );
  side.insertAdjacentHTML(
    "beforeend",
    `<div class="${imagesClass}" style="${imagesStyle}">${imagesHTML}</div>`
  );
  side.insertAdjacentHTML(
    "beforeend",
    `<div class="${textClass}">${text}</div>`
  );

  if (audio) {
    const audioObj = new Audio(audio);
    const audioBtn = document.createElement("img");
    audioBtn.className = audioClass;
    audioBtn.alt = "toggle audio";
    audioBtn.src = playIco;
    audioBtn.onclick = (e) => {
      e.stopPropagation();
      if (audioObj.paused) {
        audioObj.play();
        audioBtn.src = pauseIco;
      } else {
        audioObj.pause();
        audioBtn.src = playIco;
      }
    };
    side.insertAdjacentElement("beforeend", audioBtn);
  }
  return side;
};

export const generateFlashcardEl = (
  data,
  wrapperClass,
  containerClass = "flashcards__card",
  frontsideClass = "card-side card-side_front",
  backsideClass = "card-side card-side_back"
) => {
  const flashcard = document.createElement("div");
  flashcard.className = containerClass;
  flashcard.append(
    generateFlashcardSideEl({
      text: data.title,
      images: data.attachments.frontside.images,
      audio: data.attachments.frontside.audio,
      containerClass: frontsideClass,
    })
  );
  flashcard.append(
    generateFlashcardSideEl({
      text: data.content,
      images: data.attachments.backside.images,
      audio: data.attachments.backside.audio,
      containerClass: backsideClass,
    })
  );
  if (wrapperClass) {
    const wrapper = document.createElement("div");
    wrapper.className = wrapperClass;
    wrapper.append(flashcard);
    return wrapper;
  }
  return flashcard;
};
