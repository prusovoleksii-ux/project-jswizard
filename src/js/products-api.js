import axios from 'axios';

import { BASE_URL, ENDPOINT, PAGE_SIZE } from './constants';
import { page } from '../main';

// Отримати меблі з API
export async function fetchFurnitures() {
  const url = BASE_URL + ENDPOINT.FURNITURES;

  const params = {
    page: page,
    limit: PAGE_SIZE,
  };

  const response = await axios.get(url, { params });
  return response.data;
}
// Отримати меблі по Id
export async function fetchFurnitureById(id) {
  const url = `${BASE_URL}${ENDPOINT.FURNITURES}/${id}`;
  const response = await axios.get(url);
  return response.data;
}

export async function fetchCategories() {
  const url = BASE_URL + ENDPOINT.CATEGORIES;
  const response = await axios.get(url);
  return response.data;
}
