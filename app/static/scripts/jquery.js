$('.open-window').click(function (e) {
    e.preventDefault();
    $('.around-creation').addClass('transit');
    });
$('.close-creation').click(function (e) {
e.preventDefault();
$('.around-creation').removeClass('transit');
});