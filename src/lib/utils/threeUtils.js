import * as THREE from 'three';

export function createScene() {
  return new THREE.Scene();
}

export function createCamera() {
  const camera = new THREE.OrthographicCamera(
    window.innerWidth / -100, window.innerWidth / 100,
    window.innerHeight / 100, window.innerHeight / -100,
    1, 1000
  );
  camera.position.z = 10;
  return camera;
}

export function createRenderer() {
  const renderer = new THREE.WebGLRenderer({ antialias: true });
  renderer.setSize(window.innerWidth, window.innerHeight);
  return renderer;
}

export function addCard(gridContainer, title, description, x, y, itemWidth, itemHeight, padding) {
  // Create a placeholder material
  const placeholderMaterial = new THREE.MeshBasicMaterial({ color: 0x66ccff });
  const mesh = new THREE.Mesh(new THREE.PlaneGeometry(itemWidth, itemHeight), placeholderMaterial);
  mesh.position.set(x, y, 0);
  gridContainer.add(mesh);

  // Create a canvas texture for the text
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

export function getGridPositions(index, itemWidth, itemHeight, padding) {
  let k = Math.ceil((Math.sqrt(index + 1) - 1) / 2);
  let t = 2 * k + 1;
  let m = Math.pow(t, 2);
  t -= 1;

  if (index >= m - t) {
    return { x: (k - (m - index)) * (itemWidth + padding), y: -k * (itemHeight + padding) };
  } else if (index >= m - 2 * t) {
    return { x: -k * (itemWidth + padding), y: (-k + (m - t - index)) * (itemHeight + padding) };
  } else if (index >= m - 3 * t) {
    return { x: (-k + (m - 2 * t - index)) * (itemWidth + padding), y: k * (itemHeight + padding) };
  } else {
    return { x: k * (itemWidth + padding), y: (k - (m - 3 * t - index)) * (itemHeight + padding) };
  }
}
