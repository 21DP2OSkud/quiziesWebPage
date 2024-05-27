// Add overlay
function createOverlay() {
    const overlay = document.createElement("div");
    overlay.setAttribute("class", "overlay");
    document.body.appendChild(overlay);
}

export {
    createOverlay
}