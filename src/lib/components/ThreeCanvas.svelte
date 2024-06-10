<script>
  import { onMount, onDestroy } from 'svelte';
  import * as THREE from 'three';
  import { createScene } from '$lib/utils/three/scene';
  import { createCamera, onWindowResize } from '$lib/utils/three/camera';
  import { createRenderer } from '$lib/utils/three/renderer';
  import { createDottedGridTexture } from '$lib/utils/three/dottedGridTexture'; // Import the texture generator
  import {
    calculateGridSize,
    createCompleteGrid,
    fillEmptySpaces,
    wrapGrid,
    cleanupGrid
  } from '$lib/utils/three/grid';
  import { animate, snapCameraToGrid, rotateCardTowardsMouse } from '$lib/utils/three/animation';

  export let works = [];
  export let categories = [];
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
    const clientX = event.clientX !== undefined ? event.clientX : event.touches[0].clientX;
    const clientY = event.clientY !== undefined ? event.clientY : event.touches[0].clientY;
    const mouseX = ((clientX - rect.left) / rect.width) * 2 - 1;
    const mouseY = -((clientY - rect.top) / rect.height) * 2 + 1;

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

  function onResize() {
    if (window.innerWidth < 768) {
      camera.position.z = 35;
      camera.zoom = 2;
    } else {
      camera.position.z = 25;
      camera.zoom = 4;
    }
    camera.updateProjectionMatrix();
  }

  onMount(() => {
    ({ gridCols, gridRows } = calculateGridSize(works));

    // Set up the scene, camera, and renderer
    scene = createScene();
    camera = createCamera();
    onResize(); // Adjust camera settings based on initial screen size
    renderer = createRenderer();
    canvasContainer.appendChild(renderer.domElement);

    const cellSize = 40; // Ensure this matches the card positioning
    const textureSize = 4000; // Texture size as provided
    const gridTexture = createDottedGridTexture(cellSize, 1, textureSize);

    // Create a plane geometry that is large enough to cover the view
    const planeSize = 20000; // Large enough to cover the view
    const backgroundMesh = new THREE.Mesh(
      new THREE.PlaneGeometry(planeSize, planeSize),
      new THREE.MeshBasicMaterial({ map: gridTexture, transparent: true })
    );

    // Ensure the texture scales correctly with the PlaneGeometry
    backgroundMesh.material.map.repeat.set(planeSize / cellSize, planeSize / cellSize);

    // @ts-ignore
    backgroundMesh.position.z = -10; // Move the grid further back
    scene.add(backgroundMesh);

    // Create the grid container
    gridContainer = new THREE.Group();
    scene.add(gridContainer);

    // Create the complete grid and fill empty spaces initially
    createCompleteGrid(
      gridContainer,
      works,
      categories,
      title,
      itemWidth,
      itemHeight,
      padding,
      (work) => {
        const category = work.expand?.category?.title || 'No Category';
        console.log('Category:', category);
      },
      renderer, // Pass renderer
      camera    // Pass camera
    );
    fillEmptySpaces(gridContainer, works, itemWidth, itemHeight, padding, renderer, camera);

    // Initial card rotation
    const initialMousePosition = new THREE.Vector3(0, 0, 0);
    mouse.set(initialMousePosition.x, initialMousePosition.y);
    gridContainer.children.forEach((child) => {
      rotateCardTowardsMouse(child, mouse, camera, maxRotation);
    });

    // Ensure wrap-around grids are generated
    wrapGrid(gridContainer, camera, gridCols, gridRows, itemWidth, itemHeight, padding);
    cleanupGrid(gridContainer, camera);

    // Event listeners for dragging (mouse and touch)
    const startDrag = (e) => {
      dragging = true;
      startX = e.clientX !== undefined ? e.clientX : e.touches[0].clientX;
      startY = e.clientY !== undefined ? e.clientY : e.touches[0].clientY;
    };

    const moveDrag = (e) => {
      const mousePosition = getMousePositionInScene(e);
      mouse.set(mousePosition.x, mousePosition.y);

      if (dragging) {
        const dx = ((e.clientX !== undefined ? e.clientX : e.touches[0].clientX) - startX) / 500; // Slow down the movement
        const dy = -((e.clientY !== undefined ? e.clientY : e.touches[0].clientY) - startY) / 200; // Slow down the movement
        camera.position.x -= dx * camera.zoom;
        camera.position.y -= dy * camera.zoom;
        wrapGrid(gridContainer, camera, gridCols, gridRows, itemWidth, itemHeight, padding);
        cleanupGrid(gridContainer, camera);
        startX = e.clientX !== undefined ? e.clientX : e.touches[0].clientX;
        startY = e.clientY !== undefined ? e.clientY : e.touches[0].clientY;
      }

      gridContainer.children.forEach((child) => {
        rotateCardTowardsMouse(child, mouse, camera, maxRotation);
      });
    };

    const endDrag = () => {
      dragging = false;
      snapCameraToGrid(camera, itemWidth, itemHeight, padding);
    };

    renderer.domElement.addEventListener('mousedown', startDrag);
    renderer.domElement.addEventListener('mousemove', moveDrag);
    renderer.domElement.addEventListener('mouseup', endDrag);
    renderer.domElement.addEventListener('mouseleave', endDrag);

    // Touch events for mobile
    renderer.domElement.addEventListener('touchstart', startDrag);
    renderer.domElement.addEventListener('touchmove', moveDrag);
    renderer.domElement.addEventListener('touchend', endDrag);
    renderer.domElement.addEventListener('touchcancel', endDrag);

    animate(renderer, scene, camera);

    window.addEventListener('resize', () => {
      onWindowResize(camera, renderer);
      onResize();
    });

    // Cleanup function on unmount
    return () => {
      window.removeEventListener('resize', () => {
        onWindowResize(camera, renderer);
        onResize();
      });
      if (renderer) renderer.dispose();
      if (gridContainer) {
        gridContainer.children.forEach((child) => {
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
      gridContainer.children.forEach((child) => {
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
