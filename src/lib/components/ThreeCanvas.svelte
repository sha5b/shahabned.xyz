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

  function getGridPositions(index, centerX, centerY) {
    const positions = [
      { x: centerX, y: centerY }, // Center position for the owner card
      ...generatePositionsAround(centerX, centerY) // Positions around the center for the category cards
    ];
    return positions[index];
  }

  function generatePositionsAround(centerX, centerY) {
    const positions = [];
    let level = 1;
    while (positions.length < works.length) {
      for (let i = -level; i <= level; i++) {
        for (let j = -level; j <= level; j++) {
          if (i === 0 && j === 0) continue; // Skip the center position
          if (positions.length >= works.length) break;
          positions.push({ x: centerX + i * (itemWidth + padding), y: centerY + j * (itemHeight + padding) });
        }
      }
      level++;
    }
    return positions;
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
    const cols = Math.ceil(Math.sqrt(numCategories + 1));
    const rows = Math.ceil((numCategories + 1) / cols);

    // Calculate the center of the grid
    const centerX = Math.floor(cols / 2) * (itemWidth + padding);
    const centerY = -Math.floor(rows / 2) * (itemHeight + padding);

    // Add owner card in the middle
    addCard(gridContainer, owner.name, owner.description, centerX, centerY, itemWidth, itemHeight, padding);

    // Add work cards around the owner card
    works.forEach((work, index) => {
      const { x, y } = getGridPositions(index + 1, centerX, centerY); // +1 to account for the owner card
      addCard(gridContainer, work.title, work.description, x, y, itemWidth, itemHeight, padding);
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
