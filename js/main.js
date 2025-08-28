import * as THREE from 'three';
import { createRoom, updateRoomWindows } from './scene/room.js';
import { createLighting } from './scene/lighting.js';
import { createCamera, setupCameraControls } from './scene/camera.js';
import { createArcPath, updateLightPosition } from './features/arc-system.js';
import { setupUIControls } from './controls/ui-controls.js';
import { setupCameraControlsUI } from './controls/camera-controls.js';
import { setupDraggablePanel } from './controls/draggable.js';
import { updateSavedRoomsList } from './features/save-load.js';
import { initWindowControls } from './controls/window-controls.js';
import { createWallLabels, initWallLabels, updateWallLabels } from './features/wall-labels.js';

// Scene setup
const canvas = document.querySelector('.lr-canvas');
const scene = new THREE.Scene();
scene.background = new THREE.Color(0x222222);

// Create renderer
const renderer = new THREE.WebGLRenderer({ canvas, antialias: true });
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.shadowMap.enabled = true;
renderer.shadowMap.type = THREE.PCFSoftShadowMap;

// Create scene components
const room = createRoom();
scene.add(room);

const lighting = createLighting(scene);
const camera = createCamera(canvas);

// Initialize wall labels
initWallLabels(camera);
createWallLabels(scene);

// Setup controls
setupUIControls(scene);
setupCameraControlsUI();
setupCameraControls(canvas);
setupDraggablePanel();

// Setup window controls
initWindowControls((windowSettings) => {
    updateRoomWindows(room, windowSettings);
});

// Initialize arc path and light position
createArcPath(scene, 360);
updateLightPosition(50, 360);

// Initialize saved rooms list
updateSavedRoomsList();

// Handle window resize
window.addEventListener('resize', () => {
    const aspect = window.innerWidth / window.innerHeight;
    const frustumSize = 20;
    
    camera.left = -frustumSize * aspect / 2;
    camera.right = frustumSize * aspect / 2;
    camera.top = frustumSize / 2;
    camera.bottom = -frustumSize / 2;
    camera.updateProjectionMatrix();
    
    renderer.setSize(window.innerWidth, window.innerHeight);
});

// Animation loop
function animate() {
    requestAnimationFrame(animate);
    updateWallLabels();
    renderer.render(scene, camera);
}

animate();
