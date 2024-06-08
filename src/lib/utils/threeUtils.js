import * as THREE from 'three';
import { getImageURL } from '$lib/utils/getURL';
import { Tween, Easing, update as tweenUpdate } from '@tweenjs/tween.js';

// Configuration variables
const CAMERA_SETTINGS = {
    fov: 75,
    aspect: typeof window !== 'undefined' ? window.innerWidth / window.innerHeight : 1,
    near: 0.1,
    far: 1000,
    position: { z: 20 }
};

const RENDERER_SETTINGS = {
    antialias: true,
    size: {
        width: typeof window !== 'undefined' ? window.innerWidth : 800,
        height: typeof window !== 'undefined' ? window.innerHeight : 600
    }
};

const GRID_ITEM_SETTINGS = {
    color: 0xffffff, // Ensure the background color is white
    text: {
        color: '#000000',
        font: '30px Oxanium'
    },
    canvas: {
        width: 512,
        height: 256
    }
};

export function createScene() {
    return new THREE.Scene();
}

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

export function createRenderer(settings = RENDERER_SETTINGS) {
    if (typeof window === 'undefined') {
        return null; // or a placeholder renderer
    }

    const renderer = new THREE.WebGLRenderer({ antialias: settings.antialias });
    renderer.setSize(settings.size.width, settings.size.height);
    renderer.outputEncoding = THREE.sRGBEncoding; // Ensure the renderer output encoding is set to sRGB
    return renderer;
}

// Function to create material with texture
export function createMaterialWithTexture(textureURL, itemWidth, itemHeight) {
    const loader = new THREE.TextureLoader();
    const texture = loader.load(textureURL, (texture) => {
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
    });

    return new THREE.MeshBasicMaterial({ map: texture, color: 0xffffff });
}

export function addCard(gridContainer, title, description, x, y, itemWidth, itemHeight, textureURL = null, settings = GRID_ITEM_SETTINGS, onClick = null) {
    let material;

    if (textureURL) {
        material = createMaterialWithTexture(textureURL, itemWidth, itemHeight);
    } else {
        material = new THREE.MeshBasicMaterial({ color: settings.color });
    }

    const cardMesh = new THREE.Mesh(new THREE.PlaneGeometry(itemWidth, itemHeight), material);
    cardMesh.position.set(x, y, 0);
    gridContainer.add(cardMesh);

    if (onClick) {
        cardMesh.userData = { onClick, description };
        cardMesh.callback = onClick;
    }
}

export function getGridPositions(index, cols, itemWidth, itemHeight, padding) {
    const gap = padding;
    const row = Math.floor(index / cols);
    const col = index % cols;
    const x = col * (itemWidth + gap);
    const y = -row * (itemHeight + gap);
    return { x, y };
}

export function calculateGridSize(works) {
    const gridCols = Math.ceil(Math.sqrt(works.length + 1));
    const gridRows = Math.ceil((works.length + 1) / gridCols);
    return { gridCols, gridRows };
}

export function generatePositions(count, itemWidth, itemHeight, padding) {
    const positions = [];
    const totalCols = Math.ceil(Math.sqrt(count));
    for (let i = 0; i < count; i++) {
        const { x, y } = getGridPositions(i, totalCols, itemWidth, itemHeight, padding);
        positions.push({ x, y });
    }
    return positions;
}

export function addWorkCard(gridContainer, work, x, y, itemWidth, itemHeight, padding, onClick) {
    const description = work.expand?.category?.title || 'No Category';
    const textureURL = getImageURL('works', work.id, work.thump);
    addCard(gridContainer, work.title, description, x, y, itemWidth, itemHeight, textureURL, GRID_ITEM_SETTINGS, onClick);
}

export function createCompleteGrid(gridContainer, works, title, itemWidth, itemHeight, padding, onClick) {
    const totalCards = works.length + 1;
    const positions = generatePositions(totalCards, itemWidth, itemHeight, padding);

    addCard(gridContainer, title, '', positions[0].x, positions[0].y, itemWidth, itemHeight);

    for (let i = 1; i < totalCards; i++) {
        const work = works[i - 1];
        addWorkCard(gridContainer, work, positions[i].x, positions[i].y, itemWidth, itemHeight, padding, onClick);
    }
}

export function fillEmptySpaces(gridContainer, works, itemWidth, itemHeight, padding) {
    const bounds = new THREE.Box3().setFromObject(gridContainer);
    const width = bounds.max.x - bounds.min.x;
    const height = bounds.max.y - bounds.min.y;
    const cols = Math.ceil(width / (itemWidth + padding));
    const rows = Math.ceil(height / (itemHeight + padding));
    const totalCards = cols * rows;

    for (let i = 0; i < totalCards; i++) {
        const { x, y } = getGridPositions(i, cols, itemWidth, itemHeight, padding);
        if (!isPositionOccupied(gridContainer, x, y, itemWidth, itemHeight)) {
            const cardIndex = i % works.length;
            const work = works[cardIndex];
            addWorkCard(gridContainer, work, x, y, itemWidth, itemHeight, padding);
        }
    }
}

export function isPositionOccupied(gridContainer, x, y, itemWidth, itemHeight) {
    return gridContainer.children.some(child => {
        return Math.abs(child.position.x - x) < itemWidth / 2 && Math.abs(child.position.y - y) < itemHeight / 2;
    });
}

export function wrapGrid(gridContainer, camera, gridCols, gridRows, itemWidth, itemHeight, padding) {
    const wrapOffsetX = gridCols * (itemWidth + padding);
    const wrapOffsetY = gridRows * (itemHeight + padding);

    gridContainer.children.forEach(child => {
        if (child.position.x > camera.position.x + wrapOffsetX / 2) {
            child.position.x -= wrapOffsetX;
        } else if (child.position.x < camera.position.x - wrapOffsetX / 2) {
            child.position.x += wrapOffsetX;
        }

        if (child.position.y > camera.position.y + wrapOffsetY / 2) {
            child.position.y -= wrapOffsetY;
        } else if (child.position.y < camera.position.y - wrapOffsetY / 2) {
            child.position.y += wrapOffsetY;
        }
    });
}

export function cleanupGrid(gridContainer, camera) {
    const bounds = new THREE.Box3(
        new THREE.Vector3(camera.position.x - 50, camera.position.y - 50, -1),
        new THREE.Vector3(camera.position.x + 50, camera.position.y + 50, 1)
    );

    for (let i = gridContainer.children.length - 1; i >= 0; i--) {
        const child = gridContainer.children[i];
        if (!bounds.containsPoint(child.position)) {
            gridContainer.remove(child);
        }
    }
}

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
