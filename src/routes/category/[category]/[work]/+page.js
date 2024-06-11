import { getWorkById } from '$lib/services/pocketbase';

export async function load({ params, fetch }) {
  const { work } = params;
  const workDetails = await getWorkById(fetch, work);

  return {
    work: workDetails
  };
}
