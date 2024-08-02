// src/routes/+page.js
import { fetchCategories, fetchWorks } from '$lib/services/pocketbase';

export async function load({ fetch }) {
  const categories = await fetchCategories(fetch);
  const works = await fetchWorks(fetch);

  return {
    categories,
    works,
    pageType: 'landing'
  };
}