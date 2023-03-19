function initCardSetCreator() {
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
}



export {initCardSetCreator}
