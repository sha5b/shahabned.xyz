//src/lib/utils/three/scene.js
import * as THREE from 'three';

export function createScene() {
	const scene = new THREE.Scene();

	// Adjust ambient light intensity
	const ambientLight = new THREE.AmbientLight(0xffffff, 0.5); // Change intensity as needed
	scene.add(ambientLight);

	// Optional: add additional lights and adjust intensity
	const directionalLight = new THREE.DirectionalLight(0xffffff, 5);
	directionalLight.position.set(10, 10, 10).normalize();
	directionalLight.castShadow = true; // Enable shadow casting
	directionalLight.shadow.mapSize.width = 2048; // Shadow map resolution
	directionalLight.shadow.mapSize.height = 2048;
	directionalLight.shadow.camera.near = 0.5;
	directionalLight.shadow.camera.far = 500;
	scene.add(directionalLight);

	return scene;
}
