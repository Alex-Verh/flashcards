// JavaScript for cursor visual effect
const blob = document.getElementById("blob");

document.body.onpointermove = event => {
    const {clientX , clientY } = event;

    blob.animate ({
        left : `${clientX}px`,
        top :`${clientY}px`
    }, { duration : 3000, fill: "forwards" });
}

function deleteConf() {
    let text = "Are you sure you want to delete this set?";
    if (confirm(text) == true) {
        text = "You have succesfully deleted it!";
      } else {
        text = "You canceled!";
      }
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