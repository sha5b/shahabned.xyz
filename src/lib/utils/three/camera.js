import * as THREE from 'three';

const CAMERA_SETTINGS = {
	fov: 75,
	aspect: typeof window !== 'undefined' ? window.innerWidth / window.innerHeight : 1,
	near: 0.1,
	far: 1000,
	position: { z: 20 }
};

export function createCamera(settings = CAMERA_SETTINGS) {
	const camera = new THREE.PerspectiveCamera(
		settings.fov,
		settings.aspect,
		settings.near,
		settings.far
	);
	camera.position.z = settings.position.z;
	return camera;
}

export function onWindowResize(camera, renderer) {
	camera.aspect = window.innerWidth / window.innerHeight;
	camera.updateProjectionMatrix();
	renderer.setSize(window.innerWidth, window.innerHeight);
}
