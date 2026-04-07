const modalRefs = {
  title: document.querySelector('.product-heading'),
  text: document.querySelector('.product-text'),
  price: document.querySelector('.product-price'),
  description: document.querySelector('.product-description-text'),
  size: document.querySelector('.product-size'),
  img: document.querySelector('.product-img'),
  rowImgFirst: document.querySelector('.row-img-first'),
  rowImgSecond: document.querySelector('.row-img-second'),
  color: document.querySelector('.product-color__circle'),
  colorContainer: document.querySelector('.product-input'),
  reviewProduct: document.querySelector('.product-review'),
};
import { refs } from './refs';
import { closeModal, openModal, openOrderModal } from './close-modal';
import { swatchClass } from './render-functions';
import { fetchFurnitureById } from './products-api';
import { hideLoader, showLoader } from './loader';
import { renderStars } from './reviews';

let currentProduct = null;
let selectedColor = null;

function renderColor(colors) {
  modalRefs.colorContainer.innerHTML = colors
    .map(
      (color, index) => `
      <label class="product-color__option">
        <input
            class="product-color__input"
            type="radio"
            name="product-color"
            value="${color}"
            ${index === 0 ? 'checked' : ''}
           />
           <span
            class="product-color__circle ${swatchClass(color)}"
            style="background-color: ${color}"
           ></span>
       </label>`
    )
    .join('');
}

function renderModal(data) {
  modalRefs.title.textContent = data.name;
  modalRefs.text.textContent = data.type;
  modalRefs.price.textContent = `${Number(data.price).toLocaleString('uk-UA')} грн`;
  modalRefs.description.textContent = data.description;
  modalRefs.size.textContent = `Розміри ${data.sizes}`;
  modalRefs.img.src = data.images[0];
  modalRefs.img.alt = data.name;
  modalRefs.rowImgFirst.src = data.images?.[1] || data.images?.[0];
  modalRefs.rowImgFirst.alt = data.name;
  modalRefs.rowImgSecond.src = data.images?.[2] || data.images?.[0];
  modalRefs.rowImgSecond.alt = data.name;
  modalRefs.reviewProduct.innerHTML = renderStars(data.rate);
  renderColor(data.color);
}

modalRefs.colorContainer.addEventListener('change', e => {
  if (!e.target.classList.contains('product-color__input')) return;
  selectedColor = String(e.target.value);
});

refs.furnitureList.addEventListener('click', onCardClick);
if (refs.popularList) refs.popularList.addEventListener('click', onCardClick);
async function onCardClick(e) {
  const btn = e.target.closest('.furniture-item-btn');
  if (!btn) return;
  const card = e.target.closest('.furniture-item');
  if (!card) return;
  const id = card.dataset.id;
  try {
    showLoader();
    const data = await fetchFurnitureById(id);
    currentProduct = data;
    selectedColor = data.color?.[0] ? String(data.color[0]) : '#1212ca';
    renderModal(data);
    openModal();
  } catch (error) {
    console.error('Помилка при завантаженні меблів:', error);
  } finally {
    hideLoader();
  }
}
// Перехід з product modal => order modal
document.addEventListener('DOMContentLoaded', () => {
  const modal = document.querySelector('.modal-details');
  modal?.addEventListener('click', e => {
    const orderBtn = e.target.closest('.button-order');
    if (!orderBtn) return;
    e.preventDefault();
    closeModal();
    openOrderModal(currentProduct, selectedColor);
  });
});
