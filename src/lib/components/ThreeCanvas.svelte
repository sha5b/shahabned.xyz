<script>
  import { onMount, onDestroy } from 'svelte';
  import * as THREE from 'three';
  import { createScene } from '$lib/utils/three/scene';
  import { createCamera } from '$lib/utils/three/camera';
  import { createRenderer } from '$lib/utils/three/renderer';
  import { createDottedGridTexture } from '$lib/utils/three/dottedGridTexture';
  import {
    calculateGridSize,
    createCompleteGrid,
    wrapGrid,
    cleanupGrid,
    createImageGrid // Ensure correct import
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
    renderer = createRenderer();
    renderer.setSize(window.innerWidth, window.innerHeight);
    canvasContainer.appendChild(renderer.domElement);
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
    ({ gridCols, gridRows } = calculateGridSize(items));
    gridContainer = new THREE.Group();
    scene.add(gridContainer);

    const currentCategory = work?.expand?.category?.title;

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
      backToCategory: () => goto(`/${currentCategory}`),
      nextCategory: (category) => console.log('Next category clicked', category),
      nextWork: (work) => console.log('Next work clicked', work),
      prevCategory: (category) => console.log('Previous category clicked', category),
      prevWork: (work) => console.log('Previous work clicked', work)
    };

    if (pageType === 'landing') {
      onClickHandlers.work = (work) => goto(`/${work.expand?.category?.title || 'No Category'}`);
    }

    // Use different function to create grid based on page type
    if (pageType === 'work') {
      createImageGrid(gridContainer, items, itemWidth, itemHeight, padding, onClickHandlers);
      // Add navigation card for going back to the category
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

  function onResize() {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    if (renderer) {
      renderer.setSize(window.innerWidth, window.innerHeight);
    }
  }

  onMount(() => {
    console.log('Mounted', { works, categories, work, pageType });

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

    window.addEventListener('resize', onResize);

    loading = false;

    return () => {
      window.removeEventListener('resize', onResize);
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
