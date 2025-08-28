import {
    updateLightPosition,
    createArcPath,
    toggleArcPath,
    updateArcSystem,
    lightPosition,
    arcLength
} from '../features/arc-system.js';
import { ambientLight, directionalLight, pointLight } from '../scene/lighting.js';
import { saveRoom, resetToDefaults } from '../features/save-load.js';

// UI Controls setup
export function setupUIControls(scene) {
    const controls = {
        lightPosition: document.getElementById('lightPosition'),
        arcLength: document.getElementById('arcLength'),
        arcCenterX: document.getElementById('arcCenterX'),
        arcCenterY: document.getElementById('arcCenterY'),
        arcCenterZ: document.getElementById('arcCenterZ'),
        arcRotation: document.getElementById('arcRotation'),
        ambientIntensity: document.getElementById('ambientIntensity'),
        directionalIntensity: document.getElementById('directionalIntensity'),
        pointIntensity: document.getElementById('pointIntensity'),
        showPath: document.getElementById('showPath'),
        positionValue: document.getElementById('positionValue'),
        arcValue: document.getElementById('arcValue'),
        centerXValue: document.getElementById('centerXValue'),
        centerYValue: document.getElementById('centerYValue'),
        centerZValue: document.getElementById('centerZValue'),
        rotationValue: document.getElementById('rotationValue'),
        ambientValue: document.getElementById('ambientValue'),
        directionalValue: document.getElementById('directionalValue'),
        pointValue: document.getElementById('pointValue')
    };

    // Light position control
    controls.lightPosition.addEventListener('input', (e) => {
        const position = parseFloat(e.target.value);
        updateArcSystem({ lightPosition: position });
        updateLightPosition(position, arcLength);
        controls.positionValue.textContent = position.toFixed(1) + '%';
    });

    // Arc length control
    controls.arcLength.addEventListener('input', (e) => {
        const length = parseFloat(e.target.value);
        updateArcSystem({ arcLength: length });
        updateLightPosition(lightPosition, length);
        createArcPath(scene, length);
        controls.arcValue.textContent = length.toFixed(0) + '°';
    });

    // Arc center X control
    controls.arcCenterX.addEventListener('input', (e) => {
        const centerX = parseFloat(e.target.value);
        updateArcSystem({ arcCenterX: centerX });
        updateLightPosition(lightPosition, arcLength);
        createArcPath(scene, arcLength);
        controls.centerXValue.textContent = centerX.toFixed(1);
    });

    // Arc center Y control
    controls.arcCenterY.addEventListener('input', (e) => {
        const centerY = parseFloat(e.target.value);
        updateArcSystem({ arcCenterY: centerY });
        updateLightPosition(lightPosition, arcLength);
        createArcPath(scene, arcLength);
        controls.centerYValue.textContent = centerY.toFixed(1);
    });

    // Arc center Z control
    controls.arcCenterZ.addEventListener('input', (e) => {
        const centerZ = parseFloat(e.target.value);
        updateArcSystem({ arcCenterZ: centerZ });
        updateLightPosition(lightPosition, arcLength);
        createArcPath(scene, arcLength);
        controls.centerZValue.textContent = centerZ.toFixed(1);
    });

    // Arc rotation control
    controls.arcRotation.addEventListener('input', (e) => {
        const rotation = parseFloat(e.target.value);
        updateArcSystem({ arcRotation: rotation });
        updateLightPosition(lightPosition, arcLength);
        createArcPath(scene, arcLength);
        controls.rotationValue.textContent = rotation.toFixed(0) + '°';
    });

    // Light intensity controls
    controls.ambientIntensity.addEventListener('input', (e) => {
        const intensity = parseFloat(e.target.value);
        ambientLight.intensity = intensity;
        controls.ambientValue.textContent = intensity.toFixed(1);
    });

    controls.directionalIntensity.addEventListener('input', (e) => {
        const intensity = parseFloat(e.target.value);
        directionalLight.intensity = intensity;
        controls.directionalValue.textContent = intensity.toFixed(1);
    });

    controls.pointIntensity.addEventListener('input', (e) => {
        const intensity = parseFloat(e.target.value);
        pointLight.intensity = intensity;
        controls.pointValue.textContent = intensity.toFixed(1);
    });

    // Show path toggle
    controls.showPath.addEventListener('change', () => {
        toggleArcPath();
    });

    // Save room button
    document.getElementById('saveStateBtn').addEventListener('click', () => {
        const nameInput = document.getElementById('stateNameInput');
        const name = nameInput.value.trim();

        if (!name) {
            alert('Please enter a name for the room');
            return;
        }

        saveRoom(name);
        nameInput.value = '';
    });

    // Reset button
    document.getElementById('resetBtn').addEventListener('click', () => {
        if (confirm('Reset all controls to default values?')) {
            resetToDefaults(scene);
        }
    });
}
