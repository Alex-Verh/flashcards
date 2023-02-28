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

//Scroll sensitivy slowdown
function wheel(event) {
  var delta = 0;
  if (event.wheelDelta) {(delta = event.wheelDelta / 120);}
  else if (event.detail) {(delta = -event.detail / 3);}

  handle(delta);
  if (event.preventDefault) {(event.preventDefault());}
  event.returnValue = false;
}

function handle(delta) {
  var time = 1000;
  var distance = 300;

  $('html, body').stop().animate({
      scrollTop: $(window).scrollTop() - (distance * delta)
  }, time );
}

if (window.addEventListener) {window.addEventListener('DOMMouseScroll', wheel, false);}
window.onmousewheel = document.onmousewheel = wheel;
//end scroll

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
