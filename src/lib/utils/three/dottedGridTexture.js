import * as THREE from 'three';

export function createDottedGridTexture(cellSize, dotSize, textureSize) {
    const canvas = document.createElement('canvas');
    canvas.width = textureSize;
    canvas.height = textureSize;
    const ctx = canvas.getContext('2d');

    // Fill the canvas with a black background
    ctx.fillStyle = 'black';
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // Draw the white dots
    ctx.fillStyle = 'white';
    for (let x = 0; x < textureSize; x += cellSize) {
        for (let y = 0; y < textureSize; y += cellSize) {
            ctx.beginPath();
            ctx.arc(x + cellSize / 2, y + cellSize / 2, dotSize / 2, 0, 2 * Math.PI);
            ctx.fill();
        }
    }

    const texture = new THREE.CanvasTexture(canvas);
    texture.wrapS = THREE.RepeatWrapping;
    texture.wrapT = THREE.RepeatWrapping;
    texture.minFilter = THREE.NearestFilter; // Ensure no blurring
    texture.magFilter = THREE.NearestFilter; // Ensure no blurring
    texture.repeat.set(1, 1);

    return texture;
}