import * as THREE from 'three';

// Wall labels system
let wallLabels = [];
let camera = null;

export function initWallLabels(sceneCamera) {
    camera = sceneCamera;
}

export function createWallLabels(scene) {
    // Clear existing labels
    wallLabels.forEach(label => scene.remove(label.group));
    wallLabels = [];

    const walls = [
        { name: 'Front Left Wall', position: { x: 0, y: 4, z: 5 }, color: 0x4CAF50 },
        { name: 'Back Right Wall', position: { x: 0, y: 4, z: -5 }, color: 0x2196F3 },
        { name: 'Back Left Wall', position: { x: -5, y: 4, z: 0 }, color: 0xFF9800 },
        { name: 'Front Right Wall', position: { x: 5, y: 4, z: 0 }, color: 0x9C27B0 }
    ];

    walls.forEach(wall => {
        const labelGroup = createSpeechBubbleLabel(wall.name, wall.color);
        labelGroup.position.set(wall.position.x, wall.position.y, wall.position.z);
        scene.add(labelGroup);
        
        wallLabels.push({
            group: labelGroup,
            position: wall.position
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
    if (!camera) return;

    wallLabels.forEach(label => {
        // Make labels always face the camera
        label.group.lookAt(camera.position);
        
        // Add slight floating animation
        const time = Date.now() * 0.001;
        label.group.position.y = label.position.y + Math.sin(time + label.position.x) * 0.1;
    });
}
