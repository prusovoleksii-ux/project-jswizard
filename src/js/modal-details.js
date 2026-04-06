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
};
import { refs } from './refs';
import { closeModal, openModal, openOrderModal } from './close-modal';
import { swatchClass } from './render-functions';
import { fetchFurnitureById } from './products-api';

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
  renderColor(data.color);
}

refs.furnitureList.addEventListener('click', onCardClick);
if (refs.popularList) refs.popularList.addEventListener('click', onCardClick);
async function onCardClick(e) {
  const btn = e.target.closest('.furniture-item-btn');
  if (!btn) return;

  const card = e.target.closest('.furniture-item');
  if (!card) return;

  const id = card.dataset.id;
  try {
    const data = await fetchFurnitureById(id);
    renderModal(data);
    openModal();
  } catch (error) {}
}

//перехід з product modal => order modal
document.addEventListener('DOMContentLoaded', () => {
  const modal = document.querySelector('.modal-details');
  modal?.addEventListener('click', e => {
    const orderBtn = e.target.closest('.button-order');
    if (!orderBtn) return;
    e.preventDefault();

    closeModal();
    openOrderModal();
  });
});
