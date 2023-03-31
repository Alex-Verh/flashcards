"use strict";

document.addEventListener("DOMContentLoaded", () => {
  initCardSetsLoadingAndSearch();

  document.querySelector("#sort").addEventListener("click", (event) => {
    const sortDropdown = event.currentTarget;
    sortDropdown.setAttribute("tabindex", 1);
    sortDropdown.focus();
    sortDropdown.classList.toggle("active");
    const sortingList = sortDropdown.lastElementChild;
    slideToggle(sortingList, 200);
  });

  document.querySelector("#sort").addEventListener("focusout", (event) => {
    event.currentTarget.classList.remove("active");
    const sortingList = event.currentTarget.lastElementChild;
    slideUp(sortingList, 200);
  });

  document.querySelector("#dash-list").addEventListener("click", (event) => {
    if (event.target.matches(".set .image-save")) {
      const cardSetElement = event.target.parentElement.parentElement;
      saveCardSet(cardSetElement);
    }
  });

  const saveCardSet = (cardSetElement) => {
    const cardSetId = cardSetElement.dataset.cardsetId;
    const saveCount = cardSetElement.querySelector(".saves-count");
    const saveButton = cardSetElement.querySelector(".image-save");
    sendSaveCardSetRequest(cardSetId)
      .then((response) => {
        if (saveCount) {
          saveCount.innerHTML = response.saves;
        }
        if (response.saved) {
          saveButton.src = "../../static/images/save1.png";
        } else {
          saveButton.src = "../../static/images/save2.png";
        }
      })
      .catch((e) => {
        alert(e.message);
        if (e instanceof SyntaxError) {
          document.querySelector("#loginRegisterModal").style.display = "block";
        }
      });
  };

  const loadCardSets = (requestBody, dashList, sentinel) => {
    fetch("/api/cardsets", {
      method: "POST",
      body: JSON.stringify(requestBody),
      headers: {
        "Content-type": "application/json",
      },
    })
      .then((response) => response.json())
      .then((data) => {
        sentinel.remove();
        if (!data.length) {
          return;
        }

        data.forEach((cardSet) => {
          dashList.insertAdjacentHTML("beforeend", getCardSetHTML(cardSet));
        });

        if (data.length >= 24) {
          dashList.appendChild(sentinel);
        }
      });
  };

  const getCardSetHTML = (cardSet) => {
    const cardSetHTML = `
      <div class="set" data-cardset-id="${cardSet.id}">
          <a href="${cardSet.url}">
              <div class="set-screen">${cardSet.title}</div>
          </a>
          <div class="set-modulate">
              <img src="../../static/images/user.png" alt="user" width="10%">
              <span class="saves-count">${cardSet.saves}</span>
              ${
                cardSet.own
                  ? ""
                  : `<img class="image-save" src="${cardSet.save_img_url}" alt="Save">`
              }
          </div>
      </div>
    `;
    return cardSetHTML;
  };

  function initCardSetsLoadingAndSearch() {
    const cardSetsRequest = {
      page: 0,
      searchQuery: "",
      sortBy: "",
      sortOrder: "",
      categoryId: 0,
      cardSetsOnPage: 24,
    };

    const dashListEl = document.querySelector("#dash-list");
    const sentinel = document.querySelector("#sentinel");
    const searchInput = document.querySelector("#searchInput");

    document.querySelector("#searchBox").addEventListener("submit", (event) => {
      event.preventDefault();
      dashListEl.replaceChildren(sentinel);
      cardSetsRequest.page = 0;
      cardSetsRequest.searchQuery = searchInput.value;
    });

    document.querySelector("#aside-list").addEventListener("click", (event) => {
      const category = event.target.closest(".category");
      if (category) {
        dashListEl.replaceChildren(sentinel);
        cardSetsRequest.page = 0;
        cardSetsRequest.categoryId = +category.dataset.id;
      }
    });

    document
      .querySelector("#dropdown-filter")
      .addEventListener("click", (event) => {
        if (event.target.matches("#dropdown-filter li")) {
          const [sortBy, sortOrder] = event.target.dataset.value.split(" ");
          console.log(sortBy, sortOrder);
          dashListEl.replaceChildren(sentinel);
          cardSetsRequest.page = 0;
          cardSetsRequest.sortBy = sortBy;
          cardSetsRequest.sortOrder = sortOrder;
        }
      });

    const intersectionObserver = new IntersectionObserver((entries) => {
      if (entries[0].intersectionRatio <= 0) return;
      cardSetsRequest.page += 1;
      loadCardSets(cardSetsRequest, dashListEl, sentinel);
    });
    intersectionObserver.observe(sentinel);
  }
});
