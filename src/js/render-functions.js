import { refs } from './refs';

// Перевірка білого кольору
export function swatchClass(color) {
  const n = String(color).trim().toLowerCase();
  const isWhite = n === '#fff' || n === '#ffffff' || n === 'white';
  return isWhite
    ? 'furniture-color-item furniture-color-item--light'
    : 'furniture-color-item';
}

// Розмітка однієї картки
function createMarkup(item, extraClass = '') {
  const image = item.images?.[0] ?? '';
  const name = item.name || 'Без назви';
  const price = Number(item.price || 0).toLocaleString('uk-UA');
  const colors = item.color || [];

  const colorsMarkup = colors
    .slice(0, 3)
    .map(
      color => `
			<li class="${swatchClass(color)}" style="background-color: ${color}"></li>
		`
    )
    .join('');

  return `
		<li class="furniture-item${extraClass ? ' ' + extraClass : ''}" data-id="${item._id}">
			<img
				class="furniture-item-img"
				src="${image}"
				alt="${name}"
				width="335"
				loading="lazy"
			/>
			<div class="furniture-desc-wrap">
				<h3 class="furniture-item-name">${name}</h3>
				${colorsMarkup ? `<ul class="furniture-colors">${colorsMarkup}</ul>` : ''}
				<p class="furniture-item-price">${price} грн</p>
			</div>
			<button type="button" class="furniture-item-btn">Детальніше</button>
		</li>
	`;
}

// Завантажити меблі
export async function loadFurnitures(items, isNewCategory) {
  if (!refs.furnitureList) return;

  if (isNewCategory) {
    refs.furnitureList.innerHTML = '';
  }

  if (items.length === 0) {
    refs.furnitureList.innerHTML = '';
    return;
  }

  const markup = items.map(createMarkup).join('');
  refs.furnitureList.insertAdjacentHTML('beforeend', markup);
}

// Завантаження тексту для категорій

export function fillCategoryNames(categories) {
  if (!refs.categoryList) {
    return;
  }

  const allItem = document.querySelector('[data-id="all"]');
  if (allItem) {
    allItem.innerHTML = `<span class="category-name">Всі товари</span>`;
  }

  categories.forEach(cat => {
    const li = document.querySelector(`[data-id="${cat._id}"]`);

    if (li) {
      li.innerHTML = `<span class="category-name">${cat.name}</span>`;
    }
  })
}

export function loadPopularFurnitures(items) {
  const list = document.querySelector('.popular-list');
  if (!list) return;
  list.innerHTML = items.map(item => createMarkup(item, 'swiper-slide')).join('');
}