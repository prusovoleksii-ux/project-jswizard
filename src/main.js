import Swiper from 'swiper';
import { Navigation, Pagination, Keyboard } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';

import './js/modal-details';
import accordionInit from './js/accordion.js';

import {
  openModal,
  closeModal,
  onBackdropClick,
  onKeydownEscape,
} from './js/close-modal';

import { initFeedbackSection } from './js/reviews.js';
document.addEventListener('DOMContentLoaded', initFeedbackSection);

import { PAGE_SIZE } from './js/constants';
import { refs } from './js/refs';
import {
  fetchFurnitures,
  fetchCategories,
  fetchPopularFurnitures,
} from './js/products-api';
import {
  loadFurnitures,
  fillCategoryNames,
  loadPopularFurnitures,
} from './js/render-functions';
import {
  checkBtnStatus,
  scrollPage,
  hideLoadMoreBtn,
  showToast,
} from './js/base-functions';
import { showLoader, hideLoader } from './js/loader.js';
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

let currentCategory = 'all';

document.addEventListener('DOMContentLoaded', async () => {
  accordionInit();
  showLoader();
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
    showToast(
      'error',
      'Помилка',
      'Не вдалося завантажити меблі. Спробуйте пізніше.',
      'topRight'
    );
  } finally {
    hideLoader();
  }

  // популярні меблі
  try {
    const popularData = await fetchPopularFurnitures();
    loadPopularFurnitures(popularData.furnitures);
    new Swiper('.popular-viewport', {
      modules: [Navigation, Pagination, Keyboard],
      slidesPerView: 1.5,
      spaceBetween: 16,

      keyboard: {
        enabled: true,
        onlyInViewport: true,
        pageUpDown: true,
      },

      breakpoints: {
        768: { slidesPerView: 2, spaceBetween: 24 },
        1440: { slidesPerView: 4, spaceBetween: 24 },
      },
      navigation: {
        prevEl: '.popular-btn--prev',
        nextEl: '.popular-btn--next',
      },
      on: {
        navigationNext(swiper) {
          swiper.navigation.nextEl.blur();
        },
        navigationPrev(swiper) {
          swiper.navigation.prevEl.blur();
        },
      },
      pagination: {
        el: '.popular-pagination',
        clickable: true,
      },
    });
  } catch (error) {
    showToast(
      'error',
      'Помилка',
      'Не вдалося завантажити популярні меблі. Спробуйте пізніше.',
      'topRight'
    );
  }
});

refs.loadMoreBtn.addEventListener('click', async () => {
  page += 1;
  hideLoadMoreBtn();
  showLoader();
  try {
    const data = await fetchFurnitures();
    loadFurnitures(data.furnitures);
    scrollPage();
    checkBtnStatus();
  } catch (error) {
    showToast(
      'error',
      'Помилка',
      'Не вдалося завантажити меблі. Спробуйте пізніше.',
      'topRight'
    );
  } finally {
    hideLoader();
  }
});

// Обробка кліку по категоріях

refs.categoryList.addEventListener('click', async event => {
  const target = event.target.closest('.our-furniture-item');

  if (!target) {
    return;
  }
  // рамка
  document
    .querySelectorAll('.our-furniture-item')
    .forEach(li => li.classList.remove('active'));
  target.classList.add('active');
  refs.furnitureList.innerHTML = '';
  page = 1;
  showLoader();
  try {
    const data = await fetchFurnitures(target.dataset.id);
    TOTAL_ITEMS = Math.ceil(data.totalItems / PAGE_SIZE);
    loadFurnitures(data.furnitures);
    checkBtnStatus();
    hideLoader();
  } catch (error) {
    showToast(
      'error',
      'Помилка',
      'Не вдалося завантажити меблі. Спробуйте пізніше.',
      'topRight'
    );
    hideLoader();
  }
});
