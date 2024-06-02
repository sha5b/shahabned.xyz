<script>
    export let works = [];
  
    import WorkCard from '$lib/components/WorkCard.svelte';
  
    let dragging = false;
    let startX, startY, scrollLeft, scrollTop;
    let gridRef;
  
    function onMouseDown(e) {
      dragging = true;
      startX = e.pageX - gridRef.scrollLeft;
      startY = e.pageY - gridRef.scrollTop;
      scrollLeft = gridRef.scrollLeft;
      scrollTop = gridRef.scrollTop;
      document.body.style.userSelect = 'none'; // Prevent text selection
    }
  
    function onMouseMove(e) {
      if (!dragging) return;
      const x = e.pageX - startX;
      const y = e.pageY - startY;
      gridRef.scrollLeft = scrollLeft - x;
      gridRef.scrollTop = scrollTop - y;
    }
  
    function onMouseUp() {
      dragging = false;
      document.body.style.userSelect = ''; // Enable text selection back
    }
  </script>
  
  <div
    bind:this={gridRef}
    on:mousedown={onMouseDown}
    on:mousemove={onMouseMove}
    on:mouseup={onMouseUp}
    on:mouseleave={onMouseUp}
    class="grid-container"
  >
    {#each works as work (work.id)}
      <WorkCard {work} />
    {/each}
  </div>
  
  <style>
    .grid-container {
      display: grid;
      grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
      gap: 1rem;
      cursor: grab;
      overflow: auto;
      height: 100vh;
      user-select: none; /* Prevent text selection in the grid */
    }
  </style>
  