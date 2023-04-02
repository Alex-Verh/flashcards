"use strict";

document.addEventListener("DOMContentLoaded", () => {
  document.querySelector(".navMenu").addEventListener("click", (e) => {
    const navLink = e.target.closest("a");
    if (navLink && navLink.id !== "open-window") {
      document.querySelector("#active").checked = false;
    }
  });

  changeBackground()
  initCursorVisualEffect()
  initBackgroundChanging()
  loadCategories()
  initCardSetCreator()
  initUnauthorizedModalBox()

  function createCategoryElements(categoriesData, elementTag, parent, elementClass='') {
    for (const category of categoriesData) {
      const categoryEl = document.createElement(elementTag)
      categoryEl.className = elementClass
      categoryEl.dataset.id = category.id
      categoryEl.textContent = category.title
      parent.appendChild(categoryEl)
    }
  }

  function loadCategories() {
    fetch('/api/cardset-categories', {method: 'GET'})
      .then(response => response.json())
      .then((data) => {
        // CardSet Careation Categories
        const dropdownMenu = document.querySelector('#dropdown-menu')
        createCategoryElements(data, 'li', dropdownMenu)
        // Home Card Set Categories
        const homeCategoryList = document.querySelector("#aside-list")
        homeCategoryList && createCategoryElements(data, 'div', homeCategoryList, 'category')
      });
  }

  function initCardSetCreator() {
    const cardSetCreationDiv = document.querySelector('#around-creation');
    const dropdown = cardSetCreationDiv.querySelector('#dropdown');
    const dropdownMenu = dropdown.querySelector('#dropdown-menu')
    const categoryInput = dropdown.querySelector('input[name="category"]');
    const dropdownSpan = dropdown.querySelector('span');
    // Open creation modal box
    document.querySelector('#open-window').addEventListener('click', function(event) {
      event.preventDefault();
      cardSetCreationDiv.classList.add('transit')
    })
    // Close creation modal box
    cardSetCreationDiv.querySelector('#close-creation').addEventListener('click', function(event) {
      event.preventDefault();
      cardSetCreationDiv.classList.remove('transit')
    })
    // Submit creation form
    cardSetCreationDiv.querySelector("#window").addEventListener('submit', (event) => {
      event.preventDefault();
      const cardSetTitleEl = cardSetCreationDiv.querySelector("#window-name")
      let errors = 0;

      if (!cardSetTitleEl.value) {
        cardSetTitleEl.style.borderBottom = '0.3vh dashed #8a0000';
        errors += 1
      } else {
        cardSetTitleEl.style = ''
      }

      if (!categoryInput.value) {
        dropdown.style.boxShadow = '0 0 0.7vh #8a0000';
        errors += 1
      } else {
        dropdown.style = ''
      }

      const isOnlyEnglishRegEx = /^[a-z0-9!" #\$%&'\(\)\*\+,-\./:;<=>\?@\[\\\]\^_`\{\|\}~]*$/i
      if (cardSetCreationDiv.querySelector('#option-1').checked
          && !isOnlyEnglishRegEx.test(cardSetTitleEl.value)) {
            cardSetTitleEl.style.borderBottom = '0.3vh dashed #8a0000';
            errors += 1
          }
      
      if (!errors) {
        event.currentTarget.submit()
      }
    })
    // Categories dropdown menu
    dropdownMenu.addEventListener('click', function(event) {
      const category = event.target.closest('li');
      if (category) {
        categoryInput.value = category.dataset.id
        dropdownSpan.textContent = category.textContent.trim();
      }
    })
    // Dropdown menu animation
    dropdown.addEventListener('click', (event) => {
      dropdown.setAttribute('tabindex', 1)
      dropdown.focus()
      dropdown.classList.toggle('active')
      slideToggle(dropdownMenu, 10)
    })
    dropdown.addEventListener('focusout', (event) => {
      dropdown.classList.remove('active')
      window.getComputedStyle(dropdownMenu).display !== 'none' && slideUp(dropdownMenu, 10);
    })

  }

  function initUnauthorizedModalBox() {
    const modal = document.querySelector("#loginRegisterModal");
    try {
      document.querySelector(".close-modal").onclick = function () {
        modal.style.display = "none";
      };
    } catch (e) {
      console.log(e);
    }
    window.onclick = function (event) {
      if (event.target === modal) {
        modal.style.display = "none";
      }
    };
  }

  function initCursorVisualEffect() {
    const blob = document.querySelector("#blob");
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
  }

  function changeBackground() {
    const backgroundUrl = localStorage.getItem('backgroundUrl') || "url(/static/images/background_default.jpg)"
    document.body.style.backgroundImage = backgroundUrl;
  }

  function initBackgroundChanging() {
    document.querySelector(".images").addEventListener("click", (event) => {
      const backgroundImage = event.target.closest(".image .background");
      if (backgroundImage) {
        console.log("background");
        localStorage.setItem("backgroundUrl", `url(${backgroundImage.src})`);
        changeBackground();
      }
    });
  }
});
