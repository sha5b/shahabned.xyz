import { getWorksByCategory, getCategories } from '$lib/services/pocketbase';

export async function load({ params, fetch }) {
  const { category } = params;
  const works = await getWorksByCategory(fetch, category);
  const categories = await getCategories(fetch);

  return {
    works,
    categories,
    category
  };
}
