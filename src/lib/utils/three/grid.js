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

function calculateGridSize(works) {
    const gridCols = Math.ceil(Math.sqrt(works.length + 1));
    const gridRows = Math.ceil((works.length + 1) / gridCols);
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

function shuffleArray(array) {
    for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]];
    }
    return array;
}

function createCompleteGrid(gridContainer, works, categories, title, itemWidth, itemHeight, padding, onClick) {
    const uniqueCategories = [...new Set(categories.map(cat => cat.title))];
    const totalCards = works.length + uniqueCategories.length + 1; // Adding 1 for the title card
    const positions = generatePositions(totalCards, itemWidth, itemHeight, padding);

    // Use a larger radius for the owner card
    addCard(gridContainer, title, '', positions[0].x, positions[0].y, itemWidth, itemHeight, null, null, null, 24);

    // First, ensure each category is represented at least once
    let positionIndex = 1;
    uniqueCategories.forEach(category => {
        const work = works.find(w => w.expand.category.title === category);
        if (work) {
            addWorkCard(gridContainer, work, positions[positionIndex].x, positions[positionIndex].y, itemWidth, itemHeight, padding, onClick);
            positionIndex++;
        }
    });

    // Add remaining works
    works.forEach(work => {
        if (positionIndex >= totalCards) return;
        addWorkCard(gridContainer, work, positions[positionIndex].x, positions[positionIndex].y, itemWidth, itemHeight, padding, onClick);
        positionIndex++;
    });
}

function fillEmptySpaces(gridContainer, works, itemWidth, itemHeight, padding) {
    const bounds = new THREE.Box3().setFromObject(gridContainer);
    const width = bounds.max.x - bounds.min.x;
    const height = bounds.max.y - bounds.min.y;
    const cols = Math.ceil(width / (itemWidth + padding));
    const rows = Math.ceil(height / (itemHeight + padding));
    const totalCards = cols * rows;

    // Shuffle the works array
    const shuffledWorks = shuffleArray([...works]);

    for (let i = 0; i < totalCards; i++) {
        const { x, y } = getGridPositions(i, cols, itemWidth, itemHeight, padding);
        if (!isPositionOccupied(gridContainer, x, y, itemWidth, itemHeight)) {
            const cardIndex = i % shuffledWorks.length;
            const work = shuffledWorks[cardIndex];
            addWorkCard(gridContainer, work, x, y, itemWidth, itemHeight, padding);
        }
    }
}

function isPositionOccupied(gridContainer, x, y, itemWidth, itemHeight) {
    return gridContainer.children.some(child => {
        return Math.abs(child.position.x - x) < itemWidth / 2 && Math.abs(child.position.y - y) < itemHeight / 2;
    });
}

function wrapGrid(gridContainer, camera, gridCols, gridRows, itemWidth, itemHeight, padding) {
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
    shuffleArray,
    createCompleteGrid,
    fillEmptySpaces,
    isPositionOccupied,
    wrapGrid,
    cleanupGrid
};
