/*
 * ATTENTION: The "eval" devtool has been used (maybe by default in mode: "development").
 * This devtool is neither made for production nor for readable output files.
 * It uses "eval()" calls to create a separate source file in the browser devtools.
 * If you are trying to read the output file, select a different devtool (https://webpack.js.org/configuration/devtool/)
 * or disable the default devtool with "devtool: false".
 * If you are looking for production-ready output files, see mode: "production" (https://webpack.js.org/configuration/mode/).
 */
(self["webpackChunk"] = self["webpackChunk"] || []).push([["js_modules_modals_js"],{

/***/ "./js/modules/modals.js":
/*!******************************!*\
  !*** ./js/modules/modals.js ***!
  \******************************/
/***/ (function() {

eval("const openModalLinks = document.querySelectorAll(\"[data-modal-class]\");\r\nconst closeModalBtns = document.querySelectorAll(\".modal__close, .menu__close\");\r\n\r\nopenModalLinks.forEach((link) => {\r\n    const modalClass = link.dataset.modalClass;\r\n    const modal = document.querySelector(`.${modalClass}`);\r\n\r\n    link.addEventListener(\"click\", () => {\r\n      modal.classList.remove(\"none\");\r\n      modal.parentElement.classList.remove(\"none\");\r\n      link.parentElement?.parentElement?.blur();\r\n      document.body.style.overflow = \"hidden\";\r\n    })\r\n})\r\n\r\ncloseModalBtns.forEach((closeBtn) => {\r\n  closeBtn.addEventListener(\"click\", () => {\r\n    const overlay = closeBtn.parentElement.parentElement;\r\n    if (overlay.matches(\".overlay\")) {\r\n      overlay.classList.add(\"none\");\r\n    } else {\r\n      closeBtn.parentElement.classList.add(\"none\");\r\n    }\r\n    document.body.style.overflow = \"auto\";\r\n  })\r\n})\r\n\r\n\r\nconst profileModal = document.querySelector(\".profile-modal\")\r\nconst profileButton = document.querySelector(\".nav__profile\");\r\n\r\nif (profileButton) {\r\n  profileButton.addEventListener(\"click\", () => {\r\n    profileButton.parentElement.focus();\r\n  });\r\n}\n\n//# sourceURL=webpack:///./js/modules/modals.js?");

/***/ })

}]);