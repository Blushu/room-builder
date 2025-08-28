import * as THREE from 'three';
import { defaults } from '../utils/defaults.js';

// Wall labels system
let wallLabels = [];
let camera = null;
let scene = null;

export function initWallLabels(sceneCamera, sceneRef) {
    camera = sceneCamera;
    scene = sceneRef;
}

export function createWallLabels(sceneRef) {
    if (sceneRef) scene = sceneRef;
    
    // Clear existing labels
    wallLabels.forEach(label => scene.remove(label.group));
    wallLabels = [];

    if (!defaults.showWallLabels) return;

    const walls = [
        { name: 'Back Left Wall', position: { x: -4, y: 5, z: -2.5 }, color: 0xFF9800 },
        { name: 'Back Right Wall', position: { x: 4, y: 5, z: -2.5 }, color: 0x9C27B0 }
    ];

    walls.forEach(wall => {
        const labelGroup = createSpeechBubbleLabel(wall.name, wall.color);
        labelGroup.position.set(
            wall.position.x + defaults.labelOffsetX, 
            wall.position.y + defaults.labelOffsetY, 
            wall.position.z + defaults.labelOffsetZ
        );
        scene.add(labelGroup);
        
        wallLabels.push({
            group: labelGroup,
            basePosition: wall.position
        });
    });
}

function createSpeechBubbleLabel(text, color) {
    const group = new THREE.Group();

    // Create canvas for text
    const canvas = document.createElement('canvas');
    const context = canvas.getContext('2d');
    canvas.width = 256;
    canvas.height = 128;

    // Style the text
    context.fillStyle = '#ffffff';
    context.fillRect(0, 0, canvas.width, canvas.height);
    
    // Add border
    context.strokeStyle = `#${color.toString(16).padStart(6, '0')}`;
    context.lineWidth = 4;
    context.strokeRect(2, 2, canvas.width - 4, canvas.height - 4);
    
    // Add text
    context.fillStyle = '#333333';
    context.font = 'bold 24px Arial';
    context.textAlign = 'center';
    context.textBaseline = 'middle';
    context.fillText(text, canvas.width / 2, canvas.height / 2);

    // Create texture and material
    const texture = new THREE.CanvasTexture(canvas);
    texture.needsUpdate = true;
    
    const material = new THREE.MeshBasicMaterial({
        map: texture,
        transparent: true,
        alphaTest: 0.1,
        side: THREE.DoubleSide
    });

    // Create speech bubble geometry
    const bubbleGeometry = new THREE.PlaneGeometry(2, 1);
    const bubble = new THREE.Mesh(bubbleGeometry, material);
    
    // Create pointer/tail for speech bubble
    const pointerGeometry = new THREE.ConeGeometry(0.1, 0.3, 8);
    const pointerMaterial = new THREE.MeshBasicMaterial({ 
        color: 0xffffff,
        transparent: true,
        opacity: 0.9
    });
    const pointer = new THREE.Mesh(pointerGeometry, pointerMaterial);
    pointer.position.y = -0.65;
    pointer.rotation.x = Math.PI;

    group.add(bubble);
    group.add(pointer);

    return group;
}

export function updateWallLabels() {
    if (!camera || !defaults.showWallLabels) return;

    wallLabels.forEach(label => {
        // Make labels always face the camera
        label.group.lookAt(camera.position);
        
        // Update position with offsets and floating animation
        const time = Date.now() * 0.001;
        const floatingOffset = Math.sin(time + label.basePosition.x) * 0.1;
        
        label.group.position.set(
            label.basePosition.x + defaults.labelOffsetX,
            label.basePosition.y + defaults.labelOffsetY + floatingOffset,
            label.basePosition.z + defaults.labelOffsetZ
        );
    });
}

export function toggleWallLabels(show) {
    defaults.showWallLabels = show;
    
    if (show) {
        createWallLabels();
    } else {
        // Hide existing labels
        wallLabels.forEach(label => {
            if (scene && label.group) {
                scene.remove(label.group);
            }
        });
        wallLabels = [];
    }
}

export function updateLabelOffsets() {
    wallLabels.forEach(label => {
        label.group.position.set(
            label.basePosition.x + defaults.labelOffsetX,
            label.basePosition.y + defaults.labelOffsetY,
            label.basePosition.z + defaults.labelOffsetZ
        );
    });
}
