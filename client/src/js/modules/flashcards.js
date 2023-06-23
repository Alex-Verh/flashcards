export const generateFlashcardSideHTML = ({
  text = "",
  images = [],
  audio = null,
  containerClass = "card-side",
  imagesClass = "card-side__images",
  imageClass = "card-side__image",
  textClass = "card-side__text",
}) => {
  const imagesStyle = `height: ${!text ? "90%" : images.length ? "60%" : "0"}`;
  const imageStyle = `max-height: ${
    (images.length > 2 ? 95 / 2 - 10 : 95) + "%"
  }; max-width: ${(images.length > 1 ? 95 / 2 - 10 : 95) + "%"}`;
  const imagesHTML = images.reduce(
    (prev, imageName) =>
      prev +
      `<img class="${imageClass}" style="${imageStyle}" src="/uploads/${imageName}" />`,
    ""
  );
  return `
  <div class="${containerClass}"><div class="${imagesClass}" style="${imagesStyle}">${imagesHTML}</div><div class="${textClass}">${text}</div></div>
  `;
};

export const generateFlashcardHTML = (
  data,
  containerClass = "flashcards__card",
  frontsideClass = "card-side card-side_front",
  backsideClass = "card-side card-side_back"
) => {
  return `
  <div class="col-sm-6 col-md-4 col-lg-3"><div class="${containerClass}">${generateFlashcardSideHTML(
    {
      text: data.title,
      images: data.attachments.frontside.images,
      containerClass: frontsideClass,
    }
  )}${generateFlashcardSideHTML({
    text: data.content,
    images: data.attachments.backside.images,
    containerClass: backsideClass,
  })}</div></div>
  `;
};
