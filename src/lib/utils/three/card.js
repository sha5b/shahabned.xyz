// src/lib/utils/three/card.js
import * as THREE from 'three';
import { getImageURL } from '$lib/utils/getURL';
import { goto } from '$app/navigation';
import {
	createIconTexture,
	createTextTexture,
	createWorkDetailTextTexture,
	createSynopsisTextTexture,
	createExhibitionsTextTexture,
	createColabsTextTexture
} from '$lib/utils/three/text';

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

function createCardMesh(
	itemWidth,
	itemHeight,
	textureURL,
	radius = 8,
	onClick = null,
	cardColor = null,
	textOptions = {}
) {
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

	// Create the combined text texture
	let textTexture;
	const { textType, mainText, date, type, format, pageType, color, data } = textOptions;

	switch (textType) {
		case 'workDetail':
			textTexture = createWorkDetailTextTexture(
				data,
				itemWidth * 100,
				itemHeight * 100,
				18,
				color || 'black'
			);
			break;
		case 'synopsis':
			textTexture = createSynopsisTextTexture(
				data,
				itemWidth * 100,
				itemHeight * 100,
				18,
				color || 'black'
			);
			break;
		case 'exhibitions':
			textTexture = createExhibitionsTextTexture(
				data,
				itemWidth * 100,
				itemHeight * 100,
				18,
				color || 'black'
			);
			break;
		case 'colabs':
			textTexture = createColabsTextTexture(
				data,
				itemWidth * 100,
				itemHeight * 100,
				18,
				color || 'black'
			);
			break;
		default:
			textTexture = createTextTexture(
				mainText || '',
				date || '',
				type || '',
				format || '',
				itemWidth * 100,
				itemHeight * 100,
				18,
				color || 'black',
				pageType || 'category'
			);
			break;
	}

	const textMaterial = new THREE.MeshBasicMaterial({ map: textTexture, transparent: true });
	const textMesh = new THREE.Mesh(new THREE.PlaneGeometry(itemWidth, itemHeight), textMaterial);

	textMesh.position.set(0, 0, 0.1);
	textMesh.castShadow = true;
	textMesh.raycast = () => {};

	cardMesh.add(textMesh);

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

function addWorkCard(gridContainer, work, x, y, itemWidth, itemHeight, onClick, pageType) {
	const category = work?.expand?.category?.title || 'No Category';
	const textureURL = getImageURL('works', work.id, work.thump, '400x600');
	const textColor = work.expand.category.color;

	const mainText = pageType === 'landing' ? category : work.title;

	const cardMesh = createCardMesh(
		itemWidth,
		itemHeight,
		textureURL,
		8,
		() => {
			if (onClick) {
				onClick(work);
			} else {
				goto(`/${category}/${work.title}`);
			}
		},
		null,
		{
			mainText: mainText,
			date: work.date,
			type: work.type,
			format: work.format,
			pageType: pageType,
			color: textColor
		}
	);

	addCard(gridContainer, cardMesh, x, y);
}

function addCategoryCard(gridContainer, category, x, y, itemWidth, itemHeight, onClick) {
	const textureURL = getImageURL('category', category.id, category.thump, '400x600');
	const cardMesh = createCardMesh(
		itemWidth,
		itemHeight,
		textureURL,
		8,
		() => {
			if (onClick) {
				onClick(category);
			} else {
				goto(`/${category.title}`);
			}
		},
		null,
		category.title
	); // Pass category title as text

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

function addWorkDetailsCard(gridContainer, work, x, y, itemWidth, itemHeight, onClick) {
	const cardMesh = createCardMesh(itemWidth, itemHeight, null, 8, onClick, null, {
		textType: 'workDetail', // Ensure this is set to 'workDetail'
		data: work,
		color: 'black'
	});

	addCard(gridContainer, cardMesh, x, y);
}

function addSynopsisCard(gridContainer, work, x, y, itemWidth, itemHeight, onClick) {
	const cardMesh = createCardMesh(itemWidth, itemHeight, null, 8, onClick, null, {
		textType: 'synopsis',
		data: work.synopsis,
		color: 'black'
	});
	addCard(gridContainer, cardMesh, x, y);
}

function addColabsCard(gridContainer, work, x, y, itemWidth, itemHeight, onClick) {
    const colabData = work.colabs || [];
    if (!Array.isArray(colabData) || colabData.length === 0) return; // Skip if no colabs data
    const cardMesh = createCardMesh(itemWidth, itemHeight, null, 8, onClick, null, {
        textType: 'colabs',
        data: colabData,
        color: 'black'
    });
    addCard(gridContainer, cardMesh, x, y);
}
function addExhibitionsCard(gridContainer, work, x, y, itemWidth, itemHeight, onClick) {
    const exhibitionsData = work.exhibitions || [];
    if (!Array.isArray(exhibitionsData) || exhibitionsData.length === 0) return; // Skip if no exhibitions data
    const cardMesh = createCardMesh(itemWidth, itemHeight, null, 8, onClick, null, {
        textType: 'exhibitions',
        data: exhibitionsData,
        color: 'black'
    });
    addCard(gridContainer, cardMesh, x, y);
}

export {
	createRoundedRectTexture,
	createMaterial,
	createCardMesh,
	addCard,
	addWorkCard,
	addCategoryCard,
	addNavigationCard,
	addImageCard,
	addWorkDetailsCard,
	addSynopsisCard,
	addColabsCard,
	addExhibitionsCard
};
