import { refs } from './refs';
export const isModalOpen = () => {
  return !refs.backdrop.classList.contains('is-hidden');
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
  refs.backdrop.classList.add('is-hidden');
  document.body.classList.remove('no-scroll');
}

export function openModal() {
  refs.backdrop.classList.remove('is-hidden');
  document.body.classList.add('no-scroll');
}
