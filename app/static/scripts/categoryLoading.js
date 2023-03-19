const createCategoryElements = (categoriesData, elementTag, parent, elementClass='') => {
  for (const category of categoriesData) {
    const categoryEl = document.createElement(elementTag)
    categoryEl.className = elementClass
    categoryEl.dataset.id = category.id
    categoryEl.textContent = category.title
    parent.appendChild(categoryEl)
  }
}


function loadCategories() {
  fetch('/api/cardset-categories', {method: 'GET'})
    .then(response => response.json())
    .then((data) => {
      // CardSet Careation Categories
      const dropdownMenu = document.querySelector('#dropdown-menu')
      createCategoryElements(data, 'li', dropdownMenu)
      // Home Card Set Categories
      const homeCategoryList = document.querySelector("#aside-list")
      homeCategoryList && createCategoryElements(data, 'div', homeCategoryList, 'category')
    });
}

export {loadCategories}