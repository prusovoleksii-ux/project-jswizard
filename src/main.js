import './js/modal-details';
import accordionInit from './js/accordion.js';

import { openModal, 
        closeModal, 
        onBackdropClick, 
        onKeydownEscape } from "./js/close-modal";

import { PAGE_SIZE } from './js/constants';
import { refs } from './js/refs';
import { fetchFurnitures, fetchCategories } from './js/products-api';
import { loadFurnitures, fillCategoryNames } from './js/render-functions';
import {
  checkBtnStatus,
  scrollPage,
  hideLoadMoreBtn,
} from './js/base-functions';
import { initHeader } from './js/header.js';
initHeader();

//modal close & open
refs.modalCloseBtn.addEventListener('click', closeModal);
refs.backdrop.addEventListener('click', onBackdropClick);
document.addEventListener('keydown', onKeydownEscape);

//furniture list
export let TOTAL_ITEMS;
export let page = 1;

let currentCategory = "all"

document.addEventListener('DOMContentLoaded', async () => {
  accordionInit();

  hideLoadMoreBtn();

  try {
    const categoriesData = await fetchCategories();
    fillCategoryNames(categoriesData);
    const allItem = document.querySelector('[data-id="all"]');
    if (allItem) allItem.classList.add('active');


    const data = await fetchFurnitures(currentCategory);
    TOTAL_ITEMS = Math.ceil(data.totalItems / PAGE_SIZE);
    loadFurnitures(data.furnitures);
    checkBtnStatus();
  } catch (error) {
    console.error('Помилка при завантаженні меблів:', error);
  }
});

refs.loadMoreBtn.addEventListener('click', async () => {
  page += 1;
  hideLoadMoreBtn();

  try {
    const data = await fetchFurnitures();
    loadFurnitures(data.furnitures);
    scrollPage();
    checkBtnStatus();
  } catch (error) {
    console.error('Помилка при завантаженні меблів:', error);
  }
});

// Обробка кліку по категоріях

refs.categoryList.addEventListener('click', async (event) => {
  const target = event.target.closest('.our-furniture-item');

  if (!target) {
    return;
  }
  // рамка 
  document.querySelectorAll('.our-furniture-item')
    .forEach(li => li.classList.remove('active'));
  target.classList.add('active');
})