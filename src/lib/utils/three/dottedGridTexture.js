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
    ctx.fillStyle = 'rgba(255, 255, 255, 0.5)';
    for (let x = 0; x < textureSize; x += cellSize) {
        for (let y = 0; y < textureSize; y += cellSize) {
            ctx.beginPath();
            ctx.arc(x, y, dotSize, 0, 2 * Math.PI);
            ctx.fill();
        }
    }

    // Draw the grid lines
    ctx.strokeStyle = 'rgba(255, 255, 255, 0.1)';
    ctx.lineWidth = 0.25;
    for (let x = 0; x <= textureSize; x += cellSize) {
        ctx.beginPath();
        ctx.moveTo(x, 0);
        ctx.lineTo(x, textureSize);
        ctx.stroke();
    }
    for (let y = 0; y <= textureSize; y += cellSize) {
        ctx.beginPath();
        ctx.moveTo(0, y);
        ctx.lineTo(textureSize, y);
        ctx.stroke();
    }

    // Ensure the texture tiles perfectly
    const texture = new THREE.CanvasTexture(canvas);
    texture.wrapS = THREE.RepeatWrapping;
    texture.wrapT = THREE.RepeatWrapping;
    texture.minFilter = THREE.LinearFilter;
    texture.magFilter = THREE.LinearFilter;
    texture.repeat.set(1, 1);

    return texture;
}
