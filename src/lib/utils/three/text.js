// src/lib/utils/three/text.js
import * as THREE from 'three';

export function drawText(context, text, x, y, width, fontSize = 18, align = 'left', baseline = 'bottom', bold = false) {
    if (typeof text !== 'string') return;

    context.textAlign = align;
    context.textBaseline = baseline;
    context.font = bold ? `bold ${fontSize}px Oxanium` : `${fontSize}px Oxanium`;

    // Calculate the maximum width for the text
    const maxWidth = width - 20; // 10 pixels padding from both edges

    // Split the text into lines
    const words = text.split(' ');
    let line = '';
    const lines = [];
    for (let n = 0; n < words.length; n++) {
        const testLine = line + words[n] + ' ';
        const metrics = context.measureText(testLine);
        const testWidth = metrics.width;
        if (testWidth > maxWidth && n > 0) {
            lines.push(line);
            line = words[n] + ' ';
        } else {
            line = testLine;
        }
    }
    lines.push(line);

    // Draw each line of text
    for (let i = 0; i < lines.length; i++) {
        context.fillText(lines[i], x, y);
        y += fontSize;
    }
}

export function createIconTexture(icon, color, width = 640, height = 1024) {
    const canvas = document.createElement('canvas');
    canvas.width = width;
    canvas.height = height;
    const context = canvas.getContext('2d');

    context.clearRect(0, 0, width, height);

    const radius = Math.min(width, height) / 6;
    context.fillStyle = 'black';
    context.beginPath();
    context.arc(width / 2, height / 2, radius, 0, Math.PI * 2);
    context.fill();

    context.fillStyle = color;
    context.font = `${radius}px 'Material Icons'`;
    context.textAlign = 'center';
    context.textBaseline = 'middle';
    context.fillText(icon, width / 2, height / 2);

    return new THREE.CanvasTexture(canvas);
}

export function createTextTexture(title, date, type, format, width, height, fontSize = 18, color = 'black', pageType = 'category') {
    const canvas = document.createElement('canvas');
    canvas.width = width;
    canvas.height = height;
    const context = canvas.getContext('2d');

    context.clearRect(0, 0, width, height);
    context.fillStyle = color;
    context.font = `${fontSize}px Oxanium`;
    context.textAlign = 'left';
    context.textBaseline = 'bottom';

    if (pageType !== 'landing') {
        // Format date
        const formattedDate = date ? new Intl.DateTimeFormat('en-US', {
            year: 'numeric', month: 'short'
        }).format(new Date(date)) : '';

        // Draw date at top left and type at top right
        if (formattedDate || type) {
            drawText(context, formattedDate, 10, 10 + fontSize, width, fontSize, 'left', 'top');
            drawText(context, type, width - 10, 10 + fontSize, width, fontSize, 'right', 'top');
        }

        // Draw format above title with some padding
        const paddingBetweenFormatAndTitle = 20;
        if (format) {
            drawText(context, format, 10, height - 40 - paddingBetweenFormatAndTitle - fontSize, width, fontSize, 'left', 'bottom');
        }
    }

    // Draw title at bottom left in bold
    if (title) {
        drawText(context, title, 10, height - 40, width, fontSize, 'left', 'bottom', true);
    }

    return new THREE.CanvasTexture(canvas);
}
