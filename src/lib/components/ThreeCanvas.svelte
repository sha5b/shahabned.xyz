<script>
  import { onMount, onDestroy } from 'svelte';
  import * as THREE from 'three';
  import { createScene } from '$lib/utils/three/scene';
  import { createCamera, onWindowResize } from '$lib/utils/three/camera';
  import { createRenderer } from '$lib/utils/three/renderer';
  import { createDottedGridTexture } from '$lib/utils/three/dottedGridTexture';
  import {
    calculateGridSize,
    createCompleteGrid,
    wrapGrid,
    cleanupGrid,
    createImageGrid
  } from '$lib/utils/three/grid';
  import { animate, rotateCardTowardsMouse } from '$lib/utils/three/animation';
  import { addEventListeners, removeEventListeners } from '$lib/utils/three/eventHandlers';
  import { goto } from '$app/navigation';

  export let works = [];
  export let categories = [];
  export let work = null;
  export let title = '';
  export let pageType = 'landing';

  let scene, camera, renderer;
  let gridContainer;
  let canvasContainer;
  let loading = true;
  let lastClickTime = 0;

  const itemWidth = 3;
  const itemHeight = 4.5;
  const padding = 0.5;
  let gridCols, gridRows;

  const maxRotation = Math.PI;
  let mouse = new THREE.Vector2();

  function initializeRenderer() {
    if (!renderer) {
      renderer = createRenderer();
      renderer.setSize(window.innerWidth, window.innerHeight);
      if (canvasContainer) {
        canvasContainer.appendChild(renderer.domElement);
      } else {
        console.error('canvasContainer is not defined');
      }
    }
  }

  function initializeBackground() {
    const cellSize = 40;
    const textureSize = 4000;
    const gridTexture = createDottedGridTexture(cellSize, 1, textureSize);
    const planeSize = 20000;
    const backgroundMesh = new THREE.Mesh(
      new THREE.PlaneGeometry(planeSize, planeSize),
      new THREE.MeshBasicMaterial({ map: gridTexture, transparent: true })
    );

    backgroundMesh.material.map.repeat.set(planeSize / cellSize, planeSize / cellSize);
    backgroundMesh.position.z = -10;
    scene.add(backgroundMesh);
  }

  function initializeGrid(items, categories, title, pageType) {
    if (!scene) return;

    ({ gridCols, gridRows } = calculateGridSize(items));
    gridContainer = new THREE.Group();
    scene.add(gridContainer);

    const currentCategoryIndex = categories.findIndex(cat => cat.title === title);
    const currentCategory = categories[currentCategoryIndex];

    const onClickHandlers = {
      work: (work) => {
        if (pageType === 'work') {
          console.log('Work card clicked:', work);
        } else {
          goto(`/${work.expand?.category?.title || 'No Category'}/${work.title}`);
        }
      },
      category: (category) => goto(`/${category.title}`),
      nextPage: () => console.log('Next Page Clicked'),
      backToLanding: () => goto('/'),
      backToCategory: () => goto(`/${currentCategory.title}`),
      nextCategory: () => {
        const nextCategoryIndex = (currentCategoryIndex + 1) % categories.length;
        const nextCategory = categories[nextCategoryIndex];
        window.location.href = `/${nextCategory.title}`;
      },
      prevCategory: () => {
        const prevCategoryIndex = (currentCategoryIndex - 1 + categories.length) % categories.length;
        const prevCategory = categories[prevCategoryIndex];
        window.location.href = `/${prevCategory.title}`;
      }
    };

    if (pageType === 'landing') {
      onClickHandlers.work = (work) => goto(`/${work.expand?.category?.title || 'No Category'}`);
    }

    if (pageType === 'category') {
      const currentIndex = categories.findIndex(cat => cat.title === title);
      const nextCategory = categories[(currentIndex + 1) % categories.length];
      const prevCategory = categories[(currentIndex - 1 + categories.length) % categories.length];

      onClickHandlers.nextCategory = () => window.location.href = `/${nextCategory.title}`;
      onClickHandlers.prevCategory = () => window.location.href = `/${prevCategory.title}`;
    }

    if (pageType === 'work') {
      createImageGrid(gridContainer, items, itemWidth, itemHeight, padding, onClickHandlers);
      const backToCategoryCard = new THREE.Group();
      gridContainer.add(backToCategoryCard);
      const cardMesh = new THREE.Mesh(new THREE.PlaneGeometry(itemWidth, itemHeight), new THREE.MeshBasicMaterial({ color: 0xffffff }));
      cardMesh.position.set(0, 0, 0);
      cardMesh.callback = onClickHandlers.backToCategory;
      backToCategoryCard.add(cardMesh);
    } else {
      createCompleteGrid(gridContainer, items, categories, title, itemWidth, itemHeight, padding, onClickHandlers, 5, 5, pageType);
    }

    const initialMousePosition = new THREE.Vector3(0, 0, 0);
    mouse.set(initialMousePosition.x, initialMousePosition.y);
    gridContainer.children.forEach((child) => rotateCardTowardsMouse(child, mouse, camera, maxRotation));

    wrapGrid(gridContainer, camera, gridCols, gridRows, itemWidth, itemHeight, padding);
    cleanupGrid(gridContainer, camera);

    loading = false;  // Mark loading as false after grid is initialized
  }

  function resetScene() {
    if (gridContainer) {
      gridContainer.children.forEach((child) => {
        if (child.material && child.material.map) child.material.map.dispose();
        if (child.material) child.material.dispose();
        if (child.geometry) child.geometry.dispose();
      });
      scene.remove(gridContainer);
      gridContainer = null;
    }
    initializeGrid(works, categories, title, pageType);
  }

  $: if (pageType && categories.length && works.length) {
    resetScene();
  }

  onMount(() => {
    let items = works;
    if (pageType === 'work' && work) {
      items = [{ id: work.id, thump: work.thump }, ...work.gallery.map((item) => ({ id: work.id, thump: item }))];
    }

    scene = createScene();
    camera = createCamera();
    camera.position.z = 25;
    camera.zoom = 4;
    camera.updateProjectionMatrix();

    initializeRenderer();
    initializeBackground();
    initializeGrid(items, categories, title, pageType);

    addEventListeners(renderer, camera, gridContainer, gridCols, gridRows, itemWidth, itemHeight, padding, maxRotation, mouse, loading);
    animate(renderer, scene, camera);

    window.addEventListener('resize', () => onWindowResize(camera, renderer));

    return () => {
      window.removeEventListener('resize', () => onWindowResize(camera, renderer));
      removeEventListeners(renderer);
      if (renderer) renderer.dispose();
      if (gridContainer) {
        gridContainer.children.forEach((child) => {
          if (child.material && child.material.map) child.material.map.dispose();
          if (child.material) child.material.dispose();
          if (child.geometry) child.geometry.dispose();
        });
      }
      if (scene) {
        scene.traverse(object => {
          if (object.geometry) object.geometry.dispose();
          if (object.material) {
            if (object.material.map) object.material.map.dispose();
            object.material.dispose();
          }
        });
      }
    };
  });

  onDestroy(() => {
    if (renderer) {
      removeEventListeners(renderer);
      renderer.dispose();
    }
    if (gridContainer) {
      gridContainer.children.forEach((child) => {
        if (child.material && child.material.map) child.material.map.dispose();
        if (child.material) child.material.dispose();
        if (child.geometry) child.geometry.dispose();
      });
    }
    if (scene) {
      scene.traverse(object => {
        if (object.geometry) object.geometry.dispose();
        if (object.material) {
          if (object.material.map) object.material.map.dispose();
          object.material.dispose();
        }
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
