import * as THREE from 'three';

// Configurable variables
const defaultDotColor = 'rgba(255, 255, 255, 0.5)';
const defaultGridLineColor = 'rgba(255, 255, 255, 0.1)';
const defaultGridLineWidth = 0.25;

function createCanvas(textureSize) {
    const canvas = document.createElement('canvas');
    canvas.width = textureSize;
    canvas.height = textureSize;
    return canvas;
}

function drawDots(ctx, cellSize, dotSize, textureSize, dotColor = defaultDotColor) {
    ctx.fillStyle = dotColor;
    for (let x = 0; x < textureSize; x += cellSize) {
        for (let y = 0; y < textureSize; y += cellSize) {
            ctx.beginPath();
            ctx.arc(x, y, dotSize, 0, 2 * Math.PI);
            ctx.fill();
        }
    }
}

function drawGridLines(ctx, cellSize, textureSize, gridLineColor = defaultGridLineColor, gridLineWidth = defaultGridLineWidth) {
    ctx.strokeStyle = gridLineColor;
    ctx.lineWidth = gridLineWidth;
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
}

export function createDottedGridTexture(cellSize, dotSize, textureSize) {
    const canvas = createCanvas(textureSize);
    const ctx = canvas.getContext('2d');

    ctx.fillStyle = 'black';
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    drawDots(ctx, cellSize, dotSize, textureSize);
    drawGridLines(ctx, cellSize, textureSize);

    const texture = new THREE.CanvasTexture(canvas);
    texture.wrapS = THREE.RepeatWrapping;
    texture.wrapT = THREE.RepeatWrapping;
    texture.minFilter = THREE.LinearFilter;
    texture.magFilter = THREE.LinearFilter;
    texture.repeat.set(1, 1);

    return texture;
}
