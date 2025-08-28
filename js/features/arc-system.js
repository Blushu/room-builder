import * as THREE from 'three';
import { defaults, LIGHT_DISTANCE, ARC_SEGMENTS } from '../utils/defaults.js';
import { directionalLight, pointLight, lightSphere } from '../scene/lighting.js';

// Arc system variables
export let lightPosition = defaults.lightPosition;
export let arcLength = defaults.arcLength;
export let arcCenterX = defaults.arcCenterX;
export let arcCenterY = defaults.arcCenterY;
export let arcCenterZ = defaults.arcCenterZ;
export let arcRotation = defaults.arcRotation;
export let showArcPath = defaults.showArcPath;
export let arcPathLine = null;

// Update light position based on arc position and length
export function updateLightPosition(position, arcLen) {
    // Calculate the actual angle based on position within the arc
    const arcHalf = arcLen / 2;
    const startAngle = arcRotation - arcHalf;
    const endAngle = arcRotation + arcHalf;

    // Convert position (0-100) to angle within the arc
    const t = position / 100;
    const actualAngle = startAngle + (t * (endAngle - startAngle));

    // Convert to radians and calculate position
    const radians = (actualAngle * Math.PI) / 180;
    const x = arcCenterX + Math.cos(radians) * LIGHT_DISTANCE;
    const z = arcCenterZ + Math.sin(radians) * LIGHT_DISTANCE;
    const y = arcCenterY;

    // Update all lights to the same position
    directionalLight.position.set(x, y, z);
    pointLight.position.set(x, y, z);
    lightSphere.position.set(x, y, z);
}

// Create arc path visualization
export function createArcPath(scene, arcLen) {
    // Remove existing path if it exists
    if (arcPathLine) {
        scene.remove(arcPathLine);
    }

    const points = [];

    // Calculate start and end angles for the current arc length
    const arcHalf = arcLen / 2;
    const startAngle = arcRotation - arcHalf;
    const endAngle = arcRotation + arcHalf;

    for (let i = 0; i <= ARC_SEGMENTS; i++) {
        const t = i / ARC_SEGMENTS;
        const actualAngle = startAngle + (t * (endAngle - startAngle));

        const radians = (actualAngle * Math.PI) / 180;
        const x = arcCenterX + Math.cos(radians) * LIGHT_DISTANCE;
        const z = arcCenterZ + Math.sin(radians) * LIGHT_DISTANCE;

        points.push(new THREE.Vector3(x, arcCenterY, z));
    }

    const geometry = new THREE.BufferGeometry().setFromPoints(points);
    const material = new THREE.LineBasicMaterial({
        color: 0x00ff00,
        linewidth: 2,
        transparent: true,
        opacity: 0.7
    });

    arcPathLine = new THREE.Line(geometry, material);
    arcPathLine.visible = showArcPath;
    scene.add(arcPathLine);
}

// Update arc system variables
export function updateArcSystem(updates) {
    if (updates.lightPosition !== undefined) lightPosition = updates.lightPosition;
    if (updates.arcLength !== undefined) arcLength = updates.arcLength;
    if (updates.arcCenterX !== undefined) arcCenterX = updates.arcCenterX;
    if (updates.arcCenterY !== undefined) arcCenterY = updates.arcCenterY;
    if (updates.arcCenterZ !== undefined) arcCenterZ = updates.arcCenterZ;
    if (updates.arcRotation !== undefined) arcRotation = updates.arcRotation;
    if (updates.showArcPath !== undefined) showArcPath = updates.showArcPath;
}

export function toggleArcPath() {
    showArcPath = !showArcPath;
    if (arcPathLine) {
        arcPathLine.visible = showArcPath;
    }
}
