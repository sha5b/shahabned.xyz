import * as THREE from 'three';

export function createDottedGridTexture(cellSize, dotSize, textureSize) {
    const canvas = document.createElement('canvas');
    canvas.width = textureSize;
    canvas.height = textureSize;
    const ctx = canvas.getContext('2d');

    // Fill the canvas with a black background
    ctx.fillStyle = 'black';
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // Draw the white dots with anti-aliasing
    ctx.fillStyle = 'rgba(255, 255, 255, 0.5)'; // White and transparent
    for (let x = 0; x < textureSize; x += cellSize * 2) { // Double the cell size to reduce the number of dots
        for (let y = 0; y < textureSize; y += cellSize * 2) {
            ctx.beginPath();
            ctx.arc(x + cellSize, y + cellSize, dotSize, 0, 2 * Math.PI);
            ctx.fill();
        }
    }

    // Draw the grid lines through the center of the dots
    ctx.strokeStyle = 'rgba(255, 255, 255, 0.1)'; // White and more transparent
    ctx.lineWidth = .25;
    for (let x = cellSize; x <= textureSize; x += cellSize * 2) {
        ctx.beginPath();
        ctx.moveTo(x, 0);
        ctx.lineTo(x, textureSize);
        ctx.stroke();
    }
    for (let y = cellSize; y <= textureSize; y += cellSize * 2) {
        ctx.beginPath();
        ctx.moveTo(0, y);
        ctx.lineTo(textureSize, y);
        ctx.stroke();
    }

    const texture = new THREE.CanvasTexture(canvas);
    texture.wrapS = THREE.RepeatWrapping;
    texture.wrapT = THREE.RepeatWrapping;
    texture.minFilter = THREE.LinearFilter; // Use linear filter for better quality
    texture.magFilter = THREE.LinearFilter; // Use linear filter for better quality
    texture.repeat.set(1, 1);

    return texture;
}
