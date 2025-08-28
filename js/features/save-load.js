import { defaults } from '../utils/defaults.js';
import { ambientLight, directionalLight, pointLight } from '../scene/lighting.js';
import {
    updateArcSystem,
    lightPosition,
    arcLength,
    arcCenterX,
    arcCenterY,
    arcCenterZ,
    arcRotation,
    showArcPath,
    updateLightPosition,
    createArcPath,
    arcPathLine
} from './arc-system.js';

// Save/Load system
export function saveRoom(name) {
    const roomData = {
        lightPosition,
        arcLength,
        arcCenterX,
        arcCenterY,
        arcCenterZ,
        arcRotation,
        ambientIntensity: ambientLight.intensity,
        directionalIntensity: directionalLight.intensity,
        pointIntensity: pointLight.intensity,
        showArcPath
    };

    const savedRooms = JSON.parse(localStorage.getItem('lightingRooms') || '{}');
    savedRooms[name] = roomData;
    localStorage.setItem('lightingRooms', JSON.stringify(savedRooms));

    updateSavedRoomsList();
    console.log(`Saved room: ${name}`);
}

export function loadRoom(name) {
    const savedRooms = JSON.parse(localStorage.getItem('lightingRooms') || '{}');
    const roomData = savedRooms[name];

    if (!roomData) {
        console.error(`Room not found: ${name}`);
        return;
    }

    // Update arc system
    updateArcSystem({
        lightPosition: roomData.lightPosition,
        arcLength: roomData.arcLength,
        arcCenterX: roomData.arcCenterX,
        arcCenterY: roomData.arcCenterY,
        arcCenterZ: roomData.arcCenterZ,
        arcRotation: roomData.arcRotation,
        showArcPath: roomData.showArcPath
    });

    // Update lights
    ambientLight.intensity = roomData.ambientIntensity;
    directionalLight.intensity = roomData.directionalIntensity;
    pointLight.intensity = roomData.pointIntensity;

    // Update UI controls
    updateUIControls(roomData);

    // Update 3D scene
    updateLightPosition(roomData.lightPosition, roomData.arcLength);
    createArcPath(roomData.arcLength);
    if (arcPathLine) {
        arcPathLine.visible = roomData.showArcPath;
    }

    console.log(`Loaded room: ${name}`);
}

export function deleteRoom(name) {
    const savedRooms = JSON.parse(localStorage.getItem('lightingRooms') || '{}');
    delete savedRooms[name];
    localStorage.setItem('lightingRooms', JSON.stringify(savedRooms));

    updateSavedRoomsList();
    console.log(`Deleted room: ${name}`);
}

export function resetToDefaults(scene) {
    // Update arc system
    updateArcSystem({
        lightPosition: defaults.lightPosition,
        arcLength: defaults.arcLength,
        arcCenterX: defaults.arcCenterX,
        arcCenterY: defaults.arcCenterY,
        arcCenterZ: defaults.arcCenterZ,
        arcRotation: defaults.arcRotation,
        showArcPath: defaults.showArcPath
    });

    // Update lights
    ambientLight.intensity = defaults.ambientIntensity;
    directionalLight.intensity = defaults.directionalIntensity;
    pointLight.intensity = defaults.pointIntensity;

    // Update UI controls
    updateUIControls(defaults);

    // Update 3D scene
    updateLightPosition(defaults.lightPosition, defaults.arcLength);
    createArcPath(scene, defaults.arcLength);
    if (arcPathLine) {
        arcPathLine.visible = defaults.showArcPath;
    }

    console.log('Reset all controls to defaults');
}

function updateUIControls(data) {
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

    // Update control values
    controls.lightPosition.value = data.lightPosition;
    controls.arcLength.value = data.arcLength;
    controls.arcCenterX.value = data.arcCenterX;
    controls.arcCenterY.value = data.arcCenterY;
    controls.arcCenterZ.value = data.arcCenterZ;
    controls.arcRotation.value = data.arcRotation;
    controls.ambientIntensity.value = data.ambientIntensity;
    controls.directionalIntensity.value = data.directionalIntensity;
    controls.pointIntensity.value = data.pointIntensity;
    controls.showPath.checked = data.showArcPath;

    // Update display values
    controls.positionValue.textContent = data.lightPosition.toFixed(1) + '%';
    controls.arcValue.textContent = data.arcLength.toFixed(0) + '°';
    controls.centerXValue.textContent = data.arcCenterX.toFixed(1);
    controls.centerYValue.textContent = data.arcCenterY.toFixed(1);
    controls.centerZValue.textContent = data.arcCenterZ.toFixed(1);
    controls.rotationValue.textContent = data.arcRotation.toFixed(0) + '°';
    controls.ambientValue.textContent = data.ambientIntensity.toFixed(1);
    controls.directionalValue.textContent = data.directionalIntensity.toFixed(1);
    controls.pointValue.textContent = data.pointIntensity.toFixed(1);
}

export function updateSavedRoomsList() {
    const savedRooms = JSON.parse(localStorage.getItem('lightingRooms') || '{}');
    const listContainer = document.getElementById('savedStatesList');

    listContainer.innerHTML = '';

    Object.keys(savedRooms).forEach(name => {
        const item = document.createElement('div');
        item.className = 'lr-saved-rooms__item';

        const nameSpan = document.createElement('span');
        nameSpan.textContent = name;
        nameSpan.className = 'lr-saved-rooms__name';
        nameSpan.onclick = () => loadRoom(name);

        const deleteBtn = document.createElement('button');
        deleteBtn.textContent = 'Delete';
        deleteBtn.className = 'lr-btn lr-btn--delete';
        deleteBtn.onclick = (e) => {
            e.stopPropagation();
            if (confirm(`Delete room '${name}'?`)) {
                deleteRoom(name);
            }
        };

        item.appendChild(nameSpan);
        item.appendChild(deleteBtn);
        listContainer.appendChild(item);
    });
}
