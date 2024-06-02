import * as clientSide from './client-side.js';
const {
    updateUserProfileDB,
} = clientSide;

document.addEventListener('DOMContentLoaded', function() {
    // Retrieve user profile data from localStorage
    const userProfile = JSON.parse(localStorage.getItem('userProfile'));

    // Create profile container dynamically
    const profileContainer = document.createElement('div');
    profileContainer.id = 'profile-container';
    profileContainer.classList.add('flex', 'flex-col', 'items-center', 'justify-center', 'bg-gray-100');

    // Create profile image container dynamically
    const profileImageContainer = document.createElement('div');
    profileImageContainer.classList.add('relative');

    // Create profile image input dynamically
    const profileImageInput = document.createElement('input');
    profileImageInput.type = 'file';
    profileImageInput.accept = 'image/*';
    profileImageInput.classList.add('absolute', 'top-0', 'left-0', 'w-full', 'h-full', 'opacity-0', 'cursor-pointer');
    profileImageInput.addEventListener('change', handleImageUpload);

    // Create profile image dynamically
    const profileImage = document.createElement('img');
    profileImage.id = 'profile-image';
    profileImage.classList.add('w-32', 'h-32', 'rounded-full', 'mb-4', 'border-4', 'border-white', 'cursor-pointer');
    profileImage.src = userProfile ? userProfile.profile_image_url : 'default_profile_image.jpg';
    profileImage.addEventListener('click', () => profileImageInput.click());

    // Create profile username container dynamically
    const profileUsernameContainer = document.createElement('div');
    profileUsernameContainer.classList.add('flex', 'items-center');

    // Create profile username dynamically
    const profileUsername = document.createElement('h1');
    profileUsername.id = 'profile-username';
    profileUsername.classList.add('text-2xl', 'font-bold', 'text-gray-800', 'mt-2', 'mr-2');
    profileUsername.textContent = userProfile ? userProfile.username : 'User Profile Not Found';

    // Create edit username icon dynamically
    const editUsernameIcon = document.createElement('i');
    editUsernameIcon.classList.add('fas', 'fa-pencil-alt', 'text-gray-400', 'cursor-pointer', 'edit-username-icon');
    editUsernameIcon.addEventListener('click', editUsername);

    // Append elements to profile username container
    profileUsernameContainer.appendChild(profileUsername);
    profileUsernameContainer.appendChild(editUsernameIcon);

    // Create profile email dynamically
    const profileEmail = document.createElement('p');
    profileEmail.id = 'profile-email';
    profileEmail.classList.add('text-gray-600', 'mt-2');
    profileEmail.textContent = userProfile ? `Email: ${userProfile.email}` : '';

    // Create profile created at dynamically
    const profileCreatedAt = document.createElement('p');
    profileCreatedAt.id = 'profile-created-at';
    profileCreatedAt.classList.add('text-gray-600', 'mt-2');
    profileCreatedAt.textContent = userProfile ? `Created At: ${userProfile.created_at}` : '';

    // Create buttons container dynamically
    const buttonsContainer = document.createElement('div');
    buttonsContainer.classList.add('mt-4', 'flex', 'buttons-container');

    // Create save changes button dynamically
    const saveChangesButton = document.createElement('button');
    saveChangesButton.classList.add('bg-blue-500', 'hover:bg-blue-700', 'text-white', 'font-bold', 'py-2', 'px-4', 'rounded');
    saveChangesButton.textContent = 'Save Changes';
    saveChangesButton.addEventListener('click', () => saveChanges(profileImageInput, profileUsername));

    // Create cancel button dynamically
    const cancelButton = document.createElement('button');
    cancelButton.classList.add('bg-red-500', 'hover:bg-red-700', 'text-white', 'font-bold', 'py-2', 'px-4', 'rounded');
    cancelButton.textContent = 'Cancel';
    cancelButton.addEventListener('click', cancelChanges);

    // Append buttons to buttons container
    buttonsContainer.appendChild(cancelButton);
    buttonsContainer.appendChild(saveChangesButton);

    // Append elements to profile container
    profileImageContainer.appendChild(profileImage);
    profileImageContainer.appendChild(profileImageInput);
    profileContainer.appendChild(profileImageContainer);
    profileContainer.appendChild(profileUsernameContainer);
    profileContainer.appendChild(profileEmail);
    profileContainer.appendChild(profileCreatedAt);
    profileContainer.appendChild(buttonsContainer);

    // Append profile container to the body or any other container in your HTML
    const pageContainer = document.getElementById('page-content');
    pageContainer.appendChild(profileContainer);

    // Function to handle image upload
    function handleImageUpload(event) {
        const file = event.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onload = function(e) {
                profileImage.src = e.target.result;
            };
            reader.readAsDataURL(file);
        }
    }

    // Function to handle edit username
    function editUsername() {
        const newUsername = prompt('Enter new username:');
        if (newUsername) {
            profileUsername.textContent = newUsername;
            // You can add logic to save the new username to localStorage here
        }
    }

    // Function to update user profile in localStorage
    function updateUserProfileInLocalStorage(newProfile) {
        localStorage.setItem('userProfile', JSON.stringify(newProfile));
    }

    // Function to handle saving changes
    function saveChanges(profileImageInput, profileUsername) {
        const newUsername = profileUsername.textContent;
        const userProfile = JSON.parse(localStorage.getItem('userProfile'));

        userProfile.username = newUsername;

        const formData = new FormData();
        formData.append('user_id', userProfile.user_id);
        formData.append('username', newUsername);
        formData.append('oldProfileImageUrl', userProfile.profile_image_url);

        // Generate timestamp
        const timestamp = Date.now();
        formData.append('timestamp', timestamp); // Pass timestamp to the server

        if (profileImageInput.files.length > 0) {
            const newProfileImage = profileImageInput.files[0];
            formData.append('profile_image', newProfileImage);
            const originalName = newProfileImage.name.split('.').slice(0, -1).join('.'); // Extracting original filename without extension png/jpg/jpeg
            const extension = newProfileImage.name.split('.').pop(); // Extract extension from original filename
            const filename = `${userProfile.username}-${originalName}-${timestamp}.${extension}`;
            userProfile.profile_image_url = `../server/users_profile_pictures/${filename}`;
        }

        // Replace backward slashes with forward slashes
        userProfile.profile_image_url = userProfile.profile_image_url.replace(/\\/g, '/');

        updateUserProfileInLocalStorage(userProfile);

        updateUserProfileDB(formData)
            .then(response => {
                const { profileImageUrl } = response.data; // Retrieve profile image URL from server response
                if (profileImageUrl) {
                    console.log('Profile updated successfully!');
                    // Optionally, you can redirect or perform any other actions here
                } else {
                    console.error('Failed to update profile: Missing profileImageUrl in the server response');
                    // Optionally, you can display an error message to the user
                }
            })
            .catch(error => {
                console.error('Failed to update profile:', error);
                // Optionally, you can display an error message to the user
            });
    }


    // Function to handle canceling changes
    function cancelChanges() {
        console.log('Profile edit cancelled');
        window.location.href = 'http://127.0.0.1:5500/src/profile-template.html';
    }
});