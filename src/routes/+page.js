import { getCategories, getWorks, getOwner } from '$lib/services/pocketbase';

export async function load({ fetch }) {
  const categories = await getCategories(fetch);
  const works = await getWorks(fetch); // Fetch newest works from each category
  const owner = await getOwner(fetch, 'dwuvjtbcmpf5pz0');

  return {
    categories,
    works,
    owner
  };
}
