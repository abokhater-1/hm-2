const cardsContainer = document.getElementById('cardsContainer');
const searchInput = document.getElementById('searchInput');
const sortSelect = document.getElementById('sortSelect');
const errorContainer = document.getElementById('errorContainer');
const themeToggle = document.getElementById('themeToggle');
const themeIcon = document.getElementById('themeIcon');

let allItems = [];

window.addEventListener('DOMContentLoaded', () => {
  loadTheme();
  fetchItems();
  setupEventListeners();
});

function fetchItems() {
  fetch('data/items.json')
    .then(res => {
      if (!res.ok) throw new Error('Failed to fetch items.');
      return res.json();
    })
    .then(data => {
      allItems = data;
      renderItems(allItems);
    })
    .catch(err => {
      showError(err.message);
    });
}

function renderItems(items) {
  cardsContainer.innerHTML = '';
  errorContainer.textContent = '';

  if (items.length === 0) {
    showError('No items found.');
    return;
  }

  items.forEach(item => {
    const col = document.createElement('div');
    col.className = 'col';
    col.innerHTML = `
      <article class="card-custom h-100">
        <div class="card-img-container">
          <img src="${item.image}" alt="${item.title}" onerror="handleImageError(this, '${item.title}')" />
        </div>
        <div class="card-body d-flex flex-column">
          <h5 class="card-title">${item.title}</h5>
          <h6 class="card-subtitle mb-2"><span class="badge-author">${item.author}</span></h6>
          <p class="card-text">${item.description}</p>
        </div>
      </article>
    `;
    cardsContainer.appendChild(col);
  });
}

function showError(message) {
  errorContainer.textContent = message;
}

function setupEventListeners() {
  searchInput.addEventListener('input', filterAndSort);
  sortSelect.addEventListener('change', filterAndSort);
  themeToggle.addEventListener('click', toggleTheme);
}

function filterAndSort() {
  const query = searchInput.value.toLowerCase();
  const sortBy = sortSelect.value;

  let filtered = allItems.filter(item =>
    item.title.toLowerCase().includes(query) ||
    item.author.toLowerCase().includes(query)
  );

  if (sortBy) {
    const [key, order] = sortBy.split('-');
    filtered.sort((a, b) => {
      const aVal = a[key].toLowerCase();
      const bVal = b[key].toLowerCase();
      return order === 'asc' ? aVal.localeCompare(bVal) : bVal.localeCompare(aVal);
    });
  }

  renderItems(filtered);
}

function toggleTheme() {
  const body = document.body;
  const dark = body.classList.toggle('dark-mode');
  localStorage.setItem('theme', dark ? 'dark' : 'light');
  themeIcon.className = dark ? 'bi bi-sun-fill' : 'bi bi-moon-fill';
}

function loadTheme() {
  const storedTheme = localStorage.getItem('theme');
  if (storedTheme === 'dark') {
    document.body.classList.add('dark-mode');
    themeIcon.className = 'bi bi-sun-fill';
  } else {
    document.body.classList.remove('dark-mode');
    themeIcon.className = 'bi bi-moon-fill';
  }
}

function handleImageError(imgElement, altText) {
  const placeholder = document.createElement('div');
  placeholder.textContent = altText;
  placeholder.style.display = 'flex';
  placeholder.style.justifyContent = 'center';
  placeholder.style.alignItems = 'center';
  placeholder.style.height = '200px';
  placeholder.style.backgroundColor = '#ddd';
  placeholder.style.color = '#333';
  placeholder.style.fontWeight = 'bold';
  placeholder.style.textAlign = 'center';
  placeholder.style.padding = '1rem';

  imgElement.parentNode.replaceChild(placeholder, imgElement);
}
