//src/lib/three/eventHandlers.js
import * as THREE from 'three';
import { snapCameraToGrid, rotateCardTowardsMouse } from './animation';
import { wrapGrid, cleanupGrid } from './grid';

let dragging = false;
let startX, startY;
let moved = false;
const DRAG_THRESHOLD = 5;

function getMousePositionInScene(event, renderer, camera) {
  const rect = renderer.domElement.getBoundingClientRect();
  const clientX = event.clientX !== undefined ? event.clientX : event.touches[0].clientX;
  const clientY = event.clientY !== undefined ? event.clientY : event.touches[0].clientY;
  const mouseX = ((clientX - rect.left) / rect.width) * 2 - 1;
  const mouseY = -((clientY - rect.top) / rect.height) * 2 + 1;

  const mouseVector = new THREE.Vector3(mouseX, mouseY, 0.5);
  mouseVector.unproject(camera);
  const dir = mouseVector.sub(camera.position).normalize();
  const distance = -camera.position.z / dir.z;
  const mousePosition = camera.position.clone().add(dir.multiplyScalar(distance));
  return mousePosition;
}

function handleClick(event, renderer, camera, gridContainer, loading, lastClickTime) {
  const now = Date.now();
  if (loading || now - lastClickTime < 500) {
    return;
  }
  lastClickTime = now;

  const rect = renderer.domElement.getBoundingClientRect();
  const clientX = event.clientX !== undefined ? event.clientX : event.touches[0].clientX;
  const clientY = event.clientY !== undefined ? event.clientY : event.touches[0].clientY;
  const mouseX = ((clientX - rect.left) / rect.width) * 2 - 1;
  const mouseY = -((clientY - rect.top) / rect.height) * 2 + 1;

  const mouse = new THREE.Vector2(mouseX, mouseY);
  const raycaster = new THREE.Raycaster();
  raycaster.setFromCamera(mouse, camera);

  const intersects = raycaster.intersectObjects(gridContainer.children);
  if (intersects.length > 0) {
    const clickedObject = intersects[0].object;
    if (clickedObject.callback) {
      clickedObject.callback();
    }
  }
}

function startDrag(e) {
  dragging = true;
  moved = false;
  startX = e.clientX !== undefined ? e.clientX : e.touches[0].clientX;
  startY = e.clientY !== undefined ? e.clientY : e.touches[0].clientY;
}

function moveDrag(
  e,
  renderer,
  camera,
  gridContainer,
  gridCols,
  gridRows,
  itemWidth,
  itemHeight,
  padding,
  maxRotation,
  mouse
) {
  const mousePosition = getMousePositionInScene(e, renderer, camera);
  mouse.set(mousePosition.x, mousePosition.y);

  if (dragging) {
    const currentX = e.clientX !== undefined ? e.clientX : e.touches[0].clientX;
    const currentY = e.clientY !== undefined ? e.clientY : e.touches[0].clientY;
    const dx = currentX - startX;
    const dy = currentY - startY;

    if (Math.abs(dx) > DRAG_THRESHOLD || Math.abs(dy) > DRAG_THRESHOLD) {
      moved = true;
      camera.position.x -= (dx / 200) * camera.zoom;
      camera.position.y += (dy / 200) * camera.zoom;
      wrapGrid(gridContainer, camera, gridCols, gridRows, itemWidth, itemHeight, padding);
      cleanupGrid(gridContainer, camera);
      startX = currentX;
      startY = currentY;
    }
  }

  gridContainer.children.forEach((child) => {
    rotateCardTowardsMouse(child, mouse, camera, maxRotation);
  });
}

function endDrag(e, camera, itemWidth, itemHeight, padding, renderer, gridContainer, loading, lastClickTime) {
  dragging = false;
  snapCameraToGrid(camera, itemWidth, itemHeight, padding);
  if (!moved && e.type !== 'mouseleave') {
    handleClick(e, renderer, camera, gridContainer, loading, lastClickTime);
  }
}

export function addEventListeners(
  renderer,
  camera,
  gridContainer,
  gridCols,
  gridRows,
  itemWidth,
  itemHeight,
  padding,
  maxRotation,
  mouse,
  loading
) {
  const lastClickTime = 0;

  const handleEvent = (e) => {
    switch (e.type) {
      case 'mousedown':
      case 'touchstart':
        startDrag(e);
        break;
      case 'mousemove':
      case 'touchmove':
        moveDrag(
          e,
          renderer,
          camera,
          gridContainer,
          gridCols,
          gridRows,
          itemWidth,
          itemHeight,
          padding,
          maxRotation,
          mouse
        );
        break;
      case 'mouseup':
      case 'touchend':
      case 'mouseleave':
      case 'touchcancel':
        endDrag(e, camera, itemWidth, itemHeight, padding, renderer, gridContainer, loading, lastClickTime);
        break;
    }
  };

  ['mousedown', 'mousemove', 'mouseup', 'mouseleave', 'touchstart', 'touchmove', 'touchend', 'touchcancel'].forEach(type => {
    renderer.domElement.addEventListener(type, handleEvent);
  });

  renderer.domElement._eventHandlers = { handleEvent };
}

export function removeEventListeners(renderer) {
  const handleEvent = renderer.domElement._eventHandlers.handleEvent;
  if (handleEvent) {
    ['mousedown', 'mousemove', 'mouseup', 'mouseleave', 'touchstart', 'touchmove', 'touchend', 'touchcancel'].forEach(type => {
      renderer.domElement.removeEventListener(type, handleEvent);
    });
  }
}
