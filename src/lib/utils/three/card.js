import * as THREE from 'three';
import { getImageURL } from '$lib/utils/getURL';
import { goto } from '$app/navigation';

const CARD_SETTINGS = {
	color: 0xffffff,
	text: {
		color: '#000000',
		font: '30px Oxanium'
	},
	canvas: {
		width: 512,
		height: 256
	}
};

function createRoundedRectTexture(width, height, radius, resolution = 1024) {
	const canvas = document.createElement('canvas');
	canvas.width = resolution;
	canvas.height = resolution * (height / width);
	const context = canvas.getContext('2d');
	const scale = resolution / width;

	context.scale(scale, scale);

	context.fillStyle = '#ffffff';
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

function createMaterialWithTexture(textureURL, itemWidth, itemHeight, radius = 8) {
	let material;

	if (textureURL) {
		const loader = new THREE.TextureLoader();
		const texture = loader.load(textureURL, (texture) => {
			texture.colorSpace = THREE.SRGBColorSpace; // Ensure correct color space

			const aspectRatio = texture.image.width / texture.image.height;
			const cardAspectRatio = itemWidth / itemHeight;

			let repeatX = 1,
				repeatY = 1;
			let offsetX = 0,
				offsetY = 0;

			if (aspectRatio > cardAspectRatio) {
				repeatX = cardAspectRatio / aspectRatio;
				offsetX = (1 - repeatX) / 2;
			} else {
				repeatY = aspectRatio / cardAspectRatio;
				offsetY = (1 - repeatY) / 2;
			}

			texture.wrapS = THREE.ClampToEdgeWrapping;
			texture.wrapT = THREE.ClampToEdgeWrapping;
			texture.repeat.set(repeatX, repeatY);
			texture.offset.set(offsetX, offsetY);
			material.needsUpdate = true; // Ensure material updates
		});

		const roundedRectTexture = createRoundedRectTexture(itemWidth * 100, itemHeight * 100, radius);

		material = new THREE.MeshPhongMaterial({
			map: texture,
			alphaMap: roundedRectTexture,
			transparent: true,
			color: 0xffffff,
			shininess: 30 // Adjust for more realistic lighting
		});
	} else {
		const roundedRectTexture = createRoundedRectTexture(itemWidth * 100, itemHeight * 100, radius);

		material = new THREE.MeshPhongMaterial({
			map: roundedRectTexture,
			transparent: true,
			color: 0xffffff,
			shininess: 30 // Adjust for more realistic lighting
		});
	}

	return material;
}

function addCard(
	gridContainer,
	title,
	description,
	x,
	y,
	itemWidth,
	itemHeight,
	textureURL = null,
	settings = CARD_SETTINGS,
	onClick = null,
	radius = 8
) {
	const material = createMaterialWithTexture(textureURL, itemWidth, itemHeight, radius);

	const cardMesh = new THREE.Mesh(new THREE.PlaneGeometry(itemWidth, itemHeight), material);
	cardMesh.position.set(x, y, 0);
	gridContainer.add(cardMesh);

	if (onClick) {
		cardMesh.userData = { onClick, description };
		// @ts-ignore
		cardMesh.callback = onClick;
	}
}

function addWorkCard(
	gridContainer,
	work,
	x,
	y,
	itemWidth,
	itemHeight,
	padding,
	onClick,
	renderer,
	camera
) {
	const category = work?.expand?.category?.title || 'No Category';
	const textureURL = getImageURL('works', work.id, work.thump);
	addCard(
		gridContainer,
		work.title,
		category,
		x,
		y,
		itemWidth,
		itemHeight,
		textureURL,
		CARD_SETTINGS,
		() => {
			console.log('Category:', category);
			goto(`/category/${category}`);
		},
		8
	);
}

export { createRoundedRectTexture, createMaterialWithTexture, addCard, addWorkCard };
