import * as THREE from 'three';
import { addCard, addWorkCard, addCategoryCard, addNavigationCard } from '$lib/utils/three/card';

function getGridPositions(index, cols, itemWidth, itemHeight, padding) {
    const gap = padding;
    const row = Math.floor(index / cols);
    const col = index % cols;
    const x = col * (itemWidth + gap);
    const y = -row * (itemHeight + gap);
    return { x, y };
}

function calculateGridSize(items, minCols = 5, minRows = 5) {
    const gridCols = Math.max(minCols, Math.ceil(Math.sqrt(items.length + 1)));
    const gridRows = Math.max(minRows, Math.ceil((items.length + 1) / gridCols));
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
}

function createCompleteGrid(
    gridContainer,
    items,
    categories,
    title,
    itemWidth,
    itemHeight,
    padding,
    onClickHandlers = {},
    minCols = 5,
    minRows = 5,
    pageType
) {
    const { gridCols, gridRows } = calculateGridSize(items, minCols, minRows);
    const totalCards = gridCols * gridRows;
    const positions = generatePositions(totalCards, itemWidth, itemHeight, padding);

    let extendedItems = [];
    while (extendedItems.length < totalCards) {
        extendedItems = extendedItems.concat(items);
    }
    extendedItems = extendedItems.slice(0, totalCards);

    let additionalCards = [];

    // Add the owner card if it's the landing page
    if (pageType === 'landing') {
        additionalCards.push({
            type: 'owner',
            title,
            onClick: () => console.log('Owner Card Clicked')
        });
    }

    // Add 3 navigation cards if it's the category page
    if (pageType === 'category') {
        additionalCards.push({ type: 'navigation', label: 'Back to Landing', onClick: onClickHandlers.backToLanding });
        additionalCards.push({ type: 'navigation', label: 'Next Category', onClick: onClickHandlers.nextCategory });
        additionalCards.push({ type: 'navigation', label: 'Previous Category', onClick: onClickHandlers.prevCategory });
    }

    // Add 3 navigation cards if it's the work page
    if (pageType === 'work') {
        additionalCards.push({ type: 'navigation', label: 'Back to Category', onClick: onClickHandlers.backToCategory });
        additionalCards.push({ type: 'navigation', label: 'Next Work', onClick: onClickHandlers.nextWork });
        additionalCards.push({ type: 'navigation', label: 'Previous Work', onClick: onClickHandlers.prevWork });
    }

    // Combine the additional cards and work cards, then shuffle
    extendedItems = extendedItems.concat(additionalCards);
    shuffleArray(extendedItems);

    let positionIndex = 0;

    extendedItems.forEach((item) => {
        if (positionIndex >= positions.length) return;

        if (item.type === 'navigation') {
            addNavigationCard(
                gridContainer,
                item.label,
                positions[positionIndex].x,
                positions[positionIndex].y,
                itemWidth,
                itemHeight,
                item.onClick
            );
        } else if (item.type === 'owner') {
            addCard(
                gridContainer,
                item.title,
                'Owner',
                positions[positionIndex].x,
                positions[positionIndex].y,
                itemWidth,
                itemHeight,
                null,
                null,
                item.onClick,
                8
            );
        } else {
            addWorkCard(
                gridContainer,
                item,
                positions[positionIndex].x,
                positions[positionIndex].y,
                itemWidth,
                itemHeight,
                onClickHandlers.work
            );
        }
        positionIndex++;
    });

    // Add Category Cards
    categories.forEach((category) => {
        if (positionIndex >= positions.length) return;
        addCategoryCard(
            gridContainer,
            category,
            positions[positionIndex].x,
            positions[positionIndex].y,
            itemWidth,
            itemHeight,
            onClickHandlers.category
        );
        positionIndex++;
    });

    // Add Navigation Cards for category and work pages at the end
    if ((pageType === 'category' || pageType === 'work') && positionIndex < positions.length) {
        addNavigationCard(
            gridContainer,
            'Back',
            positions[positionIndex].x,
            positions[positionIndex].y,
            itemWidth,
            itemHeight,
            pageType === 'category' ? onClickHandlers.backToLanding : onClickHandlers.backToCategory
        );
        positionIndex++;
    }
    if ((pageType === 'category' || pageType === 'work') && positionIndex < positions.length) {
        addNavigationCard(
            gridContainer,
            'Next',
            positions[positionIndex].x,
            positions[positionIndex].y,
            itemWidth,
            itemHeight,
            pageType === 'category' ? onClickHandlers.nextCategory : onClickHandlers.nextWork
        );
        positionIndex++;
    }
    if ((pageType === 'category' || pageType === 'work') && positionIndex < positions.length) {
        addNavigationCard(
            gridContainer,
            'Previous',
            positions[positionIndex].x,
            positions[positionIndex].y,
            itemWidth,
            itemHeight,
            pageType === 'category' ? onClickHandlers.prevCategory : onClickHandlers.prevWork
        );
        positionIndex++;
    }
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
