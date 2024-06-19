<script lang="ts">
  import { goto } from '$app/navigation';

  export let data;

  // Assign data to local variables
  let { works, categories, category } = data;

  // Log data to verify
  console.log("Works:", works);
  console.log("Categories:", categories);
  console.log("Category:", category);
</script>

<main>
  <h1>Category: {category}</h1>
  <section>
    <h2>Works</h2>
    {#if works.length > 0}
      {#each works as work}
        <div on:click={() => goto(`/${category}/${encodeURIComponent(work.title)}`)}>
          <h3>{work.title}</h3>
        </div>
      {/each}
    {:else}
      <p>No works available.</p>
    {/if}
  </section>
  <section>
    <h2>Categories</h2>
    {#if categories.length > 0}
      {#each categories as category}
        <div on:click={() => goto(`/${encodeURIComponent(category.title)}`)}>
          <h3>{category.title}</h3>
        </div>
      {/each}
    {:else}
      <p>No categories available.</p>
    {/if}
  </section>
</main>
