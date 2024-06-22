<!-- src/routes/[category]/[title]/+page.svelte -->
<script>
	export let data;
	const { title, work, categories, pageType } = data;
	import ThreeCanvas from '$lib/components/ThreeCanvas.svelte';
  </script>
  
  <main>
	<ThreeCanvas {work} {categories} {title} {pageType} />
  </main>
  
  <style>
	.work-details {
	  /* Add your styles here */
	}
  </style>
  