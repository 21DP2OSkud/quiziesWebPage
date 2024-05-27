function updateUserDropdown(isLoggedIn, userProfile) {
    // Get dropdown elements
    var dropdown = document.getElementById('user-dropdown');
    var profileImg = document.querySelector('#user-menu-button img');
    var userName = document.querySelector('#user-dropdown .text-gray-900');
    var userEmail = document.querySelector('#user-dropdown .text-gray-500');

    // Function to update dropdown menu for logged in user
    function updateLoggedInDropdown() {
        profileImg.src = userProfile.profile_imgUrl;
        userName.textContent = userProfile.name;
        userEmail.textContent = userProfile.email;
        dropdown.innerHTML = `
            <div class="px-4 py-3">
                <span class="block text-sm text-gray-900 dark:text-white">${userProfile.name}</span>
                <span class="block text-sm text-gray-500 truncate dark:text-gray-400">${userProfile.email}</span>
            </div>
            <ul class="py-2" aria-labelledby="user-menu-button">
                <li>
                    <a href="#" class="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 dark:hover:bg-gray-600 dark:text-gray-200 dark:hover:text-white">Settings</a>
                </li>
                <li>
                    <a href="#" class="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 dark:hover:bg-gray-600 dark:text-gray-200 dark:hover:text-white" id="btn_sign_out">Sign out</a>
                </li>
            </ul>`;
    }

    // Function to update dropdown menu for logged out user
    function updateLoggedOutDropdown() {
        profileImg.src = "../server/users_profile_pictures/default_user_img.png"; // Change this to the URL of the default user image
        userName.textContent = "Guest";
        userEmail.textContent = "";
        dropdown.innerHTML = `
            <ul class="py-2" aria-labelledby="user-menu-button">
                <li>
                    <a href="#" class="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 dark:hover:bg-gray-600 dark:text-gray-200 dark:hover:text-white" id="btn_log_in">Login</a>
                </li>
                <li>
                    <a href="#" class="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 dark:hover:bg-gray-600 dark:text-gray-200 dark:hover:text-white">Sign_Up</a>
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
    document.getElementById('user-menu-button').addEventListener('click', function() {
        dropdown.classList.toggle('hidden');
    });

    // Hover event for user profile picture
    document.getElementById('user-menu-button').addEventListener('mouseenter', function() {
        dropdown.classList.remove('hidden');
    });

    dropdown.addEventListener('mouseleave', function() {
        dropdown.classList.add('hidden');
    });
}

// Exporting the function for use in other files
export {
    updateUserDropdown,
}