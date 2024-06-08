<script>
  import { onMount, onDestroy } from 'svelte';
  import { goto } from '$app/navigation';
  import * as THREE from 'three';
  import {
    createScene, createCamera, createRenderer, calculateGridSize, createCompleteGrid,
    fillEmptySpaces, wrapGrid, cleanupGrid, snapCameraToGrid, animate, animateToPosition
  } from '$lib/utils/threeUtils';

  export let works = [];
  export let title;

  let scene, camera, renderer;
  let gridContainer;
  let canvasContainer;

  const itemWidth = 4;
  const itemHeight = 6;
  const padding = 1;
  let dragging = false;
  let startX, startY;
  let gridCols, gridRows;

  onMount(() => {
    ({ gridCols, gridRows } = calculateGridSize(works));

    // Set up the scene, camera, and renderer
    scene = createScene();
    camera = createCamera();
    camera.position.z = 20; // Set initial position
    camera.zoom = 4; // Start with maximum zoom
    camera.updateProjectionMatrix();

    renderer = createRenderer();
    canvasContainer.appendChild(renderer.domElement);

    // Create the grid container
    gridContainer = new THREE.Group();
    scene.add(gridContainer);

    // Create the complete grid and fill empty spaces initially
    createCompleteGrid(gridContainer, works, title, itemWidth, itemHeight, padding, (work) => {
      if (work.expand?.category?.title) {
        goto(`/category/${work.expand.category.title}`);
      }
    });
    fillEmptySpaces(gridContainer, works, itemWidth, itemHeight, padding);

    // Event listeners for dragging
    renderer.domElement.addEventListener('mousedown', (e) => {
      dragging = true;
      startX = e.clientX;
      startY = e.clientY;
    });

    renderer.domElement.addEventListener('mousemove', (e) => {
      if (!dragging) return;
      const dx = (e.clientX - startX) / 500; // Slow down the movement
      const dy = -(e.clientY - startY) / 200; // Slow down the movement
      camera.position.x -= dx * camera.zoom;
      camera.position.y -= dy * camera.zoom;
      wrapGrid(gridContainer, camera, gridCols, gridRows, itemWidth, itemHeight, padding);
      cleanupGrid(gridContainer, camera);
      startX = e.clientX;
      startY = e.clientY;
    });

    renderer.domElement.addEventListener('mouseup', () => {
      dragging = false;
      snapCameraToGrid(camera, itemWidth, itemHeight, padding);
    });

    renderer.domElement.addEventListener('mouseleave', () => {
      dragging = false;
      snapCameraToGrid(camera, itemWidth, itemHeight, padding);
    });

    animate(renderer, scene, camera);

    window.addEventListener('resize', onWindowResize);

    function onWindowResize() {
      camera.aspect = window.innerWidth / window.innerHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(window.innerWidth, window.innerHeight);
    }

    // Cleanup function on unmount
    return () => {
      window.removeEventListener('resize', onWindowResize);
      if (renderer) renderer.dispose();
      if (gridContainer) {
        gridContainer.children.forEach(child => {
          if (child.material && child.material.map) child.material.map.dispose();
          if (child.material) child.material.dispose();
          if (child.geometry) child.geometry.dispose();
        });
      }
    };
  });

  onDestroy(() => {
    if (renderer) {
      renderer.dispose();
    }

    if (gridContainer) {
      gridContainer.children.forEach(child => {
        if (child.material && child.material.map) child.material.map.dispose();
        if (child.material) child.material.dispose();
        if (child.geometry) child.geometry.dispose();
      });
    }
  });
</script>

<div bind:this={canvasContainer}></div>

<style>
  div {
    width: 100%;
    height: 100%;
  }
</style>
