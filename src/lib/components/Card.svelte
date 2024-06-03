<script>
  export let title;
  export let description;
</script>

<div class="card">
  <h3>{title}</h3>
  <p>{description}</p>
</div>

<style>
  .card {
    width: 100%;
    height: 100%;
    background: white;
    border: 1px solid #ccc;
    padding: 1em;
    box-sizing: border-box;
  }
</style>
