<!-- src/routes/[category]/[title]/+page.svelte -->
<script>
	export let data;
	const { title, work, categories, worksInCategory, pageType } = data;
	import ThreeCanvas from '$lib/components/ThreeCanvas.svelte';
  </script>
  
  <main>
	<ThreeCanvas {work} {categories} {title} {worksInCategory} {pageType} />
  </main>
  
  <style>
	.work-details {
	  /* Add your styles here */
	}
  </style>
  