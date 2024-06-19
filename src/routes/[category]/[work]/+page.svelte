<!-- src/routes/[category]/[work]/+page.svelte -->
<script>
	export let data;
	const { work, categories } = data;
	import ThreeCanvas from '$lib/components/ThreeCanvas.svelte';
</script>

<main>
	<ThreeCanvas {work} {categories} pageType="work" />
</main>

<style>
	.work-details {
		/* Add your styles here */
	}
</style>
