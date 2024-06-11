<script context="module">
    import { getWorkById } from '$lib/services/pocketbase';
  
    export const load = async ({ params }) => {
      const { work } = params;
      const workDetails = await getWorkById(work);
      return { work: workDetails };
    };
  </script>
  
  <script>
    export let work;
    import ThreeCanvas from '$lib/components/ThreeCanvas.svelte';
  </script>
  
  <main>
    {#if work}
      <h1>{work.title}</h1>
      <ThreeCanvas {works} />
    {/if}
  </main>
  
  <style>
    /* Your custom styles */
  </style>
  