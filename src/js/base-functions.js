import { page, TOTAL_ITEMS } from '../main';
import { refs } from './refs';

// Показати кнопку "Показати ще"
export function showLoadMoreBtn() {
  if (refs.loadMoreBtn) refs.loadMoreBtn.classList.remove('is-hidden');
}

// Сховати кнопку "Показати ще"
export function hideLoadMoreBtn() {
  if (refs.loadMoreBtn) refs.loadMoreBtn.classList.add('is-hidden');
}

// Перевірка статусу кнопки "Показати ще"
export function checkBtnStatus(totalItems) {
  if (page >= TOTAL_ITEMS) {
    hideLoadMoreBtn();
  } else {
    showLoadMoreBtn();
  }
}

export function scrollPage() {
  const elem = refs.furnitureList.lastElementChild;
  const height = elem.getBoundingClientRect().height;
  window.scrollBy({
    top: height,
    behavior: 'smooth',
  });
}
