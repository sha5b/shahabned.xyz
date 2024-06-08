// src/routes/category/[category]/+page.js
import { getWorksByCategory } from '$lib/services/pocketbase';

export async function load({ params, fetch }) {
  const { category } = params;
  const works = await getWorksByCategory(fetch, category);
  return {
    props: {
      category,
      works
    }
  };
}
