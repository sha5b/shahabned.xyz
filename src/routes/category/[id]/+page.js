import { getCategories, getWorks } from '$lib/services/pocketbase';
import { error } from '@sveltejs/kit';

export async function load({ params }) {
  const categories = await getCategories();
  const category = categories.find(c => c.id === params.id);

  if (!category) {
    throw error(404, 'Category not found');
  }

  const works = await getWorks();
  const categoryWorks = works.filter(work => work.category === params.id);

  return { category, works: categoryWorks };
}
