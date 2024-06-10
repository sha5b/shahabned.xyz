import { getWorksByCategory } from '$lib/services/pocketbase';

export async function load({ params, fetch }) {
  try {
    const { category } = params;
    const works = await getWorksByCategory(fetch, category);
    return {
      category,
      works
    };
  } catch (error) {
    console.error('Error loading works by category:', error);
    throw error;
  }
}
