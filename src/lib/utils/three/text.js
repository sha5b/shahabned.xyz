import * as THREE from 'three';

// Configurable variables
const scaleFactor = 2;
const defaultFontSize = 18;
const defaultFontFamily = 'Oxanium';
const defaultColor = 'black';
const hyperlinkColor = 'blue';
const lineSpacing = 5;

function createHighResolutionCanvas(width, height) {
	const canvas = document.createElement('canvas');
	canvas.width = width * scaleFactor;
	canvas.height = height * scaleFactor;
	const context = canvas.getContext('2d');

	context.clearRect(0, 0, canvas.width, canvas.height);
	context.scale(scaleFactor, scaleFactor);

	return { canvas, context };
}

function createTextureFromCanvas(canvas) {
	const texture = new THREE.CanvasTexture(canvas);
	texture.minFilter = THREE.LinearFilter;
	texture.magFilter = THREE.LinearFilter;
	texture.anisotropy = 16;
	texture.wrapS = THREE.ClampToEdgeWrapping;
	texture.wrapT = THREE.ClampToEdgeWrapping;
	texture.generateMipmaps = true;
	return texture;
}

function drawText(
	context,
	text,
	x,
	y,
	width,
	fontSize = defaultFontSize,
	align = 'left',
	baseline = 'bottom',
	bold = false,
	color = defaultColor,
	isHyperlink = false
) {
	if (typeof text !== 'string') return;

	context.textAlign = align;
	context.textBaseline = baseline;
	context.font = bold ? `bold ${fontSize}px ${defaultFontFamily}` : `${fontSize}px ${defaultFontFamily}`;
	context.fillStyle = isHyperlink ? hyperlinkColor : color;

	const maxWidth = width - 20;
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

	for (let i = 0; i < lines.length; i++) {
		context.fillText(lines[i], x, y);
		y += fontSize + lineSpacing;
	}
}

function wrapText(context, text, maxWidth) {
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
	return lines;
}

export function createTextTexture(
	title,
	date,
	type,
	format,
	width,
	height,
	fontSize = defaultFontSize,
	color = defaultColor,
	pageType = 'work'
) {
	const { canvas, context } = createHighResolutionCanvas(width, height);

	context.fillStyle = color;
	context.font = `${fontSize}px ${defaultFontFamily}`;
	context.textAlign = 'left';
	context.textBaseline = 'bottom';

	if (pageType !== 'landing') {
		const formattedDate = date
			? new Intl.DateTimeFormat('en-US', {
					year: 'numeric',
					month: 'long'
				}).format(new Date(date))
			: '';

		if (formattedDate || type) {
			drawText(context, formattedDate, 10, 10 + fontSize, width, fontSize, 'left', 'top', false, color);
			drawText(context, type, width - 10, 10 + fontSize, width, fontSize, 'right', 'top', false, color);
		}

		const paddingBetweenFormatAndTitle = 20;
		if (format) {
			drawText(
				context,
				format,
				10,
				height - 40 - paddingBetweenFormatAndTitle - fontSize,
				width,
				fontSize,
				'left',
				'bottom',
				false,
				color
			);
		}
	}

	if (title) {
		const wrappedLines = wrapText(context, title, width - 20); // Wrapping the title to fit within the width
		let yPosition = height - 40 - (wrappedLines.length - 1) * (fontSize + lineSpacing); // Adjust y position to account for the number of wrapped lines

		for (let i = 0; i < wrappedLines.length; i++) {
			drawText(context, wrappedLines[i], 10, yPosition, width, fontSize, 'left', 'bottom', true, color);
			yPosition += fontSize + lineSpacing;
		}
	}

	return createTextureFromCanvas(canvas);
}

export function createIconTexture(icon, color, width = 640, height = 1024) {
	const { canvas, context } = createHighResolutionCanvas(width, height);

	const radius = Math.min(canvas.width, canvas.height) / (6 * scaleFactor);
	context.fillStyle = 'black';
	context.beginPath();
	context.arc(
		canvas.width / (2 * scaleFactor),
		canvas.height / (2 * scaleFactor),
		radius,
		0,
		Math.PI * 2
	);
	context.fill();

	context.fillStyle = color;
	context.font = `${radius}px 'Material Icons'`;
	context.textAlign = 'center';
	context.textBaseline = 'middle';
	context.fillText(icon, canvas.width / (2 * scaleFactor), canvas.height / (2 * scaleFactor));

	return createTextureFromCanvas(canvas);
}
