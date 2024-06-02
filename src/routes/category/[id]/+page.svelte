<script>
    export let data;
    const { category, works } = data;
    import Grid from '$lib/components/Grid.svelte';
  </script>
  
  <main>
    <h1>Category: {category.title}</h1>
    <Grid {works} />
  </main>
  
  <style>
    main {
      padding: 1rem;
    }
  </style>
  