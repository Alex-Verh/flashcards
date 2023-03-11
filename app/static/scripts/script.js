"use strict"

document.addEventListener('DOMContentLoaded', (e) => {
  ///////////////////////////////////////////////////////////////////
  // ########################## GENERAL #############################
  ///////////////////////////////////////////////////////////////////

  // ############## SKIPING MENU OPENING ON RETURN ##################
  window.onload = function() {
    document.querySelector('#active').checked = false;
  }

  // #################### CURSOR VISUAL EFFECT #######################
  const blob = document.getElementById("blob");
  document.body.onpointermove = event => {
    const { clientX, clientY } = event;
    blob.animate({
      left: `${clientX}px`,
      top: `${clientY}px`
    }, { duration: 3000, fill: "forwards" });
  }

  // ######################### BACKGROUND ###########################
  const setCookie = (name, value, exdays = 30) => {
    const date = new Date();
    date.setTime(date.getTime() + (exdays * 24 * 60 * 60 * 1000));
    let expires = "expires=" + date.toUTCString();
    document.cookie = name + "=" + value + ";" + expires + ";path=/";
  }
  const parseCookie = () => {
    const decodedCookies = decodeURIComponent(document.cookie).split('; ');
    const cookiesObject = {}
    decodedCookies.forEach((cookie) => {
      const [cookieName, cookieValue] = cookie.split('=')
      cookiesObject[cookieName] = cookieValue
    });
    return cookiesObject
  }
  const changeBackground = () => {
    const backgroundUrl = parseCookie().backgroundUrl || "url(/static/images/background_default.jpg)"
    document.body.style.backgroundImage = backgroundUrl;
  }
  document.querySelector('.images').addEventListener('click', (event) => {
    const backgroundImage = event.target.closest('.image .background');
    if (backgroundImage) {
      setCookie('backgroundUrl', `url(${backgroundImage.src})`)
      changeBackground()
    }
  });
  changeBackground()

  // #################### LOGIN / REGISTER MODAL BOX ####################
  const modal = document.getElementById("loginRegisterModal");
  try {
    document.querySelector('.close-modal').onclick = function() {
    modal.style.display = "none";
    }
  } catch (e) {console.log(e)}
  window.onclick = function(event) {
    if (event.target === modal) {
      modal.style.display = "none";
    }
  }

  // ##################### CARD SET CATEGORIES LOADING ########################
  const createCategoryElements = (categoriesData, elementTag, parent, elementClass='') => {
    for (const category of categoriesData) {
      const categoryEl = document.createElement(elementTag)
      categoryEl.className = elementClass
      categoryEl.dataset.id = category.id
      categoryEl.textContent = category.title
      parent.appendChild(categoryEl)
    }
  }
  fetch('/api/cardset-categories', {method: 'GET'})
    .then(response => response.json())
    .then((data) => {
      // CardSet Careation Categories
      createCategoryElements(data, 'li', dropdownMenu)
      // Home Card Set Categories
      const homeCategoryList = document.querySelector("#aside-list")
      homeCategoryList && createCategoryElements(data, 'div', homeCategoryList, 'category')
    });

  // ######################## NEW CARD SET CREATION ########################
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
  $(dropdown).click(function () {
    $(this).attr('tabindex', 1).focus();
    $(this).toggleClass('active');
    $(this).find(dropdownMenu).slideToggle(300);
  });
  $(dropdown).focusout(function () {
    $(this).removeClass('active');dropdownMenu
    $(this).find(dropdownMenu).slideUp(300);
  });
  

  /////////////////////////////////////////////////////////////////////////////
  // ############################## HOME PAGE ################################
  /////////////////////////////////////////////////////////////////////////////
  if (window.location.href.endsWith('home')) {

    // ################### CARD SETS DYNAMIC LOADING AND SEARCH ################
    let page = 0;
    let searchQuery = '';
    let sortBy = '';
    let sortOrder = '';
    let categoryId = '0';
    const cardSetsOnPage = 24;
    const dashListEl = document.getElementById('dash-list');
    const sentinel = document.getElementById('sentinel');

    // Search & sorting
    const searchInput = document.getElementById('searchInput');
    document.querySelector('#searchBox').addEventListener('submit', function (event) {
      event.preventDefault();
      dashListEl.replaceChildren(sentinel)
      page = 0
      searchQuery = searchInput.value
    })
    document.querySelector('#aside-list').addEventListener('click', function(event) {
      const category = event.target.closest('.category')
      if (category) {
        dashListEl.replaceChildren(sentinel)
        page = 0
        categoryId = category.dataset.id
      }
    })
    // Card set dynamic loading
    function loadCardSets() {

      const formData = new FormData();
      formData.append('page', page);
      formData.append('cardsets_quantity', cardSetsOnPage);
      formData.append('search_q', searchQuery);
      formData.append('sort_by', sortBy);
      formData.append('ort_order', sortOrder);
      formData.append('category', categoryId)

      fetch('/api/cardsets', {method: 'POST', body: formData})
        .then(response => response.json())
        .then(data => {
          sentinel.remove();
          if (!data.length) {return}

          for (const cardset of data) {
            const cardSetEl = document.createElement('div');
            cardSetEl.classList.add('set');
            cardSetEl.innerHTML = 
              ` <a href="${cardset.url}">
                <div class = "set-screen">${cardset.title}</div>
                </a>
                <div class = "set-modulate">
                    <img src="../../static/images/user.png" alt="user" width="15px">
                    <span id="saves-count-${cardset.id}">${cardset.saves}</span>
                    <img id="save-cardset-${cardset.id}" onclick="saveCardSet(${cardset.id})" class = "image-save" src="${cardset.save_img_url}" alt="Save">
                </div>`;
            dashListEl.appendChild(cardSetEl);
          }
          if (data.length >= 24) {dashListEl.appendChild(sentinel);}
        })
    }
    const intersectionObserver = new IntersectionObserver(entries => {
      if (entries[0].intersectionRatio <= 0) {return}
      page += 1;
      loadCardSets();
    })
    intersectionObserver.observe(sentinel)
  }

  /////////////////////////////////////////////////////////////////////////////
  // ############################ CARD SET PAGE ###############################
  /////////////////////////////////////////////////////////////////////////////
  if (window.location.href.split('/')[3] === 'cardset') {

    // ####################### FLASH CARD CONSTRUCTOR #########################
    const addImageToCardSide = (imageUrl, cardSide) => {
      const imagePreview = cardSide.querySelector('.image-preview')
      const textArea = cardSide.querySelector('.textarea')
      const imagesQty = imagePreview.children.length
      // Guards
      if (textArea.innerHTML.trim() && imagesQty > 1) {
        alert("You cannot add more picture while having a text.");
        return;
      } else if (imagesQty > 3) {
        alert("You can not upload more photos.");
        return;
      }
      textArea.classList.replace('only-text', 'not-only-text')
      // Create image element
      let imageClass = 'constructor-image-multiple'
      const imageEl = document.createElement('img')
      imageEl.src = imageUrl
      imageEl.alt = "Image"
      imageEl.className = 'constructor-image'

      // imageEl.className = 'constructor-image '+ imageClass
      switch (imagesQty) {
        case 0:
          imageClass = 'constructor-image-single'
          break;
        case 2:
          textArea.style.display = 'none'
        default:
          imagePreview.querySelectorAll(".constructor-image-single").forEach(el => {
            el.classList.replace('constructor-image-single', 'constructor-image-multiple')})
      }
      imageEl.classList.add(imageClass)
      imagePreview.appendChild(imageEl)
    }

    const removeImageFromCardSide = (imageEl, cardSide) => {
      const imagePreview = cardSide.querySelector('.image-preview')
      const textArea = cardSide.querySelector('.textarea')
      const imagesQty = imagePreview.children.length
      switch (imagesQty) {
        case 1:
          textArea.classList.replace('not-only-text', 'only-text')
          break;
        case 2:
          imagePreview.querySelectorAll(".constructor-image-multiple").forEach(el => {
            el.classList.replace('constructor-image-multiple', 'constructor-image-single')})
        case 3:
          textArea.style = ''
      imagePreview.remove.removeChild(imageEl)
      }
    }
    
    const flashCardCreationBox = document.querySelector('#constructor')
    const flashcardSides = flashCardCreationBox.querySelectorAll('.flashcard-part')
    const uploadSound = flashCardCreationBox.querySelector("#uploadSound");
    const uploadImage = flashCardCreationBox.querySelector("#uploadImage");

    const unselectSide = (flashCardSideEl) => {
      flashCardSideEl.classList.remove("selected")
      flashCardSideEl.querySelector('.textarea').setAttribute('contenteditable', 'false')
    }
    // Constructor Selected Side
    flashCardCreationBox.querySelector('form').addEventListener('click', (e) => {
      const flashCardSide = e.target.closest('.flashcard-part')
      if (flashCardSide) {
        // Unlock text area
        const textArea = e.target.closest('.textarea')
        if (textArea 
            && flashCardSide.classList.contains('selected')
            && (flashCardSide.querySelectorAll(".constructor-image").length <= 2)) {

          textArea.setAttribute('contenteditable', 'true')
          textArea.focus()
        }
        // Change flashcard side status
        const selectedEl = document.querySelector(".selected");
        if (selectedEl && (flashCardSide !== selectedEl)) {
          unselectSide(selectedEl)
        }
        flashCardSide.classList.add("selected");
        return;
      
      // Unselect the side if user clicks arround the flashcard
      } else if (e.target.closest('#constructor-bottom') === null) {
        flashcardSides.forEach(side => {unselectSide(side)})
      }
    })

    // Constructor audio
    uploadSound.addEventListener('change', () => {
      uploadSoundFunction(uploadSound.files[0]);
    })
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
    uploadImage.addEventListener('change', () => {
      uploadImageFunction(uploadImage.files[0]);
    })

    function uploadImageFunction(file) {
      if (!['image/jpeg', 'image/png', 'image/svg+xml'].includes(file.type)) {
        alert('Choose another format. (JPEG, PNG, SVG)');
        uploadImage.value = '';
        return;
      }
      const readerImage = new FileReader();
      readerImage.onload = (event) => {
        console.log('add image')
        const selectedSide = flashCardCreationBox.querySelector(".selected");
        // Check for flashcard side selected
        if (selectedSide) {
          addImageToCardSide(event.target.result, selectedSide)
        } else {alert("Select a part to upload your image on.")}
      }
        
      readerImage.onerror = function (e) {
        alert('Error');
      };
      readerImage.readAsDataURL(file);
    }

    function decideImageState(e) {
      let selectedEl = flashCardCreationBox.querySelector(".selected");
      if (!selectedEl) {
        alert("Select a part to upload your image on.");
        return;
      }
    
      const imagePreview = selectedEl.querySelector('.image-preview'); 
      const constructorImages = imagePreview.getElementsByClassName("constructor-image");
      if (constructorImages.length >= 4) {
        alert("You can not upload more photos.");
        return;
      }
      if (canAddSingleImage(selectedEl)) {
        if (!canAddMoreImages(selectedEl)) {
          alert("You cannot add more picture while having a textarea.");
          return;
        }
        imagePreview.innerHTML += `<img src="${e.target.result}" alt="Image" class="constructor-image constructor-image-multiple">`;
        if (selectedEl.querySelector(".constructor-image-single")) {
          imageStateChanger(selectedEl);
        } 
        if (selectedEl.querySelector(".only-text")) {
          textStateChanger(selectedEl);
        }
      } else {
        imagePreview.innerHTML += `<img src="${e.target.result}" alt="Image" class="constructor-image constructor-image-single">`;
      }
    }    

    function canAddSingleImage(element) {
      return !element.querySelector(".inactive") || element.querySelector(".constructor-image");
    }

    function canAddMoreImages(element) {
      return !element.querySelector(".inactive") && element.getElementsByClassName("constructor-image").length < 2;
    }

    // Constructor creation
    document.querySelector('#create-flashcard').addEventListener('click', (e) => {
      e.preventDefault();
      flashCardCreationBox.classList.add('transit');
    })
    flashCardCreationBox.querySelector('#close-addition').addEventListener('click', (e) => {
      e.preventDefault();
      flashCardCreationBox.classList.remove('transit');
    })
  }
})

// ######################## CARD SET MANIPULATION #######################
const deleteCardSet = (cardSetId, isOwn) => {
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
const saveCardSet = (cardSetId) => {
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
        document.getElementById("loginRegisterModal").style.display = "block";
      };
      console.log(e)
    })
}

