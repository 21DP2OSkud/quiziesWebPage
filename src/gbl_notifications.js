import * as session from './gbl_check_session.js';

const { checkSession } = session;
const sessionData = checkSession(); // session data

let notificationCount = 0; // Initialize notification count
let IP = "81.198.7.240";

function updateNotificationCount(count) {
    const notificationBadge = document.getElementById('notification-badge');
    if (count > 0) {
        if (count > 9) {
            notificationBadge.innerText = '9+'; // Display 9+ if notifications exceed 9
        } else {
            notificationBadge.innerText = count.toString();
        }
        notificationBadge.style.display = 'inline-flex'; // Show the badge
    } else {
        notificationBadge.innerText = '';
        notificationBadge.style.display = 'none'; // Hide the badge if no notifications
    }
}

function fetchNotificationCount(user_id) {
    const url = `http://${IP}:3000/api/notifications/count?user_id=${user_id}`;

    return fetch(url)
        .then(response => {
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            return response.json();
        })
        .then(data => {
            localStorage.setItem('notificationCount', JSON.stringify(data.notificationCount));
            return data.notificationCount; // Return notification count if successful
        })
        .catch(error => {
            console.error('Error fetching notification count:', error);
            throw error; // Propagate the error
        });
}


function initializeNotifications() {
    const profileAndNotifications = document.getElementById('profile-and_notifications');

    const bellIcon = document.createElement('button');
    bellIcon.type = 'button';
    bellIcon.classList.add('bell-btn', 'relative', 'flex', 'items-center', 'justify-center', 'text-gray-700', 'hover:text-gray-900', 'focus:outline-none', 'rounded-full', 'w-10', 'h-10', 'p-3', 'mr-4');
    bellIcon.innerHTML = `
        <i class="fas fa-bell text-xl"></i>
        <span id="notification-badge" class="absolute top-0 right-0 inline-flex items-center justify-center px-2 py-1 text-xs font-bold leading-none text-white bg-red-600 rounded-full"></span>
    `;

    bellIcon.addEventListener('click', () => {
        console.log(sessionData.notifications);
        openNotificationsPanel();
    });

    profileAndNotifications.insertBefore(bellIcon, profileAndNotifications.firstChild);

    const user_id = sessionData.userProfile.user_id; // Get current user's ID
    const storedNotificationCount = JSON.parse(localStorage.getItem('notificationCount'));

    if (storedNotificationCount !== null) {
        updateNotificationCount(storedNotificationCount);
    }

    fetchNotificationCount(user_id)
        .then(data => {
            updateNotificationCount(data);
        })
        .catch(error => {
            console.error('Error initializing notifications:', error);
        });
}


function fetchNotifications(user_id) {
    const url = `http://${IP}:3000/api/notifications?user_id=${user_id}`;

    return fetch(url)
        .then(response => {
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            return response.json();
        })
        .then(data => {
            return data; // Return notifications data
        })
        .catch(error => {
            console.error('Error fetching notifications:', error);
            throw error; // Propagate the error
        });
}



function openNotificationsPanel() {
    const notificationsPanel = document.createElement('div');
    notificationsPanel.classList.add('notifications-panel', 'p-4', 'bg-white', 'shadow-md', 'absolute', 'right-0', 'top-12', 'z-10');

    fetchNotifications(sessionData.userProfile.user_id)
        .then(notifications => {
            if (notifications.length === 0) {
                const noNotificationsText = document.createElement('p');
                noNotificationsText.innerText = 'No notifications yet';
                notificationsPanel.appendChild(noNotificationsText);
            } else {
                notifications.forEach(notification => {
                    const notificationElement = document.createElement('div');
                    notificationElement.classList.add('notification', 'p-2', 'mb-2', 'border', 'border-gray-200', 'rounded');
                    notificationElement.innerText = `Notification: ${notification.type} from user ${notification.sender_id}`;

                    notificationsPanel.appendChild(notificationElement);
                });
            }

            const closeButton = document.createElement('button');
            closeButton.innerText = 'Close';
            closeButton.classList.add('text-sm', 'text-gray-500', 'mt-2', 'px-4', 'py-2', 'border', 'border-gray-300', 'rounded', 'hover:bg-gray-100', 'focus:outline-none');
            closeButton.addEventListener('click', () => {
                notificationsPanel.remove();
            });

            notificationsPanel.appendChild(closeButton);
            document.body.appendChild(notificationsPanel);
        })
        .catch(error => {
            console.error('Error fetching notifications:', error);
        });
}


// Function to create notification for friend request on the client side
function createFriendRequestNotification(receiverUserId, senderUserId) {
    const notificationData = {
        user_id: receiverUserId,
        type: 'friend_request',
        sender_id: senderUserId
    };

    const checkUrl = `http://${IP}:3000/api/notifications/check?user_id=${receiverUserId}&sender_id=${senderUserId}&type=friend_request`;

    return fetch(checkUrl)
        .then(response => {
            if (!response.ok) {
                throw new Error('Failed to check existing notifications');
            }
            return response.json();
        })
        .then(data => {
            console.log('Check existing notification response:', data);
            if (data.exists) {
                console.log('Notification already exists for this event');
                return null; // Return null to indicate notification exists
            }

            // If no existing notification, create a new one
            return fetch(`http://${IP}:3000/api/notifications`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(notificationData)
            });
        })
        .then(response => {
            if (response && !response.ok) {
                throw new Error('Failed to create notification');
            }
            return response ? response.json() : null;
        })
        .then(data => {
            if (data === null) {
                console.log('No new notification created because one already exists');
                return; // Early return as no further processing is needed
            }
            console.log('Notification created successfully:', data);

            // Fetch the latest notification count and update localStorage if needed
            // return fetchNotificationCount(receiverUserId)
            //     .then(count => {
            //         localStorage.setItem('notificationCount', JSON.stringify(count));
            //     })
            //     .catch(error => {
            //         console.error('Error updating notification count in localStorage:', error);
            //     });
        })
        .catch(error => {
            console.error('Error creating notification:', error);
            throw error; // Propagate the error
        });
}


document.addEventListener('DOMContentLoaded', () => {
    initializeNotifications();
});

export { updateNotificationCount, fetchNotificationCount, createFriendRequestNotification, initializeNotifications };