import IMask from 'imask';
import iziToast from 'izitoast';
import 'izitoast/dist/css/iziToast.min.css';
import axios from 'axios';

// --- КОНСТАНТИ ---
const STORAGE_KEY = 'modal-form-state';
const API_URL = 'https://furniture-store-v2.b.goit.study/api/orders';
const TOAST_CONFIG = {
  position: 'topRight',
  timeout: 3000,
  progressBar: true,
  close: true,
  closeOnClick: true,
  displayMode: 'once',
};

// --- ЕЛЕМЕНТИ ---
const elements = {
  backdrop: document.querySelector('.backdrop'),
  form: document.querySelector('.form'),
  nameInput: document.getElementById('name'),
  phoneInput: document.getElementById('phone'),
  commentInput: document.getElementById('comment'),
  sendButton: document.querySelector('.send-button'),
  openModalBtns: document.querySelectorAll('.js-open-modal'),
};
const {
  backdrop,
  form,
  nameInput,
  phoneInput,
  commentInput,
  sendButton,
  openModalBtns,
} = elements;

// --- СТАН ПОЛІВ ---
let fieldStates = {
  name: { isValidated: false, wasTouched: false },
  phone: { isValidated: false, wasTouched: false },
};

// --- МОДАЛЬНЕ ВІКНО ---
const scrollbarWidth = `${window.innerWidth - document.documentElement.clientWidth}px`;
const transitionTimeout =
  parseFloat(getComputedStyle(backdrop).transitionDuration) * 1000 || 250;
const modal = {
  open: () => {
    backdrop.classList.add('is-open');
    document.body.style.cssText = `overflow: hidden; padding-right: ${scrollbarWidth};`;
  },
  close: () => {
    backdrop.classList.remove('is-open');
    setTimeout(() => (document.body.style.cssText = ''), transitionTimeout);
  },
};
export const openModal = modal.open;

// --- LOCALSTORAGE ---
const storage = {
  load: () => {
    try {
      const data = JSON.parse(localStorage.getItem(STORAGE_KEY)) || {};
      nameInput.value = data.name || '';
      phoneInput.value = data.phone || '';
      commentInput.value = data.comment || '';
      return data;
    } catch {
      return {};
    }
  },
  save: () => {
    localStorage.setItem(
      STORAGE_KEY,
      JSON.stringify({
        name: nameInput.value,
        phone: phoneInput.value,
        comment: commentInput.value,
      })
    );
  },
  clear: () => localStorage.removeItem(STORAGE_KEY),
};

// --- МАСКА ТЕЛЕФОНУ ---
const phoneMask = IMask(phoneInput, {
  mask: '{38} 000 000 00 00',
  lazy: true,
  placeholderChar: '_',
});
const storedData = storage.load();
if (storedData?.phone) phoneMask.value = storedData.phone;

// --- ВАЛІДАЦІЯ ІМЕНІ ---
const normalizeName = value =>
  value
    .replace(/[^A-Za-zА-Яа-яІіЇїЄєҐґ\s-]/g, '')
    .replace(/^[\s-]+/, '')
    .replace(/^([A-Za-zА-Яа-яІіЇїЄєҐґ])[\s-]/, '$1')
    .replace(/[\s-]{2,}/g, match => match[0])
    .toLowerCase()
    .replace(
      /(^|[\s-])([a-zа-яіїєґ])/g,
      (_, sep, letter) => sep + letter.toUpperCase()
    );

// --- ВАЛІДАТОРИ ---
const validators = {
  name: value => {
    const trimmed = value.trim();
    if (!trimmed) return { isValid: false, message: "Введіть ваше ім'я" };
    if (trimmed.length < 3)
      return { isValid: false, message: 'Мінімум 3 символи' };
    if (trimmed.length > 50)
      return {
        isValid: false,
        message: 'Введена максимальна кількість символів',
      };
    if (!/^[a-zа-яіїєґ]{2,}([\s-][a-zа-яіїєґ]{2,})*$/i.test(trimmed)) {
      return { isValid: false, message: "Некоректне ім'я" };
    }
    return { isValid: true, message: 'Поле заповнено коректно' };
  },

  phone: value => {
    const digits = value.replace(/\D/g, '');
    if (!digits) return { isValid: false, message: 'Введіть номер телефону' };
    if (digits.length !== 12)
      return { isValid: false, message: 'Номер повинен містити 12 цифр' };
    return { isValid: true, message: 'Поле заповнено коректно' };
  },
};

// --- УПРАВЛІННЯ ВАЛІДАЦІЄЮ ---
const validation = {
  show: (input, { isValid, message }) => {
    const container = input.closest('.entry-field');

   // --- Очищення ---
    container
      .querySelectorAll(
        '.just-validate-error-label, .just-validate-success-label'
      )
      .forEach(el => el.remove());
    input.classList.remove('is-valid', 'is-invalid');

   // --- Додавання нового стану ---
    input.classList.add(isValid ? 'is-valid' : 'is-invalid');
    const label = document.createElement('div');
    label.className = isValid
      ? 'just-validate-success-label'
      : 'just-validate-error-label';
    label.textContent = message;
    container.appendChild(label);
  },

  clear: input => {
    const container = input.closest('.entry-field');
    container
      .querySelectorAll(
        '.just-validate-error-label, .just-validate-success-label'
      )
      .forEach(el => el.remove());
    input.classList.remove('is-valid', 'is-invalid');
  },

 // --- Валідація з відображенням ---
  validateAndShow: (input, validator, fieldName) => {
    if (!input.value.trim()) {
      validation.clear(input);
      return false;
    }

    const result = validator(input.value);
    validation.show(input, result);
    fieldStates[fieldName].isValidated = true;
    return result.isValid;
  },
};

// --- ПЕРЕВІРКА КНОПКИ ---
const updateButton = () => {
  sendButton.disabled = !(
    nameInput.value.trim().length >= 2 && phoneMask.unmaskedValue.length === 12
  );
};

// --- TOAST ---
const showToast = (type, title, message) =>
  new Promise(resolve => {
    iziToast[type]({
      ...TOAST_CONFIG,
      title,
      message,
      onClosing: resolve,
      onClosed: resolve,
    });
    setTimeout(resolve, TOAST_CONFIG.timeout + 500);
  });

// --- ОБРОБНИКИ ПОЛІВ ---
const fieldHandlers = {
  name: {
    input: e => {
      e.target.value = normalizeName(e.target.value);

      // --- Якщо поле вже торкалися - валідуємо при введенні ---
      if (fieldStates.name.wasTouched) {
        validation.validateAndShow(nameInput, validators.name, 'name');
      }

      updateButton();
      storage.save();
    },

    blur: () => {
      fieldStates.name.wasTouched = true;
      validation.validateAndShow(nameInput, validators.name, 'name');
    },

    focus: () => {
      fieldStates.name.wasTouched = true;
    },
  },

  phone: {
    input: () => {
      // --- Якщо поле вже торкалися - валідуємо при введенні ---
      if (fieldStates.phone.wasTouched) {
        validation.validateAndShow(phoneInput, validators.phone, 'phone');
      }

      updateButton();
      storage.save();
    },

    blur: () => {
      fieldStates.phone.wasTouched = true;
      validation.validateAndShow(phoneInput, validators.phone, 'phone');
    },

    focus: () => {
      fieldStates.phone.wasTouched = true;
    },
  },
};

 // --- Додаємо всі обробники ---
nameInput.addEventListener('input', fieldHandlers.name.input);
nameInput.addEventListener('blur', fieldHandlers.name.blur);
nameInput.addEventListener('focus', fieldHandlers.name.focus);
phoneInput.addEventListener('input', fieldHandlers.phone.input);
phoneInput.addEventListener('blur', fieldHandlers.phone.blur);
phoneInput.addEventListener('focus', fieldHandlers.phone.focus);
commentInput.addEventListener('input', storage.save);

// --- МОДАЛЬНЕ ВІКНО ---
openModalBtns.forEach(btn => {
  btn.addEventListener('click', e => {
    e.preventDefault();
    modal.open();
  });
});
backdrop.addEventListener('click', ({ target }) => {
  if (target === backdrop || target.closest('[data-modal-close]')) {
    modal.close();
  }
});
document.addEventListener('keydown', e => {
  if (e.key === 'Escape' && backdrop.classList.contains('is-open')) {
    modal.close();
  }
});

// --- ВІДПРАВКА ФОРМИ ---
form.addEventListener('submit', async e => {
  e.preventDefault();
  const nameResult = validators.name(nameInput.value);
  const phoneResult = validators.phone(phoneInput.value);
  validation.show(nameInput, nameResult);
  validation.show(phoneInput, phoneResult);
  if (!nameResult.isValid || !phoneResult.isValid) return;
  const formData = {
    name: nameInput.value.trim(),
    phone: phoneMask.unmaskedValue,
    comment: commentInput.value.trim() || 'Без коментаря',
    modelId: '682f9bbf8acbdf505592ac36', //!!!необхідно виправити на значення, яке приходить з попереднього модального вікна
    color: '#1212ca', //!!!необхідно виправити на значення, яке приходить з попереднього модального вікна
  };
  try {
    await axios.post(API_URL, formData);
    await showToast('success', 'Дякуємо!', 'Ваше замовлення прийнято.');
    form.reset();
    phoneMask.value = '';
    storage.clear();
    validation.clear(nameInput);
    validation.clear(phoneInput);

    // --- Скидаємо стани ---
    fieldStates.name = { isValidated: false, wasTouched: false };
    fieldStates.phone = { isValidated: false, wasTouched: false };

    updateButton();
    modal.close();
  } catch (error) {
    console.error('Помилка відправки:', error.response?.data || error.message);
    await showToast('error', 'Ой!', 'Щось пішло не так, повторіть спробу.');
  }
});

// --- ІНІЦІАЛІЗАЦІЯ ---
updateButton();
if (storedData.name || storedData.phone) {
  setTimeout(() => {
    if (storedData.name?.trim()) {
      fieldStates.name.wasTouched = true;
      validation.validateAndShow(nameInput, validators.name, 'name');
    }

    if (storedData.phone?.trim()) {
      fieldStates.phone.wasTouched = true;
      validation.validateAndShow(phoneInput, validators.phone, 'phone');
    }
  }, 100);
}
