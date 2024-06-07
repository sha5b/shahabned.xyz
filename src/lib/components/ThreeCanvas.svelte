<script>
  import { onMount, onDestroy } from 'svelte';
  import * as THREE from 'three';
  import { createScene, createCamera, createRenderer, addCard, getGridPositions } from '$lib/utils/threeUtils';
  import { Tween, Easing, update as tweenUpdate } from '@tweenjs/tween.js';

  export let works = [];
  export let owner;

  let scene, camera, renderer, gridContainer, canvasContainer;
  let dragging = false, startX, startY;
  const itemWidth = 4, itemHeight = 6, padding = 1;
  const maxZoomOut = 6;
  const gridCols = Math.ceil(Math.sqrt(works.length + 1));
  const gridRows = Math.ceil((works.length + 1) / gridCols);

  function generatePositions(count) {
    const positions = [];
    const totalCols = Math.ceil(Math.sqrt(count));
    for (let i = 0; i < count; i++) {
      const { x, y } = getGridPositions(i, totalCols, itemWidth, itemHeight, padding);
      positions.push({ x, y });
    }
    return positions;
  }

  function createCompleteGrid() {
    const totalCards = works.length + 1;
    const positions = generatePositions(totalCards);

    addCard(gridContainer, owner.name, owner.description, positions[0].x, positions[0].y, itemWidth, itemHeight);
    for (let i = 1; i < totalCards; i++) {
      const work = works[i - 1];
      const description = work.expand?.category?.title || 'No Category';
      addCard(gridContainer, work.title, description, positions[i].x, positions[i].y, itemWidth, itemHeight);
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
        const work = works[i % works.length];
        const description = work.expand?.category?.title || 'No Category';
        addCard(gridContainer, work.title, description, x, y, itemWidth, itemHeight);
      }
    }
  }

  function isPositionOccupied(x, y) {
    return gridContainer.children.some(child => 
      Math.abs(child.position.x - x) < itemWidth / 2 && Math.abs(child.position.y - y) < itemHeight / 2
    );
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

  function cleanupGrid() {
    const bounds = new THREE.Box3(
      new THREE.Vector3(camera.position.x - 50, camera.position.y - 50, -1),
      new THREE.Vector3(camera.position.x + 50, camera.position.y + 50, 1)
    );

    for (let i = gridContainer.children.length - 1; i >= 0; i--) {
      const child = gridContainer.children[i];
      if (!bounds.containsPoint(child.position)) {
        gridContainer.remove(child);
      }
    }
  }

  onMount(() => {
    scene = createScene();
    camera = createCamera();
    camera.position.z = 20;
    camera.zoom = 4;
    camera.updateProjectionMatrix();

    renderer = createRenderer();
    canvasContainer.appendChild(renderer.domElement);

    gridContainer = new THREE.Group();
    scene.add(gridContainer);

    createCompleteGrid();
    fillEmptySpaces();

    const handleMouseDown = (e) => {
      dragging = true;
      startX = e.clientX;
      startY = e.clientY;
    };

    const handleMouseMove = (e) => {
      if (!dragging) return;
      const dx = (e.clientX - startX) / 500;
      const dy = -(e.clientY - startY) / 200;
      camera.position.x -= dx * camera.zoom;
      camera.position.y -= dy * camera.zoom;
      wrapGrid();
      cleanupGrid();
      startX = e.clientX;
      startY = e.clientY;
    };

    const handleMouseUpOrLeave = () => {
      dragging = false;
      snapCameraToGrid();
    };

    renderer.domElement.addEventListener('mousedown', handleMouseDown);
    renderer.domElement.addEventListener('mousemove', handleMouseMove);
    renderer.domElement.addEventListener('mouseup', handleMouseUpOrLeave);
    renderer.domElement.addEventListener('mouseleave', handleMouseUpOrLeave);

    const snapCameraToGrid = () => {
      const snapX = Math.round(camera.position.x / (itemWidth + padding)) * (itemWidth + padding);
      const snapY = Math.round(camera.position.y / (itemHeight + padding)) * (itemHeight + padding);
      animateToPosition(snapX, snapY);
    };

    const animateToPosition = (x, y) => {
      new Tween(camera.position)
        .to({ x, y }, 500)
        .easing(Easing.Quadratic.Out)
        .start();
    };

    const animate = () => {
      requestAnimationFrame(animate);
      tweenUpdate();
      renderer.render(scene, camera);
    };

    animate();

    const onWindowResize = () => {
      camera.aspect = window.innerWidth / window.innerHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(window.innerWidth, window.innerHeight);
    };

    window.addEventListener('resize', onWindowResize);

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
