// src/lib/utils/three/text.js
import * as THREE from 'three';

const scaleFactor = 2;

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

function drawTextWithHyperlink(
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

	context.fillStyle = 'blue';
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
			drawText(
				context,
				format,
				10,
				height - 40 - paddingBetweenFormatAndTitle - fontSize,
				width,
				fontSize,
				'left',
				'bottom'
			);
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

	context.fillStyle = color;
	context.font = `${fontSize}px Oxanium`;
	context.textAlign = 'left';
	context.textBaseline = 'bottom';

	const paddingBetweenLines = fontSize + 5;
	let y = 10 + fontSize;

	const formattedDate = work.date
		? new Intl.DateTimeFormat('en-US', {
				year: 'numeric',
				month: 'long'
			}).format(new Date(work.date))
		: '';

	if (formattedDate || work.type) {
		drawText(context, formattedDate, 10, y, width, fontSize, 'left', 'top');
		drawText(context, work.type, width - 10, y, width, fontSize, 'right', 'top');
		y += paddingBetweenLines;
	}

	if (work.edition) {
		drawText(context, `Edition: ${work.edition}`, 10, y, width, fontSize, 'left', 'top');
		y += paddingBetweenLines;
	}

	if (work.dimension) {
		drawText(context, `${work.dimension}`, 10, y, width, fontSize, 'left', 'top');
		y += paddingBetweenLines;
	}

	const paddingBetweenFormatAndTitle = 20;
	if (work.format) {
		drawText(
			context,
			`Format: ${work.format}`,
			10,
			height - 40 - paddingBetweenFormatAndTitle - fontSize,
			width,
			fontSize,
			'left',
			'bottom'
		);
	}

	if (work.title) {
		const titleLines = wrapText(context, work.title, width - 20);
		let titleY = height - 40 - (titleLines.length - 1) * (fontSize + 5);
		titleLines.forEach((line) => {
			drawText(context, line, 10, titleY, width - 20, fontSize, 'left', 'bottom', true);
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

	context.fillStyle = color;
	context.font = `${fontSize}px Oxanium`;
	context.textAlign = 'left';
	context.textBaseline = 'top';

	const richText =
		new DOMParser().parseFromString(synopsis, 'text/html').body.textContent || synopsis;
	drawText(context, `Synopsis: ${richText}`, 10, 10, width - 20, fontSize);

	return createTextureFromCanvas(canvas);
}

export function createExhibitionsTextTexture(
	exhibitions,
	width = 640,
	height = 1024,
	fontSize = 12,
	color = 'black'
) {
	const { canvas, context } = createHighResolutionCanvas(width, height);

	context.fillStyle = color;
	context.font = `${fontSize}px Oxanium`;
	context.textAlign = 'left';
	context.textBaseline = 'bottom';

	const paddingBetweenLines = fontSize + 5;
	let y = 10 + fontSize;

	// Store clickable areas
	const clickableAreas = [];

	exhibitions.forEach((exhibition) => {
		if (exhibition.title) {
			const titleLines = wrapText(context, exhibition.title, width - 20);
			titleLines.forEach((line) => {
				drawTextWithHyperlink(context, line, 10, y, width - 20, fontSize, 'left', 'top', false);
				clickableAreas.push({
					x: 10,
					y: y - fontSize,
					width: context.measureText(line).width,
					height: fontSize,
					link: exhibition.link
				});
				y += paddingBetweenLines;
			});
			y += 10; // Extra space after each exhibition entry
		}
		if (exhibition.date) {
			const dateText = `Date: ${new Date(exhibition.date).toLocaleDateString()}`;
			const dateLines = wrapText(context, dateText, width - 20);
			dateLines.forEach((line) => {
				drawText(context, line, 10, y, width - 20, fontSize, 'left', 'top');
				y += paddingBetweenLines;
			});
		}
		if (exhibition.location) {
			const locationText = `Location: ${exhibition.location}`;
			const locationLines = wrapText(context, locationText, width - 20);
			locationLines.forEach((line) => {
				drawText(context, line, 10, y, width - 20, fontSize, 'left', 'top');
				y += paddingBetweenLines;
			});
		}
	});

	// Make the canvas clickable
	canvas.addEventListener('click', (event) => {
		const rect = canvas.getBoundingClientRect();
		const x = (event.clientX - rect.left) / scaleFactor;
		const y = (event.clientY - rect.top) / scaleFactor;

		clickableAreas.forEach(area => {
			if (x >= area.x && x <= area.x + area.width && y >= area.y && y <= area.y + area.height) {
				window.open(area.link, '_blank');
			}
		});
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

	context.fillStyle = color;
	context.font = `${fontSize}px Oxanium`;
	context.textAlign = 'left';
	context.textBaseline = 'bottom';

	const paddingBetweenLines = fontSize + 5;
	let y = 10 + fontSize;

	// Store clickable areas
	const clickableAreas = [];

	colabs.forEach((colab) => {
		if (colab.title) {
			const titleLines = wrapText(context, colab.title, width - 20);
			titleLines.forEach((line) => {
				drawTextWithHyperlink(context, line, 10, y, width - 20, fontSize, 'left', 'top', false);
				clickableAreas.push({
					x: 10,
					y: y - fontSize,
					width: context.measureText(line).width,
					height: fontSize,
					link: colab.link
				});
				y += paddingBetweenLines;
			});
			y += 10; // Extra space after each colab entry
		}
	});

	return createTextureFromCanvas(canvas);
}
