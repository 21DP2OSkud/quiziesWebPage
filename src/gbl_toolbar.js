import * as userDropDownMenu from './gbl_user_drop_down.js';
const {
    updateUserDropdown,
} = userDropDownMenu;

import * as userProfileDisplay from './profile.js'
const {
    loadProfilePage,
} = userProfileDisplay;

document.addEventListener('DOMContentLoaded', function() {
    const userProfile = JSON.parse(localStorage.getItem('userProfile'));
    
    // Add event listener to the profile icon
    const profileIcon = document.getElementById("profile-icon");
    if (userProfile) {
        profileIcon.addEventListener("click", function() {
            window.location.href = 'http://127.0.0.1:5500/src/profile-template.html';
        });
    }
    else {
        profileIcon.style.cursor = "auto";
    }

    // Function to handle route redirection
    function redirectToRoute(route) {
        // Redirect to the specified route while preserving session information
        window.location.href = route;
    }

    // Add event listener to handle route redirection for each navigation link
    function addRouteListener(linkId, route) {
        const link = document.getElementById(linkId);
        link.style.cursor = 'pointer';
        link.addEventListener('click', function() {
            redirectToRoute(route);
        });
    }

    // Check session on page load
    function checkSession() {
        const userProfile = JSON.parse(localStorage.getItem('userProfile'));
        if (userProfile) {
            updateUserDropdown(true, userProfile);
        } else {
            updateUserDropdown(false, null);
        }
    }

    // Define routes and their corresponding IDs
    const routes = {
        home: 'index.html',
        about: 'about.html',
        services: 'services.html',
        quizes: 'quizzes.html'
        // Add more routes as needed
    };

    // Get the current page URL
    const currentPage = window.location.pathname;

    // Iterate over the routes and add event listeners for each navigation link
    for (const [key, value] of Object.entries(routes)) {
        addRouteListener(`${key}-link`, value);
    }

    // Check the current page and update the active state of the navigation links
    for (const [key, value] of Object.entries(routes)) {
        if (currentPage.includes(value)) {
            const link = document.getElementById(`${key}-link`);
            link.classList.add('active');
            break; // Once the active link is found, exit the loop
        }
    }

    // Call checkSession on page load
    checkSession();
});