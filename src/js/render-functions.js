import { refs } from './refs';

// Перевірка білого кольору
function swatchClass(color) {
  const n = String(color).trim().toLowerCase();
  const isWhite = n === '#fff' || n === '#ffffff' || n === 'white';
  return isWhite
    ? 'furniture-color-item furniture-color-item--light'
    : 'furniture-color-item';
}

// Розмітка однієї картки
function createMarkup(item) {
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
		<li class="furniture-item">
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
export async function loadFurnitures(items) {
  if (!refs.furnitureList) return;

  if (items.length === 0) {
    refs.furnitureList.innerHTML = '';
    return;
  }

  const markup = items.map(createMarkup).join('');
  refs.furnitureList.insertAdjacentHTML('beforeend', markup);
}
