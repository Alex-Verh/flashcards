/* Window of creation appearence and disappearence */
$('.open-window').click(function (e) {
    e.preventDefault();
    $('.around-creation').addClass('transit');
    });
$('.close-creation').click(function (e) {
e.preventDefault();
$('.around-creation').removeClass('transit');
});

/* Disable copy, paste and cut on the webpage */
// $(document).bind("contextmenu",function(e){
//     return false;
// });