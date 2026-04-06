import Swiper from 'swiper';
import { Navigation, Pagination } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';

import './js/modal-details';
import accordionInit from './js/accordion.js';

import { openModal, 
        closeModal, 
        onBackdropClick, 
        onKeydownEscape } from "./js/close-modal";

import { PAGE_SIZE } from './js/constants';
import { refs } from './js/refs';
import { fetchFurnitures, fetchCategories, fetchPopularFurnitures } from './js/products-api';
import { loadFurnitures, fillCategoryNames, loadPopularFurnitures } from './js/render-functions';
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
export let furnitureCategory = 'all';

let currentCategory = "all"

document.addEventListener('DOMContentLoaded', async () => {
  accordionInit();

  hideLoadMoreBtn();

  try {
    const categoriesData = await fetchCategories();
    fillCategoryNames(categoriesData);
    const allItem = document.querySelector('[data-id="all"]');
    if (allItem) allItem.classList.add('active');


    const data = await fetchFurnitures();
    TOTAL_ITEMS = Math.ceil(data.totalItems / PAGE_SIZE);
    loadFurnitures(data.furnitures);
    checkBtnStatus();
  } catch (error) {
    console.error('Помилка при завантаженні меблів:', error);
  }

// популярні меблі
   try {
     const popularData = await fetchPopularFurnitures();
     loadPopularFurnitures(popularData.furnitures);
     new Swiper('.popular-viewport', {
  modules: [Navigation, Pagination],
  slidesPerView: 1.5,
  spaceBetween: 16,
  breakpoints: {
    480: { slidesPerView: 1.5, spaceBetween: 24 },
    768: { slidesPerView: 2, spaceBetween: 24 },
    1200: { slidesPerView: 4, spaceBetween: 24 },
  },
  navigation: {
    prevEl: '.popular-btn--prev',
    nextEl: '.popular-btn--next',
  },
  pagination: {
    el: '.popular-pagination',
    clickable: true,
  },
});
  } catch (error) {
    console.error('Помилка при завантаженні популярних меблів:', error);
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
  refs.furnitureList.innerHTML = '';
  page = 1;
  try {
    const data = await fetchFurnitures(target.dataset.id);
    TOTAL_ITEMS = Math.ceil(data.totalItems / PAGE_SIZE);
    loadFurnitures(data.furnitures);
    checkBtnStatus();
  } catch (error) {
    console.error('Помилка при завантаженні меблів:', error);
  }
});

