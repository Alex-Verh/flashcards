const loadCardSets = ({page, searchQuery, sortBy, sortOrder, categoryId},
                       dashList, sentinel, cardSetsOnPage) => {

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
                <img src="../../static/images/user.png" alt="user" width="10%">
                <span id="saves-count-${cardset.id}">${cardset.saves}</span>
                <img id="save-cardset-${cardset.id}" onclick="saveCardSet(${cardset.id})" class = "image-save" src="${cardset.save_img_url}" alt="Save">
            </div>`;
        dashList.appendChild(cardSetEl);
      }
      if (data.length >= 24) {dashList.appendChild(sentinel);}
    })
}

function initCardSetsLoadingAndSearch() {
  const state = {
    page: 0,
    searchQuery: '',
    sortBy: '',
    sortOrder: '',
    categoryId: 0,
  }

  const cardSetsOnPage = 24;
  const dashListEl = document.getElementById('dash-list');
  const sentinel = document.getElementById('sentinel');
  const searchInput = document.getElementById('searchInput');
  document.querySelector('#searchBox').addEventListener('submit', function (event) {
    event.preventDefault();
    dashListEl.replaceChildren(sentinel)
    state.page = 0
    state.searchQuery = searchInput.value
  })

  document.querySelector('#aside-list').addEventListener('click', function(event) {
    const category = event.target.closest('.category')
    if (category) {
      dashListEl.replaceChildren(sentinel)
      state.page = 0
      state.categoryId = +category.dataset.id
    }
  })

  const intersectionObserver = new IntersectionObserver(entries => {
    if (entries[0].intersectionRatio <= 0) return;
    state.page += 1;
    loadCardSets(state, dashListEl, sentinel, cardSetsOnPage);
  })
  intersectionObserver.observe(sentinel)
}

export {initCardSetsLoadingAndSearch}