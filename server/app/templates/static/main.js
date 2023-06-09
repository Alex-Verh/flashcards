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

/***/ "./sass/pages/main.scss":
/*!******************************!*\
  !*** ./sass/pages/main.scss ***!
  \******************************/
/***/ (function(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

eval("__webpack_require__.r(__webpack_exports__);\n// extracted by mini-css-extract-plugin\n\n\n//# sourceURL=webpack:///./sass/pages/main.scss?");

/***/ }),

/***/ "./js/api/endpoints.js":
/*!*****************************!*\
  !*** ./js/api/endpoints.js ***!
  \*****************************/
/***/ (function(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

eval("__webpack_require__.r(__webpack_exports__);\n/* harmony export */ __webpack_require__.d(__webpack_exports__, {\n/* harmony export */   \"BASE_API_URL\": function() { return /* binding */ BASE_API_URL; },\n/* harmony export */   \"CARDSETS_URL\": function() { return /* binding */ CARDSETS_URL; },\n/* harmony export */   \"CATEGORIES_URL\": function() { return /* binding */ CATEGORIES_URL; }\n/* harmony export */ });\nconst BASE_API_URL = \"http://localhost:5000/api\";\r\n\r\nconst CARDSETS_URL = BASE_API_URL + \"/cardsets\";\r\nconst CATEGORIES_URL = BASE_API_URL + \"/cardset-categories\";\r\n\n\n//# sourceURL=webpack:///./js/api/endpoints.js?");

/***/ }),

/***/ "./js/api/queries.js":
/*!***************************!*\
  !*** ./js/api/queries.js ***!
  \***************************/
/***/ (function(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

eval("__webpack_require__.r(__webpack_exports__);\n/* harmony export */ __webpack_require__.d(__webpack_exports__, {\n/* harmony export */   \"getCardsets\": function() { return /* binding */ getCardsets; },\n/* harmony export */   \"getCategories\": function() { return /* binding */ getCategories; }\n/* harmony export */ });\n/* harmony import */ var _endpoints__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./endpoints */ \"./js/api/endpoints.js\");\n\r\n\r\nconst getCardsets = async ({\r\n  offset = 0,\r\n  limit = 16,\r\n  searchQ = \"\",\r\n  categoryId = 0,\r\n  sortBy = \"\",\r\n  filter,\r\n}) => {\r\n  const url = `${_endpoints__WEBPACK_IMPORTED_MODULE_0__.CARDSETS_URL}?limit=${limit}&offset=${offset}&categoryId=${categoryId}&searchQuery=${searchQ}&sortBy=${sortBy}${\r\n    filter ? \"&\" + filter + \"=true\" : \"\"\r\n  }`;\r\n\r\n  const res = await fetch(url);\r\n  const cardsets = await res.json();\r\n  return cardsets;\r\n};\r\n\r\nconst getCategories = async () => {\r\n  const res = await fetch(_endpoints__WEBPACK_IMPORTED_MODULE_0__.CATEGORIES_URL);\r\n  return await res.json();\r\n};\r\n\n\n//# sourceURL=webpack:///./js/api/queries.js?");

/***/ }),

/***/ "./js/constants.js":
/*!*************************!*\
  !*** ./js/constants.js ***!
  \*************************/
/***/ (function(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

eval("__webpack_require__.r(__webpack_exports__);\n/* harmony export */ __webpack_require__.d(__webpack_exports__, {\n/* harmony export */   \"categoryColor\": function() { return /* binding */ categoryColor; },\n/* harmony export */   \"questionAnswer\": function() { return /* binding */ questionAnswer; }\n/* harmony export */ });\nconst questionAnswer = {\r\n  \"What is a flashcard?\":\r\n    \"A flashcard is a double-sided tool used for learning, consisting of a question or term on one side and the corresponding explanation on the other side.\",\r\n  \"Why flashcards are useful?\":\r\n    \"Flashcards are used as a study tool to enhance memorization by promoting active repetition and reinforcement of information in a concise and portable format.\",\r\n  \"How are flashcards grouped?\":\r\n    \"Flashcards can be grouped based on various criteria such as topic, category, difficulty level, or any other classification that helps organize the flashcards within a card set.\",\r\n  \"How do I study flashcards?\":\r\n    \"To study flashcards, review each card by attempting to recall the answer, checking your response, and repeating the process while focusing on challenging cards.\",\r\n  \"Can I share my flashcards?\":\r\n    \"Yes, you can share flashcards by making the card set public and accessible to others.\",\r\n};\r\n\r\nconst categoryColor = {\r\n  Math: \"#41fdfe\",\r\n  Science: \"#ff66ff\",\r\n  Language: \"#00ff7c\",\r\n  History: \"#9f00ff\",\r\n  Geography: \"#87fd05\",\r\n  Literature: \"#fe4164\",\r\n  Art: \"#ff9889\",\r\n  Music: \"#fedf08\",\r\n  Philosophy: \"#fcfd74\",\r\n  Religion: \"#ffa62b\",\r\n  Sports: \"#fff000\",\r\n  Medicine: \"#f4c430\",\r\n  Business: \"#ff7fa7\",\r\n  Law: \"#fe6700\",\r\n  Technology: \"#08E8DE\",\r\n  Social: \"#f0e681\",\r\n  Psychology: \"#fe01b1\",\r\n  Education: \"#ffc82a\",\r\n  Politics: \"#ff878d\",\r\n  Environment: \"#fff600\",\r\n  Other: \"#bb1237\",\r\n};\r\n\n\n//# sourceURL=webpack:///./js/constants.js?");

/***/ }),

/***/ "./js/main.js":
/*!********************!*\
  !*** ./js/main.js ***!
  \********************/
/***/ (function(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

eval("__webpack_require__.r(__webpack_exports__);\n/* harmony import */ var _sass_pages_main_scss__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../sass/pages/main.scss */ \"./sass/pages/main.scss\");\n/* harmony import */ var _modules_cardsets__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./modules/cardsets */ \"./js/modules/cardsets.js\");\n/* harmony import */ var _constants__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./constants */ \"./js/constants.js\");\n/* harmony import */ var _modules_categories__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ./modules/categories */ \"./js/modules/categories.js\");\n\r\n\r\n\r\n\r\n\r\ndocument.addEventListener(\"DOMContentLoaded\", () => {\r\n  __webpack_require__.e(/*! import() */ \"js_modules_modals_js\").then(__webpack_require__.t.bind(__webpack_require__, /*! ./modules/modals */ \"./js/modules/modals.js\", 23));\r\n  (0,_modules_categories__WEBPACK_IMPORTED_MODULE_3__.loadCategories)();\r\n  (0,_modules_cardsets__WEBPACK_IMPORTED_MODULE_1__.initCardsetsSection)(\r\n    {\r\n      offset: 0,\r\n      limit: 16,\r\n      searchQ: \"\",\r\n      categoryId: 0,\r\n      sortBy: \"\",\r\n    },\r\n    \".main__card-sets .row\",\r\n    \"#loadMoreBtn\",\r\n    \"#search\",\r\n    \"#category\",\r\n    \"#sortBy\"\r\n  );\r\n  ///  FAQ section ///\r\n  const questionCard = document.querySelector(\"#question-card\");\r\n  const answerCard = document.querySelector(\"#answer-card\");\r\n  const questionsContainer = document.querySelector(\".help__questions\");\r\n  const questions = Object.keys(_constants__WEBPACK_IMPORTED_MODULE_2__.questionAnswer);\r\n\r\n  questions.forEach((question) => {\r\n    questionsContainer.insertAdjacentHTML(\r\n      \"beforeend\",\r\n      `\r\n    <div class=\"help__question\">${question}</div>\r\n    `\r\n    );\r\n  });\r\n\r\n  questionCard.innerHTML = questions[0];\r\n  answerCard.innerHTML = _constants__WEBPACK_IMPORTED_MODULE_2__.questionAnswer[questions[0]];\r\n\r\n  questionsContainer.addEventListener(\"click\", (event) => {\r\n    const question = event.target.closest(\".help__question\");\r\n    if (question) {\r\n      questionCard.innerHTML = question.innerHTML;\r\n      answerCard.innerHTML = _constants__WEBPACK_IMPORTED_MODULE_2__.questionAnswer[question.innerHTML];\r\n    }\r\n  });\r\n  ///  END FAQ section ///\r\n});\r\n\n\n//# sourceURL=webpack:///./js/main.js?");

/***/ }),

/***/ "./js/modules/cardsets.js":
/*!********************************!*\
  !*** ./js/modules/cardsets.js ***!
  \********************************/
/***/ (function(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

eval("__webpack_require__.r(__webpack_exports__);\n/* harmony export */ __webpack_require__.d(__webpack_exports__, {\n/* harmony export */   \"generateCardsetsHTML\": function() { return /* binding */ generateCardsetsHTML; },\n/* harmony export */   \"initCardsetsSection\": function() { return /* binding */ initCardsetsSection; }\n/* harmony export */ });\n/* harmony import */ var _api_queries__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../api/queries */ \"./js/api/queries.js\");\n/* harmony import */ var _constants__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../constants */ \"./js/constants.js\");\n/* harmony import */ var _dropdown__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./dropdown */ \"./js/modules/dropdown.js\");\n\r\n\r\n\r\n\r\nconst generateCardsetsHTML = (cardsets) => {\r\n  const cardsetsHTML = cardsets.reduce(\r\n    (prev, cardset) =>\r\n      prev +\r\n      `\r\n    <div class=\"col-sm-6 col-md-4 col-lg-3\">\r\n      <div class=\"card-set\">\r\n        <div class=\"card-set__counter\">\r\n          <img src=\"../img/flashcard_counter.svg\" alt=\"Nr\" />\r\n          <span>${cardset.flashcards_qty}</span>\r\n        </div>\r\n        <div class=\"card-set__category\" style=\"background-color: ${\r\n          _constants__WEBPACK_IMPORTED_MODULE_1__.categoryColor[cardset.category]\r\n        }\">${cardset.category}</div>\r\n        <div class=\"card-set__name\">${cardset.title}</div>\r\n        <div class=\"card-set__author\">${cardset.author}</div>\r\n        <div class=\"card-set__saved\">\r\n          <img src=\"../img/saved_counter.svg\" alt=\"Nr\" />\r\n          <span>${cardset.saves}</span>\r\n        </div>\r\n      </div>\r\n    </div>\r\n    `,\r\n    \"\"\r\n  );\r\n  return cardsetsHTML;\r\n};\r\n\r\nconst initCardsetsSection = (\r\n  queryParams,\r\n  cardsetsContainerSelector,\r\n  loadMoreBtnSelector,\r\n  searchSelector,\r\n  categorySelector,\r\n  sortBySelector,\r\n  typeSelector\r\n) => {\r\n  const cardsetsContainer = document.querySelector(cardsetsContainerSelector);\r\n  const loadMoreBtn = document.querySelector(loadMoreBtnSelector);\r\n\r\n  const loadCardsets = async () => {\r\n    const cardsets = await (0,_api_queries__WEBPACK_IMPORTED_MODULE_0__.getCardsets)(queryParams);\r\n    cardsetsContainer.insertAdjacentHTML(\r\n      \"beforeend\",\r\n      generateCardsetsHTML(cardsets)\r\n    );\r\n    if (loadMoreBtn) {\r\n      if (cardsets.length < queryParams.limit) {\r\n        loadMoreBtn.classList.add(\"none\");\r\n      } else {\r\n        loadMoreBtn.classList.remove(\"none\");\r\n      }\r\n    }\r\n  };\r\n\r\n  loadCardsets(queryParams, cardsetsContainer);\r\n\r\n  loadMoreBtn &&\r\n    loadMoreBtn.addEventListener(\"click\", () => {\r\n      queryParams.offset += queryParams.limit;\r\n      loadCardsets();\r\n    });\r\n\r\n  typeSelector &&\r\n    (0,_dropdown__WEBPACK_IMPORTED_MODULE_2__.initDropdown)(typeSelector, (clickedItem) => {\r\n      queryParams.filter = clickedItem.dataset.filter;\r\n      queryParams.offset = 0;\r\n      cardsetsContainer.innerHTML = \"\";\r\n      loadCardsets();\r\n    });\r\n\r\n  document.querySelector(searchSelector).addEventListener(\"change\", (e) => {\r\n    queryParams.searchQ = e.target.value;\r\n    queryParams.offset = 0;\r\n    cardsetsContainer.innerHTML = \"\";\r\n    loadCardsets();\r\n  });\r\n\r\n  (0,_dropdown__WEBPACK_IMPORTED_MODULE_2__.initDropdown)(categorySelector, (clickedItem) => {\r\n    queryParams.categoryId = clickedItem.dataset.categoryId;\r\n    queryParams.offset = 0;\r\n    cardsetsContainer.innerHTML = \"\";\r\n    loadCardsets();\r\n  });\r\n\r\n  (0,_dropdown__WEBPACK_IMPORTED_MODULE_2__.initDropdown)(sortBySelector, (clickedItem) => {\r\n    queryParams.sortBy = clickedItem.dataset.sortId;\r\n    queryParams.offset = 0;\r\n    cardsetsContainer.innerHTML = \"\";\r\n    loadCardsets();\r\n  });\r\n};\r\n\n\n//# sourceURL=webpack:///./js/modules/cardsets.js?");

/***/ }),

/***/ "./js/modules/categories.js":
/*!**********************************!*\
  !*** ./js/modules/categories.js ***!
  \**********************************/
/***/ (function(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

eval("__webpack_require__.r(__webpack_exports__);\n/* harmony export */ __webpack_require__.d(__webpack_exports__, {\n/* harmony export */   \"loadCategories\": function() { return /* binding */ loadCategories; }\n/* harmony export */ });\n/* harmony import */ var _api_queries__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../api/queries */ \"./js/api/queries.js\");\n\r\n\r\nconst loadCategories = async () => {\r\n  const categories = await (0,_api_queries__WEBPACK_IMPORTED_MODULE_0__.getCategories)();\r\n  const categoriesContainer = document.querySelector(\"#categoriesDropdown\");\r\n  const categoriesHTML = categories.reduce(\r\n    (prev, category) =>\r\n      prev +\r\n      `<li class=\"dropdown__item\" data-category-id=\"${category.id}\">${category.title}</li>`,\r\n    \"\"\r\n  );\r\n  categoriesContainer.insertAdjacentHTML(\"beforeend\", categoriesHTML);\r\n};\r\n\n\n//# sourceURL=webpack:///./js/modules/categories.js?");

/***/ }),

/***/ "./js/modules/dropdown.js":
/*!********************************!*\
  !*** ./js/modules/dropdown.js ***!
  \********************************/
/***/ (function(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

eval("__webpack_require__.r(__webpack_exports__);\n/* harmony export */ __webpack_require__.d(__webpack_exports__, {\n/* harmony export */   \"initDropdown\": function() { return /* binding */ initDropdown; }\n/* harmony export */ });\nconst initDropdown = (selector, onChange) => {\r\n  const dropdown = document.querySelector(selector);\r\n  const dropdownBtn = dropdown.firstElementChild;\r\n\r\n  dropdownBtn.addEventListener(\"click\", (e) => {\r\n    dropdownBtn.parentElement.focus();\r\n  });\r\n\r\n  dropdown.lastElementChild.addEventListener(\"click\", (e) => {\r\n    const target = e.target.closest(\"li\");\r\n    if (target) {\r\n      dropdownBtn.classList.add(\"dropdown__btn_choosed\");\r\n      dropdownBtn.textContent = target.textContent;\r\n      dropdownBtn.parentElement.blur();\r\n      onChange(target);\r\n    }\r\n  });\r\n};\r\n\n\n//# sourceURL=webpack:///./js/modules/dropdown.js?");

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
/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = __webpack_modules__;
/******/ 	
/************************************************************************/
/******/ 	/* webpack/runtime/create fake namespace object */
/******/ 	!function() {
/******/ 		var getProto = Object.getPrototypeOf ? function(obj) { return Object.getPrototypeOf(obj); } : function(obj) { return obj.__proto__; };
/******/ 		var leafPrototypes;
/******/ 		// create a fake namespace object
/******/ 		// mode & 1: value is a module id, require it
/******/ 		// mode & 2: merge all properties of value into the ns
/******/ 		// mode & 4: return value when already ns object
/******/ 		// mode & 16: return value when it's Promise-like
/******/ 		// mode & 8|1: behave like require
/******/ 		__webpack_require__.t = function(value, mode) {
/******/ 			if(mode & 1) value = this(value);
/******/ 			if(mode & 8) return value;
/******/ 			if(typeof value === 'object' && value) {
/******/ 				if((mode & 4) && value.__esModule) return value;
/******/ 				if((mode & 16) && typeof value.then === 'function') return value;
/******/ 			}
/******/ 			var ns = Object.create(null);
/******/ 			__webpack_require__.r(ns);
/******/ 			var def = {};
/******/ 			leafPrototypes = leafPrototypes || [null, getProto({}), getProto([]), getProto(getProto)];
/******/ 			for(var current = mode & 2 && value; typeof current == 'object' && !~leafPrototypes.indexOf(current); current = getProto(current)) {
/******/ 				Object.getOwnPropertyNames(current).forEach(function(key) { def[key] = function() { return value[key]; }; });
/******/ 			}
/******/ 			def['default'] = function() { return value; };
/******/ 			__webpack_require__.d(ns, def);
/******/ 			return ns;
/******/ 		};
/******/ 	}();
/******/ 	
/******/ 	/* webpack/runtime/define property getters */
/******/ 	!function() {
/******/ 		// define getter functions for harmony exports
/******/ 		__webpack_require__.d = function(exports, definition) {
/******/ 			for(var key in definition) {
/******/ 				if(__webpack_require__.o(definition, key) && !__webpack_require__.o(exports, key)) {
/******/ 					Object.defineProperty(exports, key, { enumerable: true, get: definition[key] });
/******/ 				}
/******/ 			}
/******/ 		};
/******/ 	}();
/******/ 	
/******/ 	/* webpack/runtime/ensure chunk */
/******/ 	!function() {
/******/ 		__webpack_require__.f = {};
/******/ 		// This file contains only the entry chunk.
/******/ 		// The chunk loading function for additional chunks
/******/ 		__webpack_require__.e = function(chunkId) {
/******/ 			return Promise.all(Object.keys(__webpack_require__.f).reduce(function(promises, key) {
/******/ 				__webpack_require__.f[key](chunkId, promises);
/******/ 				return promises;
/******/ 			}, []));
/******/ 		};
/******/ 	}();
/******/ 	
/******/ 	/* webpack/runtime/get javascript chunk filename */
/******/ 	!function() {
/******/ 		// This function allow to reference async chunks
/******/ 		__webpack_require__.u = function(chunkId) {
/******/ 			// return url for filenames based on template
/******/ 			return "" + chunkId + ".js";
/******/ 		};
/******/ 	}();
/******/ 	
/******/ 	/* webpack/runtime/get mini-css chunk filename */
/******/ 	!function() {
/******/ 		// This function allow to reference async chunks
/******/ 		__webpack_require__.miniCssF = function(chunkId) {
/******/ 			// return url for filenames based on template
/******/ 			return undefined;
/******/ 		};
/******/ 	}();
/******/ 	
/******/ 	/* webpack/runtime/global */
/******/ 	!function() {
/******/ 		__webpack_require__.g = (function() {
/******/ 			if (typeof globalThis === 'object') return globalThis;
/******/ 			try {
/******/ 				return this || new Function('return this')();
/******/ 			} catch (e) {
/******/ 				if (typeof window === 'object') return window;
/******/ 			}
/******/ 		})();
/******/ 	}();
/******/ 	
/******/ 	/* webpack/runtime/hasOwnProperty shorthand */
/******/ 	!function() {
/******/ 		__webpack_require__.o = function(obj, prop) { return Object.prototype.hasOwnProperty.call(obj, prop); }
/******/ 	}();
/******/ 	
/******/ 	/* webpack/runtime/load script */
/******/ 	!function() {
/******/ 		var inProgress = {};
/******/ 		// data-webpack is not used as build has no uniqueName
/******/ 		// loadScript function to load a script via script tag
/******/ 		__webpack_require__.l = function(url, done, key, chunkId) {
/******/ 			if(inProgress[url]) { inProgress[url].push(done); return; }
/******/ 			var script, needAttach;
/******/ 			if(key !== undefined) {
/******/ 				var scripts = document.getElementsByTagName("script");
/******/ 				for(var i = 0; i < scripts.length; i++) {
/******/ 					var s = scripts[i];
/******/ 					if(s.getAttribute("src") == url) { script = s; break; }
/******/ 				}
/******/ 			}
/******/ 			if(!script) {
/******/ 				needAttach = true;
/******/ 				script = document.createElement('script');
/******/ 		
/******/ 				script.charset = 'utf-8';
/******/ 				script.timeout = 120;
/******/ 				if (__webpack_require__.nc) {
/******/ 					script.setAttribute("nonce", __webpack_require__.nc);
/******/ 				}
/******/ 		
/******/ 				script.src = url;
/******/ 			}
/******/ 			inProgress[url] = [done];
/******/ 			var onScriptComplete = function(prev, event) {
/******/ 				// avoid mem leaks in IE.
/******/ 				script.onerror = script.onload = null;
/******/ 				clearTimeout(timeout);
/******/ 				var doneFns = inProgress[url];
/******/ 				delete inProgress[url];
/******/ 				script.parentNode && script.parentNode.removeChild(script);
/******/ 				doneFns && doneFns.forEach(function(fn) { return fn(event); });
/******/ 				if(prev) return prev(event);
/******/ 			}
/******/ 			var timeout = setTimeout(onScriptComplete.bind(null, undefined, { type: 'timeout', target: script }), 120000);
/******/ 			script.onerror = onScriptComplete.bind(null, script.onerror);
/******/ 			script.onload = onScriptComplete.bind(null, script.onload);
/******/ 			needAttach && document.head.appendChild(script);
/******/ 		};
/******/ 	}();
/******/ 	
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
/******/ 	/* webpack/runtime/publicPath */
/******/ 	!function() {
/******/ 		var scriptUrl;
/******/ 		if (__webpack_require__.g.importScripts) scriptUrl = __webpack_require__.g.location + "";
/******/ 		var document = __webpack_require__.g.document;
/******/ 		if (!scriptUrl && document) {
/******/ 			if (document.currentScript)
/******/ 				scriptUrl = document.currentScript.src;
/******/ 			if (!scriptUrl) {
/******/ 				var scripts = document.getElementsByTagName("script");
/******/ 				if(scripts.length) {
/******/ 					var i = scripts.length - 1;
/******/ 					while (i > -1 && !scriptUrl) scriptUrl = scripts[i--].src;
/******/ 				}
/******/ 			}
/******/ 		}
/******/ 		// When supporting browsers where an automatic publicPath is not supported you must specify an output.publicPath manually via configuration
/******/ 		// or pass an empty string ("") and set the __webpack_public_path__ variable from your code to use your own logic.
/******/ 		if (!scriptUrl) throw new Error("Automatic publicPath is not supported in this browser");
/******/ 		scriptUrl = scriptUrl.replace(/#.*$/, "").replace(/\?.*$/, "").replace(/\/[^\/]+$/, "/");
/******/ 		__webpack_require__.p = scriptUrl;
/******/ 	}();
/******/ 	
/******/ 	/* webpack/runtime/jsonp chunk loading */
/******/ 	!function() {
/******/ 		// no baseURI
/******/ 		
/******/ 		// object to store loaded and loading chunks
/******/ 		// undefined = chunk not loaded, null = chunk preloaded/prefetched
/******/ 		// [resolve, reject, Promise] = chunk loading, 0 = chunk loaded
/******/ 		var installedChunks = {
/******/ 			"main": 0
/******/ 		};
/******/ 		
/******/ 		__webpack_require__.f.j = function(chunkId, promises) {
/******/ 				// JSONP chunk loading for javascript
/******/ 				var installedChunkData = __webpack_require__.o(installedChunks, chunkId) ? installedChunks[chunkId] : undefined;
/******/ 				if(installedChunkData !== 0) { // 0 means "already installed".
/******/ 		
/******/ 					// a Promise means "currently loading".
/******/ 					if(installedChunkData) {
/******/ 						promises.push(installedChunkData[2]);
/******/ 					} else {
/******/ 						if(true) { // all chunks have JS
/******/ 							// setup Promise in chunk cache
/******/ 							var promise = new Promise(function(resolve, reject) { installedChunkData = installedChunks[chunkId] = [resolve, reject]; });
/******/ 							promises.push(installedChunkData[2] = promise);
/******/ 		
/******/ 							// start chunk loading
/******/ 							var url = __webpack_require__.p + __webpack_require__.u(chunkId);
/******/ 							// create error before stack unwound to get useful stacktrace later
/******/ 							var error = new Error();
/******/ 							var loadingEnded = function(event) {
/******/ 								if(__webpack_require__.o(installedChunks, chunkId)) {
/******/ 									installedChunkData = installedChunks[chunkId];
/******/ 									if(installedChunkData !== 0) installedChunks[chunkId] = undefined;
/******/ 									if(installedChunkData) {
/******/ 										var errorType = event && (event.type === 'load' ? 'missing' : event.type);
/******/ 										var realSrc = event && event.target && event.target.src;
/******/ 										error.message = 'Loading chunk ' + chunkId + ' failed.\n(' + errorType + ': ' + realSrc + ')';
/******/ 										error.name = 'ChunkLoadError';
/******/ 										error.type = errorType;
/******/ 										error.request = realSrc;
/******/ 										installedChunkData[1](error);
/******/ 									}
/******/ 								}
/******/ 							};
/******/ 							__webpack_require__.l(url, loadingEnded, "chunk-" + chunkId, chunkId);
/******/ 						}
/******/ 					}
/******/ 				}
/******/ 		};
/******/ 		
/******/ 		// no prefetching
/******/ 		
/******/ 		// no preloaded
/******/ 		
/******/ 		// no HMR
/******/ 		
/******/ 		// no HMR manifest
/******/ 		
/******/ 		// no on chunks loaded
/******/ 		
/******/ 		// install a JSONP callback for chunk loading
/******/ 		var webpackJsonpCallback = function(parentChunkLoadingFunction, data) {
/******/ 			var chunkIds = data[0];
/******/ 			var moreModules = data[1];
/******/ 			var runtime = data[2];
/******/ 			// add "moreModules" to the modules object,
/******/ 			// then flag all "chunkIds" as loaded and fire callback
/******/ 			var moduleId, chunkId, i = 0;
/******/ 			if(chunkIds.some(function(id) { return installedChunks[id] !== 0; })) {
/******/ 				for(moduleId in moreModules) {
/******/ 					if(__webpack_require__.o(moreModules, moduleId)) {
/******/ 						__webpack_require__.m[moduleId] = moreModules[moduleId];
/******/ 					}
/******/ 				}
/******/ 				if(runtime) var result = runtime(__webpack_require__);
/******/ 			}
/******/ 			if(parentChunkLoadingFunction) parentChunkLoadingFunction(data);
/******/ 			for(;i < chunkIds.length; i++) {
/******/ 				chunkId = chunkIds[i];
/******/ 				if(__webpack_require__.o(installedChunks, chunkId) && installedChunks[chunkId]) {
/******/ 					installedChunks[chunkId][0]();
/******/ 				}
/******/ 				installedChunks[chunkId] = 0;
/******/ 			}
/******/ 		
/******/ 		}
/******/ 		
/******/ 		var chunkLoadingGlobal = self["webpackChunk"] = self["webpackChunk"] || [];
/******/ 		chunkLoadingGlobal.forEach(webpackJsonpCallback.bind(null, 0));
/******/ 		chunkLoadingGlobal.push = webpackJsonpCallback.bind(null, chunkLoadingGlobal.push.bind(chunkLoadingGlobal));
/******/ 	}();
/******/ 	
/************************************************************************/
/******/ 	
/******/ 	// startup
/******/ 	// Load entry module and return exports
/******/ 	// This entry module can't be inlined because the eval devtool is used.
/******/ 	var __webpack_exports__ = __webpack_require__("./js/main.js");
/******/ 	
/******/ })()
;