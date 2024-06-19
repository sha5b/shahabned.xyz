// src/routes/[category]/[work]/+page.js
import { getWorkById, getCategories } from '$lib/services/pocketbase';

export async function load({ params, fetch }) {
    const { work } = params; // The work ID from the URL
    try {
        const workDetails = await getWorkById(fetch, work); // Fetch details of the clicked work
        const categories = await getCategories(fetch);
        return {
            work: workDetails,
            categories
        };
    } catch (error) {
        console.error('Error fetching work:', error);
        return {
            status: 404,
            error: new Error('Work not found')
        };
    }
}
