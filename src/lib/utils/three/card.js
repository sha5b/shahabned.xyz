import * as THREE from 'three';
import { getImageURL } from '$lib/utils/getURL';
import { goto } from '$app/navigation';

// Constants for common properties
const DEFAULT_RADIUS = 8;
const DEFAULT_COLOR = 0xffffff;
const DEFAULT_SHININESS = 30;
const DEFAULT_TRANSPARENT = true;

// Utility functions
const createCanvas = (width, height, scale) => {
  const canvas = document.createElement('canvas');
  canvas.width = width * scale;
  canvas.height = height * scale;
  return canvas;
};

const drawRoundedRect = (context, width, height, radius) => {
  context.fillStyle = '#ffffff';
  context.beginPath();
  context.moveTo(radius, 0);
  context.lineTo(width - radius, 0);
  context.quadraticCurveTo(width, 0, width, radius);
  context.lineTo(width, height - radius);
  context.quadraticCurveTo(width, height, width - radius, height);
  context.lineTo(radius, height);
  context.quadraticCurveTo(0, height, 0, height - radius);
  context.lineTo(0, radius);
  context.quadraticCurveTo(0, 0, radius, 0);
  context.closePath();
  context.fill();
};

const createRoundedRectTexture = (width, height, radius, resolution = 1024) => {
  const scale = resolution / width;
  const canvas = createCanvas(width, height, scale);
  const context = canvas.getContext('2d');
  context.scale(scale, scale);
  drawRoundedRect(context, width, height, radius);
  return new THREE.CanvasTexture(canvas);
};

const configureTexture = (texture, itemWidth, itemHeight) => {
  const aspectRatio = texture.image.width / texture.image.height;
  const cardAspectRatio = itemWidth / itemHeight;

  if (aspectRatio > cardAspectRatio) {
    texture.repeat.set(cardAspectRatio / aspectRatio, 1);
    texture.offset.set((1 - texture.repeat.x) / 2, 0);
  } else {
    texture.repeat.set(1, aspectRatio / cardAspectRatio);
    texture.offset.set(0, (1 - texture.repeat.y) / 2);
  }

  texture.wrapS = THREE.ClampToEdgeWrapping;
  texture.wrapT = THREE.ClampToEdgeWrapping;
};

const createMaterial = (textureURL, itemWidth, itemHeight, radius = DEFAULT_RADIUS) => {
  const roundedRectTexture = createRoundedRectTexture(itemWidth * 100, itemHeight * 100, radius);
  const commonProps = {
    alphaMap: roundedRectTexture,
    transparent: DEFAULT_TRANSPARENT,
    color: DEFAULT_COLOR,
    shininess: DEFAULT_SHININESS
  };

  const material = new THREE.MeshPhongMaterial(commonProps);

  if (textureURL) {
    const loader = new THREE.TextureLoader();
    loader.load(textureURL, (texture) => {
      texture.colorSpace = THREE.SRGBColorSpace;
      configureTexture(texture, itemWidth, itemHeight);
      material.map = texture;
      material.needsUpdate = true;
    });
  } else {
    material.map = roundedRectTexture;
  }

  return material;
};

const createCardMesh = (itemWidth, itemHeight, textureURL, radius = DEFAULT_RADIUS, onClick = null) => {
  const material = createMaterial(textureURL, itemWidth, itemHeight, radius);
  const cardMesh = new THREE.Mesh(new THREE.PlaneGeometry(itemWidth, itemHeight), material);
  if (onClick) {
    cardMesh.userData = { onClick };
    cardMesh.callback = onClick;
  }
  return cardMesh;
};

const addCard = (gridContainer, cardMesh, x, y) => {
  cardMesh.position.set(x, y, 0);
  gridContainer.add(cardMesh);
};

const createClickHandler = (onClick, fallbackURL) => () => {
  if (onClick) {
    onClick();
  } else {
    goto(fallbackURL);
  }
};

// Card-specific functions
const addWorkCard = (gridContainer, work, x, y, itemWidth, itemHeight, onClick) => {
  const category = work?.expand?.category?.title || 'No Category';
  const textureURL = getImageURL('works', work.id, work.thump);
  const fallbackURL = `/${category}/${work.title}`;
  const cardMesh = createCardMesh(itemWidth, itemHeight, textureURL, DEFAULT_RADIUS, createClickHandler(() => onClick(work), fallbackURL));
  addCard(gridContainer, cardMesh, x, y);
};

const addCategoryCard = (gridContainer, category, x, y, itemWidth, itemHeight, onClick) => {
  const textureURL = getImageURL('categories', category.id, category.thump);
  const fallbackURL = `/${category.title}`;
  const cardMesh = createCardMesh(itemWidth, itemHeight, textureURL, DEFAULT_RADIUS, createClickHandler(() => onClick(category), fallbackURL));
  addCard(gridContainer, cardMesh, x, y);
};

const addNavigationCard = (gridContainer, label, x, y, itemWidth, itemHeight, onClick) => {
  const cardMesh = createCardMesh(itemWidth, itemHeight, null, DEFAULT_RADIUS, onClick);
  addCard(gridContainer, cardMesh, x, y);
};

const addImageCard = (gridContainer, image, x, y, itemWidth, itemHeight) => {
  const textureURL = getImageURL('works', image.id, image.thump);
  const cardMesh = createCardMesh(itemWidth, itemHeight, textureURL, DEFAULT_RADIUS, () => console.log('Image card clicked:', image));
  addCard(gridContainer, cardMesh, x, y);
};

const addOwnerCard = (gridContainer, title, x, y, itemWidth, itemHeight, onClick) => {
  const cardMesh = createCardMesh(itemWidth, itemHeight, null, DEFAULT_RADIUS, onClick);
  addCard(gridContainer, cardMesh, x, y);
};

const addTextCard = (gridContainer, text, x, y, itemWidth, itemHeight, onClick) => {
  const cardMesh = createCardMesh(itemWidth, itemHeight, null, DEFAULT_RADIUS, onClick);
  addCard(gridContainer, cardMesh, x, y);
};

export {
  createRoundedRectTexture,
  createMaterial,
  createCardMesh,
  addCard,
  addWorkCard,
  addCategoryCard,
  addNavigationCard,
  addImageCard,
  addOwnerCard,
  addTextCard,
};
