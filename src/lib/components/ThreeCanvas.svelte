<script>
    import { onMount, onDestroy } from 'svelte';
    import * as THREE from 'three';
    import { createScene } from '$lib/utils/three/scene'; // Ensure this path is correct
    import { createCamera, onWindowResize } from '$lib/utils/three/camera';
    import { createRenderer } from '$lib/utils/three/renderer';
    import { createDottedGridTexture } from '$lib/utils/three/dottedGridTexture';
    import {
        calculateGridSize,
        createCompleteGrid,
        wrapGrid,
        cleanupGrid
    } from '$lib/utils/three/grid';
    import { animate, snapCameraToGrid, rotateCardTowardsMouse } from '$lib/utils/three/animation';

    export let works = [];
    export let categories = [];
    export let title;

    let scene, camera, renderer;
    let gridContainer;
    let canvasContainer;
    let dragging = false;
    let startX, startY;
    let mouse = new THREE.Vector2();
    let moved = false;

    // Updated dimensions for smaller cards
    const itemWidth = 3; // Previously 4
    const itemHeight = 4.5; // Previously 6
    const padding = .5;
    let gridCols, gridRows;

    const maxRotation = Math.PI; // More extreme rotation

    function getMousePositionInScene(event) {
        const rect = renderer.domElement.getBoundingClientRect();
        const clientX = event.clientX !== undefined ? event.clientX : event.touches[0].clientX;
        const clientY = event.clientY !== undefined ? event.clientY : event.touches[0].clientY;
        const mouseX = ((clientX - rect.left) / rect.width) * 2 - 1;
        const mouseY = -((clientY - rect.top) / rect.height) * 2 + 1;

        const mouseVector = new THREE.Vector3(mouseX, mouseY, 0.5);
        mouseVector.unproject(camera);
        const dir = mouseVector.sub(camera.position).normalize();
        const distance = -camera.position.z / dir.z;
        const mousePosition = camera.position.clone().add(dir.multiplyScalar(distance));
        return mousePosition;
    }

    function onResize() {
        const aspect = window.innerWidth / window.innerHeight;
        camera.aspect = aspect;
        camera.updateProjectionMatrix();
        if (renderer) {
            renderer.setSize(window.innerWidth, window.innerHeight);
        }
    }

    function handleClick(event) {
        const rect = renderer.domElement.getBoundingClientRect();
        const clientX = event.clientX !== undefined ? event.clientX : event.touches[0].clientX;
        const clientY = event.clientY !== undefined ? event.clientY : event.touches[0].clientY;
        const mouseX = ((clientX - rect.left) / rect.width) * 2 - 1;
        const mouseY = -((clientY - rect.top) / rect.height) * 2 + 1;

        const mouse = new THREE.Vector2(mouseX, mouseY);
        const raycaster = new THREE.Raycaster();
        raycaster.setFromCamera(mouse, camera);

        const intersects = raycaster.intersectObjects(gridContainer.children);
        if (intersects.length > 0) {
            const clickedObject = intersects[0].object;
            if (clickedObject.callback) {
                clickedObject.callback();
            }
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

        const planeSize = 20000;
        const backgroundMesh = new THREE.Mesh(
            new THREE.PlaneGeometry(planeSize, planeSize),
            new THREE.MeshBasicMaterial({ map: gridTexture, transparent: true })
        );

        backgroundMesh.material.map.repeat.set(planeSize / cellSize, planeSize / cellSize);
        backgroundMesh.position.z = -10;
        scene.add(backgroundMesh);

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
            },
            renderer,
            camera
        );

        const initialMousePosition = new THREE.Vector3(0, 0, 0);
        mouse.set(initialMousePosition.x, initialMousePosition.y);
        gridContainer.children.forEach((child) => {
            rotateCardTowardsMouse(child, mouse, camera, maxRotation);
        });

        wrapGrid(gridContainer, camera, gridCols, gridRows, itemWidth, itemHeight, padding);
        cleanupGrid(gridContainer, camera);

        const startDrag = (e) => {
            dragging = true;
            moved = false;
            startX = e.clientX !== undefined ? e.clientX : e.touches[0].clientX;
            startY = e.clientY !== undefined ? e.clientY : e.touches[0].clientY;
        };

        const moveDrag = (e) => {
            const mousePosition = getMousePositionInScene(e);
            mouse.set(mousePosition.x, mousePosition.y);

            if (dragging) {
                moved = true;
                const dx = ((e.clientX !== undefined ? e.clientX : e.touches[0].clientX) - startX) / 200;
                const dy = -((e.clientY !== undefined ? e.clientY : e.touches[0].clientY) - startY) / 200;
                camera.position.x -= dx * camera.zoom;
                camera.position.y -= dy * camera.zoom;
                wrapGrid(gridContainer, camera, gridCols, gridRows, itemWidth, itemHeight, padding);
                cleanupGrid(gridContainer, camera);
                startX = e.clientX !== undefined ? e.clientX : e.touches[0].clientX;
                startY = e.clientY !== undefined ? e.clientY : e.touches[0].clientY;
            }

            gridContainer.children.forEach((child) => {
                rotateCardTowardsMouse(child, mouse, camera, maxRotation);
            });
        };

        const endDrag = (e) => {
            dragging = false;
            snapCameraToGrid(camera, itemWidth, itemHeight, padding);
            if (!moved) {
                handleClick(e);
            }
        };

        renderer.domElement.addEventListener('mousedown', startDrag);
        renderer.domElement.addEventListener('mousemove', moveDrag);
        renderer.domElement.addEventListener('mouseup', endDrag);
        renderer.domElement.addEventListener('mouseleave', endDrag);

        renderer.domElement.addEventListener('touchstart', startDrag);
        renderer.domElement.addEventListener('touchmove', moveDrag);
        renderer.domElement.addEventListener('touchend', endDrag);
        renderer.domElement.addEventListener('touchcancel', endDrag);

        animate(renderer, scene, camera);

        window.addEventListener('resize', () => {
            onWindowResize(camera, renderer);
            onResize();
        });

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
