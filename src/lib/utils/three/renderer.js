import * as THREE from 'three';

const RENDERER_SETTINGS = {
    antialias: true,
    size: {
        width: typeof window !== 'undefined' ? window.innerWidth : 800,
        height: typeof window !== 'undefined' ? window.innerHeight : 600
    }
};

export function createRenderer(settings = RENDERER_SETTINGS) {
    if (typeof window === 'undefined') {
        return null; // or a placeholder renderer
    }

    const renderer = new THREE.WebGLRenderer({ antialias: settings.antialias });
    renderer.setSize(settings.size.width, settings.size.height);
    renderer.toneMapping = THREE.ACESFilmicToneMapping; // Adjust tone mapping
    return renderer;
}
