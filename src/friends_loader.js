import * as ui from './gbl_create_ui.js';
const { createOverlay, closeUI } = ui;

import * as session from './gbl_check_session.js';
const { checkSession } = session;
const sessionData = checkSession(); // session data

import * as notifications from './gbl_notifications.js';
const { updateNotificationCount, fetchNotificationCount } = notifications;

import IP from '../appConfig.js';

document.addEventListener('DOMContentLoaded', () => {
    document.getElementById('add-friend-button').addEventListener('click', () => {
        showAddFriendUI();
    });

    fetchFriends().then(friends => {
        displayFriends(friends);
    });
});

function getUserId() {
    // Logic to get the current logged-in user ID
    const user_id = sessionData.userProfile.user_id;
    // This might come from a cookie, local storage, or a global JS variable
    return user_id;
}

function fetchUsers() {
    const user_id = getUserId(); // Get current user's ID
    const url = `http://${IP}:3000/api/users?user_id=${user_id}`;

    return fetch(url)
        .then(response => {
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            return response.json(); // Return user data
        })
        .catch(error => {
            console.error('Error fetching users:', error);
            throw error; // Propagate the error to handle it in the calling function
        });
}

function fetchFriends() {
    const user_id = getUserId();
    const url = `http://${IP}:3000/api/friends?user_id=${user_id}`;

    return fetch(url)
        .then(response => {
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            return response.json();
        })
        .catch(error => {
            console.error('Error fetching friends:', error);
        });
}


function sendFriendRequest(senderId, receiverId) {
    const friendRequestData = {
        sender_id: senderId,
        receiver_id: receiverId
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
            return response.json().then(errorData => {
                throw new Error(errorData.error || 'Failed to send friend request');
            });
        }
        return response.json();
    })
    .then(data => {
        console.log('Friend request sent successfully:', data);
        alert('Friend request sent successfully');
        // Optionally update UI or perform further actions
        fetchNotificationCount(sessionData.userProfile.user_id)
            .then(count => {
                updateNotificationCount(count);
            })
            .catch(error => {
                console.error('Error updating notification count:', error);
            });
    })
    .catch(error => {
        console.error('Error in friend request flow:', error);
        alert(error.message);
    });
}

//
// 
//

function showAddFriendUI() {
    createOverlay();

    const ui = document.createElement('div');
    ui.className = 'ui all-users-ui fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-white bg-opacity-80 backdrop-filter backdrop-blur-lg rounded-lg shadow-lg p-6 w-[1080px] h-[720px]'; // Adjusted height to 720px

    // Wrapper div for close button
    const closeButtonWrapper = document.createElement('div');
    closeButtonWrapper.className = 'flex justify-end mb-4';
    ui.appendChild(closeButtonWrapper);

    const closeButton = document.createElement('button');
    closeButton.innerText = '×'; // Red 'x' character for close button
    closeButton.className = 'close-btn text-red-600 hover:text-red-800 text-2xl font-bold p-1 rounded-full bg-gray-200 hover:bg-gray-300'; // Styled as red 'x'
    closeButton.addEventListener('click', () => closeUI(ui));
    closeButtonWrapper.appendChild(closeButton);

    const searchBar = document.createElement('input');
    searchBar.type = 'text';
    searchBar.placeholder = 'Search users...';
    searchBar.className = 'w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:border-blue-500 mb-4';
    ui.appendChild(searchBar);

    const usersContainer = document.createElement('div');
    usersContainer.id = 'users-container';
    usersContainer.className = 'flex flex-wrap gap-4 justify-center overflow-y-auto'; // Tailwind classes
    ui.appendChild(usersContainer);

    document.body.appendChild(ui);

    fetchUsers().then(users => {
        displayAllUsers(users);
    });
}

function displayAllUsers(users) {
    const usersContainer = document.getElementById('users-container');
    usersContainer.innerHTML = ''; // Clear existing content

    users.forEach(user => {
        const userElement = document.createElement('div');
        userElement.className = 'user-card p-4 bg-white rounded-lg shadow-md flex flex-col items-center mb-4';
        
        const userImage = document.createElement('img');
        userImage.src = user.profile_image_url;
        userImage.alt = user.username;
        userImage.className = 'w-20 h-20 rounded-full';
        
        const username = document.createElement('span');
        username.innerText = user.username;
        username.className = 'font-bold mt-2';

        const addButton = document.createElement('button');
        addButton.innerText = 'Add Friend';
        addButton.className = 'bg-blue-500 hover:bg-blue-600 text-white py-2 px-4 rounded mt-2';
        addButton.addEventListener('click', () => sendFriendRequest(getUserId(), user.user_id));

        userElement.appendChild(userImage);
        userElement.appendChild(username);
        userElement.appendChild(addButton);
        usersContainer.appendChild(userElement);
    });
}


function displayFriends(friends) {
    const friendsContainer = document.getElementById('friends-container');
    friendsContainer.innerHTML = ''; // Clear existing content

    friends.forEach(friend => {
        const friendElement = document.createElement('div');
        friendElement.classList.add('friend-card'); // Use friend-card class for styling

        // Create image element
        const friendImage = document.createElement('img');
        friendImage.src = friend.profile_image_url;
        friendImage.alt = friend.username;
        friendElement.appendChild(friendImage);

        // Create username element
        const username = document.createElement('span');
        username.innerText = friend.username;
        friendElement.appendChild(username);

        // Append friend element to container
        friendsContainer.appendChild(friendElement);
    });
}