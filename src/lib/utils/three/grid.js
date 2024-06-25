import * as THREE from 'three';
import {
  addCard,
  addWorkCard,
  addCategoryCard,
  addNavigationCard,
  createCardMesh,
  addImageCard
} from '$lib/utils/three/card';

// Utility functions for grid positioning
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

// Card addition helper function
function addCardsToGrid(gridContainer, items, positions, itemWidth, itemHeight, onClickHandlers) {
  let positionIndex = 0;

  items.forEach((item) => {
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
      const cardMesh = createCardMesh(itemWidth, itemHeight, null, 8, item.onClick);
      addCard(gridContainer, cardMesh, positions[positionIndex].x, positions[positionIndex].y);
    } else if (item.type === 'image') {
      addImageCard(
        gridContainer,
        item,
        positions[positionIndex].x,
        positions[positionIndex].y,
        itemWidth,
        itemHeight
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
}

// Main functions to create grids
function createCompleteGrid(gridContainer, items, categories, title, itemWidth, itemHeight, padding, onClickHandlers = {}, minCols = 5, minRows = 5, pageType) {
  const { gridCols, gridRows } = calculateGridSize(items, minCols, minRows);
  const totalCards = gridCols * gridRows;
  const positions = generatePositions(totalCards, itemWidth, itemHeight, padding);

  let extendedItems = [];
  while (extendedItems.length < totalCards) {
    extendedItems = extendedItems.concat(items);
  }
  extendedItems = extendedItems.slice(0, totalCards);

  let additionalCards = [];

  if (pageType === 'landing') {
    additionalCards.push({ type: 'owner', title, onClick: () => console.log('Owner Card Clicked') });
  }

  if (pageType === 'category') {
    const currentIndex = categories.findIndex(cat => cat.title === title);
    const nextCategory = categories[(currentIndex + 1) % categories.length];
    const prevCategory = categories[(currentIndex - 1 + categories.length) % categories.length];

    additionalCards.push({ type: 'navigation', label: 'Back to Landing', onClick: onClickHandlers.backToLanding });
    additionalCards.push({ type: 'navigation', label: 'Next Category', onClick: () => onClickHandlers.nextCategory(nextCategory) });
    additionalCards.push({ type: 'navigation', label: 'Previous Category', onClick: () => onClickHandlers.prevCategory(prevCategory) });
  }

  if (pageType === 'work') {
    const currentIndex = items.findIndex(item => item.id === title);
    const nextWork = items[(currentIndex + 1) % items.length];
    const prevWork = items[(currentIndex - 1 + items.length) % items.length];

    additionalCards.push({ type: 'navigation', label: 'Back to Category', onClick: onClickHandlers.backToCategory });
    additionalCards.push({ type: 'navigation', label: 'Next Work', onClick: () => onClickHandlers.nextWork(nextWork) });
    additionalCards.push({ type: 'navigation', label: 'Previous Work', onClick: () => onClickHandlers.prevWork(prevWork) });
  }

  extendedItems = extendedItems.concat(additionalCards);
  shuffleArray(extendedItems);

  addCardsToGrid(gridContainer, extendedItems, positions, itemWidth, itemHeight, onClickHandlers);

  let positionIndex = extendedItems.length;
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
}

function createImageGrid(gridContainer, items, itemWidth, itemHeight, padding, onClickHandlers) {
  const { gridCols, gridRows } = calculateGridSize(items);
  const totalCards = gridCols * gridRows;
  const positions = generatePositions(totalCards, itemWidth, itemHeight, padding);

  let extendedItems = [];
  while (extendedItems.length < totalCards) {
    extendedItems = extendedItems.concat(items);
  }
  extendedItems = extendedItems.slice(0, totalCards);

  const navigationCards = [
    { type: 'navigation', label: 'Back to Category', onClick: onClickHandlers.backToCategory },
    { type: 'navigation', label: 'Next Work', onClick: onClickHandlers.nextWork },
    { type: 'navigation', label: 'Previous Work', onClick: onClickHandlers.prevWork }
  ];

  extendedItems = extendedItems.concat(navigationCards);
  shuffleArray(extendedItems);

  addCardsToGrid(gridContainer, extendedItems, positions, itemWidth, itemHeight, onClickHandlers);
}

// Grid management functions
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
      disposeResources(child);
      gridContainer.remove(child);
    }
  }
}

function disposeResources(object) {
  if (object.geometry) object.geometry.dispose();
  if (object.material) {
    if (object.material.map) object.material.map.dispose();
    object.material.dispose();
  }
  if (object.texture) object.texture.dispose();
}

export {
  getGridPositions,
  calculateGridSize,
  generatePositions,
  createCompleteGrid,
  wrapGrid,
  cleanupGrid,
  createImageGrid
};
