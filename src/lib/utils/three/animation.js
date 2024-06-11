import { Tween, Easing, update as tweenUpdate } from '@tweenjs/tween.js';
import * as THREE from 'three';

export function snapCameraToGrid(camera, itemWidth, itemHeight, padding) {
	const snapX = Math.round(camera.position.x / (itemWidth + padding)) * (itemWidth + padding);
	const snapY = Math.round(camera.position.y / (itemHeight + padding)) * (itemHeight + padding);
	animateToPosition(camera, snapX, snapY);
}

export function animateToPosition(camera, x, y) {
	new Tween(camera.position).to({ x, y }, 500).easing(Easing.Quadratic.Out).start();
}

export function animate(renderer, scene, camera) {
	requestAnimationFrame(() => animate(renderer, scene, camera));
	tweenUpdate();
	renderer.render(scene, camera);
}

export function rotateCardTowardsMouse(card, mouse, camera, maxRotation) {
	const vector = new THREE.Vector3();
	card.getWorldPosition(vector);

	const dx = mouse.x - vector.x;
	const dy = mouse.y - vector.y;

	// Increase the effect of the target rotations
	const targetRotationX = Math.atan2(dy, camera.position.z) * 3; // Amplify by 3
	const targetRotationY = Math.atan2(dx, camera.position.z) * 3; // Amplify by 3

	const smoothRotationX = THREE.MathUtils.lerp(
		card.rotation.x,
		THREE.MathUtils.clamp(-targetRotationX, -maxRotation, maxRotation),
		0.1
	);
	const smoothRotationY = THREE.MathUtils.lerp(
		card.rotation.y,
		THREE.MathUtils.clamp(targetRotationY, -maxRotation, maxRotation),
		0.1
	);

	card.rotation.x = smoothRotationX;
	card.rotation.y = smoothRotationY;
}

export function updateCardTransparency(gridContainer, camera, maxDistance) {
	gridContainer.children.forEach((child) => {
		const distance = camera.position.distanceTo(child.position);
		const transparency = THREE.MathUtils.clamp(1 - distance / maxDistance, 0.1, 1);
		child.material.opacity = transparency;
	});
}
