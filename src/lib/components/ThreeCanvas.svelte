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

  const itemWidth = 4; // Double the size
  const itemHeight = 6; // Double the size
  const padding = 2; // Increase the gaps
  let dragging = false;
  let startX, startY;
  let endX, endY;

  onMount(() => {
    // Set up the scene, camera, and renderer
    scene = createScene();
    camera = createCamera();
    renderer = createRenderer();
    canvasContainer.appendChild(renderer.domElement);

    // Create the grid container
    gridContainer = new THREE.Group();
    scene.add(gridContainer);

    // Add owner card in the middle
    addCard(gridContainer, owner.name, owner.description, 0, 0, itemWidth, itemHeight, padding);

    // Add work cards around the owner card
    works.forEach((work, index) => {
      const positions = getGridPositions(index, itemWidth, itemHeight, padding);
      addCard(gridContainer, work.title, work.description, positions.x, positions.y, itemWidth, itemHeight, padding);
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
        .to({ zoom: Math.min(Math.max(0.5, zoom), 4) }, 500)
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
      camera.left = window.innerWidth / -100;
      camera.right = window.innerWidth / 100;
      camera.top = window.innerHeight / 100;
      camera.bottom = window.innerHeight / -100;
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
