<script>
	//src/routes/[category]/[title]/+page.svelte
	export let data;
	const { title, work, works, categories, pageType } = data;
	import ThreeCanvas from '$lib/components/ThreeCanvas.svelte';
  </script>
  
  <main>
	<ThreeCanvas {work} {works} {categories} {title} {pageType} />
  </main>
  
