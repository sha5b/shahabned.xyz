import { Tween, Easing, update as tweenUpdate } from '@tweenjs/tween.js';
import * as THREE from 'three';

export function snapCameraToGrid(camera, itemWidth, itemHeight, padding) {
    const snapX = Math.round(camera.position.x / (itemWidth + padding)) * (itemWidth + padding);
    const snapY = Math.round(camera.position.y / (itemHeight + padding)) * (itemHeight + padding);
    animateToPosition(camera, snapX, snapY);
}

export function animateToPosition(camera, x, y) {
    new Tween(camera.position)
        .to({ x, y }, 500)
        .easing(Easing.Quadratic.Out)
        .start();
}

export function animate(renderer, scene, camera) {
    requestAnimationFrame(() => animate(renderer, scene, camera));
    tweenUpdate();
    renderer.render(scene, camera);
}

export function rotateCardTowardsMouse(card, mouseX, mouseY, camera, maxRotation) {
    const vector = new THREE.Vector3();
    card.getWorldPosition(vector);

    const dx = mouseX - vector.x;
    const dy = mouseY - vector.y;

    const angle = Math.atan2(dy, dx);

    card.rotation.z = THREE.MathUtils.clamp(angle, -maxRotation, maxRotation);
}

export function updateCardTransparency(gridContainer, camera, maxDistance) {
    gridContainer.children.forEach(child => {
        const distance = camera.position.distanceTo(child.position);
        const transparency = THREE.MathUtils.clamp(1 - distance / maxDistance, 0.1, 1);
        child.material.opacity = transparency;
    });
}
