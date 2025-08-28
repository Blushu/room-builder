import * as THREE from 'three';

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

    // Ceiling
    const ceiling = new THREE.Mesh(floorGeometry, wallMaterial);
    ceiling.rotation.x = Math.PI / 2;
    ceiling.position.y = roomHeight;
    roomGroup.add(ceiling);

    // Create walls with holes
    createWallsWithHoles(roomGroup, roomWidth, roomHeight, roomDepth, wallMaterial);

    return roomGroup;
}

function createWallsWithHoles(roomGroup, width, height, depth, material) {
    // Hole dimensions
    const holeWidth = 4;
    const holeHeight = 3;
    const holeY = 1.5; // Height from floor to bottom of hole

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
