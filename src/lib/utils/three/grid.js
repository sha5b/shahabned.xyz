import * as THREE from 'three';
import { addCard, addWorkCard } from '$lib/utils/three/card';

function getGridPositions(index, cols, itemWidth, itemHeight, padding) {
	const gap = padding;
	const row = Math.floor(index / cols);
	const col = index % cols;
	const x = col * (itemWidth + gap);
	const y = -row * (itemHeight + gap);
	return { x, y };
}

function calculateGridSize(works, minCols = 5, minRows = 5) {
	const gridCols = Math.max(minCols, Math.ceil(Math.sqrt(works.length + 1)));
	const gridRows = Math.max(minRows, Math.ceil((works.length + 1) / gridCols));
	return { gridCols, gridRows };
}

function generatePositions(count, itemWidth, itemHeight, padding) {
	const positions = [];
	const totalCols = Math.ceil(Math.sqrt(count));
	for (let i = 0; i < count; i++) {
		const { x, y } = getGridPositions(i, totalCols, itemWidth, itemHeight, padding);
		positions.push({ x, y });
	}
	return positions;
}

function createCompleteGrid(
	gridContainer,
	works,
	categories,
	title,
	itemWidth,
	itemHeight,
	padding,
	onClick,
	minCols = 5,
	minRows = 5
) {
	const { gridCols, gridRows } = calculateGridSize(works, minCols, minRows);
	const totalCards = gridCols * gridRows;
	const positions = generatePositions(totalCards, itemWidth, itemHeight, padding);

	let extendedWorks = [];
	while (extendedWorks.length < totalCards) {
		extendedWorks = extendedWorks.concat(works);
	}
	extendedWorks = extendedWorks.slice(0, totalCards);

	let positionIndex = 0;
	addCard(
		gridContainer,
		title,
		'Owner',
		positions[positionIndex].x,
		positions[positionIndex].y,
		itemWidth,
		itemHeight,
		null,
		null,
		() => console.log('Owner Card Clicked'),
		8
	); // Adjusted radius to 8 for owner card
	positionIndex++;

	extendedWorks.forEach((work) => {
		if (positionIndex >= positions.length) return;
		addWorkCard(
			gridContainer,
			work,
			positions[positionIndex].x,
			positions[positionIndex].y,
			itemWidth,
			itemHeight,
		);
		positionIndex++;
	});
}

function wrapGrid(gridContainer, camera, gridCols, gridRows, itemWidth, itemHeight, padding) {
	const wrapOffsetX = gridCols * (itemWidth + padding);
	const wrapOffsetY = gridRows * (itemHeight + padding);

	gridContainer.children.forEach((child) => {
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

function cleanupGrid(gridContainer, camera) {
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

export {
	getGridPositions,
	calculateGridSize,
	generatePositions,
	createCompleteGrid,
	wrapGrid,
	cleanupGrid
};
