import * as ui from './gbl_create_ui.js';
const { 
    createOverlay,
    closeUI
} = ui;

import * as session from './gbl_check_session.js';
const {
    checkSession,
} = session;
const sessionData = checkSession(); // session data

import * as notifications from './gbl_notifications.js';
const { 
    updateNotificationCount, 
    fetchNotificationCount,
    createFriendRequestNotification,
} = notifications

let IP = "81.198.7.240";

document.addEventListener('DOMContentLoaded', () => {
    const user_id = getUserId(); // Implement this function to get the current user ID
    //loadFriends(user_id);

    document.getElementById('add-friend-button').addEventListener('click', () => {
        showAddFriendUI();
    });
});

function getUserId() {
    // Logic to get the current logged-in user ID
    const user_id = sessionData.userProfile.user_id;
    // This might come from a cookie, local storage, or a global JS variable
    return user_id;
}

function showAddFriendUI() {
    createOverlay();
    
    const ui = document.createElement('div');
    ui.className = 'ui all-users-ui w-[1080px] h-[720px]';
    
    const closeButton = document.createElement('button');
    closeButton.innerText = 'Close';
    closeButton.addEventListener('click', () => closeUI(ui));
    ui.appendChild(closeButton);

    const usersContainer = document.createElement('div');
    usersContainer.id = 'users-container';
    ui.appendChild(usersContainer);

    document.body.appendChild(ui);

    fetchUsers().then(users => {
        displayAllUsers(users);
    });
}

function fetchUsers() {
    const user_id = getUserId(); // Get current user's ID
    const url = user_id ? `http://${IP}:3000/api/users?user_id=${user_id}` : `http://${IP}:3000/api/users`;

    return fetch(url)
        .then(response => {
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            return response.json(); // Return user data
        })
        .catch(error => {
            console.error('Error fetching users:', error);
        });
}

function displayAllUsers(users) {
    const usersContainer = document.getElementById('users-container');
    usersContainer.innerHTML = ''; // Clear existing content
    usersContainer.classList.add('flex', 'flex-wrap', 'gap-4', 'justify-center'); // Apply Tailwind CSS utility classes

    users.forEach(user => {
        const userElement = document.createElement('div');
        userElement.classList.add('user-card'); // Use user-card class for styling

        const userImage = document.createElement('img');
        userImage.src = user.profile_image_url;
        userImage.alt = user.username;

        const username = document.createElement('span');
        username.innerText = user.username;

        const addButton = document.createElement('button');
        addButton.innerText = 'Add Friend';
        addButton.addEventListener('click', () => sendFriendRequest(getUserId(), user.user_id));

        userElement.appendChild(userImage);
        userElement.appendChild(username);
        userElement.appendChild(addButton);
        usersContainer.appendChild(userElement);
    });
}


// Function to send a friend request from the client-side
function sendFriendRequest(senderId, receiverId) {
    const friendRequestData = {
        sender_id: senderId,
        receiver_id: receiverId,
        status: 'pending',
        sent_at: new Date().toISOString()
    };

    fetch(`http://${IP}:3000/api/friend_requests`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(friendRequestData)
    })
    .then(response => {
        if (!response.ok) {
            throw new Error('Failed to send friend request');
        }
        return response.json();
    })
    .then(data => {
        console.log('Friend request sent successfully:', data);
        // Optionally handle notification creation on the client side if needed
        // createFriendRequestNotification(receiverId, senderId);
    })
    .catch(error => {
        console.error('Error in friend request flow:', error);
    });
}