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

  const gridCols = Math.ceil(Math.sqrt(works.length + 1));
  const gridRows = Math.ceil((works.length + 1) / gridCols);

  function createCompleteGrid() {
    for (let i = 0; i < works.length + 1; i++) {
      const { x, y } = getGridPositions(i, gridCols, itemWidth, itemHeight, padding);
      if (i === 0) {
        addCard(gridContainer, owner.name, owner.description, x, y, itemWidth, itemHeight, padding);
      } else {
        addCard(gridContainer, works[i - 1].title, works[i - 1].description, x, y, itemWidth, itemHeight, padding);
      }
    }
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
      const newZoom = camera.zoom + e.deltaY * -0.01;
      camera.zoom = newZoom;
      camera.updateProjectionMatrix();
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
