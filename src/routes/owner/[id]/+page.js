import { getOwner } from '$lib/services/pocketbase';

export async function load({ fetch, params }) {
  const { id } = params;
  const owner = await getOwner(fetch, id);

  return {
    owner
  };
}
