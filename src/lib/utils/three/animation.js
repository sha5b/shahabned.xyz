import { Tween, Easing, update as tweenUpdate } from '@tweenjs/tween.js';

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
