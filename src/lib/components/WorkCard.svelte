<script>
    export let work;
    import { getImageURL } from '$lib/utils/getURL.js';
  
    const imageURL = getImageURL(work.collectionId, work.id, work.thump);
  </script>
  
  <div class="work-card">
    <img src={imageURL} alt={work.title} />
    <h3>{work.title}</h3>
  </div>
  
  <style>
    .work-card {
      border: 1px solid #ccc;
      padding: 1rem;
      text-align: center;
      background-color: white;
    }
    .work-card img {
      width: 100%;
      height: auto;
    }
  </style>
  