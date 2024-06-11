import * as THREE from 'three';

export function createScene() {
    const scene = new THREE.Scene();

    // Adjust ambient light intensity
    const ambientLight = new THREE.AmbientLight(0xffffff, 1); // Change intensity as needed
    scene.add(ambientLight);

    // Optional: add additional lights and adjust intensity
    const directionalLight = new THREE.DirectionalLight(0xffffff, 0.5);
    directionalLight.position.set(10, 10, 10).normalize();
    scene.add(directionalLight);

    return scene;
}
