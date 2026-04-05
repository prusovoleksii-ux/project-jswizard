export function initHeader() {
  const refs = {
    openModalBtn: document.querySelector('[data-menu-open]'),
    modal: document.querySelector('[data-menu]'),
    overlay: document.querySelector('#overlay'),
    body: document.querySelector('body'),
    menuLinks: document.querySelectorAll('.mobile-menu'),
  };

  refs.openModalBtn.addEventListener('click', toggleModal);
  refs.overlay.addEventListener('click', closeModal);
  document.addEventListener('keydown', e => {
    if (e.key === 'Escape' && refs.modal.classList.contains('is-open')) {
      closeModal();
    }
  });
  refs.menuLinks.forEach(link => {
    link.addEventListener('click', closeModal);
  });

  function toggleModal() {
    refs.modal.classList.toggle('is-open');
    refs.openModalBtn.classList.toggle('active');
    refs.overlay.classList.toggle('active');
    refs.body.classList.toggle('no-scroll');
  }

  function closeModal() {
    refs.modal.classList.remove('is-open');
    refs.openModalBtn.classList.remove('active');
    refs.overlay.classList.remove('active');
    refs.body.classList.remove('no-scroll');
  }
}
