import * as userAuthentication from './gbl_user_authentication_ui.js';

const {
    createLogInUI,
    createRegisterUI,
    signOut,
} = userAuthentication;

function updateUserDropdown(isLoggedIn, userProfile) {
    // Get dropdown elements
    const dropdown = document.getElementById('user-dropdown');
    const profileImg = document.querySelector('#user-menu-button img');
    

    // Function to update dropdown menu for logged in user
    function updateLoggedInDropdown() {
        console.log(userProfile);
    
        // Function to remove additional quotes from the URL
        function cleanProfileImageUrl(url) {
            return url.replace(/^['"](.*)['"]$/, '$1');
        }
    
        // Clean the profile image URL if necessary
        const cleanedProfileImageUrl = cleanProfileImageUrl(userProfile.profile_image_url);
    
        // Create elements for dropdown menu
        const profileNameSpan = document.createElement('span');
        profileNameSpan.textContent = userProfile.username;
        profileNameSpan.classList.add('block', 'text-sm', 'text-gray-900', 'dark:text-white', 'text-center'); // Center text
    
        const profileEmailSpan = document.createElement('span');
        profileEmailSpan.textContent = userProfile.email;
        profileEmailSpan.classList.add('block', 'text-sm', 'text-gray-500', 'truncate', 'dark:text-gray-400', 'text-center'); // Center text
    
        const profileSettingsLink = document.createElement('a');
        profileSettingsLink.href = '#';
        profileSettingsLink.textContent = 'Settings';
        profileSettingsLink.classList.add('block', 'px-4', 'py-2', 'text-sm', 'text-gray-700', 'hover:bg-gray-100', 'dark:hover:bg-gray-600', 'dark:text-gray-200', 'dark:hover:text-white', 'text-center'); // Center text
    
        const signOutLink = document.createElement('a');
        signOutLink.href = '#';
        signOutLink.textContent = 'Sign out';
        signOutLink.id = 'btn_sign_out';
        signOutLink.classList.add('block', 'px-4', 'py-2', 'text-sm', 'text-gray-700', 'hover:bg-gray-100', 'dark:hover:bg-gray-600', 'dark:text-gray-200', 'dark:hover:text-white', 'text-center'); // Center text
    
        const profileList = document.createElement('ul');
        profileList.classList.add('py-2');
        profileList.setAttribute('aria-labelledby', 'user-menu-button');
    
        const settingsListItem = document.createElement('li');
        settingsListItem.appendChild(profileSettingsLink);
    
        const signOutListItem = document.createElement('li');
        signOutListItem.appendChild(signOutLink);
    
        profileList.appendChild(settingsListItem);
        profileList.appendChild(signOutListItem);
    
        // Clear existing dropdown content
        dropdown.textContent = '';
    
        // Append elements to dropdown
        dropdown.appendChild(profileNameSpan);
        dropdown.appendChild(profileEmailSpan);
        dropdown.appendChild(profileList);
    
        // Update profile image source
        profileImg.src = cleanedProfileImageUrl;
    }

    // Function to update dropdown menu for logged out user
    function updateLoggedOutDropdown() {
        profileImg.src = "../server/users_profile_pictures/default_user_img.png"; // Change this to the URL of the default user image
        dropdown.innerHTML = `
            <ul class="py-2" aria-labelledby="user-menu-button">
                <li>
                    <a href="#" class="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 dark:hover:bg-gray-600 dark:text-gray-200 dark:hover:text-white" id="btn_log_in">Login</a>
                </li>
                <li>
                    <a href="#" class="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 dark:hover:bg-gray-600 dark:text-gray-200 dark:hover:text-white" id="btn_register">Sign Up</a>
                </li>
            </ul>`;
    }

    // Update dropdown menu based on login status
    if (isLoggedIn) {
        updateLoggedInDropdown();
    } else {
        updateLoggedOutDropdown();
    }

    // Toggle dropdown menu visibility
    document.getElementById('user-menu-button').addEventListener('mouseenter', function() {
        dropdown.classList.remove('hidden');
    });

    dropdown.addEventListener('mouseleave', function() {
        dropdown.classList.add('hidden');
    });

    // Get the buttons for sign out, log in, and sign up
    const btnSignOut = document.getElementById('btn_sign_out');
    const btnLogIn = document.getElementById('btn_log_in');
    const btnRegister = document.getElementById('btn_register');

    // Add event listener for sign out button if it exists
    if (btnSignOut) {
        btnSignOut.addEventListener('click', function() {
            console.log("Sign out processing");
            userAuthentication.signOut();
        });
    }

    // Add event listener for log in button if it exists
    if (btnLogIn) {
        btnLogIn.addEventListener('click', function() {
            console.log("Log In processing");
            createLogInUI();
        });
    }

    // Add event listener for sign up button if it exists
    if (btnRegister) {
        btnRegister.addEventListener('click', function() {
            console.log("Register processing");
            createRegisterUI();
        });
    }
}

updateUserDropdown(false, null);


export {
    updateUserDropdown,
}