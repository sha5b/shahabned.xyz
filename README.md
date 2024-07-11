
# Shahab Nedaei Portfolio Website

An interactive 3D canvas web application using Svelte and Three.js.

## Overview

This project is a Svelte-based web application that leverages the Three.js library to create an interactive 3D canvas. The application displays works and categories in a dynamic and visually engaging manner, allowing users to interact with the 3D canvas to navigate through different categories and works.

## Installation

To get started with this project, follow these steps:

1. Clone the repository:
   ```bash
   git clone https://github.com/sha5b/shahabned.xyz.git
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
(the shema for the database is under pb/pb_shema.json)
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


## Contributing

Contributions are welcome! Please fork the repository and submit a pull request.

## License

This project is licensed under the MIT License. See the LICENSE file for details.
