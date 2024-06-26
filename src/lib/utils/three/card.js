// src/lib/utils/three/card.js
import * as THREE from 'three';
import { getImageURL } from '$lib/utils/getURL';
import { goto } from '$app/navigation';

function createRoundedRectTexture(width, height, radius, resolution = 1024) {
  const canvas = document.createElement('canvas');
  canvas.width = resolution;
  canvas.height = resolution * (height / width);
  const context = canvas.getContext('2d');
  const scale = resolution / width;

  context.scale(scale, scale);

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

  return new THREE.CanvasTexture(canvas);
}

function createTextTexture(text, width = 1024, height = 256) {
  const canvas = document.createElement('canvas');
  canvas.width = width;
  canvas.height = height;
  const context = canvas.getContext('2d');

  context.clearRect(0, 0, width, height);

  context.fillStyle = 'rgba(255, 255, 255, 0)';
  context.fillRect(0, 0, width, height);

  context.fillStyle = 'black';
  context.font = '72px Oxanium';
  context.textAlign = 'center';
  context.textBaseline = 'middle';
  context.fillText(text, width / 2, height / 2);

  return new THREE.CanvasTexture(canvas);
}

function createMaterial(textureURL, itemWidth, itemHeight, radius = 8) {
  const roundedRectTexture = createRoundedRectTexture(itemWidth * 100, itemHeight * 100, radius);
  let material;

  if (textureURL) {
    const loader = new THREE.TextureLoader();
    const texture = loader.load(textureURL, (texture) => {
      texture.colorSpace = THREE.SRGBColorSpace;

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
      material.needsUpdate = true;
    });

    material = new THREE.MeshPhongMaterial({
      map: texture,
      alphaMap: roundedRectTexture,
      transparent: true,
      color: 0xffffff,
      shininess: 30
    });

    texture.onUpdate = function() {
      this.needsUpdate = false;
    };

  } else {
    material = new THREE.MeshPhongMaterial({
      map: roundedRectTexture,
      transparent: true,
      color: 0xffffff,
      shininess: 30
    });
  }

  return material;
}

function createCardMesh(itemWidth, itemHeight, textureURL, radius = 8, onClick = null) {
  const material = createMaterial(textureURL, itemWidth, itemHeight, radius);
  const cardMesh = new THREE.Mesh(new THREE.PlaneGeometry(itemWidth, itemHeight), material);
  cardMesh.receiveShadow = true;  // Enable shadow receiving

  if (onClick) {
    cardMesh.userData = { onClick };
    // @ts-ignore
    cardMesh.callback = onClick;
  }

  return cardMesh;
}

function createNavigationCardMesh(itemWidth, itemHeight, label, onClick) {
  const cardMesh = createCardMesh(itemWidth, itemHeight, null, 8, onClick);

  const textTexture = createTextTexture(label);
  const textMaterial = new THREE.MeshBasicMaterial({ map: textTexture, transparent: true });
  const textMesh = new THREE.Mesh(
    new THREE.PlaneGeometry(itemWidth, itemHeight / 4),
    textMaterial
  );

  textMesh.position.set(0, 0, 0.5); // Position the text slightly above the card
  textMesh.castShadow = true;  // Enable shadow casting

  // Ensure the text mesh is not part of the interactive area of the card
  textMesh.raycast = () => {};

  cardMesh.add(textMesh);

  return cardMesh;
}

function addCard(gridContainer, cardMesh, x, y) {
  cardMesh.position.set(x, y, 0);
  gridContainer.add(cardMesh);
}

function addWorkCard(gridContainer, work, x, y, itemWidth, itemHeight, onClick) {
  const category = work?.expand?.category?.title || 'No Category';
  const textureURL = getImageURL('works', work.id, work.thump, '0x600');
  const cardMesh = createCardMesh(itemWidth, itemHeight, textureURL, 8, () => {
    if (onClick) {
      onClick(work);
    } else {
      goto(`/${category}/${work.title}`);
    }
  });

  addCard(gridContainer, cardMesh, x, y);
}

function addCategoryCard(gridContainer, category, x, y, itemWidth, itemHeight, onClick) {
  const textureURL = getImageURL('categories', category.id, category.thump);
  const cardMesh = createCardMesh(itemWidth, itemHeight, textureURL, 8, () => {
    if (onClick) {
      onClick(category);
    } else {
      goto(`/${category.title}`);
    }
  });

  addCard(gridContainer, cardMesh, x, y);
}

function addNavigationCard(gridContainer, label, x, y, itemWidth, itemHeight, onClick) {
  const cardMesh = createNavigationCardMesh(itemWidth, itemHeight, label, onClick);
  addCard(gridContainer, cardMesh, x, y);
}

function addImageCard(gridContainer, image, x, y, itemWidth, itemHeight) {
  const textureURL = getImageURL('works', image.id, image.thump);
  const cardMesh = createCardMesh(itemWidth, itemHeight, textureURL, 8, () => {
    console.log('Image card clicked:', image);
  });

  addCard(gridContainer, cardMesh, x, y);
}

export {
  createRoundedRectTexture,
  createTextTexture,
  createMaterial,
  createCardMesh,
  addCard,
  addWorkCard,
  addCategoryCard,
  addNavigationCard,
  addImageCard
};
