function addLeftBarIcon() {
    // Const variable declarations
    const navbar = document.getElementById('nav-bar');

    const leftBarDiv = document.createElement('div');
    const iconDiv = document.createElement('div');
    const leftBarIcon = document.createElement('span');
    const leftBarIconSVG = document.createElementNS("http://www.w3.org/2000/svg", "svg");

    const hr = document.createElement("hr");

    const labelsDiv = document.createElement('div');

    const label1 = createLeftBarLabel(1, 'My quizzes');
    const label2 = createLeftBarLabel(2, 'settings');
    const label3 = createLeftBarLabel(3, 'Label 3');

    // Setting attributes
    leftBarDiv.setAttribute('id', 'leftbar');
    leftBarDiv.setAttribute('class', 'leftbar');

    iconDiv.setAttribute('class', "leftbar-icon-div absolute left-0 top-0");

    leftBarIcon.setAttribute('id', "leftbar-icon-span");
    leftBarIcon.setAttribute('class', "flex items-center justify-center w-full h-full");

    leftBarIconSVG.setAttribute('class', "text-white cursor-pointer");
    leftBarIconSVG.setAttribute('id', "leftbar-icon");
    leftBarIconSVG.setAttribute('width', "32");
    leftBarIconSVG.setAttribute('height', "32");
    leftBarIconSVG.setAttribute('viewBox', "0 0 24 24");
    leftBarIconSVG.innerHTML = `
        <path fill="currentColor" d="M3 7h18v2H3V7zm0 5h18v2H3v-2zm0 5h18v2H3v-2z"></path>
    `;

    labelsDiv.setAttribute('class', 'leftbar-labels mt-16 w-[100%] flex flex-col items-center');

    // Appending children
    leftBarIcon.appendChild(leftBarIconSVG);
    iconDiv.appendChild(leftBarIcon);

    labelsDiv.appendChild(label1);
    labelsDiv.appendChild(label2);
    labelsDiv.appendChild(label3);

    leftBarDiv.appendChild(iconDiv);
    leftBarDiv.appendChild(hr);
    leftBarDiv.appendChild(labelsDiv);
    navbar.appendChild(leftBarDiv);

    // Adding event listeners
    leftBarDiv.addEventListener('mouseover', expandLeftBar);
    leftBarDiv.addEventListener('mouseout', collapseLeftBar);

    // Adding event listeners to labels
    const labels = document.querySelectorAll('.leftbar-label');
    labels.forEach(label => {
        label.addEventListener('mouseover', expandLeftBarFully);
        label.addEventListener('mouseout', collapseLeftBar);
    });
}


function createLeftBarLabel(id, text) {
    const label = document.createElement('div');
    label.textContent = text;
    label.setAttribute('class', 'leftbar-label');
    label.setAttribute('id', 'label-'+id);
    return label;
}

function expandLeftBar() {
    const leftBar = document.getElementById('leftbar');
    leftBar.style.width = '16.7%'; 
    showLabels();
}

//nestrada
function expandLeftBarFully() {
    const leftBar = document.getElementById('leftbar');
    leftBar.style.width = '25%';
    showLabels();
}

function collapseLeftBar() {
    const leftBar = document.getElementById('leftbar');
    leftBar.style.width = '64px';
    hideLabels();
}

function showLabels() {
    const labels = document.querySelectorAll('.leftbar-label');
    labels.forEach(label => {
        label.style.opacity = '1';
        label.style.visibility = 'visible';
    });
}

function hideLabels() {
    const labels = document.querySelectorAll('.leftbar-label');
    labels.forEach(label => {
        label.style.opacity = '0';
        label.style.visibility = 'hidden';
    });
}

document.addEventListener('DOMContentLoaded', addLeftBarIcon);
