import * as session from './gbl_check_session.js';
const {
    checkSession,
} = session;

import * as userDropDownMenu from './gbl_user_drop_down.js';
const {
    updateUserDropdown,
} = userDropDownMenu;



document.addEventListener('DOMContentLoaded', function() {
    const userProfile = JSON.parse(localStorage.getItem('userProfile'));
    
    // Add event listener to the profile icon

    const profileIcon = document.getElementById("profile-icon");
    if (userProfile) {
        profileIcon.addEventListener("click", function() {
            window.location.href = 'profile-template.html';
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
            const navBar = document.getElementById("nav-bar");
            const logoSpan = document.getElementById("logo-span");
            const link = document.getElementById(`${key}-link`);
            link.classList.add('active');
            navBar.classList.add('bg-gray-800');
            logoSpan.classList.add('text-gray-900');
            break; // Once the active link is found, exit the loop
        }
    }

    // Call checkSession on page load
    const sessionData = checkSession();

    if (sessionData.session) {
        updateUserDropdown(true, sessionData.userProfile);
        console.log("Session: ", sessionData.session);
    } else {
        updateUserDropdown(false, null);
        console.log("Session: false");
    }
});