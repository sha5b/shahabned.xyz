<script>
  export let data;
  import ThreeCanvas from '$lib/components/ThreeCanvas.svelte';

  const { works, owner } = data;
</script>

<main>
  <ThreeCanvas works={data.works} owner={data.owner} />
</main>

<style>
  main {
    padding: 0rem;
  }
</style>
