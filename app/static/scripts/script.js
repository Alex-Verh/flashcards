"use strict";

import { changeBackground } from "./background.js";
import { loadCategories } from "./categoryLoading.js";
import { initCardSetCreator } from "./cardset.js";
import { initFlashCardConstructor, loadFlashCards } from "./flashcard.js";
import { initCardSetsLoadingAndSearch } from "./cardsetsLoadingAndSearch.js";
import { initModalBoxes } from "./modalBoxes.js";
import { initEditProfile } from "./editProfile.js";
import { chooseLearn } from "./learn.js";
import { sortSelect } from "./sort.js";


document.addEventListener("DOMContentLoaded", (e) => {
  document.querySelector(".navMenu").addEventListener("click", (e) => {
    const navLink = e.target.closest("a");
    if (navLink && navLink.id !== "open-window") {
      document.querySelector("#active").checked = false;
    }
  });

  const blob = document.getElementById("blob");
  document.body.onpointermove = (event) => {
    const { clientX, clientY } = event;
    blob.animate(
      {
        left: `${clientX}px`,
        top: `${clientY}px`,
      },
      { duration: 3000, fill: "forwards" }
    );
  };

  document.querySelector(".images").addEventListener("click", (event) => {
    const backgroundImage = event.target.closest(".image .background");
    if (backgroundImage) {
      console.log("background");
      localStorage.setItem("backgroundUrl", `url(${backgroundImage.src})`);
      changeBackground();
    }
  });

  loadCategories();
  initCardSetCreator();
  initModalBoxes();

  if (window.location.href.endsWith("home")) {
    initCardSetsLoadingAndSearch();
    sortSelect();
  } else if (window.location.href.split("/")[3] === "cardset") {
    loadFlashCards(window.location.href.split("/")[4])
    initFlashCardConstructor();
  } else if (window.location.href.endsWith("profile")) {
    initEditProfile();
  } else if (window.location.href.includes('learn')) {
    chooseLearn();
  }
});
