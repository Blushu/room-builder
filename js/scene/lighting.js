import * as THREE from 'three';
import { defaults } from '../utils/defaults.js';

// Lighting system
export let ambientLight, directionalLight, pointLight, lightSphere;

export function createLighting(scene) {
    // Ambient light
    ambientLight = new THREE.AmbientLight(0xffffff, defaults.ambientIntensity);
    scene.add(ambientLight);

    // Directional light (sun-like)
    directionalLight = new THREE.DirectionalLight(0xffffff, defaults.directionalIntensity);
    directionalLight.position.set(5, 10, 5);
    directionalLight.castShadow = true;
    scene.add(directionalLight);

    // Point light (additional lighting)
    pointLight = new THREE.PointLight(0xffffff, defaults.pointIntensity, 100);
    pointLight.position.set(5, 5, 5);
    scene.add(pointLight);

    // Visual representation of light source
    const sphereGeometry = new THREE.SphereGeometry(0.2, 16, 16);
    const sphereMaterial = new THREE.MeshBasicMaterial({ color: 0xffff00 });
    lightSphere = new THREE.Mesh(sphereGeometry, sphereMaterial);
    scene.add(lightSphere);

    return { ambientLight, directionalLight, pointLight, lightSphere };
}
