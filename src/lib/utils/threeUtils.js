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
  const material = new THREE.MeshBasicMaterial({ color: 0x66ccff });
  const mesh = new THREE.Mesh(new THREE.PlaneGeometry(itemWidth, itemHeight), material);
  mesh.position.set(x, y, 0);

  const textCanvas = document.createElement('canvas');
  textCanvas.width = 256;
  textCanvas.height = 512;
  const context = textCanvas.getContext('2d');
  context.fillStyle = '#ffffff';
  context.font = '24px Arial';
  context.fillText(title, 10, 50);
  context.fillText(description, 10, 100); 
  const textTexture = new THREE.CanvasTexture(textCanvas);
  const textMaterial = new THREE.MeshBasicMaterial({ map: textTexture, transparent: true });
  const textMesh = new THREE.Mesh(new THREE.PlaneGeometry(itemWidth, itemHeight), textMaterial);
  textMesh.position.set(x, y, 0.1); // Slightly above the background

  gridContainer.add(mesh);
  gridContainer.add(textMesh);
}

export function getSpiralPositions(index, itemWidth, itemHeight, padding) {
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
