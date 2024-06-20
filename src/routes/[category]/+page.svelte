<script>
  export let data;
  import ThreeCanvas from '$lib/components/ThreeCanvas.svelte';

  const { category, works, categories, pageType } = data;
</script>

<main>
  <ThreeCanvas {works} {categories} {pageType}/>
</main>

<style>
  main {
    margin: 0;
    padding: 0;
    width: 100%;
    height: 100%;
    display: flex;
    flex-direction: column;
    align-items: center;
  }

  h1 {
    margin-top: 1rem;
    margin-bottom: 2rem;
  }
</style>
