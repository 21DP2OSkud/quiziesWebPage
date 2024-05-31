import * as userDropDown from './gbl_user_drop_down.js';

const {
    updateUserDropdown,
    updateLoggedOutDropdown,
    updateLoggedInDropdown,
} = userDropDown;

import * as clientSide from './client-side.js';

const { 
    loadQuizzesFromDB,
} = clientSide;

import * as userAuthentication from './gbl_user_authentication_ui.js';

const {
    createLogInUI,
    createRegisterUI,
    signOut,
} = userAuthentication;


document.addEventListener('DOMContentLoaded', function() {
    let isLoggedIn = false; // Set this to true if user is logged in
    // Function to toggle isLoggedIn state
    function toggleLoggedInState() {
        isLoggedIn = !isLoggedIn;
    }

    
    var userProfile = {
        name: "Bonnie Green",
        email: "name@quizies.com",
        profile_imgUrl: "../server/users_profile_pictures/user1_name.jpeg" // Change this to the URL of the user's profile image
    };


    // Calling the function from gbl_user_drop_down.js
    updateUserDropdown(isLoggedIn, userProfile);


    // Get the buttons for sign out and log in
    const btnSignOut = document.getElementById('btn_sign_out');
    const btnLogIn = document.getElementById('btn_log_in');
    const btnRegister = document.getElementById('btn_register');

    // Add event listener for sign out button if it exists
    if (btnLogIn) {
        btnLogIn.addEventListener('click', function() {
            /*
            toggleLoggedInState();
            console.log(isLoggedIn);
            console.log(userProfile);
            updateUserDropdown(isLoggedIn, userProfile);
            */
            console.log("Log In processing");
            createLogInUI();
        });
    }


    // Add event listener for log in button if it exists
    if (btnRegister) {
        btnRegister.addEventListener('click', function() {
            /*
            console.log("Login eksistee");
            toggleLoggedInState();
            console.log(isLoggedIn);
            console.log(userProfile);
            updateUserDropdown(isLoggedIn, userProfile);
            */
            console.log("Register processing");
            createRegisterUI();
        });
    }

    // Add event listener for sign out button if it exists
    if (btnSignOut) {
        btnSignOut.addEventListener('click', function() {
            /*
            toggleLoggedInState();
            console.log(isLoggedIn);
            console.log(userProfile);
            updateUserDropdown(isLoggedIn, userProfile);
            */
            console.log("Sign out processing");
            signOut();
        });
    }


    else {
        console.log("Login neeksistee");
    }
    

    // Add event listener to the profile icon
    const profileIcon = document.getElementById("profile-icon");
    profileIcon.addEventListener("click", function() {
        // Redirect to the edit profile page
        window.location.href = `profile.html`;
    });



    // Get the current page URL
    const currentPage = window.location.pathname;

    // Get the navigation links
    const homeLink = document.getElementById('home-link');
    const aboutLink = document.getElementById('about-link');
    const servicesLink = document.getElementById('services-link');
    const quizesLink = document.getElementById('quizes-link');
    // Add more links as needed

    // Check the current page and update the active state of the navigation links
    if (currentPage.includes('index.html')) {
        homeLink.classList.add('active');
    } else if (currentPage.includes('about.html')) {
        aboutLink.classList.add('active');
    } else if (currentPage.includes('services.html')) {
        servicesLink.classList.add('active');
    } else if (currentPage.includes('quizzes.html')) {
        quizesLink.classList.add('active');
    }
    // Add more conditions for other pages
});

