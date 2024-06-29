import * as THREE from 'three';
import { EffectComposer } from 'three/examples/jsm/postprocessing/EffectComposer';
import { RenderPass } from 'three/examples/jsm/postprocessing/RenderPass';
import { ShaderPass } from 'three/examples/jsm/postprocessing/ShaderPass';
import { GammaCorrectionShader } from 'three/examples/jsm/shaders/GammaCorrectionShader';

// Configurable variables
const DEFAULT_FISHEYE_STRENGTH = 0.6;
const DEFAULT_CHROMATIC_ABERRATION_OFFSET = 0.001;
const DEFAULT_SATURATION = 1.0;  // Neutral saturation
const DEFAULT_CONTRAST = 1.0;    // Neutral contrast

export function createPostProcessing(renderer, scene, camera, options = {}) {
    const {
        fisheyeStrength = DEFAULT_FISHEYE_STRENGTH,
        chromaticAberrationOffset = DEFAULT_CHROMATIC_ABERRATION_OFFSET,
        saturation = DEFAULT_SATURATION,
        contrast = DEFAULT_CONTRAST
    } = options;

    const composer = new EffectComposer(renderer);
    const renderPass = new RenderPass(scene, camera);
    composer.addPass(renderPass);

    const chromaticAberrationShader = {
        uniforms: {
            "tDiffuse": { value: null },
            "offset": { value: new THREE.Vector2(chromaticAberrationOffset, chromaticAberrationOffset) }
        },
        vertexShader: `
            varying vec2 vUv;
            void main() {
                vUv = uv;
                gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
            }
        `,
        fragmentShader: `
            uniform sampler2D tDiffuse;
            uniform vec2 offset;
            varying vec2 vUv;
            void main() {
                vec2 uv = vUv;
                vec2 dist = uv - 0.5;
                float factor = smoothstep(0.0, 0.5, length(dist));
                vec4 color = vec4(
                    texture2D(tDiffuse, uv + offset * factor).r,
                    texture2D(tDiffuse, uv).g,
                    texture2D(tDiffuse, uv - offset * factor).b,
                    1.0
                );
                gl_FragColor = color;
            }
        `
    };
    const chromaticAberrationPass = new ShaderPass(chromaticAberrationShader);
    composer.addPass(chromaticAberrationPass);

    const fisheyeShader = {
        uniforms: {
            "tDiffuse": { value: null },
            "strength": { value: fisheyeStrength }
        },
        vertexShader: `
            varying vec2 vUv;
            void main() {
                vUv = uv;
                gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
            }
        `,
        fragmentShader: `
            uniform sampler2D tDiffuse;
            uniform float strength;
            varying vec2 vUv;
            void main() {
                vec2 uv = vUv;
                vec2 dist = uv - 0.5;
                float radius = length(dist);
                float theta = atan(dist.y, dist.x);
                float factor = smoothstep(0.0, 1.0, radius);
                float distortion = pow(radius, 0.5) * strength;
                vec2 distorted = 0.5 + vec2(cos(theta), sin(theta)) * distortion;
                gl_FragColor = texture2D(tDiffuse, mix(uv, distorted, factor));
            }
        `
    };
    const fisheyePass = new ShaderPass(fisheyeShader);
    composer.addPass(fisheyePass);

    const colorCorrectionShader = {
        uniforms: {
            "tDiffuse": { value: null },
            "saturation": { value: saturation },
            "contrast": { value: contrast }
        },
        vertexShader: `
            varying vec2 vUv;
            void main() {
                vUv = uv;
                gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
            }
        `,
        fragmentShader: `
            uniform sampler2D tDiffuse;
            uniform float saturation;
            uniform float contrast;
            varying vec2 vUv;
            void main() {
                vec4 color = texture2D(tDiffuse, vUv);
                float average = (color.r + color.g + color.b) / 3.0;
                color.rgb = mix(vec3(average), color.rgb, saturation);
                color.rgb = (color.rgb - 0.5) * contrast + 0.5;
                gl_FragColor = color;
            }
        `
    };
    const colorCorrectionPass = new ShaderPass(colorCorrectionShader);
    composer.addPass(colorCorrectionPass);

    const gammaCorrectionPass = new ShaderPass(GammaCorrectionShader);
    composer.addPass(gammaCorrectionPass);

    return composer;
}
