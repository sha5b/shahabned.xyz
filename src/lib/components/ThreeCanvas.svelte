<script>
    import { onMount, onDestroy } from 'svelte';
    import * as THREE from 'three';
    import { createScene, createCamera, createRenderer, addCard, getSpiralPositions } from '$lib/utils/threeUtils';
  
    export let works = [];
    export let owner;
  
    let scene, camera, renderer;
    let gridContainer;
    let canvasContainer;
  
    const itemWidth = 2; // Width of the card
    const itemHeight = 3; // Height of the card
    const padding = 0.5;
    let dragging = false;
    let startX, startY;
  
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
        const positions = getSpiralPositions(index, itemWidth, itemHeight, padding);
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
        snapToGrid();
      });
  
      renderer.domElement.addEventListener('mouseleave', () => {
        dragging = false;
        snapToGrid();
      });
  
      renderer.domElement.addEventListener('wheel', (e) => {
        e.preventDefault();
        camera.zoom += e.deltaY * -0.01;
        camera.zoom = Math.min(Math.max(0.5, camera.zoom), 4);
        camera.updateProjectionMatrix();
      });
  
      function snapToGrid() {
        // Calculate nearest grid position and snap the container
        const targetX = Math.round(gridContainer.position.x / (itemWidth + padding)) * (itemWidth + padding);
        const targetY = Math.round(gridContainer.position.y / (itemHeight + padding)) * (itemHeight + padding);
        gridContainer.position.x = targetX;
        gridContainer.position.y = targetY;
      }
  
      function animate() {
        requestAnimationFrame(animate);
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
  