<script>
  import { onMount, onDestroy } from 'svelte';
  import * as THREE from 'three';
  import { createScene, createCamera, createRenderer, addCard } from '$lib/utils/threeUtils';
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
  let endX, endY;

  function getGridPositions(index, cols) {
    const row = Math.floor(index / cols);
    const col = index % cols;
    const x = col * (itemWidth + padding);
    const y = -row * (itemHeight + padding);
    return { x, y };
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

    // Determine grid dimensions
    const numCategories = works.length;
    const cols = Math.ceil(Math.sqrt(numCategories));
    const rows = Math.ceil(numCategories / cols);

    // Add owner card in the middle
    const ownerX = Math.floor(cols / 2) * (itemWidth + padding);
    const ownerY = -Math.floor(rows / 2) * (itemHeight + padding);
    addCard(gridContainer, owner.name, owner.description, ownerX, ownerY, itemWidth, itemHeight, padding);

    // Add work cards around the owner card
    works.forEach((work, index) => {
      const { x, y } = getGridPositions(index, cols);
      addCard(gridContainer, work.title, work.description, x - ownerX, y - ownerY, itemWidth, itemHeight, padding);
    });

    renderer.domElement.addEventListener('mousedown', (e) => {
      dragging = true;
      startX = e.clientX;
      startY = e.clientY;
    });

    renderer.domElement.addEventListener('mousemove', (e) => {
      if (!dragging) return;
      const dx = (e.clientX - startX) / 100;
      const dy = -(e.clientY - startY) / 100;
      gridContainer.position.x += dx;
      gridContainer.position.y += dy;
      startX = e.clientX;
      startY = e.clientY;
    });

    renderer.domElement.addEventListener('mouseup', () => {
      dragging = false;
      endX = Math.round(gridContainer.position.x / (itemWidth + padding)) * (itemWidth + padding);
      endY = Math.round(gridContainer.position.y / (itemHeight + padding)) * (itemHeight + padding);
      animateToPosition(endX, endY);
    });

    renderer.domElement.addEventListener('mouseleave', () => {
      dragging = false;
      endX = Math.round(gridContainer.position.x / (itemWidth + padding)) * (itemWidth + padding);
      endY = Math.round(gridContainer.position.y / (itemHeight + padding)) * (itemHeight + padding);
      animateToPosition(endX, endY);
    });

    renderer.domElement.addEventListener('wheel', (e) => {
      e.preventDefault();
      const newZoom = camera.zoom + e.deltaY * -0.01;
      animateZoom(newZoom);
    });

    function animateToPosition(x, y) {
      new Tween(gridContainer.position)
        .to({ x, y }, 500)
        .easing(Easing.Quadratic.Out)
        .start();
    }

    function animateZoom(zoom) {
      new Tween(camera)
        .to({ zoom: Math.min(Math.max(0.5, zoom), 4) }, 500) // Max zoom is 4
        .easing(Easing.Quadratic.Out)
        .onUpdate(() => camera.updateProjectionMatrix())
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
