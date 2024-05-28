// Add overlay
function createOverlay() {
    const overlay = document.createElement("div");
    overlay.setAttribute("class", "overlay");
    document.body.appendChild(overlay);
}

function closeUI(uiDiv) {
    document.getElementsByClassName("overlay")[0].remove();
    uiDiv.remove();
}

export {
    createOverlay,
    closeUI,
}