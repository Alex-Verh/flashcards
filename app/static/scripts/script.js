// Work with cookie
function setCookie(name, value, exdays=30) {
    const date = new Date();
    date.setTime(date.getTime() + (exdays*24*60*60*1000));
    let expires = "expires="+ date.toUTCString();
    document.cookie = name + "=" + value + ";" + expires + ";path=/";
  }

function getCookie(name) {
    name += "=";
    let decodedCookie = decodeURIComponent(document.cookie);
    let decCookie = decodedCookie.split(';');
    for(let i = 0; i < decCookie.length; i++) {
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


document.querySelector('body').style.backgroundImage = getCookie('background_url')

// JavaScript for cursor visual effect
const blob = document.getElementById("blob");

document.body.onpointermove = event => {
    const {clientX , clientY } = event;

    blob.animate ({
        left : `${clientX}px`,
        top :`${clientY}px`
    }, { duration : 3000, fill: "forwards" });
}


function deleteCardSet(cardSetId) {
    const text = "Are you sure you want to delete this set?";
    if (confirm(text) == true) {
        const cardSetEl = document.getElementById(`cardset-${cardSetId}`);
        fetch(`/cardset/delete/${cardSetId}`, { method: "POST" })
        .then(cardSetEl.remove())
        .catch((e) => alert('Card set does not exist or it is not your own or saved card set'));
      }
}

function saveCardSet(cardSetId) {
    const saveCount = document.getElementById(`saves-count-${cardSetId}`);
    const saveButton = document.getElementById(`save-cardset-${cardSetId}`);

    fetch(`/cardset/save/${cardSetId}`, { method: "POST" })
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

/*Dropdown Menu*/
$('.dropdown').click(function () {
  $(this).attr('tabindex', 1).focus();
  $(this).toggleClass('active');
  $(this).find('.dropdown-menu').slideToggle(300);
});
$('.dropdown').focusout(function () {
  $(this).removeClass('active');
  $(this).find('.dropdown-menu').slideUp(300);
});
$('.dropdown .dropdown-menu li').click(function () {
  $(this).parents('.dropdown').find('span').text($(this).text());
  $(this).parents('.dropdown').find('input').attr('value', $(this).attr('id'));
});
/*End Dropdown Menu*/

//  Category of new set 
  const dropdown = document.querySelector('.dropdown');
  const input = dropdown.querySelector('input[name="category"]');
  const select = dropdown.querySelector('.select');
  const dropdownMenu = dropdown.querySelector('.dropdown-menu');
  const options = dropdownMenu.querySelectorAll('li');
  
  // Add click event listeners to each option
  options.forEach(option => {
      option.addEventListener('click', () => {
        const categoryId = option.dataset.categoryId;
          // Update the input value with the selected option's text content
          input.value = categoryId;
          
          // Update the select element's text to display the selected option
          select.querySelector('span').textContent = option.textContent.trim();
      });
  });
// end category

//background setter
const backgroundImage = document.querySelector('body');
const images = document.querySelectorAll('.background');
images.forEach(image => {
  image.addEventListener('click', () => {
    //TODO save in cookies
    backgroundImage.style.backgroundImage = `${image.src}`;
    setCookie('background_url', `${image.src}`)
  });
});
//end background
