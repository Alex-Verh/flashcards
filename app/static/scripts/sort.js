function sortSelect() {

    const dropdown = document.querySelector('#sort');
    const sorting_list = dropdown.querySelector('#dropdown-filter');

    $(dropdown).click(function () {
        $(this).attr('tabindex', 1).focus();
        $(this).toggleClass('active');
        $(this).find(sorting_list).slideToggle(300);
    });

    $(dropdown).focusout(function () {
        $(this).removeClass('active');
        $(this).find(sorting_list).slideUp(300);
    });
}

export {sortSelect}
