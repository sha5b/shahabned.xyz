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
        cleanupGrid
    } from '$lib/utils/three/grid';
    import { animate, rotateCardTowardsMouse } from '$lib/utils/three/animation';
    import { addEventListeners, removeEventListeners } from '$lib/utils/three/eventHandlers';

    export let works = [];
    export let categories = [];
    export let title;

    let scene, camera, renderer;
    let gridContainer;
    let canvasContainer;
    let loading = true;

    const itemWidth = 3;
    const itemHeight = 4.5;
    const padding = 0.5;
    let gridCols, gridRows;

    const maxRotation = Math.PI;
    let mouse = new THREE.Vector2();

    function onResize() {
        const aspect = window.innerWidth / window.innerHeight;
        camera.aspect = aspect;
        camera.updateProjectionMatrix();
        if (renderer) {
            renderer.setSize(window.innerWidth, window.innerHeight);
        }
    }

    onMount(() => {
        ({ gridCols, gridRows } = calculateGridSize(works));

        scene = createScene(); // Initialize the scene using createScene
        camera = createCamera();
        camera.position.z = 25; // Set a fixed position for the camera
        camera.zoom = 4; // Set a fixed zoom level for all devices
        renderer = createRenderer(); // Initialize the renderer
        onResize(); // Ensure renderer is resized after initialization
        canvasContainer.appendChild(renderer.domElement);

        const cellSize = 40;
        const textureSize = 4000;
        const gridTexture = createDottedGridTexture(cellSize, 1, textureSize);

        // Immediately display the dotted grid texture
        const planeSize = 20000;
        const backgroundMesh = new THREE.Mesh(
            new THREE.PlaneGeometry(planeSize, planeSize),
            new THREE.MeshBasicMaterial({ map: gridTexture, transparent: true })
        );

        backgroundMesh.material.map.repeat.set(planeSize / cellSize, planeSize / cellSize);
        backgroundMesh.position.z = -10;
        scene.add(backgroundMesh);

        renderer.render(scene, camera); // Render the scene with the grid texture first

        // Display spinner
        const spinner = document.createElement('div');
        spinner.className = 'spinner';
        document.body.appendChild(spinner);

        // Load the grid and other components
        setTimeout(() => {
            gridContainer = new THREE.Group();
            scene.add(gridContainer);

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
                }
            );

            const initialMousePosition = new THREE.Vector3(0, 0, 0);
            mouse.set(initialMousePosition.x, initialMousePosition.y);
            gridContainer.children.forEach((child) => {
                rotateCardTowardsMouse(child, mouse, camera, maxRotation);
            });

            wrapGrid(gridContainer, camera, gridCols, gridRows, itemWidth, itemHeight, padding);
            cleanupGrid(gridContainer, camera);

            addEventListeners(renderer, camera, gridContainer, gridCols, gridRows, itemWidth, itemHeight, padding, maxRotation, mouse);
            animate(renderer, scene, camera);

            window.addEventListener('resize', () => {
                onWindowResize(camera, renderer);
                onResize();
            });

            // Remove spinner when loading is done
            loading = false;
            document.body.removeChild(spinner);
        }, 1000); // Simulate delay for demonstration, adjust as needed

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
    });
</script>

<div bind:this={canvasContainer}></div>

<style>
    div {
        width: 100%;
        height: 100%;
    }
</style>
