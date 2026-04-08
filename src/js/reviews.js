// Axios
import axios from 'axios';

//Backend
const URL = 'https://furniture-store-v2.b.goit.study';
const feedbacksURL = `${URL}/api/feedbacks`;

// Swiper
import Swiper from 'swiper';
import { Navigation, Pagination, Keyboard } from 'swiper/modules';
import 'swiper/swiper-bundle.css';

// Star-rating.css import 'css-star-rating/css/star-rating.css';
import starFull from '../img/stars/star-full.svg?url';
import starEmpty from '../img/stars/star-empty.svg?url';
import starHalf from '../img/stars/star-half.svg?url';

// iziToast
import iziToast from 'izitoast';
import 'izitoast/dist/css/iziToast.min.css';

// API function

async function getFeedbacks(limit = 10, page = 1) {
  const response = await axios.get(feedbacksURL, {
    params: {
      page,
      limit,
    },
  });
  return response.data;
}

export async function initFeedbackSection() {
  const section = document.querySelector('#reviews');
  if (!section) return;

  const swiperEl = section.querySelector('.swiper.reviews-swiper');
  const wrapper = section.querySelector('.swiper-wrapper');
  const paginationEl = section.querySelector('.reviews-swiper-pagination');
  const nextBtn = section.querySelector('.reviews-swiper-button-next');
  const prevBtn = section.querySelector('.reviews-swiper-button-prev');

  try {
    // Backend request
    const page = Math.floor(Math.random() * 9) + 1;
    const response = await getFeedbacks(10, page);
    const feedbacks = response?.feedbacks || [];

    //Validate returns: no array or < 3 feedback = error => catch block.
    if (!Array.isArray(feedbacks) || feedbacks.length < 3) {
      console.error('Not enough feedbacks (min 3 required)');
      return [];
    }

    // Render
    wrapper.innerHTML = feedbacks.map(renderFeedbackSlide).join('');

    // Swiper init
    new Swiper(swiperEl, {
      modules: [Navigation, Pagination, Keyboard],
      speed: 800,
      slidesPerView: 1,
      spaceBetween: 20,
      loop: false,
      resistanceRatio: 0.85,
      touchRatio: 1.2,

      keyboard: {
        enabled: true,
        onlyInViewport: true,
        pageUpDown: true,
      },

      breakpoints: {
        768: {
          slidesPerView: 2,
          spaceBetween: 24,
        },

        1440: {
          slidesPerView: 3,
          spaceBetween: 24,
        },
      },

      pagination: {
        el: paginationEl,
        clickable: true,
      },

      navigation: {
        nextEl: nextBtn,
        prevEl: prevBtn,
        disabledClass: 'is-disabled',
      },
    });
  } catch (err) {
    console.error(err);
    iziToast.error({
      title: 'Error',
      message: err.message,
      position: 'topRight',
    });
  }
}

// HTML render function
function renderFeedbackSlide(item) {
  const name = item?.name ?? 'User';
  const text = item?.descr ?? 'Your comment could be here';
  const rating = clampRating(item?.rate ?? 0);

  return `
    <div class="swiper-slide">
      <div class="feedback-card">
        <div class="rating-star">
          <div class="star-rating-container">
            ${renderStars(rating)}
          </div>
        </div>

        <p class="reviews-comment">${text}</p>
        <p class="reviews-author">${name}</p>
      </div>
    </div>
  `;
}

export function renderStars(rating) {
  return Array.from({ length: 5 }, (_, i) => {
    const index = i + 1;

    let icon = starEmpty;

    if (rating >= index) {
      icon = starFull;
    } else if (rating >= index - 0.5) {
      icon = starHalf;
    }

    return `
      <img class="star" src="${icon}" alt="Rating">
    `;
  }).join('');
}

// Validation rating between 0 and 5
function clampRating(val) {
  const n = Number(val);
  if (!Number.isFinite(n)) return 0;
  return Math.max(0, Math.min(5, n));
}
