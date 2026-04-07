import { showLoader } from './loader';
import { refs } from './refs';
export const isModalOpen = () => {
  return refs.backdrop.classList.contains('is-open');
};

export function onKeydownEscape(e) {
  if (e.key === 'Escape' && isModalOpen()) {
    closeModal();
  }
}

export function onBackdropClick(e) {
  if (e.target === e.currentTarget) {
    closeModal();
  }
}

export function closeModal() {
  refs.backdrop.classList.remove('is-open');

  document.body.classList.remove('no-scroll');
  document.body.style.paddingRight = '';
}

export function openModal() {
  const scrollBarWidth =
    window.innerWidth - document.documentElement.clientWidth;

  document.body.classList.add('no-scroll');
  document.body.style.paddingRight = `${scrollBarWidth}px`;

  requestAnimationFrame(() => {
    refs.backdrop.classList.add('is-open');
  });
}

export function openOrderModal() {
  const orderBackdrop = document.querySelector('.order-backdrop');
  if (!orderBackdrop) return;

  const scrollBarWidth =
    window.innerWidth - document.documentElement.clientWidth;

  document.body.classList.add('no-scroll');
  document.body.style.paddingRight = `${scrollBarWidth}px`;

  requestAnimationFrame(() => {
    closeModal();
    orderBackdrop.classList.add('is-open');
  });
}
