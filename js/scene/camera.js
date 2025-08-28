import * as THREE from 'three';

// Camera system with orbit and pan controls
export let camera;
export let cameraMode = 'orbit'; // 'orbit' or 'pan'
export let cameraControlsEnabled = true;

// Camera state
const cameraDefaults = {
    position: { x: 15, y: 10, z: 15 },
    target: { x: 0, y: 4, z: 0 }
};

const cameraTarget = new THREE.Vector3(cameraDefaults.target.x, cameraDefaults.target.y, cameraDefaults.target.z);
let isMouseDown = false;
const mouseStart = { x: 0, y: 0 };
const cameraStart = { position: new THREE.Vector3(), target: new THREE.Vector3() };

export function createCamera(canvas) {
    const aspect = canvas.clientWidth / canvas.clientHeight;
    const frustumSize = 20;

    camera = new THREE.OrthographicCamera(
        -frustumSize * aspect / 2, frustumSize * aspect / 2,
        frustumSize / 2, -frustumSize / 2,
        0.1, 1000
    );

    resetCameraPosition();
    return camera;
}

export function resetCameraPosition() {
    camera.position.set(cameraDefaults.position.x, cameraDefaults.position.y, cameraDefaults.position.z);
    cameraTarget.set(cameraDefaults.target.x, cameraDefaults.target.y, cameraDefaults.target.z);
    camera.lookAt(cameraTarget);
}

export function setCameraMode(mode) {
    cameraMode = mode;
    console.log(`Camera mode: ${mode}`);
}

export function setCameraControlsEnabled(enabled) {
    cameraControlsEnabled = enabled;
    const canvas = document.querySelector('.lr-canvas');
    if (enabled) {
        canvas.classList.remove('lr-canvas--disabled');
    } else {
        canvas.classList.add('lr-canvas--disabled');
    }
    console.log(`Camera controls: ${enabled ? 'enabled' : 'disabled'}`);
}

export function setupCameraControls(canvas) {
    canvas.addEventListener('mousedown', onMouseDown);
    canvas.addEventListener('mousemove', onMouseMove);
    canvas.addEventListener('mouseup', onMouseUp);
    canvas.addEventListener('mouseleave', onMouseUp);
}

function onMouseDown(event) {
    if (!cameraControlsEnabled) return;

    isMouseDown = true;
    mouseStart.x = event.clientX;
    mouseStart.y = event.clientY;

    cameraStart.position.copy(camera.position);
    cameraStart.target.copy(cameraTarget);
}

function onMouseMove(event) {
    if (!isMouseDown || !cameraControlsEnabled) return;

    const deltaX = event.clientX - mouseStart.x;
    const deltaY = event.clientY - mouseStart.y;

    if (cameraMode === 'orbit') {
        orbitCamera(deltaX, deltaY);
    } else if (cameraMode === 'pan') {
        panCamera(deltaX, deltaY);
    }
}

function onMouseUp() {
    isMouseDown = false;
}

function orbitCamera(deltaX, deltaY) {
    const sensitivity = 0.01;

    // Calculate spherical coordinates
    const offset = new THREE.Vector3().subVectors(cameraStart.position, cameraStart.target);
    const spherical = new THREE.Spherical().setFromVector3(offset);

    // Apply rotation
    spherical.theta -= deltaX * sensitivity;
    spherical.phi += deltaY * sensitivity;

    // Constrain phi to avoid flipping
    spherical.phi = Math.max(0.1, Math.min(Math.PI - 0.1, spherical.phi));

    // Update camera position
    offset.setFromSpherical(spherical);
    camera.position.copy(cameraStart.target).add(offset);
    camera.lookAt(cameraTarget);
}

function panCamera(deltaX, deltaY) {
    const sensitivity = 0.05;

    // Get camera's right and up vectors
    const right = new THREE.Vector3();
    const up = new THREE.Vector3();

    camera.getWorldDirection(new THREE.Vector3()); // Ensure matrix is updated
    right.setFromMatrixColumn(camera.matrixWorld, 0);
    up.setFromMatrixColumn(camera.matrixWorld, 1);

    // Calculate pan offset
    const panOffset = new THREE.Vector3();
    panOffset.addScaledVector(right, -deltaX * sensitivity);
    panOffset.addScaledVector(up, deltaY * sensitivity);

    // Apply pan to both camera and target
    camera.position.copy(cameraStart.position).add(panOffset);
    cameraTarget.copy(cameraStart.target).add(panOffset);
    camera.lookAt(cameraTarget);
}
