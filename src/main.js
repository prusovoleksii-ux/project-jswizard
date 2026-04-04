import { PAGE_SIZE } from './js/constants';
import { refs } from './js/refs';
import { fetchFurnitures } from './js/products-api';
import { loadFurnitures } from './js/render-functions';
import {
  checkBtnStatus,
  scrollPage,
  hideLoadMoreBtn,
} from './js/base-functions';

export let TOTAL_ITEMS;
export let page = 1;

document.addEventListener('DOMContentLoaded', async () => {
  hideLoadMoreBtn();
  try {
    const data = await fetchFurnitures();
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
