// Draggable control panel functionality
export function setupDraggablePanel() {
    let isDragging = false;
    const dragOffset = { x: 0, y: 0 };
    const controlsPanel = document.querySelector('.lr-controls');

    controlsPanel.addEventListener('mousedown', (e) => {
        // Only start dragging if clicking on the panel itself or the header, not on controls
        if (e.target === controlsPanel ||
            e.target.classList.contains('lr-controls__title') ||
            e.target.classList.contains('lr-control-section__summary')) {
            isDragging = true;
            dragOffset.x = e.clientX - controlsPanel.offsetLeft;
            dragOffset.y = e.clientY - controlsPanel.offsetTop;
            controlsPanel.style.cursor = 'grabbing';
        }
    });

    document.addEventListener('mousemove', (e) => {
        if (isDragging) {
            const x = e.clientX - dragOffset.x;
            const y = e.clientY - dragOffset.y;

            // Keep panel within viewport bounds
            const maxX = window.innerWidth - controlsPanel.offsetWidth;
            const maxY = window.innerHeight - controlsPanel.offsetHeight;

            controlsPanel.style.left = Math.max(0, Math.min(x, maxX)) + 'px';
            controlsPanel.style.top = Math.max(0, Math.min(y, maxY)) + 'px';
        }
    });

    document.addEventListener('mouseup', () => {
        if (isDragging) {
            isDragging = false;
            controlsPanel.style.cursor = 'grab';
        }
    });
}
