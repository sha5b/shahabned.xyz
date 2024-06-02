import { getCategories } from '$lib/services/pocketbase';

export async function load() {
  const categories = await getCategories();
  return {
    categories
  };
}
