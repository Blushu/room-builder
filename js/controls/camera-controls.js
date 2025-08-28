import { setCameraMode, resetCameraPosition, setCameraControlsEnabled } from '../scene/camera.js';

// Camera control UI setup
export function setupCameraControlsUI() {
    // Setup event listeners for existing BEM-structured HTML
    const radioButtons = document.querySelectorAll('input[name="cameraMode"]');
    radioButtons.forEach(radio => {
        radio.addEventListener('change', (e) => {
            setCameraMode(e.target.value);
        });
    });

    document.getElementById('resetCameraBtn').addEventListener('click', () => {
        resetCameraPosition();
    });

    document.getElementById('enableCameraControls').addEventListener('change', (e) => {
        setCameraControlsEnabled(e.target.checked);
    });
}
