// src/lib/utils/threeUtils.js
import * as THREE from 'three';

export function createScene() {
  return new THREE.Scene();
}

export function createCamera() {
  const camera = new THREE.PerspectiveCamera(
    75, // Field of view
    window.innerWidth / window.innerHeight, // Aspect ratio
    0.1, // Near clipping plane
    1000 // Far clipping plane
  );
  camera.position.z = 20; // Adjust zoom level
  return camera;
}

export function createRenderer() {
  const renderer = new THREE.WebGLRenderer({ antialias: true });
  renderer.setSize(window.innerWidth, window.innerHeight);
  return renderer;
}

export function addCard(gridContainer, title, description, x, y, itemWidth, itemHeight, padding) {
  const placeholderMaterial = new THREE.MeshBasicMaterial({ color: 0x66ccff });
  const mesh = new THREE.Mesh(new THREE.PlaneGeometry(itemWidth, itemHeight), placeholderMaterial);
  mesh.position.set(x, y, 0);
  gridContainer.add(mesh);

  const textCanvas = document.createElement('canvas');
  textCanvas.width = 512;
  textCanvas.height = 256;
  const context = textCanvas.getContext('2d');
  context.fillStyle = '#ffffff';
  context.font = '30px Arial';
  context.fillText(title, 10, 50);
  context.fillText(description, 10, 100);
  const textTexture = new THREE.CanvasTexture(textCanvas);
  const textMaterial = new THREE.SpriteMaterial({ map: textTexture });
  const textSprite = new THREE.Sprite(textMaterial);
  textSprite.scale.set(itemWidth, itemHeight / 2, 1);
  textSprite.position.set(x, y - itemHeight / 2, 0.1);

  gridContainer.add(textSprite);
}

export function getGridPositions(index, cols, itemWidth, itemHeight, padding) {
  const gap = padding;
  const row = Math.floor(index / cols);
  const col = index % cols;
  const x = col * (itemWidth + gap);
  const y = -row * (itemHeight + gap);
  return { x, y };
}
