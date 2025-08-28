import { defaults } from '../utils/defaults.js';
import { toggleWallLabels, updateLabelOffsets } from '../features/wall-labels.js';

// Window control elements
let windowControls = {};
let onWindowChangeCallback = null;

export function initWindowControls(onWindowChange) {
    onWindowChangeCallback = onWindowChange;
    
    // Get all window control elements
    windowControls = {
        windowWidth: document.getElementById('windowWidth'),
        windowHeight: document.getElementById('windowHeight'),
        windowPositionX: document.getElementById('windowPositionX'),
        windowPositionY: document.getElementById('windowPositionY'),
        showWallLabels: document.getElementById('showWallLabels'),
        labelOffsetX: document.getElementById('labelOffsetX'),
        labelOffsetY: document.getElementById('labelOffsetY'),
        labelOffsetZ: document.getElementById('labelOffsetZ'),
        
        // Value display elements
        windowWidthValue: document.getElementById('windowWidthValue'),
        windowHeightValue: document.getElementById('windowHeightValue'),
        windowPositionXValue: document.getElementById('windowPositionXValue'),
        windowPositionYValue: document.getElementById('windowPositionYValue'),
        labelOffsetXValue: document.getElementById('labelOffsetXValue'),
        labelOffsetYValue: document.getElementById('labelOffsetYValue'),
        labelOffsetZValue: document.getElementById('labelOffsetZValue')
    };

    // Set initial values from defaults
    windowControls.windowWidth.value = defaults.windowWidth;
    windowControls.windowHeight.value = defaults.windowHeight;
    windowControls.windowPositionX.value = defaults.windowPositionX;
    windowControls.windowPositionY.value = defaults.windowPositionY;
    windowControls.showWallLabels.checked = defaults.showWallLabels;
    windowControls.labelOffsetX.value = defaults.labelOffsetX;
    windowControls.labelOffsetY.value = defaults.labelOffsetY;
    windowControls.labelOffsetZ.value = defaults.labelOffsetZ;

    // Update displays
    updateWindowDisplays();

    // Add event listeners
    Object.keys(windowControls).forEach(key => {
        if (key.includes('Value')) return; // Skip value display elements
        
        if (key === 'showWallLabels') {
            windowControls[key].addEventListener('change', (event) => {
                toggleWallLabels(event.target.checked);
            });
        } else if (key.startsWith('labelOffset')) {
            windowControls[key].addEventListener('input', (event) => {
                const offsetType = key.replace('labelOffset', '').toLowerCase();
                defaults[key] = parseFloat(event.target.value);
                updateWindowDisplays();
                updateLabelOffsets();
            });
        } else {
            windowControls[key].addEventListener('input', (event) => {
                updateWindowDisplays();
                if (onWindowChangeCallback) {
                    onWindowChangeCallback(getWindowSettings());
                }
            });
        }
    });
}

function updateWindowDisplays() {
    windowControls.windowWidthValue.textContent = parseFloat(windowControls.windowWidth.value).toFixed(1);
    windowControls.windowHeightValue.textContent = parseFloat(windowControls.windowHeight.value).toFixed(1);
    windowControls.windowPositionXValue.textContent = parseFloat(windowControls.windowPositionX.value).toFixed(1);
    windowControls.windowPositionYValue.textContent = parseFloat(windowControls.windowPositionY.value).toFixed(1);
    windowControls.labelOffsetXValue.textContent = parseFloat(windowControls.labelOffsetX.value).toFixed(1);
    windowControls.labelOffsetYValue.textContent = parseFloat(windowControls.labelOffsetY.value).toFixed(1);
    windowControls.labelOffsetZValue.textContent = parseFloat(windowControls.labelOffsetZ.value).toFixed(1);
}

export function getWindowSettings() {
    return {
        windowWidth: parseFloat(windowControls.windowWidth.value),
        windowHeight: parseFloat(windowControls.windowHeight.value),
        windowPositionX: parseFloat(windowControls.windowPositionX.value),
        windowPositionY: parseFloat(windowControls.windowPositionY.value)
    };
}

export function setWindowSettings(settings) {
    if (settings.windowWidth !== undefined) {
        windowControls.windowWidth.value = settings.windowWidth;
        defaults.windowWidth = settings.windowWidth;
    }
    if (settings.windowHeight !== undefined) {
        windowControls.windowHeight.value = settings.windowHeight;
        defaults.windowHeight = settings.windowHeight;
    }
    if (settings.windowPositionX !== undefined) {
        windowControls.windowPositionX.value = settings.windowPositionX;
        defaults.windowPositionX = settings.windowPositionX;
    }
    if (settings.windowPositionY !== undefined) {
        windowControls.windowPositionY.value = settings.windowPositionY;
        defaults.windowPositionY = settings.windowPositionY;
    }
    
    updateWindowDisplays();
    
    if (onWindowChangeCallback) {
        onWindowChangeCallback(getWindowSettings());
    }
}
