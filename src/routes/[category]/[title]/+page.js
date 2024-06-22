import { fetchCategories, fetchWorkByTitle, fetchWorks } from '$lib/services/pocketbase';

export async function load({ params, fetch }) {
  const { category, title } = params;
  try {
    const workDetails = await fetchWorkByTitle(fetch, title);
    const categories = await fetchCategories(fetch);
    const worksInCategory = await fetchWorks(fetch, { categoryId: workDetails.expand.category.id });

    return {
      work: workDetails,
      categories,
      worksInCategory,
      title: category, // Pass the category title
      pageType: 'work'
    };
  } catch (error) {
    console.error('Error fetching work:', error);
    return {
      status: 404,
      error: new Error('Work not found')
    };
  }
}
