<script>
  import ThreeCanvas from '$lib/components/ThreeCanvas.svelte';

  export let category;
  export let works;

  let title = `Category: ${category}`;
</script>

<h1>{title}</h1>
<ThreeCanvas {works} {title} />
