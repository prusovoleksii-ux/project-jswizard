import axios from 'axios';

import { BASE_URL, ENDPOINT, PAGE_SIZE } from './constants';
import { page } from '../main';

// Отримати меблі з API
export async function fetchFurnitures(category) {
  const url = BASE_URL + ENDPOINT.FURNITURES;

  let params = {
      page: page,
      limit: PAGE_SIZE,
  };

  if (category === 'all') {
    params = {
      page: page,
      limit: PAGE_SIZE,
      category: category,
    };
  }


  const response = await axios.get(url, { params });
  return response.data;
}

export async function fetchCategories() {
  const url = BASE_URL + ENDPOINT.CATEGORIES;
  const response = await axios.get(url);
  return response.data;
}
