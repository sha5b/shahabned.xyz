<script>
  import { onMount } from 'svelte';
  import { getWorkById } from '$lib/services/pocketbase';

  export let work = {};
  export let params;

  onMount(async () => {
      const workId = params.work;
      work = await getWorkById(fetch, workId);
  });
</script>

<div>
  <h1>{work.title}</h1>
  <p>{work.description}</p>
</div>

<style>
  div {
      width: 100%;
      height: 100%;
  }
</style>
