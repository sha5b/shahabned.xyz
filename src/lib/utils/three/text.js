// src/lib/utils/three/text.js
import * as THREE from 'three';

const scaleFactor = 4;

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
	fontSize = 18,
	align = 'left',
	baseline = 'bottom',
	bold = false
) {
	if (typeof text !== 'string') return;

	context.textAlign = align;
	context.textBaseline = baseline;
	context.font = bold ? `bold ${fontSize}px Oxanium` : `${fontSize}px Oxanium`;

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
		y += fontSize;
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

export function createIconTexture(icon, color, width = 640, height = 1024) {
	const { canvas, context } = createHighResolutionCanvas(width, height);

	const radius = Math.min(canvas.width, canvas.height) / (6 * scaleFactor);
	context.fillStyle = 'black';
	context.beginPath();
	context.arc(canvas.width / (2 * scaleFactor), canvas.height / (2 * scaleFactor), radius, 0, Math.PI * 2);
	context.fill();

	context.fillStyle = color;
	context.font = `${radius}px 'Material Icons'`;
	context.textAlign = 'center';
	context.textBaseline = 'middle';
	context.fillText(icon, canvas.width / (2 * scaleFactor), canvas.height / (2 * scaleFactor));

	return createTextureFromCanvas(canvas);
}

export function createTextTexture(
	title,
	date,
	type,
	format,
	width,
	height,
	fontSize = 18,
	color = 'black',
	pageType = 'work'
) {
	const { canvas, context } = createHighResolutionCanvas(width, height);

	context.fillStyle = color;
	context.font = `${fontSize}px Oxanium`;
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
			drawText(context, formattedDate, 10, 10 + fontSize, width, fontSize, 'left', 'top');
			drawText(context, type, width - 10, 10 + fontSize, width, fontSize, 'right', 'top');
		}

		const paddingBetweenFormatAndTitle = 20;
		if (format) {
			drawText(context, format, 10, height - 40 - paddingBetweenFormatAndTitle - fontSize, width, fontSize, 'left', 'bottom');
		}
	}

	if (title) {
		drawText(context, title, 10, height - 40, width, fontSize, 'left', 'bottom', true);
	}

	return createTextureFromCanvas(canvas);
}

export function createWorkDetailTextTexture(
	work,
	width = 640,
	height = 1024,
	fontSize = 18,
	color = 'black'
) {
	const { canvas, context } = createHighResolutionCanvas(width, height);

	console.log('Workdetail text created')

	context.fillStyle = color;
	context.font = `${fontSize}px Oxanium`;
	context.textAlign = 'left';
	context.textBaseline = 'top';

	const paddingBetweenLines = fontSize + 5;
	let y = 10;

	if (work.date) {
		const formattedDate = work.date
			? new Intl.DateTimeFormat('en-US', {
					year: 'numeric',
					month: 'long'
				}).format(new Date(work.date))
			: '';
		drawText(context, formattedDate, 10, y, width - 20, fontSize, 'left', 'top');
	}

	if (work.type) {
		drawText(context, work.type, width - 10, y, width - 20, fontSize, 'right', 'top');
	}
	y += paddingBetweenLines;

	if (work.edition) {
		drawText(context, `Edition: ${work.edition}`, 10, y, width - 20, fontSize, 'left', 'top');
		y += paddingBetweenLines;
	}

	if (work.dimension) {
		drawText(context, `${work.dimension}`, 10, y, width - 20, fontSize, 'left', 'top');
		y += paddingBetweenLines;
	}

	// Calculate title position
	let titleY = height ;

	// Format
	if (work.format) {
		const formatLines = wrapText(context, `Format: ${work.format}`, width - 20);
		titleY -= formatLines.length * (fontSize + 5);
		formatLines.forEach(line => {
			drawText(context, line, 10, titleY, width - 20, fontSize, 'left', 'top');
			titleY += paddingBetweenLines;
		});
		titleY -= formatLines.length * (fontSize + 5); // Adjust titleY to account for format lines
	}

	// Title
	if (work.title) {
		const titleLines = wrapText(context, work.title, width - 20);
		titleY -= titleLines.length * (fontSize + 5);
		titleLines.forEach(line => {
			drawText(context, line, 10, titleY, width - 20, fontSize, 'left', 'top', true);
			titleY += paddingBetweenLines;
		});
	}

	return createTextureFromCanvas(canvas);
}



export function createSynopsisTextTexture(
	synopsis,
	width = 640,
	height = 1024,
	fontSize = 18,
	color = 'black'
) {
	const { canvas, context } = createHighResolutionCanvas(width, height);
	console.log('Synopsis text created')

	context.fillStyle = color;
	context.font = `${fontSize}px Oxanium`;
	context.textAlign = 'left';
	context.textBaseline = 'top';

	const richText = new DOMParser().parseFromString(synopsis, 'text/html').body.textContent || synopsis;
	drawText(context, `Synopsis: ${richText}`, 10, 10, width - 20, fontSize);

	return createTextureFromCanvas(canvas);
}

export function createExhibitionsTextTexture(
	exhibitions,
	width = 640,
	height = 1024,
	fontSize = 18,
	color = 'black'
) {
	const { canvas, context } = createHighResolutionCanvas(width, height);
	console.log('Exhibiton text created')


	context.fillStyle = color;
	context.font = `${fontSize}px Oxanium`;
	context.textAlign = 'left';
	context.textBaseline = 'top';

	let y = 10;
	exhibitions.forEach((exhibition) => {
		if (exhibition.title) {
			drawText(context, `Title: ${exhibition.title}`, 10, y, width - 20, fontSize);
			y += fontSize + 5;
		}
		if (exhibition.date) {
			drawText(context, `Date: ${new Date(exhibition.date).toLocaleDateString()}`, 10, y, width - 20, fontSize);
			y += fontSize + 5;
		}
		if (exhibition.location) {
			drawText(context, `Location: ${exhibition.location}`, 10, y, width - 20, fontSize);
			y += fontSize + 10;
		}
	});

	return createTextureFromCanvas(canvas);
}

export function createColabsTextTexture(
	colabs,
	width = 640,
	height = 1024,
	fontSize = 18,
	color = 'black'
) {
	const { canvas, context } = createHighResolutionCanvas(width, height);
	console.log('Colab text created')

	context.fillStyle = color;
	context.font = `${fontSize}px Oxanium`;
	context.textAlign = 'left';
	context.textBaseline = 'top';

	let y = 10;
	colabs.forEach((colab) => {
		if (colab.title) {
			drawText(context, `Title: ${colab.title}`, 10, y, width - 20, fontSize);
			y += fontSize + 5;
		}
		if (colab.role) {
			drawText(context, `Role: ${colab.role}`, 10, y, width - 20, fontSize);
			y += fontSize + 5;
		}
		if (colab.link) {
			drawText(context, `Link: ${colab.link}`, 10, y, width - 20, fontSize);
			y += fontSize + 10;
		}
	});

	return createTextureFromCanvas(canvas);
}
