<script>
    export let data;
    const { categories } = data;
  </script>
  
  <main>
    <h1>Categories</h1>
    <ul>
      {#each categories as category}
        <li><a href={`/category/${category.id}`}>{category.title}</a></li>
      {/each}
    </ul>
  </main>
  
  <style>
    main {
      padding: 1rem;
    }
  </style>
  