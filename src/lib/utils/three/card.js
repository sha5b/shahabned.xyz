//src/lib/utils/three/card.js
import * as THREE from 'three';
import { getImageURL } from '$lib/utils/getURL';
import { goto } from '$app/navigation';

function createRoundedRectTexture(width, height, radius, resolution = 1024, color = '#f5f5f5') {
	const canvas = document.createElement('canvas');
	canvas.width = resolution;
	canvas.height = resolution * (height / width);
	const context = canvas.getContext('2d');
	const scale = resolution / width;

	context.scale(scale, scale);

	context.fillStyle = color;
	context.beginPath();
	context.moveTo(radius, 0);
	context.lineTo(width - radius, 0);
	context.quadraticCurveTo(width, 0, width, radius);
	context.lineTo(width, height - radius);
	context.quadraticCurveTo(width, height, width - radius, height);
	context.lineTo(radius, height);
	context.quadraticCurveTo(0, height, 0, height - radius);
	context.lineTo(0, radius);
	context.quadraticCurveTo(0, 0, radius, 0);
	context.closePath();
	context.fill();

	return new THREE.CanvasTexture(canvas);
}

function createIconTexture(icon, color, width = 640, height = 1024) {
	const canvas = document.createElement('canvas');
	canvas.width = width;
	canvas.height = height;
	const context = canvas.getContext('2d');

	context.clearRect(0, 0, width, height);

	const radius = Math.min(width, height) / 4;
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

function createTextTexture(text, width, height, fontSize = 24, color = 'black') {
    const canvas = document.createElement('canvas');
    canvas.width = width;
    canvas.height = height;
    const context = canvas.getContext('2d');

    context.clearRect(0, 0, width, height);
    context.fillStyle = color;
    context.font = `${fontSize}px Oxanium`;
    context.textAlign = 'left';
    context.textBaseline = 'bottom';

    // Calculate the maximum width for the text
    const maxWidth = width - 10; // 10 pixels padding from the edge

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
    let y = height - 10; // 10 pixels padding from the bottom
    for (let i = lines.length - 1; i >= 0; i--) {
        context.fillText(lines[i], 10, y);
        y -= fontSize;
    }

    return new THREE.CanvasTexture(canvas);
}


function createMaterial(textureURL, itemWidth, itemHeight, radius = 8) {
	const roundedRectTexture = createRoundedRectTexture(itemWidth * 100, itemHeight * 100, radius);
	let material;

	if (textureURL) {
		const loader = new THREE.TextureLoader();
		const texture = loader.load(textureURL, (texture) => {
			texture.colorSpace = THREE.SRGBColorSpace;

			const aspectRatio = texture.image.width / texture.image.height;
			const cardAspectRatio = itemWidth / itemHeight;

			if (aspectRatio > cardAspectRatio) {
				texture.repeat.set(cardAspectRatio / aspectRatio, 1);
				texture.offset.set((1 - texture.repeat.x) / 2, 0);
			} else {
				texture.repeat.set(1, aspectRatio / cardAspectRatio);
				texture.offset.set(0, (1 - texture.repeat.y) / 2);
			}

			texture.wrapS = THREE.ClampToEdgeWrapping;
			texture.wrapT = THREE.ClampToEdgeWrapping;
			material.needsUpdate = true;
		});

		material = new THREE.MeshPhongMaterial({
			map: texture,
			alphaMap: roundedRectTexture,
			transparent: true,
			color: 0xffffff,
			shininess: 30
		});

		texture.onUpdate = function () {
			this.needsUpdate = false;
		};
	} else {
		material = new THREE.MeshPhongMaterial({
			map: roundedRectTexture,
			transparent: true,
			color: 0xffffff,
			shininess: 30
		});
	}

	return material;
}

function parseHexColor(hex) {
	try {
		return new THREE.Color(hex);
	} catch {
		console.error(`Invalid color: ${hex}`);
		return new THREE.Color(0xffffff);
	}
}

function createCardMesh(itemWidth, itemHeight, textureURL, radius = 8, onClick = null, cardColor = null, text = null, textColor = 'black') {
    let material;
    if (cardColor) {
        const parsedColor = parseHexColor(cardColor);
        material = new THREE.MeshPhongMaterial({
            color: parsedColor,
            shininess: 30,
            transparent: true
        });
    } else {
        material = createMaterial(textureURL, itemWidth, itemHeight, radius);
    }

    const cardMesh = new THREE.Mesh(new THREE.PlaneGeometry(itemWidth, itemHeight), material);
    cardMesh.receiveShadow = true;

    if (onClick) {
        cardMesh.userData = { onClick };
        // @ts-ignore
        cardMesh.callback = onClick;
    }

    if (text) {
        const textTexture = createTextTexture(text, itemWidth * 100, itemHeight * 100, 24, textColor); // Use textColor here
        const textMaterial = new THREE.MeshBasicMaterial({ map: textTexture, transparent: true });
        const textMesh = new THREE.Mesh(new THREE.PlaneGeometry(itemWidth, itemHeight), textMaterial);
        
        textMesh.position.set(0, 0, 0.1);
        textMesh.castShadow = true;
        textMesh.raycast = () => {};
        
        cardMesh.add(textMesh);
    }

    return cardMesh;
}

function createNavigationCardMesh(itemWidth, itemHeight, icon, color, onClick) {
	const radius = 8;
	const roundedRectTexture = createRoundedRectTexture(itemWidth * 100, itemHeight * 100, radius);
	const parsedColor = parseHexColor(color); // Ensure this function works correctly
	const cardMaterial = new THREE.MeshPhongMaterial({
		map: roundedRectTexture,
		transparent: true,
		color: parsedColor,
		shininess: 30
	});

	const cardMesh = new THREE.Mesh(new THREE.PlaneGeometry(itemWidth, itemHeight), cardMaterial);
	cardMesh.receiveShadow = true;

	if (onClick) {
		cardMesh.userData = { onClick };
		// @ts-ignore
		cardMesh.callback = onClick;
	}

	const iconTexture = createIconTexture(icon, color);
	const iconMaterial = new THREE.MeshBasicMaterial({ map: iconTexture, transparent: true });
	const iconMesh = new THREE.Mesh(new THREE.PlaneGeometry(itemWidth, itemHeight), iconMaterial);

	iconMesh.position.set(0, 0, 0.25);
	iconMesh.castShadow = true;
	iconMesh.raycast = () => {};

	cardMesh.add(iconMesh);

	return cardMesh;
}

function addCard(gridContainer, cardMesh, x, y) {
	cardMesh.position.set(x, y, 0);
	gridContainer.add(cardMesh);
}

function addWorkCard(gridContainer, work, x, y, itemWidth, itemHeight, onClick) {
    const category = work?.expand?.category?.title || 'No Category';
    const textureURL = getImageURL('works', work.id, work.thump, '400x600');
    const textColor = work.expand.category.color; // Assuming the color is available here

    const cardMesh = createCardMesh(itemWidth, itemHeight, textureURL, 8, () => {
        if (onClick) {
            onClick(work);
        } else {
            goto(`/${category}/${work.title}`);
        }
    }, null, work.title, textColor); // Pass work title as text and color

    addCard(gridContainer, cardMesh, x, y);
}

function addCategoryCard(gridContainer, category, x, y, itemWidth, itemHeight, onClick) {
    const textureURL = getImageURL('category', category.id, category.thump, '400x600');
    const cardMesh = createCardMesh(itemWidth, itemHeight, textureURL, 8, () => {
        if (onClick) {
            onClick(category);
        } else {
            goto(`/${category.title}`);
        }
    }, null, category.title); // Pass category title as text
	
    addCard(gridContainer, cardMesh, x, y);
}

function addNavigationCard(gridContainer, icon, color, x, y, itemWidth, itemHeight, onClick) {
	const cardMesh = createNavigationCardMesh(itemWidth, itemHeight, icon, color, onClick);
	addCard(gridContainer, cardMesh, x, y);
}

function addImageCard(gridContainer, image, x, y, itemWidth, itemHeight) {
	const textureURL = getImageURL('works', image.id, image.thump, '400x600');
	const cardMesh = createCardMesh(itemWidth, itemHeight, textureURL, 8, () => {
		console.log('Image card clicked:', image);
	});

	addCard(gridContainer, cardMesh, x, y);
}

export {
	createRoundedRectTexture,
	createIconTexture,
	createMaterial,
	createCardMesh,
	addCard,
	addWorkCard,
	addCategoryCard,
	addNavigationCard,
	addImageCard
};
