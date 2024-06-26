// src/routes/+page.js
import { fetchCategories, fetchWorks, fetchOwner } from '$lib/services/pocketbase';

export async function load({ fetch }) {
  const categories = await fetchCategories(fetch);
  const works = await fetchWorks(fetch);
  const owner = await fetchOwner(fetch, 'dwuvjtbcmpf5pz0');

  return {
    categories,
    works,
    owner,
    pageType: 'landing'
  };
}