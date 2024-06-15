import * as session from './gbl_check_session.js';
const {
    checkSession,
} = session;
const sessionData = checkSession(); // session data

import * as adminPanel from './admin_panel.js';
const {
    createAdminControlPanel,
} = adminPanel;

import * as userAuthentication from './gbl_user_authentication_ui.js';
const {
    createLogInUI,
} = userAuthentication;

//
//
//

let isHovered = false;
let labelHovered = false;
let collapseTimeout;

function addLeftBarIcon() {
    // Const variable declarations
    const navbar = document.getElementById('nav-bar');

    const leftBarDiv = document.createElement('div');
    const iconDiv = document.createElement('div');
    const leftBarIcon = document.createElement('span');
    const leftBarIconSVG = document.createElementNS("http://www.w3.org/2000/svg", "svg");

    const hrUpper = document.createElement("hr");
    hrUpper.setAttribute("class", "upper-hr");

    const labelsDiv = document.createElement('div');


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

    const LoginLabel = createLeftBarLabel(0, 'Log In to see content', "default");
    LoginLabel.addEventListener('click', function () {
        createLogInUI();
    });
    labelsDiv.appendChild(LoginLabel);

    // Appending children
    leftBarIcon.appendChild(leftBarIconSVG);
    iconDiv.appendChild(leftBarIcon);

    leftBarDiv.appendChild(iconDiv);
    leftBarDiv.appendChild(hrUpper);
    leftBarDiv.appendChild(labelsDiv);
    navbar.appendChild(leftBarDiv);

    // Adding event listeners
    iconDiv.addEventListener('mouseover', expandLeftBar);
    iconDiv.addEventListener('mouseout', collapseLeftBar);

    // Add mouse event listener to left bar
    leftBarDiv.addEventListener('mouseenter', () => {
        isHovered = true;
        expandLeftBar();
    });

    leftBarDiv.addEventListener('mouseleave', () => {
        isHovered = false;
        if (!labelHovered) {
            clearTimeout(collapseTimeout);
            collapseLeftBar();
        }
    });

    if (sessionData.session) {
        LoginLabel.remove();

        const myQuizzesLabel = createLeftBarLabel(1, 'My quizzes', "default");
        myQuizzesLabel.addEventListener('click', function () {
            window.location.href = 'my-quizzes-template.html';
        }); 
    
        const dashboardLabel = createLeftBarLabel(2, 'Dashboard', "default");
        dashboardLabel.addEventListener('click', function () {
            window.location.href = 'dashboard-template.html';
        });

        const friendsLabel = createLeftBarLabel(3, 'Friends', "default");
        friendsLabel.addEventListener('click', function () {
            window.location.href = 'friends-template.html';
        });
    
        // admin stuff
        if (sessionData.admin === true) {
            console.log('Account is admin');
            const hr1 = document.createElement('hr');
            hr1.setAttribute('class', 'leftbar-hr');
            const hr2 = document.createElement('hr');
            hr2.setAttribute('class', 'leftbar-hr');
            const allUsersLabel = createLeftBarLabel(4, 'Admin panel', "admin");
            allUsersLabel.addEventListener('click', function () {
                createAdminControlPanel(); // Display admin panel
            });
            const adminLabel = createLeftBarLabel(5, 'Admin label', "admin");
            const settingLabel = createLeftBarLabel(6, 'Settings', "default");
    
            labelsDiv.appendChild(myQuizzesLabel);
            labelsDiv.appendChild(dashboardLabel);
            labelsDiv.appendChild(friendsLabel);
            labelsDiv.appendChild(hr1);
            labelsDiv.appendChild(adminLabel);
            labelsDiv.appendChild(allUsersLabel);
            labelsDiv.appendChild(hr2);
            labelsDiv.appendChild(settingLabel);
        }
        else {
            console.log('Account not admin');
            const settingLabel = createLeftBarLabel(4, 'Settings', "default");
    
            labelsDiv.appendChild(myQuizzesLabel);
            labelsDiv.appendChild(dashboardLabel);
            labelsDiv.appendChild(friendsLabel);
            labelsDiv.appendChild(settingLabel);
        }

        // Adding event listeners to labels
        const labels = document.querySelectorAll('.leftbar-label, .leftbar-admin-label');
        labels.forEach(label => {
            label.addEventListener('mouseover', () => {
                labelHovered = true;
                clearTimeout(collapseTimeout);
                expandLeftBarFully();
            });
            label.addEventListener('mouseout', () => {
                labelHovered = false;
                collapseTimeout = setTimeout(() => {
                    collapseLeftBar();
                }, 500); // Wait for 0.5 second before collapsing
            });
        });

        // Add mouse event listener to left bar
        leftBarDiv.addEventListener('mouseenter', () => {
            isHovered = true;
            expandLeftBar();
        });

        leftBarDiv.addEventListener('mouseleave', () => {
            isHovered = false;
            if (!labelHovered) {
                clearTimeout(collapseTimeout);
                collapseLeftBar();
            }
        });
    } else {
        /* */
    }
}

function createLeftBarLabel(id, text, type) {
    if (type === "default") {
        const label = document.createElement('div');
        label.textContent = text;
        label.setAttribute('class', 'leftbar-label');
        label.setAttribute('id', 'label-' + id);
        return label;
    }
    else if (type === "admin") {
        const label = document.createElement('div');
        label.textContent = text;
        label.setAttribute('class', 'leftbar-admin-label');
        label.setAttribute('id', 'label-' + id);
        return label;
    }
}

function expandLeftBar() {
    const leftBar = document.getElementById('leftbar');
    leftBar.style.width = '12.5%'; 
    showLabels();
}

function expandLeftBarFully() {
    const leftBar = document.getElementById('leftbar');
    leftBar.style.width = '18.75%';
    showLabels();
}

function collapseLeftBar() {
    const leftBar = document.getElementById('leftbar');
    if (!isHovered && !labelHovered) {
        leftBar.style.width = '64px';
        hideLabels();
    } else {
        leftBar.style.width = '12.5%'; // Adjust the width after delay
    }
}

function showLabels() {
    const labels = document.querySelectorAll('.leftbar-label, .leftbar-admin-label');
    labels.forEach(label => {
        label.style.opacity = '1';
        label.style.visibility = 'visible';
    });
}

function hideLabels() {
    const labels = document.querySelectorAll('.leftbar-label, .leftbar-admin-label');
    labels.forEach(label => {
        label.style.opacity = '0';
        label.style.visibility = 'hidden';
    });
}

document.addEventListener('DOMContentLoaded', addLeftBarIcon);