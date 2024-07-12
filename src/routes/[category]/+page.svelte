<script>
	//src/routes/[category]/+page.svelte
	export let data;
	import ThreeCanvas from '$lib/components/ThreeCanvas.svelte';

	const { title, category, works, categories, pageType, description, keywords } = data;
</script>

<svelte:head>
	<title>{description}</title>
	<meta name="description" content={description} />
	<meta name="keywords" content={keywords} />
	<meta property="og:title" content={title} />
	<meta property="og:description" content={description} />
	<meta name="twitter:card" content="summary_large_image" />
</svelte:head>

<main>
	<ThreeCanvas {works} {categories} {title} {pageType} />
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
