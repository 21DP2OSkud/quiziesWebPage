import * as session from './gbl_check_session.js';
const {
    checkSession,
} = session;

function loadProfilePage() {
    document.addEventListener('DOMContentLoaded', function() {
        const currentPage = window.location.pathname;

        if (currentPage.includes('profile-template.html')) {
            const userProfile = JSON.parse(localStorage.getItem('userProfile'));
            if (!userProfile || !userProfile.user_id) {
                console.error('User profile or user ID not found.');
                return;
            }

            // Create profile container dynamically
            const profileContainer = document.createElement('div');
            profileContainer.id = 'profile-container';
            profileContainer.classList.add('flex', 'flex-col', 'items-center', 'justify-center', 'bg-gray-100', 'relative'); // Added 'relative' for positioning

            // Create profile image dynamically
            const profileImage = document.createElement('img');
            profileImage.id = 'profile-image';
            profileImage.classList.add('w-32', 'h-32', 'rounded-full', 'mb-4', 'border-4', 'border-white');
            profileImage.src = userProfile.profile_image_url ? userProfile.profile_image_url : 'default_profile_image.jpg';

            // Create profile username dynamically
            const profileUsername = document.createElement('h1');
            profileUsername.id = 'profile-username';
            profileUsername.classList.add('text-2xl', 'font-bold', 'text-gray-800', 'mt-2');
            profileUsername.textContent = userProfile.username;

            // Create profile email dynamically
            const profileEmail = document.createElement('p');
            profileEmail.id = 'profile-email';
            profileEmail.classList.add('text-gray-600', 'mt-2');
            profileEmail.textContent = `Email: ${userProfile.email}`;

            // Create profile created at dynamically
            const profileCreatedAt = document.createElement('p');
            profileCreatedAt.id = 'profile-created-at';
            profileCreatedAt.classList.add('text-gray-600', 'mt-2');
            profileCreatedAt.textContent = `Created At: ${userProfile.created_at}`;

            // Create edit button with pencil icon
            const editButton = document.createElement('button');
            editButton.id = 'edit-button';
            editButton.classList.add('absolute', 'top-0', 'right-0', 'm-2', 'bg-gray-200', 'p-2', 'rounded-full', 'hover:bg-gray-300', 'focus:outline-none');
            editButton.innerHTML = '<i class="fas fa-pencil-alt"></i>'; // Using Font Awesome for the pencil icon
            editButton.addEventListener('click', function() {
                window.location.href = 'profile-edit.html';
            });

            // Append elements to profile container
            profileContainer.appendChild(profileImage);
            profileContainer.appendChild(profileUsername);
            profileContainer.appendChild(profileEmail);
            profileContainer.appendChild(profileCreatedAt);
            profileContainer.appendChild(editButton); // Append the edit button to profile container

            // Append profile container to the body or any other container in your HTML
            const pageContainer = document.getElementById('page-content');
            pageContainer.appendChild(profileContainer);
        } else {
            console.log('Current page is not profile-template.html');
        }
    });
}

if (checkSession()) {
    loadProfilePage();
}
else {
    console.log('Log in to see profile!');
}