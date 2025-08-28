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

    // Front wall with hole
    const frontWallShape = new THREE.Shape();
    frontWallShape.moveTo(-width/2, 0);
    frontWallShape.lineTo(width/2, 0);
    frontWallShape.lineTo(width/2, height);
    frontWallShape.lineTo(-width/2, height);
    frontWallShape.lineTo(-width/2, 0);

    // Create hole in front wall
    const frontHole = new THREE.Path();
    frontHole.moveTo(-holeWidth/2, holeY);
    frontHole.lineTo(holeWidth/2, holeY);
    frontHole.lineTo(holeWidth/2, holeY + holeHeight);
    frontHole.lineTo(-holeWidth/2, holeY + holeHeight);
    frontHole.lineTo(-holeWidth/2, holeY);
    frontWallShape.holes.push(frontHole);

    const frontWallGeometry = new THREE.ShapeGeometry(frontWallShape);
    const frontWall = new THREE.Mesh(frontWallGeometry, material);
    frontWall.position.z = depth/2;
    roomGroup.add(frontWall);

    // Back wall with hole
    const backWallShape = new THREE.Shape();
    backWallShape.moveTo(-width/2, 0);
    backWallShape.lineTo(width/2, 0);
    backWallShape.lineTo(width/2, height);
    backWallShape.lineTo(-width/2, height);
    backWallShape.lineTo(-width/2, 0);

    // Create hole in back wall
    const backHole = new THREE.Path();
    backHole.moveTo(-holeWidth/2, holeY);
    backHole.lineTo(holeWidth/2, holeY);
    backHole.lineTo(holeWidth/2, holeY + holeHeight);
    backHole.lineTo(-holeWidth/2, holeY + holeHeight);
    backHole.lineTo(-holeWidth/2, holeY);
    backWallShape.holes.push(backHole);

    const backWallGeometry = new THREE.ShapeGeometry(backWallShape);
    const backWall = new THREE.Mesh(backWallGeometry, material);
    backWall.position.z = -depth/2;
    backWall.rotation.y = Math.PI;
    roomGroup.add(backWall);

    // Left wall (solid)
    const leftWallGeometry = new THREE.PlaneGeometry(depth, height);
    const leftWall = new THREE.Mesh(leftWallGeometry, material);
    leftWall.rotation.y = Math.PI / 2;
    leftWall.position.x = -width/2;
    leftWall.position.y = height/2;
    roomGroup.add(leftWall);

    // Right wall (solid)
    const rightWall = new THREE.Mesh(leftWallGeometry, material);
    rightWall.rotation.y = -Math.PI / 2;
    rightWall.position.x = width/2;
    rightWall.position.y = height/2;
    roomGroup.add(rightWall);
}
