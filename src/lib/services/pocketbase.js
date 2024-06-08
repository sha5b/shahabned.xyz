// src/lib/services/pocketbase.js
import PocketBase from 'pocketbase';

const pb = new PocketBase(import.meta.env.VITE_API_URL);

export const getCategories = async (fetch) => {
  return await pb.collection('categories').getFullList({ sort: '-title', fetch });
};

export const getWorks = async (fetch) => {
  const categories = await getCategories(fetch);
  const newestWorks = [];

  for (const category of categories) {
    const works = await pb.collection('works').getFullList({
      filter: `category="${category.id}"`,
      sort: '-date',
      limit: 1,
      expand: 'category', // Ensure categories are expanded
      fetch
    });
    if (works.length > 0) {
      newestWorks.push(works[0]);
    }
  }

  return newestWorks;
};

export const getWorksByCategory = async (fetch, category) => {
  return await pb.collection('works').getFullList({
    filter: `category="${category}"`,
    sort: '-date',
    expand: 'category', // Ensure categories are expanded
    fetch
  });
};

export const getOwner = async (fetch, id) => {
  return await pb.collection('users').getOne(id, { fetch });
};
