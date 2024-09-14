import { Tween, Easing, update as tweenUpdate } from '@tweenjs/tween.js';
import * as THREE from 'three';

// Configurable variables
const animationDuration = 500;
const maxRotationMultiplier = 3;
const rotationLerpFactor = 0.1;

export function snapCameraToGrid(camera, itemWidth, itemHeight, padding) {
    const snapX = Math.round(camera.position.x / (itemWidth + padding)) * (itemWidth + padding);
    const snapY = Math.round(camera.position.y / (itemHeight + padding)) * (itemHeight + padding);
    animateToPosition(camera, snapX, snapY);
}

export function animateToPosition(camera, x, y) {
    new Tween(camera.position).to({ x, y }, animationDuration).easing(Easing.Quadratic.Out).start();
}

export function animate(renderer, scene, camera, composer = null) {
    requestAnimationFrame(() => animate(renderer, scene, camera, composer));
    tweenUpdate();
    if (composer) {
        composer.render();
    } else {
        renderer.render(scene, camera);
    }
}

export function rotateCardTowardsMouse(card, mouse, camera, maxRotation) {
    const vector = new THREE.Vector3();
    card.getWorldPosition(vector);

    const dx = mouse.x - vector.x;
    const dy = mouse.y - vector.y;

    const targetRotationX = Math.atan2(dy, camera.position.z) * maxRotationMultiplier;
    const targetRotationY = Math.atan2(dx, camera.position.z) * maxRotationMultiplier;

    card.rotation.x = THREE.MathUtils.lerp(card.rotation.x, THREE.MathUtils.clamp(-targetRotationX, -maxRotation, maxRotation), rotationLerpFactor);
    card.rotation.y = THREE.MathUtils.lerp(card.rotation.y, THREE.MathUtils.clamp(targetRotationY, -maxRotation, maxRotation), rotationLerpFactor);
}

export function updateCardTransparency(gridContainer, camera, maxDistance) {
    gridContainer.children.forEach((child) => {
        const distance = camera.position.distanceTo(child.position);
        child.material.opacity = THREE.MathUtils.clamp(1 - distance / maxDistance, 0, 1);
        child.material.transparent = child.material.opacity < 1;
    });
}
