/*
 * ATTENTION: The "eval" devtool has been used (maybe by default in mode: "development").
 * This devtool is neither made for production nor for readable output files.
 * It uses "eval()" calls to create a separate source file in the browser devtools.
 * If you are trying to read the output file, select a different devtool (https://webpack.js.org/configuration/devtool/)
 * or disable the default devtool with "devtool: false".
 * If you are looking for production-ready output files, see mode: "production" (https://webpack.js.org/configuration/mode/).
 */
/******/ (function() { // webpackBootstrap
/******/ 	"use strict";
/******/ 	var __webpack_modules__ = ({

/***/ "./sass/pages/set.scss":
/*!*****************************!*\
  !*** ./sass/pages/set.scss ***!
  \*****************************/
/***/ (function(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

eval("__webpack_require__.r(__webpack_exports__);\n// extracted by mini-css-extract-plugin\n\n\n//# sourceURL=webpack:///./sass/pages/set.scss?");

/***/ }),

/***/ "./js/set.js":
/*!*******************!*\
  !*** ./js/set.js ***!
  \*******************/
/***/ (function(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

eval("__webpack_require__.r(__webpack_exports__);\n/* harmony import */ var _sass_pages_set_scss__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../sass/pages/set.scss */ \"./sass/pages/set.scss\");\n\r\n\r\ndocument.addEventListener(\"DOMContentLoaded\", () => {\r\n  const flashcards = document.querySelector(\".flashcards\");\r\n\r\n  flashcards.addEventListener(\"click\", (event) => {\r\n    const flashcard = event.target.closest(\".flashcards__card\");\r\n    if (flashcard) {\r\n      flashcard.classList.toggle(\"flashcards__card-active\");\r\n    }\r\n  });\r\n\r\n  const flashcardData = {\r\n    title: \"\",\r\n    content: \"\",\r\n    frontImages: [],\r\n    frontAudio: null,\r\n    backImages: [],\r\n    backAudio: null,\r\n  };\r\n  const flashcardContructor = document.querySelector(\".constructor\");\r\n\r\n  flashcardContructor\r\n    .querySelectorAll(\".flashcard-side__text\")\r\n    .forEach((textarea) => {\r\n      textarea.addEventListener(\"input\", (e) => {\r\n        if (\r\n          e.target.value.endsWith(\"\\n\\n\") ||\r\n          parseFloat(e.target.scrollHeight) -\r\n            parseFloat(getComputedStyle(e.target).height) >\r\n            5\r\n        ) {\r\n          e.target.value = e.target.value.slice(0, -1);\r\n          return;\r\n        }\r\n        flashcardData[e.target.dataset.key] = e.target.value;\r\n        console.log(flashcardData);\r\n      });\r\n    });\r\n\r\n  flashcardContructor\r\n    .querySelectorAll(\".tool input[type=file]\")\r\n    .forEach((input) => {\r\n      input.addEventListener(\"change\", (e) => {\r\n        uploadFile(e, flashcardData);\r\n      });\r\n    });\r\n\r\n  flashcardContructor\r\n    .querySelectorAll(\"button[data-text-btn]\")\r\n    .forEach((btn) => {\r\n      btn.addEventListener(\"click\", () => {\r\n        const textEl =\r\n          btn.parentElement.previousElementSibling.lastElementChild;\r\n        textEl.classList.toggle(\"none\");\r\n        textEl.focus();\r\n      });\r\n    });\r\n\r\n  flashcardContructor\r\n    .querySelectorAll(\"button[data-upload-btn]\")\r\n    .forEach((btn) => {\r\n      btn.addEventListener(\"click\", () => {\r\n        btn.lastElementChild.click();\r\n      });\r\n    });\r\n});\r\n\r\nconst uploadFile = (event, flashcardData) => {\r\n  const dataKey = event.target.dataset.key;\r\n\r\n  if (dataKey.includes(\"Images\")) {\r\n    uploadImage(event, flashcardData, dataKey);\r\n  } else if (dataKey.includes(\"Audio\")) {\r\n    uploadSound(event, flashcardData, dataKey);\r\n  }\r\n};\r\nconst uploadImage = (event, flashcardData, flashcardDataKey) => {\r\n  const file = event.target.files[0];\r\n  if (!file) {\r\n    return;\r\n  }\r\n  if (![\"image/jpeg\", \"image/png\", \"image/svg+xml\"].includes(file.type)) {\r\n    alert(\"Choose another format. (JPEG, PNG, SVG)\");\r\n    event.target.value = \"\";\r\n    return;\r\n  }\r\n  const imagesContainer =\r\n    event.target.parentElement.parentElement.previousElementSibling\r\n      .firstElementChild;\r\n\r\n  // Check if no more than 3 images\r\n  if (imagesContainer.children.length >= 3 ) {\r\n    alert(\"Image limit has been reached!\");\r\n    event.target.value = \"\";\r\n    return;\r\n  }\r\n  const readerImage = new FileReader();\r\n  readerImage.onload = (event) => {\r\n    imagesContainer.insertAdjacentHTML(\r\n      \"beforeend\",\r\n      `\r\n    <img\r\n      class=\"flashcard-side__image\"\r\n      src=\"${event.target.result}\"\r\n    />\r\n    `\r\n    );\r\n    flashcardData[flashcardDataKey].push(file);\r\n  };\r\n  readerImage.onerror = function (e) {\r\n    alert(\"Error\");\r\n    console.log(e);\r\n  };\r\n  readerImage.readAsDataURL(file);\r\n};\r\n\r\nconst uploadSound = (event, flashcardData, flashcardDataKey) => {\r\n  const file = event.target.files[0];\r\n  if (!file) {\r\n    return;\r\n  }\r\n  if (![\"audio/mpeg\", \"audio/wav\", \"audio/ogg\"].includes(file.type)) {\r\n    alert(\"Choose another format. (MP3, WAV, OGG)\");\r\n    event.target.value = \"\";\r\n    return;\r\n  }\r\n  if (file.size > 1024 * 1024 * 10) {\r\n    alert(\"File size must be less than 10 MB\");\r\n    audioInput.value = \"\";\r\n    return;\r\n  }\r\n  const sideWorkspace = event.target.parentElement.parentElement.previousElementSibling;\r\n  const playSound = sideWorkspace.querySelector(\".flashcard-side__sound\");\r\n  // Check if no more than 1 audio\r\n  if (playSound.children.length >= 1 ) {\r\n    alert(\"Audio limit has been reached!\");\r\n    event.target.value = \"\";\r\n    return;\r\n  }\r\n\r\n  const readerSound = new FileReader();\r\n  readerSound.onload = (event) => {\r\n    const audio = new Audio(readerSound.result);\r\n    playSound.innerHTML = `<img src=\"./img/play-ico.svg\" alt=\"Play\">`;\r\n    flashcardData[flashcardDataKey] = file;\r\n\r\n    playSound.onclick = function () {\r\n      if (audio.paused) {\r\n        audio.play();\r\n        playSound.innerHTML = `<img src=\"./img/pause-ico.svg\" alt=\"Pause\">`;\r\n      } else {\r\n        audio.pause();\r\n        playSound.innerHTML = `<img src=\"./img/play-ico.svg\" alt=\"Play\">`;\r\n      }\r\n      };\r\n  };\r\n  readerSound.onerror = function (e) {\r\n    alert(\"Error\");\r\n  };\r\n  readerSound.readAsDataURL(file);\r\n};\r\n\r\nconst submitFlashCard = (event, flashcardSides, flashCardAttachments) => {\r\n  event.preventDefault();\r\n  const formData = new FormData();\r\n\r\n  const cardSetTitleEl = document.querySelector(\"h1\");\r\n\r\n  const cardsetId = +cardSetTitleEl.dataset.id;\r\n  formData.append(\"cardset_id\", cardsetId);\r\n\r\n  let errors = 0;\r\n\r\n  flashcardSides.forEach((side) => {\r\n    const sideName = side.dataset.type + \"Side\";\r\n    const textarea = side.querySelector(\".textarea\");\r\n    const sideText = textarea.textContent.trim();\r\n\r\n    if (\r\n      !sideText &&\r\n      !flashCardAttachments[sideName].images.length &&\r\n      !flashCardAttachments[sideName].audio\r\n    ) {\r\n      alert(\"Flash card side can not be empty!\");\r\n      errors += 1;\r\n      return;\r\n    }\r\n\r\n    formData.append(textarea.id.replace(\"textarea-\", \"\"), sideText);\r\n    textarea.innerHTML = \"\";\r\n    side.querySelector(\".image-preview\").innerHTML = \"\";\r\n  });\r\n\r\n  if (errors) {\r\n    return;\r\n  }\r\n\r\n  flashCardAttachments.frontSide.images.forEach((image) => {\r\n    formData.append(\"front_images\", image);\r\n  });\r\n  flashCardAttachments.backSide.images.forEach((image) => {\r\n    formData.append(\"back_images\", image);\r\n  });\r\n  flashCardAttachments.frontSide.audio &&\r\n    formData.append(\"front_audio\", flashCardAttachments.frontSide.audio);\r\n  flashCardAttachments.backSide.audio &&\r\n    formData.append(\"back_audio\", flashCardAttachments.backSide.audio);\r\n\r\n  fetch(\"/api/create-flashcard\", { method: \"POST\", body: formData }).then(\r\n    (response) => loadFlashCards(cardsetId)\r\n  );\r\n\r\n  event.target.reset();\r\n  for (const side in flashCardAttachments) {\r\n    flashCardAttachments[side] = {\r\n      images: [],\r\n      audio: null,\r\n    };\r\n  }\r\n  event.target.parentElement.classList.remove(\"transit\");\r\n};\r\n\n\n//# sourceURL=webpack:///./js/set.js?");

/***/ })

/******/ 	});
/************************************************************************/
/******/ 	// The module cache
/******/ 	var __webpack_module_cache__ = {};
/******/ 	
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/ 		// Check if module is in cache
/******/ 		var cachedModule = __webpack_module_cache__[moduleId];
/******/ 		if (cachedModule !== undefined) {
/******/ 			return cachedModule.exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = __webpack_module_cache__[moduleId] = {
/******/ 			// no module.id needed
/******/ 			// no module.loaded needed
/******/ 			exports: {}
/******/ 		};
/******/ 	
/******/ 		// Execute the module function
/******/ 		__webpack_modules__[moduleId](module, module.exports, __webpack_require__);
/******/ 	
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/ 	
/************************************************************************/
/******/ 	/* webpack/runtime/make namespace object */
/******/ 	!function() {
/******/ 		// define __esModule on exports
/******/ 		__webpack_require__.r = function(exports) {
/******/ 			if(typeof Symbol !== 'undefined' && Symbol.toStringTag) {
/******/ 				Object.defineProperty(exports, Symbol.toStringTag, { value: 'Module' });
/******/ 			}
/******/ 			Object.defineProperty(exports, '__esModule', { value: true });
/******/ 		};
/******/ 	}();
/******/ 	
/************************************************************************/
/******/ 	
/******/ 	// startup
/******/ 	// Load entry module and return exports
/******/ 	// This entry module can't be inlined because the eval devtool is used.
/******/ 	var __webpack_exports__ = __webpack_require__("./js/set.js");
/******/ 	
/******/ })()
;