//src/lib/services/pocketbase.js
import PocketBase from 'pocketbase';

const pb = new PocketBase(import.meta.env.VITE_API_URL);

export const fetchWorkByTitle = async (fetch, title) => {
  try {
    const works = await pb.collection('works').getFullList({
      filter: `title="${title}"`,
      expand: 'category,colab,reference,exhibitions', // Expand additional fields
      $autoCancel: false // Disable auto-cancellation
    });
    if (works.length === 0) {
      throw new Error('Work not found');
    }
    return works[0];
  } catch (error) {
    console.error(`Error fetching work by title "${title}":`, error);
    throw error;
  }
};

export const fetchOwner = async (fetch, id) => {
  try {
    return await pb.collection('users').getOne(id, {
      $autoCancel: false // Disable auto-cancellation
    });
  } catch (error) {
    console.error('Error fetching owner:', error);
    throw error;
  }
};

export const fetchCategories = async (fetch) => {
  try {
    return await pb.collection('categories').getFullList({
      sort: '-title',
      expand: 'category',
      $autoCancel: false // Disable auto-cancellation
    });
  } catch (error) {
    console.error('Error fetching categories:', error);
    throw error;
  }
};

export const fetchWorks = async (fetch, options = {}) => {
  const { categoryId = null, workId = null } = options;

  try {
    if (categoryId) {
      return await pb.collection('works').getFullList({
        filter: `category="${categoryId}"`,
        sort: '-date',
        expand: 'category',
        $autoCancel: false // Disable auto-cancellation
      });
    }

    if (workId) {
      return await pb.collection('works').getOne(workId, {
        expand: 'category',
        $autoCancel: false // Disable auto-cancellation
      });
    }

    // Fetch newest works from each category
    const categories = await fetchCategories(fetch);
    const newestWorks = [];

    for (const category of categories) {
      const works = await pb.collection('works').getFullList({
        filter: `category="${category.id}"`,
        sort: '-date',
        limit: 1,
        expand: 'category',
        $autoCancel: false // Disable auto-cancellation
      });
      if (works.length > 0) {
        newestWorks.push(works[0]);
      }
    }

    return newestWorks;
  } catch (error) {
    console.error('Error fetching works:', error);
    throw error;
  }
};
