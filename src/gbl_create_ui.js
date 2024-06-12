// Add overlay
function createOverlay() {
    const overlay = document.createElement("div");
    overlay.setAttribute("class", "overlay");
    document.body.appendChild(overlay);
}

// Close the UI and remove the overlay
function closeUI(uiElement) {
    if (uiElement) {
        uiElement.remove();
        const overlay = document.querySelector('.overlay');
        if (overlay) overlay.remove();
    }
}


export {
    createOverlay,
    closeUI,
}