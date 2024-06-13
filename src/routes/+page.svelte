<script>
  export let data;
  import ThreeCanvas from '$lib/components/ThreeCanvas.svelte';

  const { works, owner, categories } = data;
</script>

<main>
  <ThreeCanvas {works} {categories} pageType="landing"/>
</main>

<style>
  main {
    margin: 0;
    padding: 0;
    width: 100%;
    height: 100%;
    display: flex;
    justify-content: center;
    align-items: center;
    overflow: hidden; /* Prevents scrollbars */
  }
</style>
