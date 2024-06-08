<script>
  import { onMount, onDestroy } from 'svelte';
  import { goto } from '$app/navigation';
  import * as THREE from 'three';
  import { createScene } from '$lib/utils/three/scene';
  import { createCamera, onWindowResize } from '$lib/utils/three/camera';
  import { createRenderer } from '$lib/utils/three/renderer';
  import {
    calculateGridSize, createCompleteGrid, fillEmptySpaces, wrapGrid, cleanupGrid
  } from '$lib/utils/three/grid';
  import { animate, snapCameraToGrid, rotateCardTowardsMouse } from '$lib/utils/three/animation';

  export let works = [];
  export let title;

  let scene, camera, renderer;
  let gridContainer;
  let canvasContainer;
  let dragging = false;
  let startX, startY;
  let mouse = new THREE.Vector2();

  const itemWidth = 4;
  const itemHeight = 6;
  const padding = 1;
  let gridCols, gridRows;

  const maxRotation = Math.PI / 3; // 60 degrees in radians

  function getMousePositionInScene(event) {
    const rect = renderer.domElement.getBoundingClientRect();
    const mouseX = ((event.clientX - rect.left) / rect.width) * 2 - 1;
    const mouseY = -((event.clientY - rect.top) / rect.height) * 2 + 1;

    // Create a vector in 3D space using the mouse coordinates
    const mouseVector = new THREE.Vector3(mouseX, mouseY, 0.5);

    // Unproject the vector from the camera to get the correct 3D position
    mouseVector.unproject(camera);

    // Calculate the direction from the camera to the mouse position
    const dir = mouseVector.sub(camera.position).normalize();

    // Set a distance from the camera
    const distance = -camera.position.z / dir.z;

    // Get the mouse position in 3D space
    const mousePosition = camera.position.clone().add(dir.multiplyScalar(distance));
    
    return mousePosition;
  }

  onMount(() => {
    ({ gridCols, gridRows } = calculateGridSize(works));

    // Set up the scene, camera, and renderer
    scene = createScene();
    camera = createCamera();
    camera.position.z = 25; // Adjusted position to zoom out less
    camera.zoom = 4; // Adjusted zoom level to zoom out less
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

    // Initial card rotation
    const initialMousePosition = new THREE.Vector3(0, 0, 0);
    mouse.set(initialMousePosition.x, initialMousePosition.y);
    gridContainer.children.forEach(child => {
      rotateCardTowardsMouse(child, mouse, camera, maxRotation);
    });

    // Ensure wrap-around grids are generated
    wrapGrid(gridContainer, camera, gridCols, gridRows, itemWidth, itemHeight, padding);
    cleanupGrid(gridContainer, camera);

    // Event listeners for dragging
    renderer.domElement.addEventListener('mousedown', (e) => {
      dragging = true;
      startX = e.clientX;
      startY = e.clientY;
    });

    renderer.domElement.addEventListener('mousemove', (e) => {
      const mousePosition = getMousePositionInScene(e);
      mouse.set(mousePosition.x, mousePosition.y);

      if (dragging) {
        const dx = (e.clientX - startX) / 500; // Slow down the movement
        const dy = -(e.clientY - startY) / 200; // Slow down the movement
        camera.position.x -= dx * camera.zoom;
        camera.position.y -= dy * camera.zoom;
        wrapGrid(gridContainer, camera, gridCols, gridRows, itemWidth, itemHeight, padding);
        cleanupGrid(gridContainer, camera);
        startX = e.clientX;
        startY = e.clientY;
      }

      gridContainer.children.forEach(child => {
        rotateCardTowardsMouse(child, mouse, camera, maxRotation);
      });
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

    window.addEventListener('resize', () => onWindowResize(camera, renderer));

    // Cleanup function on unmount
    return () => {
      window.removeEventListener('resize', () => onWindowResize(camera, renderer));
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
