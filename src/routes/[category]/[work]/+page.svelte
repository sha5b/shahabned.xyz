<!-- src/routes/[category]/[work]/+page.svelte -->
<script>
  export let data;
  const { work, categories } = data;
</script>

{#if work}
  <div class="work-details">
      <h1>{work.title}</h1>
      <p>{work.synopsis}</p>
      <!-- Display other details of the work as needed -->
      {#if work.thump}
          <img src={work.thump} alt={work.title} />
      {/if}
  </div>
{:else}
  <p>Loading work details...</p>
{/if}

<style>
  .work-details {
      /* Add your styles here */
  }
</style>
