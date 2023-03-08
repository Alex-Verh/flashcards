"use strict"

// GLOBAL CONSTANTS AND VARIABLESownMe

// Cursor visual effect
const blob = document.getElementById("blob");

// New card set creation
const cardSetCreationDiv = document.querySelector('#around-creation');
const dropdown = cardSetCreationDiv.querySelector('#dropdown');
const dropdownMenu = dropdown.querySelector('#dropdown-menu')
const categoryInput = dropdown.querySelector('input[name="category"]');
const dropdownSpan = dropdown.querySelector('span');


// HOME PAGE CONSTANTS AND VARIABLES

// Cardsets loading
let page = 0;
const cardSetsOnPage = 24;
const dashListEl = document.getElementById('dash-list');
const sentinel = document.getElementById('sentinel');

// Search
const searchBox = document.getElementById('searchBox');
const searchButton = document.getElementById('searchButton');
const searchInput = document.getElementById('searchInput');
let searchQuery = '';
let sortBy = '';
let sortOrder = '';
let categoryId = '0';


// FUNCTIONS

// Cookie
function setCookie(name, value, exdays = 30) {
  const date = new Date();
  date.setTime(date.getTime() + (exdays * 24 * 60 * 60 * 1000));
  let expires = "expires=" + date.toUTCString();
  document.cookie = name + "=" + value + ";" + expires + ";path=/";
}

function getCookie(name) {
  name += "=";
  let decodedCookie = decodeURIComponent(document.cookie);
  let decCookie = decodedCookie.split(';');
  for (let i = 0; i < decCookie.length; i++) {
    let cookie = decCookie[i];
    while (cookie.charAt(0) == ' ') {
      cookie = cookie.substring(1);
    }
    if (cookie.indexOf(name) == 0) {
      return cookie.substring(name.length, cookie.length);
    }
  }
  return "";
}


// Cursor visual effect
document.body.onpointermove = event => {
  const { clientX, clientY } = event;
  blob.animate({
    left: `${clientX}px`,
    top: `${clientY}px`
  }, { duration: 3000, fill: "forwards" });
}


// Background
function changeBackground(backgroundUrl) {
  document.body.style.backgroundImage = backgroundUrl;
}

document.addEventListener("DOMContentLoaded", function(event) { 
  changeBackground(getCookie('background_url'));
});

document.querySelector('.images').addEventListener('click', function(event) {
  const backgroundImage = event.target.closest('.image .background');
  if (backgroundImage) {
    changeBackground(`url(${backgroundImage.src})`)
    setCookie('background_url', `url(${backgroundImage.src})`)
  }
});


// Search & sorting
try {
  document.querySelector('#searchBox').addEventListener('submit', function (event) {
  event.preventDefault();
  dashListEl.replaceChildren(sentinel)
  page = 0
  searchQuery = searchInput.value
})
}
catch (e) {console.log(e)}

try {
  document.querySelector('#aside-list').addEventListener('click', function(event) {
    const category = event.target.closest('.category')
    if (category) {
      dashListEl.replaceChildren(sentinel)
      page = 0
      categoryId = category.dataset.id
    }
  })
}
catch (e) {console.log(e)}


// Card set dynamic loading
function loadCardSets() {

  const postData = new FormData();
  postData.append('page', page);
  postData.append('cardsets_quantity', cardSetsOnPage);
  postData.append('search_q', searchQuery);
  postData.append('sort_by', sortBy);
  postData.append('ort_order', sortOrder);
  postData.append('category', categoryId)

  fetch('/api/cardsets', {
    method: 'POST',
    body: postData
  })
    .then(response => response.json())
    .then(data => {
      sentinel.remove();

      if (!data.length) {return}

      for (var i = 0; i < data.length; i++) {
        const cardSetEl = document.createElement('div');
        cardSetEl.classList.add('set');
        cardSetEl.innerHTML = 
        //!TODO fix a link href
          ` <a href="${data[i].url}">
            <div class = "set-screen">${data[i].title}</div>
            </a>
            <div class = "set-modulate">
                <span id="saves-count-${data[i].id}">${data[i].saves}</span>
                <img id="save-cardset-${data[i].id}" onclick="saveCardSet(${data[i].id})" class = "image-save" src="${data[i].save_img_url}" alt="Save">
            </div>`;
        dashListEl.appendChild(cardSetEl);
      }
      if (data.length >= 24) {dashListEl.appendChild(sentinel);}
    })
}

const intersectionObserver = new IntersectionObserver(entries => {
  if (entries[0].intersectionRatio <= 0) {
    return;
  }
  page += 1;
  loadCardSets();
})
try {intersectionObserver.observe(sentinel)}
catch (e) {console.log(e)}


// Card Set
function deleteCardSet(cardSetId) {
  const text = "Are you sure you want to delete this set?";
  if (confirm(text) == true) {
    const cardSetEl = document.getElementById(`cardset-${cardSetId}`);
    fetch(`/api/delete-cardset/${cardSetId}`, { method: "GET" })
      .then(cardSetEl.remove())
      .catch((e) => alert('Card set does not exist or it is not your own or saved card set'));
  }
}

function saveCardSet(cardSetId) {
  const saveCount = document.getElementById(`saves-count-${cardSetId}`);
  const saveButton = document.getElementById(`save-cardset-${cardSetId}`);

  fetch(`/api/save-cardset/${cardSetId}`, { method: "POST" })
    .then((res) => res.json())
    .then((data) => {
      saveCount.innerHTML = data["saves"];
      if (data["saved"] === true) {
        saveButton.src = data["image_url"];
      } else {
        saveButton.src = data["image_url"];
      }
    })
    .catch((e) => alert("Could not save cardset."));
}


// New card set creation
dropdownMenu.addEventListener('click', function(event) {
  const category = event.target.closest('li');
  if (category) {
    categoryInput.value = category.dataset.id
    dropdownSpan.textContent = category.textContent.trim();
  }
})

document.querySelector('#open-window').addEventListener('click', function(event) {
  event.preventDefault();
  cardSetCreationDiv.classList.add('transit')
})

document.querySelector('#close-creation').addEventListener('click', function(event) {
  event.preventDefault();
  cardSetCreationDiv.classList.remove('transit')
})

$(dropdown).click(function () {
  $(this).attr('tabindex', 1).focus();
  $(this).toggleClass('active');
  $(this).find(dropdownMenu).slideToggle(300);
});

$(dropdown).focusout(function () {
  $(this).removeClass('active');dropdownMenu
  $(this).find(dropdownMenu).slideUp(300);
});

$('#dropdown #dropdown-menu li').click(function () {
  $(this).parents('#dropdown').find('span').text($(this).text());
  $(this).parents('#dropdown').find('input').attr('value', $(this).attr('id'));
});


// Flash Card constructor
const formImage = document.getElementById('formImage')
const imagePreview = document.getElementById('imagePreview')

try {
  formImage.addEventListener('change', () => {
    uploadFile(formImage.files[0]);
  })
}
catch (e) {console.log(e)}

function uploadFile(file) {
  if (!['image/jpeg', 'image/png', 'image/jpg'].includes(file.type)) {
    alert('Only images are allowed!');
    formImage.value = '';
    return;
  }

  const reader = new FileReader();
  reader.onload = function (e) {
    imagePreview.innerHTML = `<img src="${e.target.result}" alt="Image">`
  };

  reader.onerror = function (e) {
    alert('Error')
  };
  reader.readAsDataURL(file);
}