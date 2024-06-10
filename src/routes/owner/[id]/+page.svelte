<script>
    export let data;
  
    const { owner } = data;
  </script>
  
  <main>
    <h1>{owner.name}</h1>
    <p>{owner.description}</p>
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
  </style>
  