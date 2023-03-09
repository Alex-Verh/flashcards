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

// Constructor
const selected_flashcard_parts = document.getElementsByClassName('flashcard-part')
const uploadSound = document.getElementById("uploadSound");
const uploadImage = document.getElementById("uploadImage");
const imagePreview = document.getElementById('imagePreview')

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


const modal = document.getElementById("loginRegisterModal");

// FUNCTIONS

//Constructor Selection && Text
try {
  for (let i = 0; i < 2; i++) {
      selected_flashcard_parts[i].addEventListener("click", function(){
      let selectedEl = document.querySelector(".selected");
      if(selectedEl){
        selectedEl.classList.remove("selected");
      }
      this.classList.add("selected");
      }, false);

      
      selected_flashcard_parts[i].addEventListener("dblclick", (e) => {
        let inactive_text = e.currentTarget.querySelector(".inactive");
        if (inactive_text) {
          inactive_text.classList.remove("inactive");
        }
    });
  }
} catch (e) {
  console.log(e);
}

// Constructor audio
try {
  uploadSound.addEventListener('change', () => {
    uploadSoundFunction(uploadSound.files[0]);
  })
}
catch (e) {console.log(e)}

function uploadSoundFunction(file) {
  if (!['audio/mpeg', 'audio/wav', 'audio/ogg'].includes(file.type)) {
    alert('Choose another format. (MP3, WAV, OGG)');
    uploadSound.value = '';
    return;
  }

  const reader_sound = new FileReader();

  reader_sound.addEventListener('load', () => {
    const audio = new Audio(reader_sound.result);

    const playSound = document.createElement('button');
    playSound.textContent = 'Play';

    playSound.addEventListener('click', () => {
      audio.play();
    });

    parentDiv.appendChild(playSound);
});

  reader_sound.readAsDataURL(file);
}

// Constructor image
try {
  uploadImage.addEventListener('change', () => {
    uploadImageFunction(uploadImage.files[0]);
  })
}
catch (e) {console.log(e)}

function uploadImageFunction(file) {
  if (!['image/jpeg', 'image/png', 'image/svg+xml'].includes(file.type)) {
    alert('Choose another format. (JPEG, PNG, SVG)');
    uploadImage.value = '';
    return;
  }

  const readerImage = new FileReader();
  readerImage.onload = function (e) {
    imagePreview.innerHTML = `<img src="${e.target.result}" alt="Image">`
  };

  readerImage.onerror = function (e) {
    alert('Error')
  };
  readerImage.readAsDataURL(file);
}


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
  const backgroundUrl = getCookie('background_url') || "url(../images/background_default.jpg)"
  changeBackground(backgroundUrl)

  const createCategoryElements = (categoriesData, elementTag, parent, elementClass='') => {
    for (const category of categoriesData) {
      const categoryEl = document.createElement(elementTag)
      categoryEl.className = elementClass
      categoryEl.dataset.id = category.id
      categoryEl.textContent = category.title
      parent.appendChild(categoryEl)
    }
  }
  
  getCardSetCategories().then((data) => {
    createCategoryElements(data, 'li', dropdownMenu)
    const homeCategoryList = document.querySelector("#aside-list")
    homeCategoryList && createCategoryElements(data, 'div', homeCategoryList, 'category')
  });
});

window.onload = function() {
  document.querySelector('#active').checked = false;
}

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
          ` <a href="${data[i].url}">
            <div class = "set-screen">${data[i].title}</div>
            </a>
            <div class = "set-modulate">
                <img src="../../static/images/user.png" alt="user" width="15px">
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
function deleteCardSet(cardSetId, isOwn) {
  if (isOwn) {
    if (confirm("Are you sure you want to delete this set?") !== true) {return;}
  }
  const cardSetEl = document.getElementById(`cardset-${cardSetId}`);
  fetch(`/api/delete-cardset/${cardSetId}`, { method: "GET"})
    .then(() => {
      if (!isOwn) {
        document.getElementById("deleteFromSaved").src = '../../static/images/save2.png'
        console.log('dd')
      }
      setTimeout(() => {cardSetEl.remove()}, 100)
      
    })
    .catch((e) => {alert(e); console.log(e)});

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
    .catch((e) => {
      if (e instanceof SyntaxError) {
        modal.style.display = "block";
      };
      console.log(e)
    })
}


// New card set creation

try {
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

  cardSetCreationDiv.querySelector("#window").addEventListener('submit', (event) => {
    event.preventDefault();
    const cardSetTitleEl = cardSetCreationDiv.querySelector("#window-name")
    const cardSetTitle = cardSetTitleEl.value
    const cardSetCategory = categoryInput.value
    const cardSetPrivacy = cardSetCreationDiv.querySelector('input[name="is_public"]:checked').value
    console.log(cardSetTitle, cardSetCategory, cardSetPrivacy)
    if (!cardSetTitle) {
      cardSetTitleEl.style.borderBottom = '0.3vh dashed #8a0000';
      return;
    }
    if (!cardSetCategory) {
      dropdown.style.boxShadow = '0 0 0.7vh #8a0000';
      return;
    }
    
    cardSetTitleEl.style = ''
    dropdown.style = ''
    event.currentTarget.submit()
  })

} catch (e) {console.log(e)}

$('#dropdown #dropdown-menu li').click(function () {
  $(this).parents('#dropdown').find('span').text($(this).text());
  $(this).parents('#dropdown').find('input').attr('value', $(this).attr('id'));
});


$(dropdown).click(function () {
  $(this).attr('tabindex', 1).focus();
  $(this).toggleClass('active');
  $(this).find(dropdownMenu).slideToggle(300);
});

$(dropdown).focusout(function () {
  $(this).removeClass('active');dropdownMenu
  $(this).find(dropdownMenu).slideUp(300);
});


// Flash Card constructor

// New flashcard creation
$('#create-flashcard').click(function (e) {
  e.preventDefault();
  console.log('open')
  $('#constructor').addClass('transit');
  });
$('#close-addition').click(function (e) {
e.preventDefault();
$('#constructor').removeClass('transit');
});

// Login/Register Modal Box

// When the user clicks on <span> (x), close the modal
try {
  document.querySelector('.close-modal').onclick = function() {
  modal.style.display = "none";
  }
} catch (e) {console.log(e)}

// When the user clicks anywhere outside of the modal, close it
window.onclick = function(event) {
  if (event.target == modal) {
    modal.style.display = "none";
  }
}

// Card Set Categories Loading
const getCardSetCategories = async () => {
  const response = await fetch('/api/cardset-categories', {method: 'GET'})
  return response.json()
}
