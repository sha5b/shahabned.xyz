<script>
	//src/routes/[category]/[title]/+page.svelte
	export let data;
	const { title, work, works, categories, pageType, description, keywords } = data;
	import ThreeCanvas from '$lib/components/ThreeCanvas.svelte';
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
	<ThreeCanvas {work} {works} {categories} {title} {pageType} />
</main>
