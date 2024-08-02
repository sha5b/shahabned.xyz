import * as THREE from 'three';
import { getImageURL } from '$lib/utils/getURL';
import { goto } from '$app/navigation';
import {
	createIconTexture,
	createTextTexture
} from '$lib/utils/three/text';

// Configurable variables
const defaultRadius = 8;
const defaultShininess = 30;
const defaultTextColor = 'black';

function createRoundedRectTexture(width, height, radius, color = '#f5f5f5') {
	const canvas = document.createElement('canvas');
	canvas.width = width;
	canvas.height = height;
	const context = canvas.getContext('2d');

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

function createMaterial(textureURL, itemWidth, itemHeight, radius = defaultRadius, cardColor = null) {
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
			shininess: defaultShininess
		});

		texture.onUpdate = function () {
			this.needsUpdate = false;
		};
	} else {
		material = new THREE.MeshPhongMaterial({
			color: cardColor || 0xffffff,
			map: roundedRectTexture,
			transparent: true,
			shininess: defaultShininess
		});
	}

	material.alphaMap = roundedRectTexture; // Ensure alphaMap is always applied for rounded corners
	material.transparent = true;

	return material;
}

function createCardMesh(
	itemWidth,
	itemHeight,
	textureURL = null,
	onClick = null,
	cardColor = null,
	textOptions = {}
) {
	const material = createMaterial(textureURL, itemWidth, itemHeight, defaultRadius, cardColor);

	const cardMesh = new THREE.Mesh(new THREE.PlaneGeometry(itemWidth, itemHeight), material);
	cardMesh.receiveShadow = true;

	if (onClick) {
		cardMesh.userData = { onClick };
		cardMesh.callback = onClick;
	}

	// Text texture handling
	const { mainText = '', date = '', type = '', format = '', pageType = 'category', color = defaultTextColor } = textOptions;
	const textTexture = createTextTexture(
		mainText, date, type, format,
		itemWidth * 100, itemHeight * 100,
		18, color, pageType
	);

	const textMaterial = new THREE.MeshBasicMaterial({ map: textTexture, transparent: true });
	const textMesh = new THREE.Mesh(new THREE.PlaneGeometry(itemWidth, itemHeight), textMaterial);

	textMesh.position.set(0, 0, 0.1);
	textMesh.castShadow = true;
	textMesh.raycast = () => {};

	cardMesh.add(textMesh);

	return cardMesh;
}

function createNavigationCardMesh(itemWidth, itemHeight, icon, color, onClick) {
	const cardMesh = createCardMesh(itemWidth, itemHeight, null, onClick, color);
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

	const cardMesh = createCardMesh(
		itemWidth, itemHeight, textureURL, 
		() => onClick ? onClick(work) : goto(`/${category}/${work.title}`),
		null,
		{
			mainText: pageType === 'landing' ? category : work.title,
			date: work.date,
			type: work.type,
			format: work.format,
			pageType,
			color: textColor
		}
	);

	addCard(gridContainer, cardMesh, x, y);
}

function addCategoryCard(gridContainer, category, x, y, itemWidth, itemHeight, onClick) {
	const textureURL = getImageURL('category', category.id, category.thump, '400x600');
	const cardMesh = createCardMesh(
		itemWidth, itemHeight, textureURL,
		() => onClick ? onClick(category) : goto(`/${category.title}`),
		null,
		{ mainText: category.title }
	);

	addCard(gridContainer, cardMesh, x, y);
}

function addNavigationCard(gridContainer, icon, color, x, y, itemWidth, itemHeight, onClick) {
	const cardMesh = createNavigationCardMesh(itemWidth, itemHeight, icon, color, onClick);
	addCard(gridContainer, cardMesh, x, y);
}

function addImageCard(gridContainer, image, x, y, itemWidth, itemHeight) {
	const textureURL = getImageURL('works', image.id, image.thump, '400x600');
	const cardMesh = createCardMesh(itemWidth, itemHeight, textureURL);

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
	addImageCard
};
