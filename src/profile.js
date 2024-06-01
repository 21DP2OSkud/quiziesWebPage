function createProfilePage(userProfile) {
    document.addEventListener('DOMContentLoaded', function() {
        if (!userProfile || !userProfile.user_id) {
            console.error('User profile or user ID not found.');
            return;
        }

        const currentPage = window.location.pathname;

        if (currentPage.includes('profile-template.html')) {
            const profileContainer = document.getElementById('profile-container');

            // Create profile image dynamically
            const profileImage = document.createElement('img');
            profileImage.id = 'profile-image';
            profileImage.classList.add('w-32', 'h-32', 'rounded-full', 'mb-4', 'border-4', 'border-white');
            profileImage.src = userProfile ? userProfile.profile_image_url : 'default_profile_image.jpg';
    
            // Create profile username dynamically
            const profileUsername = document.createElement('h1');
            profileUsername.id = 'profile-username';
            profileUsername.classList.add('text-2xl', 'font-bold', 'text-gray-800', 'mt-2');
            profileUsername.textContent = userProfile ? userProfile.username : 'User Profile Not Found';
    
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
    
            // Append elements to profile container
            profileContainer.appendChild(profileImage);
            profileContainer.appendChild(profileUsername);
            profileContainer.appendChild(profileEmail);
            profileContainer.appendChild(profileCreatedAt);
        }
    });
}

const userProfile = JSON.parse(localStorage.getItem('userProfile'));
createProfilePage(userProfile);