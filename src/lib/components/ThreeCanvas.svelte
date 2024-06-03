<script>
  import { onMount, onDestroy } from 'svelte';
  import * as THREE from 'three';
  import { createScene, createCamera, createRenderer, addCard, getGridPositions } from '$lib/utils/threeUtils';
  import { Tween, Easing, update as tweenUpdate } from '@tweenjs/tween.js';

  export let works = [];
  export let owner;

  let scene, camera, renderer;
  let gridContainer;
  let canvasContainer;

  const itemWidth = 4;
  const itemHeight = 6;
  const padding = 2;
  let dragging = false;
  let startX, startY;

  const maxZoomOut = 8; // Restrict max zoom out to double the initial zoom level
  const gridCols = Math.ceil(Math.sqrt(works.length + 1));
  const gridRows = Math.ceil((works.length + 1) / gridCols);

  function generatePositionsAround(centerX, centerY, count) {
    const positions = [];
    const totalCols = Math.ceil(Math.sqrt(count));
    for (let i = 0; i < count; i++) {
      const { x, y } = getGridPositions(i, totalCols, itemWidth, itemHeight, padding);
      positions.push({ x: centerX + x, y: centerY + y });
    }
    return positions;
  }

  function createCompleteGrid() {
    const totalCards = works.length + 1;
    const positions = generatePositionsAround(0, 0, totalCards);

    addCard(gridContainer, owner.name, owner.description, positions[0].x, positions[0].y, itemWidth, itemHeight, padding);

    for (let i = 1; i < totalCards; i++) {
      addCard(gridContainer, works[i - 1].title, works[i - 1].description, positions[i].x, positions[i].y, itemWidth, itemHeight, padding);
    }
  }

  function fillEmptySpaces() {
    const bounds = new THREE.Box3().setFromObject(gridContainer);
    const width = bounds.max.x - bounds.min.x;
    const height = bounds.max.y - bounds.min.y;
    const cols = Math.ceil(width / (itemWidth + padding));
    const rows = Math.ceil(height / (itemHeight + padding));
    const totalCards = cols * rows;

    for (let i = 0; i < totalCards; i++) {
      const { x, y } = getGridPositions(i, cols, itemWidth, itemHeight, padding);
      if (!isPositionOccupied(x, y)) {
        const cardIndex = i % works.length;
        addCard(gridContainer, works[cardIndex].title, works[cardIndex].description, x, y, itemWidth, itemHeight, padding);
      }
    }
  }

  function isPositionOccupied(x, y) {
    return gridContainer.children.some(child => {
      return Math.abs(child.position.x - x) < itemWidth / 2 && Math.abs(child.position.y - y) < itemHeight / 2;
    });
  }

  function wrapGrid() {
    const wrapOffsetX = gridCols * (itemWidth + padding);
    const wrapOffsetY = gridRows * (itemHeight + padding);

    gridContainer.children.forEach(child => {
      if (child.position.x > camera.position.x + wrapOffsetX / 2) {
        child.position.x -= wrapOffsetX;
      } else if (child.position.x < camera.position.x - wrapOffsetX / 2) {
        child.position.x += wrapOffsetX;
      }

      if (child.position.y > camera.position.y + wrapOffsetY / 2) {
        child.position.y -= wrapOffsetY;
      } else if (child.position.y < camera.position.y - wrapOffsetY / 2) {
        child.position.y += wrapOffsetY;
      }
    });
  }

  onMount(() => {
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

    // Create the complete grid
    createCompleteGrid();
    fillEmptySpaces();

    renderer.domElement.addEventListener('mousedown', (e) => {
      dragging = true;
      startX = e.clientX;
      startY = e.clientY;
    });

    renderer.domElement.addEventListener('mousemove', (e) => {
      if (!dragging) return;
      const dx = (e.clientX - startX) / 200; // Slow down the movement
      const dy = -(e.clientY - startY) / 200; // Slow down the movement
      camera.position.x -= dx * camera.zoom;
      camera.position.y -= dy * camera.zoom;
      wrapGrid();
      startX = e.clientX;
      startY = e.clientY;
    });

    renderer.domElement.addEventListener('mouseup', () => {
      dragging = false;
      snapCameraToGrid();
    });

    renderer.domElement.addEventListener('mouseleave', () => {
      dragging = false;
      snapCameraToGrid();
    });

    renderer.domElement.addEventListener('wheel', (e) => {
      e.preventDefault();
      const newZoom = Math.min(Math.max(camera.zoom + e.deltaY * -0.01, 0.5), maxZoomOut); // Restrict zoom
      camera.zoom = newZoom;
      camera.updateProjectionMatrix();
      if (newZoom >= maxZoomOut) {
        fillEmptySpaces();
      }
    });

    function snapCameraToGrid() {
      const snapX = Math.round(camera.position.x / (itemWidth + padding)) * (itemWidth + padding);
      const snapY = Math.round(camera.position.y / (itemHeight + padding)) * (itemHeight + padding);
      animateToPosition(snapX, snapY);
    }

    function animateToPosition(x, y) {
      new Tween(camera.position)
        .to({ x, y }, 500)
        .easing(Easing.Quadratic.Out)
        .start();
    }

    function animate() {
      requestAnimationFrame(animate);
      tweenUpdate();
      renderer.render(scene, camera);
    }

    animate();

    window.addEventListener('resize', onWindowResize);

    function onWindowResize() {
      camera.aspect = window.innerWidth / window.innerHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(window.innerWidth, window.innerHeight);
    }

    return () => {
      window.removeEventListener('resize', onWindowResize);
      if (renderer) renderer.dispose();
    };
  });

  onDestroy(() => {
    if (renderer) renderer.dispose();
  });
</script>

<div bind:this={canvasContainer}></div>

<style>
  div {
    width: 100%;
    height: 100%;
  }
</style>
