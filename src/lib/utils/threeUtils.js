// src/lib/utils/threeUtils.js
import * as THREE from 'three';

// Configuration variables
const CAMERA_SETTINGS = {
  fov: 75,
  aspect: typeof window !== 'undefined' ? window.innerWidth / window.innerHeight : 1,
  near: 0.1,
  far: 1000,
  position: { z: 20 }
};

const RENDERER_SETTINGS = {
  antialias: true,
  size: { width: typeof window !== 'undefined' ? window.innerWidth : 800, height: typeof window !== 'undefined' ? window.innerHeight : 600 }
};

const GRID_ITEM_SETTINGS = {
  color: 0xffffff,
  text: {
    color: '#000000',
    font: '30px Oxanium'
  },
  canvas: {
    width: 512,
    height: 256
  }
};

export function createScene() {
  return new THREE.Scene();
}

export function createCamera(settings = CAMERA_SETTINGS) {
  const camera = new THREE.PerspectiveCamera(
    settings.fov,
    settings.aspect,
    settings.near,
    settings.far
  );
  camera.position.z = settings.position.z;
  return camera;
}

export function createRenderer(settings = RENDERER_SETTINGS) {
  if (typeof window === 'undefined') {
    return null; // or a placeholder renderer
  }
  
  const renderer = new THREE.WebGLRenderer({ antialias: settings.antialias });
  renderer.setSize(settings.size.width, settings.size.height);
  return renderer;
}

export function addCard(gridContainer, title, description, x, y, itemWidth, itemHeight, settings = GRID_ITEM_SETTINGS) {
  const placeholderMaterial = new THREE.MeshBasicMaterial({ color: settings.color });
  const mesh = new THREE.Mesh(new THREE.PlaneGeometry(itemWidth, itemHeight), placeholderMaterial);
  mesh.position.set(x, y, 0);
  gridContainer.add(mesh);

  if (typeof document !== 'undefined') {
    const textCanvas = document.createElement('canvas');
    textCanvas.width = settings.canvas.width;
    textCanvas.height = settings.canvas.height;
    const context = textCanvas.getContext('2d');
    context.fillStyle = settings.text.color;
    context.font = settings.text.font;
    context.fillText(title, 10, 50);
    context.fillText(description, 10, 150);
    const textTexture = new THREE.CanvasTexture(textCanvas);
    const textMaterial = new THREE.SpriteMaterial({ map: textTexture });
    const textSprite = new THREE.Sprite(textMaterial);
    textSprite.scale.set(itemWidth, itemHeight / 2, 1);
    textSprite.position.set(x, y, 0.1);

    gridContainer.add(textSprite);
  }
}

export function getGridPositions(index, cols, itemWidth, itemHeight, padding) {
  const gap = padding;
  const row = Math.floor(index / cols);
  const col = index % cols;
  const x = col * (itemWidth + gap);
  const y = -row * (itemHeight + gap);
  return { x, y };
}
