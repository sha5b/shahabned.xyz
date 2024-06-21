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
	import { goto } from '$app/navigation';

	export let works = [];
	export let categories = [];
	export let work = null; // Accept work as a prop for work page
	export let title = '';
	export let pageType = 'landing'; // Accept pageType as a prop

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
		console.log('Mounted', { works, categories, work, pageType });

		let items = works;
		if (pageType === 'work' && work) {
			// Combine thump and gallery items
			items = [
				{ id: work.id, thump: work.thump },
				...work.gallery.map((item, index) => ({ id: work.id, thump: item }))
			];
		}

		console.log('Items', items);

		({ gridCols, gridRows } = calculateGridSize(items));

		scene = createScene();
		camera = createCamera();
		camera.position.z = 25;
		camera.zoom = 4;
		renderer = createRenderer();
		onResize();
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

		renderer.render(scene, camera);

		setTimeout(() => {
			gridContainer = new THREE.Group();
			scene.add(gridContainer);

			const onClickHandlers = {
				work: (work) => {
					const category = work.expand?.category?.title || 'No Category';
					const workId = work.id;
					goto(`/${category}/${workId}`);
				},
				category: (category) => {
					goto(`/${category.title}`);
				},
				nextPage: () => {
					console.log('Next Page Clicked');
				},
				backToLanding: () => goto('/'),
				backToCategory: (category) => goto(`/${category}`),
				nextCategory: (category) => {
					console.log('Next category clicked', category);
				},
				nextWork: (work) => {
					console.log('Next work clicked', work);
				},
				prevCategory: (category) => {
					console.log('Previous category clicked', category);
				},
				prevWork: (work) => {
					console.log('Previous work clicked', work);
				}
			};

			if (pageType === 'landing') {
				onClickHandlers.work = (work) => {
					const category = work.expand?.category?.title || 'No Category';
					goto(`/${category}`);
				};
			}

			console.log('Creating grid with items', items);
			createCompleteGrid(
				gridContainer,
				items,
				categories,
				title,
				itemWidth,
				itemHeight,
				padding,
				onClickHandlers,
				5,
				5,
				pageType // Pass the pageType parameter
			);

			const initialMousePosition = new THREE.Vector3(0, 0, 0);
			mouse.set(initialMousePosition.x, initialMousePosition.y);
			gridContainer.children.forEach((child) => {
				rotateCardTowardsMouse(child, mouse, camera, maxRotation);
			});

			wrapGrid(gridContainer, camera, gridCols, gridRows, itemWidth, itemHeight, padding);
			cleanupGrid(gridContainer, camera);

			addEventListeners(
				renderer,
				camera,
				gridContainer,
				gridCols,
				gridRows,
				itemWidth,
				itemHeight,
				padding,
				maxRotation,
				mouse
			);
			animate(renderer, scene, camera);

			window.addEventListener('resize', () => {
				onWindowResize(camera, renderer);
				onResize();
			});

			loading = false;
		}, 1000);

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
