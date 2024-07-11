
# Shahab Nedaei Portfolio Website

An interactive 3D canvas web application using Svelte and Three.js.

## Overview

This project is a Svelte-based web application that leverages the Three.js library to create an interactive 3D canvas. The application displays works and categories in a dynamic and visually engaging manner, allowing users to interact with the 3D canvas to navigate through different categories and works.

## Installation

To get started with this project, follow these steps:

1. Clone the repository:
   ```bash
   git clone https://github.com/your-username/your-repo.git
   cd your-repo
   ```

2. Install the dependencies:
   ```bash
   npm install
   ```

3. Create a `.env` file in the root directory and add your environment variables:
   ```env
   VITE_API_URL=https://your-pocketbase-api-url
   ```

## Usage

To run the application locally:
```bash
npm run dev
```
Open your browser and navigate to `http://localhost:3000` to view the application.

To build the application for production:
```bash
npm run build
```
The production-ready files will be generated in the `dist` folder.

## Folder Structure

```plaintext
src/
    app.d.ts
    app.html
    lib/
        index.js
        components/
            ThreeCanvas.svelte
        services/
            pocketbase.js
        utils/
            getURL.js
            three/
                animation.js
                camera.js
                card.js
                dottedGridTexture.js
                eventHandlers.js
                grid.js
                renderer.js
                scene.js
    routes/
        +layout.svelte
        +page.js
        +page.svelte
        owner/
            [id]/
                +page.js
                +page.svelte
        [category]/
            +page.js
            +page.svelte
            [title]/
                +page.js
                +page.svelte
```

## Functions and Their Interactions

### `src/lib/utils/three/renderer.js`

#### `createRenderer(settings)`
Creates and configures a Three.js WebGLRenderer.

### `src/lib/utils/three/camera.js`

#### `createCamera(settings)`
Initializes and configures a Three.js PerspectiveCamera.

#### `onWindowResize(camera, renderer)`
Adjusts camera and renderer sizes on window resize.

### `src/lib/utils/three/scene.js`

#### `createScene()`
Creates and configures a Three.js Scene with ambient and directional lights.

### `src/lib/utils/three/dottedGridTexture.js`

#### `createDottedGridTexture(cellSize, dotSize, textureSize)`
Generates a dotted grid texture for the scene background.

### `src/lib/utils/three/animation.js`

#### `snapCameraToGrid(camera, itemWidth, itemHeight, padding)`
Snaps the camera position to the nearest grid points.

#### `animateToPosition(camera, x, y)`
Animates the camera to specified coordinates.

#### `animate(renderer, scene, camera, composer)`
Main animation loop.

#### `rotateCardTowardsMouse(card, mouse, camera, maxRotation)`
Rotates a card towards the mouse pointer.

#### `updateCardTransparency(gridContainer, camera, maxDistance)`
Adjusts card transparency based on distance to the camera.

### `src/lib/utils/three/postProcessing.js`

#### `createPostProcessing(renderer, scene, camera, options)`
Sets up post-processing effects.

### `src/lib/utils/three/eventHandlers.js`

#### `getMousePositionInScene(event, renderer, camera)`
Converts screen coordinates to scene coordinates.

#### `handleClick(event, renderer, camera, gridContainer, loading, lastClickTime)`
Processes click events on the grid.

#### `startDrag(e)`
Initiates dragging.

#### `moveDrag(e, renderer, camera, gridContainer, gridCols, gridRows, itemWidth, itemHeight, padding, maxRotation, mouse)`
Processes drag events.

#### `endDrag(e, camera, itemWidth, itemHeight, padding, renderer, gridContainer, loading, lastClickTime)`
Ends dragging.

#### `addEventListeners(renderer, camera, gridContainer, gridCols, gridRows, itemWidth, itemHeight, padding, maxRotation, mouse, loading)`
Adds interaction event listeners.

#### `removeEventListeners(renderer)`
Removes interaction event listeners.

### `src/lib/utils/three/grid.js`

#### `calculateGridSize(items, minCols, minRows)`
Determines grid dimensions based on item count.

#### `generatePositions(count, itemWidth, itemHeight, padding)`
Generates grid positions for items.

#### `createCompleteGrid(gridContainer, items, categories, title, itemWidth, itemHeight, padding, onClickHandlers, minCols, minRows, pageType, work)`
Constructs the entire grid layout.

#### `wrapGrid(gridContainer, camera, gridCols, gridRows, itemWidth, itemHeight, padding)`
Wraps grid items around the camera view.

#### `cleanupGrid(gridContainer, camera)`
Removes out-of-bound grid items.

### `src/lib/utils/three/card.js`

#### `createCardMesh(itemWidth, itemHeight, textureURL, radius, onClick, cardColor, textOptions)`
Creates a card mesh.

#### `addCard(gridContainer, cardMesh, x, y)`
Adds a card to the grid.

#### `addWorkCard(gridContainer, work, x, y, itemWidth, itemHeight, onClick, pageType)`
Adds a work card.

#### `addCategoryCard(gridContainer, category, x, y, itemWidth, itemHeight, onClick)`
Adds a category card.

#### `addNavigationCard(gridContainer, icon, color, x, y, itemWidth, itemHeight, onClick)`
Adds a navigation card.

#### `addImageCard(gridContainer, image, x, y, itemWidth, itemHeight)`
Adds an image card.

#### `addWorkDetailsCard(gridContainer, work, x, y, itemWidth, itemHeight, onClick)`
Adds a work details card.

#### `addSynopsisCard(gridContainer, work, x, y, itemWidth, itemHeight, onClick)`
Adds a synopsis card.

#### `addColabsCard(gridContainer, work, x, y, itemWidth, itemHeight, onClick)`
Adds a collaborations card.

#### `addExhibitionsCard(gridContainer, work, x, y, itemWidth, itemHeight, onClick)`
Adds an exhibitions card.

## Contributing

Contributions are welcome! Please fork the repository and submit a pull request.

## License

This project is licensed under the MIT License. See the LICENSE file for details.
