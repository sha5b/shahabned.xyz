<script>
  export let title;
  export let description;
  export let imageUrl;
</script>

<div class="card">
  <img src={imageUrl} alt={title} />
  <h3>{title}</h3>
  <p>{description}</p>
</div>

<style>
  .card {
    width: 400px; /* Double the size */
    height: 600px; /* Double the size */
    background-color: rgba(102, 204, 255, 0.8);
    border: 1px solid #ccc;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    text-align: center;
    color: white;
    padding: 1rem;
    box-sizing: border-box;
  }
  .card img {
    max-width: 100%;
    height: auto;
  }
  .card h3 {
    font-size: 2rem;
    margin: 0.5rem 0;
  }
  .card p {
    font-size: 1.2rem;
  }
</style>
