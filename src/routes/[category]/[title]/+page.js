// src/routes/[category]/[title]/+page.js
import { fetchCategories, fetchWorkByTitle } from '$lib/services/pocketbase';

export async function load({ params, fetch }) {
  const { title } = params;
  try {
    const workDetails = await fetchWorkByTitle(fetch, title);
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
