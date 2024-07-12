//src/routes/[category]/[title]/+page.js
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
      works: worksInCategory,
      title: category, // Pass the category title
      description: `Discover ${workDetails.title}, a ${category} artwork by Shahab Nedaei, exploring digital, virtual reality, and AI art.`,
      keywords: `${workDetails.title}, ${category} art, digital art, virtual reality art, AI art, Shahab Nedaei`,
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
