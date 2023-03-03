// GLOBAL CONSTANTS AND VARIABLES

// Background
const background = document.querySelector('body');
const images = document.querySelectorAll('.background');

// Cursor visual effect
const blob = document.getElementById("blob");

// Cardsets loading
var page = 0
const cardSetsOnPage = 24
const dashListEl = document.getElementById('dash-list')
const sentinel = document.getElementById('sentinel')

// Search
const searchBox = document.getElementById('searchBox')
const searchButton = document.getElementById('searchButton')
const searchInput = document.getElementById('searchInput')
var searchQuery = ''
var sortBy = ''
var sortOrder = ''

// New card set creation
const dropdown = document.querySelector('.dropdown');
const input = dropdown.querySelector('input[name="category"]');
const select = dropdown.querySelector('.select');
const dropdownMenu = dropdown.querySelector('.dropdown-menu');
const options = dropdownMenu.querySelectorAll('li');


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


// Background
background.onload = function() {background.style.backgroundImage = getCookie('background_url')};

images.forEach(image => {
  image.addEventListener('click', () => {
    background.style.backgroundImage = `url(${image.src})`;
    setCookie('background_url', `url(${image.src})`)
  });
});


// Cursor visual effect
document.body.onpointermove = event => {
  const { clientX, clientY } = event;

  blob.animate({
    left: `${clientX}px`,
    top: `${clientY}px`
  }, { duration: 3000, fill: "forwards" });
}

// Search
function searchCardSets(event) {
  event.preventDefault();
  dashListEl.innerHTML = ''
  dashListEl.appendChild(sentinel)
  page = 1
  searchQuery = searchInput.value
  loadCardSets()
}
searchBox.addEventListener('submit', searchCardSets);


// Card set dynamic loading
function loadCardSets() {

  const postData = new FormData();
  postData.append('page', page);
  postData.append('cardsets_quantity', cardSetsOnPage);
  postData.append('search_q', searchQuery);
  postData.append('sort_by', sortBy);
  postData.append('ort_order', sortOrder);

  fetch('/api/cardsets', {
    method: 'POST',
    body: postData
  })
    .then(response => response.json())
    .then(data => {
      if (!data.length) {
        sentinel.innerHTML = ''
      }
      dashListEl.removeChild(sentinel)
      for (var i = 0; i < data.length; i++) {
        const cardSetEl = document.createElement('div')
        cardSetEl.classList.add('set')
        cardSetEl.innerHTML = 
           `<div class = "set-screen">${data[i].title}</div>
            <div class = "set-modulate">
                <span id="saves-count-${data[i].id}">${data[i].saves}</span>
                <img id="save-cardset-${data[i].id}" onclick="saveCardSet(${data[i].id})" class = "image-save" src="${data[i].save_img_url}" alt="Save">
            </div>`
        dashListEl.appendChild(cardSetEl)
      }
      dashListEl.appendChild(sentinel)
    })
}

var intersectionObserver = new IntersectionObserver(entries => {
  if (entries[0].intersectionRatio <= 0) {
    return;
  }
  page += 1

  loadCardSets()
})
intersectionObserver.observe(sentinel)


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

options.forEach(option => {
  option.addEventListener('click', () => {
    const categoryId = option.id;
    console.log(categoryId)
    input.value = categoryId;
    select.querySelector('span').textContent = option.textContent.trim();
  });
});
