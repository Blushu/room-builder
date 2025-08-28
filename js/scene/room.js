import * as THREE from 'three';
import { defaults } from '../utils/defaults.js';

// Create room geometry with walls, floor, ceiling, and holes
export function createRoom() {
    const roomGroup = new THREE.Group();

    // Room dimensions
    const roomWidth = 10;
    const roomHeight = 8;
    const roomDepth = 10;

    // Materials
    const wallMaterial = new THREE.MeshLambertMaterial({ color: 0xcccccc });
    const floorMaterial = new THREE.MeshLambertMaterial({ color: 0x888888 });

    // Floor
    const floorGeometry = new THREE.PlaneGeometry(roomWidth, roomDepth);
    const floor = new THREE.Mesh(floorGeometry, floorMaterial);
    floor.rotation.x = -Math.PI / 2;
    floor.position.y = 0;
    roomGroup.add(floor);

    // Ceiling (invisible)
    const ceilingMaterial = new THREE.MeshLambertMaterial({ 
        color: 0xcccccc, 
        transparent: true, 
        opacity: 0 
    });
    const ceiling = new THREE.Mesh(floorGeometry, ceilingMaterial);
    ceiling.rotation.x = Math.PI / 2;
    ceiling.position.y = roomHeight;
    roomGroup.add(ceiling);

    // Create walls with holes
    createWallsWithHoles(roomGroup, roomWidth, roomHeight, roomDepth, wallMaterial);

    return roomGroup;
}

export function updateRoomWindows(roomGroup, windowSettings) {
    // Remove existing walls
    const wallsToRemove = [];
    roomGroup.children.forEach(child => {
        if (child.material && child.material.color && child.material.color.getHex() === 0xcccccc && child.position.y !== 0) {
            if (child.position.z !== 0 || child.position.x !== 0) { // Not floor or ceiling
                wallsToRemove.push(child);
            }
        }
    });
    
    wallsToRemove.forEach(wall => roomGroup.remove(wall));
    
    // Update defaults with new window settings
    Object.assign(defaults, windowSettings);
    
    // Recreate walls with new window dimensions
    const wallMaterial = new THREE.MeshLambertMaterial({ color: 0xcccccc });
    createWallsWithHoles(roomGroup, 10, 8, 10, wallMaterial);
}

function createWallsWithHoles(roomGroup, width, height, depth, material) {
    // Window dimensions from defaults
    const holeWidth = defaults.windowWidth;
    const holeHeight = defaults.windowHeight;
    const holeY = defaults.windowPositionY; // Height from floor to bottom of hole
    const wallThickness = 1;

    // Back left wall with hole (visible) - thick wall
    const backLeftWallShape = new THREE.Shape();
    backLeftWallShape.moveTo(0, 0);
    backLeftWallShape.lineTo(depth, 0);
    backLeftWallShape.lineTo(depth, height);
    backLeftWallShape.lineTo(0, height);
    backLeftWallShape.lineTo(0, 0);

    // Create hole in back left wall
    const backLeftHole = new THREE.Path();
    backLeftHole.moveTo(depth/2 - holeWidth/2, holeY);
    backLeftHole.lineTo(depth/2 + holeWidth/2, holeY);
    backLeftHole.lineTo(depth/2 + holeWidth/2, holeY + holeHeight);
    backLeftHole.lineTo(depth/2 - holeWidth/2, holeY + holeHeight);
    backLeftHole.lineTo(depth/2 - holeWidth/2, holeY);
    backLeftWallShape.holes.push(backLeftHole);

    const backLeftWallGeometry = new THREE.ExtrudeGeometry(backLeftWallShape, {
        depth: wallThickness,
        bevelEnabled: false
    });
    const backLeftWall = new THREE.Mesh(backLeftWallGeometry, material);
    backLeftWall.rotation.y = Math.PI / 2;
    backLeftWall.position.x = -width/2;
    backLeftWall.position.z = width/2;
    backLeftWall.position.y = 0;
    roomGroup.add(backLeftWall);

    // Back right wall with hole (visible) - thick wall
    const backRightWallShape = new THREE.Shape();
    backRightWallShape.moveTo(0, 0);
    backRightWallShape.lineTo(depth, 0);
    backRightWallShape.lineTo(depth, height);
    backRightWallShape.lineTo(0, height);
    backRightWallShape.lineTo(0, 0);

    // Create hole in back right wall
    const backRightHole = new THREE.Path();
    backRightHole.moveTo(depth/2 - holeWidth/2, holeY);
    backRightHole.lineTo(depth/2 + holeWidth/2, holeY);
    backRightHole.lineTo(depth/2 + holeWidth/2, holeY + holeHeight);
    backRightHole.lineTo(depth/2 - holeWidth/2, holeY + holeHeight);
    backRightHole.lineTo(depth/2 - holeWidth/2, holeY);
    backRightWallShape.holes.push(backRightHole);

    const backRightWallGeometry = new THREE.ExtrudeGeometry(backRightWallShape, {
        depth: wallThickness,
        bevelEnabled: false
    });
    const backRightWall = new THREE.Mesh(backRightWallGeometry, material);
    // backRightWall.rotation.y = Math.PI / 2;
    backRightWall.position.x = -width/2;
    backRightWall.position.z = -width/2;
    backRightWall.position.y = 0;
    roomGroup.add(backRightWall);

    // Front left and front right walls are hidden (not created)
}
