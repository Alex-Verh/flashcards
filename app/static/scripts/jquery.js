// New card set creation
$('.open-window').click(function (e) {
    e.preventDefault();
    $('#around-creation').addClass('transit');
    });
$('#close-creation').click(function (e) {
e.preventDefault();
$('#around-creation').removeClass('transit');
});

$('#dropdown').click(function () {
    $(this).attr('tabindex', 1).focus();
    $(this).toggleClass('active');
    $(this).find('#dropdown-menu').slideToggle(300);
  });
  $('#dropdown').focusout(function () {
    $(this).removeClass('active');
    $(this).find('#dropdown-menu').slideUp(300);
  });
  $('#dropdown #dropdown-menu li').click(function () {
    $(this).parents('#dropdown').find('span').text($(this).text());
    $(this).parents('#dropdown').find('input').attr('value', $(this).attr('id'));
  });

/* Disable copy, paste and cut on the webpage */
// $(document).bind("contextmenu",function(e){
//     return false;
// });