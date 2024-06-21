import { fetchCategories, fetchWorks } from '$lib/services/pocketbase';

export async function load({ params, fetch }) {
  const { category } = params;
  const categories = await fetchCategories(fetch);
  const categoryDetails = categories.find(cat => cat.title === category);
  
  if (!categoryDetails) {
    return {
      status: 404,
      error: new Error('Category not found')
    };
  }

  const works = await fetchWorks(fetch, { categoryId: categoryDetails.id });

  return {
    works,
    categories,
    category,
    pageType: 'category'
  };
}
