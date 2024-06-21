import { fetchWorks, fetchCategories } from '$lib/services/pocketbase';

export async function load({ params, fetch }) {
  const { work } = params;
  try {
    const workDetails = await fetchWorks(fetch, { workId: work });
    const categories = await fetchCategories(fetch);

    return {
      work: workDetails,
      categories,
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
