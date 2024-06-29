// src/lib/utils/three/grid.js
import * as THREE from 'three';
import {
    addCard,
    addWorkCard,
    addCategoryCard,
    addNavigationCard,
    createCardMesh,
    addImageCard,
    addWorkDetailsCard,
    addSynopsisCard,
    addColabsCard,
    addExhibitionsCard
} from '$lib/utils/three/card';

function getGridPositions(index, cols, itemWidth, itemHeight, padding) {
    const gap = padding;
    const row = Math.floor(index / cols);
    const col = index % cols;
    const x = col * (itemWidth + gap);
    const y = -row * (itemHeight + gap);
    return { x, y };
}

function calculateGridSize(items, minCols = 5, minRows = 5) {
    const gridCols = Math.max(minCols, Math.ceil(Math.sqrt(items.length)));
    const gridRows = Math.max(minRows, Math.ceil(items.length / gridCols));
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

function createLandingPageCards(title) {
    return [{
        type: 'owner',
        title,
        onClick: () => console.log('Owner Card Clicked')
    }];
}

function createCategoryPageCards(categories, title, onClickHandlers) {
    const currentIndex = categories.findIndex((cat) => cat.title === title);
    const nextCategory = categories[(currentIndex + 1) % categories.length];
    const prevCategory = categories[(currentIndex - 1 + categories.length) % categories.length];

    return [
        {
            type: 'navigation',
            icon: 'north',
            color: categories[currentIndex].color,
            onClick: onClickHandlers.backToLanding
        },
        {
            type: 'navigation',
            icon: 'east',
            color: categories[currentIndex].color,
            onClick: () => onClickHandlers.nextCategory(nextCategory)
        },
        {
            type: 'navigation',
            icon: 'west',
            color: categories[currentIndex].color,
            onClick: () => onClickHandlers.prevCategory(prevCategory)
        }
    ];
}

function createWorkPageCards(items, title, onClickHandlers, work) {
    const currentIndex = items.findIndex((item) => item.id === title);
    const nextWork = items[(currentIndex + 1) % items.length];
    const prevWork = items[(currentIndex - 1 + items.length) % items.length];

    const cards = [
        {
            type: 'navigation',
            icon: 'north',
            color: work.expand.category.color,
            onClick: onClickHandlers.backToCategory
        },
        {
            type: 'navigation',
            icon: 'east',
            color: work.expand.category.color,
            onClick: () => onClickHandlers.nextWork(nextWork)
        },
        {
            type: 'navigation',
            icon: 'west',
            color: work.expand.category.color,
            onClick: () => onClickHandlers.prevWork(prevWork)
        },
        {
            type: 'workdetails',
            work,
            color: work.expand.category.color,
            onClick: () => console.log('Work Details Clicked')
        }
    ];

    if (work.synopsis) {
        cards.push({
            type: 'synopsis',
            text: work.synopsis,
            color: work.expand.category.color,
            onClick: () => console.log('Synopsis Clicked')
        });
    }

    if (work.colab && work.colab.length > 0) {
        cards.push({
            type: 'colabs',
            text: work.expand.colab,
            color: work.expand.category.color,
            onClick: () => console.log('Collaborations Clicked')
        });
    }

    if (work.exhibitions && work.exhibitions.length > 0) {
        cards.push({
            type: 'exhibitions',
            text: work.expand.exhibitions,
            color: work.expand.category.color,
            onClick: () => console.log('Exhibitions Clicked')
        });
    }

    return cards;
}

function addCardToGrid(gridContainer, item, position, itemWidth, itemHeight, onClickHandlers, pageType) {
    if (item.type === 'navigation') {
        addNavigationCard(
            gridContainer,
            item.icon,
            item.color,
            position.x,
            position.y,
            itemWidth,
            itemHeight,
            item.onClick
        );
    } else if (item.type === 'owner') {
        const cardMesh = createCardMesh(itemWidth, itemHeight, null, 8, item.onClick);
        addCard(gridContainer, cardMesh, position.x, position.y);
    } else if (item.type === 'workdetails') {
        addWorkDetailsCard(
            gridContainer,
            item.work,
            position.x,
            position.y,
            itemWidth,
            itemHeight,
            item.onClick
        );
    } else if (item.type === 'synopsis') {
        addSynopsisCard(
            gridContainer,
            { synopsis: item.text }, // Ensure correct synopsis data is passed
            position.x,
            position.y,
            itemWidth,
            itemHeight,
            item.onClick
        );
    } else if (item.type === 'colabs') {
        addColabsCard(
            gridContainer,
            { colabs: item.text }, // Ensure correct colabs data is passed
            position.x,
            position.y,
            itemWidth,
            itemHeight,
            item.onClick
        );
    } else if (item.type === 'exhibitions') {
        addExhibitionsCard(
            gridContainer,
            { exhibitions: item.text }, // Ensure correct exhibitions data is passed
            position.x,
            position.y,
            itemWidth,
            itemHeight,
            item.onClick
        );
    } else if (pageType === 'work') {
        addImageCard(
            gridContainer,
            item,
            position.x,
            position.y,
            itemWidth,
            itemHeight
        );
    } else {
        addWorkCard(
            gridContainer,
            item,
            position.x,
            position.y,
            itemWidth,
            itemHeight,
            onClickHandlers.work,
            pageType
        );
    }
}

function addCategoriesToGrid(gridContainer, categories, positions, extendedItems, itemWidth, itemHeight, onClickHandlers) {
    categories.forEach((category, index) => {
        if (index + extendedItems.length >= positions.length) return;
        addCategoryCard(
            gridContainer,
            category,
            positions[index + extendedItems.length].x,
            positions[index + extendedItems.length].y,
            itemWidth,
            itemHeight,
            onClickHandlers.category
        );
    });
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
    pageType,
    work
) {
    const { gridCols, gridRows } = calculateGridSize(items, minCols, minRows);
    const totalCards = gridCols * gridRows;
    const positions = generatePositions(totalCards, itemWidth, itemHeight, padding);

    let extendedItems = [...items];
    while (extendedItems.length < totalCards) {
        extendedItems = extendedItems.concat(items);
    }
    extendedItems = extendedItems.slice(0, totalCards);

    let additionalCards = [];
    switch (pageType) {
        case 'landing':
            additionalCards = createLandingPageCards(title);
            break;
        case 'category':
            additionalCards = createCategoryPageCards(categories, title, onClickHandlers);
            break;
        case 'work':
            additionalCards = createWorkPageCards(items, title, onClickHandlers, work);
            break;
    }

    extendedItems = extendedItems.concat(additionalCards);
    shuffleArray(extendedItems);

    extendedItems.forEach((item, index) => {
        if (index >= positions.length) return;
        addCardToGrid(gridContainer, item, positions[index], itemWidth, itemHeight, onClickHandlers, pageType);
    });

    if (pageType !== 'work') {
        addCategoriesToGrid(gridContainer, categories, positions, extendedItems, itemWidth, itemHeight, onClickHandlers);
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
