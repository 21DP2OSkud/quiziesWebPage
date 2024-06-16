import * as session from './gbl_check_session.js';

const { checkSession } = session;
const sessionData = checkSession(); // session data

let IP = "81.198.7.240";


async function handleAccept(request_id) {
    try {
        const response = await fetch(`http://${IP}:3000/api/friend-request/accept`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ request_id })
        });

        if (response.ok) {
            console.log(`Accepted friend request with request_id: ${request_id}`);
            // Optionally update UI or perform further actions
            fetchNotifications(sessionData.userProfile.user_id)
                .then(notifications => {
                    toggleNotificationsPanel(notifications);
                    updateNotificationCount(notifications.length);
                });
        } else {
            throw new Error('Failed to accept friend request');
        }
    } catch (error) {
        console.error('Error accepting friend request:', error);
    }
}

async function handleDecline(request_id) {
    try {
        const response = await fetch(`http://${IP}:3000/api/friend-request/decline`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ request_id })
        });

        if (response.ok) {
            console.log(`Declined friend request with request_id: ${request_id}`);
            // Optionally update UI or perform further actions
            fetchNotifications(sessionData.userProfile.user_id)
                .then(notifications => {
                    toggleNotificationsPanel(notifications);
                    updateNotificationCount(notifications.length);
                });
        } else {
            throw new Error('Failed to decline friend request');
        }
    } catch (error) {
        console.error('Error declining friend request:', error);
    }
}


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

async function fetchNotifications(user_id) {
    try {
        const response = await fetch(`http://${IP}:3000/api/notifications?user_id=${user_id}`);
        if (!response.ok) {
            throw new Error('Failed to fetch notifications');
        }
        const notifications = await response.json();
        return notifications;
    } catch (error) {
        console.error('Error fetching notifications:', error);
        throw error;
    }
}


async function fetchNotificationCount(user_id) {
    try {
        const response = await fetch(`http://${IP}:3000/api/notifications/count?user_id=${user_id}`);
        if (!response.ok) {
            throw new Error('Failed to fetch notification count');
        }
        const data = await response.json();
        return data.count;
    } catch (error) {
        console.error('Error fetching notification count:', error);
        throw error;
    }
}


//
//
//

let notificationsPanel = null;
let overlay = null;

function toggleNotificationsPanel(notifications) {
    // Close existing panel if it's already open
    if (notificationsPanel) {
        notificationsPanel.classList.remove('notifications-panel-open');
        overlay.classList.remove('notifications-overlay-active');
        setTimeout(() => {
            notificationsPanel.remove();
            overlay.remove();
            notificationsPanel = null;
            overlay = null;
        }, 300); // Adjust timing to match CSS transition duration
        return;
    }

    // Create overlay
    overlay = document.createElement('div');
    overlay.classList.add('notifications-overlay', 'fixed', 'inset-0', 'bg-black', 'bg-opacity-50', 'z-40');

    // Create notifications panel
    notificationsPanel = document.createElement('div');
    notificationsPanel.classList.add('notifications-panel', 'bg-white', 'shadow-md', 'fixed', 'right-0', 'top-0', 'bottom-0', 'z-50', 'overflow-hidden');

    const panelContent = document.createElement('div');
    panelContent.classList.add('notifications-panel-content', 'overflow-y-auto', 'h-full', 'w-full');

    if (notifications.length === 0) {
        const noNotificationsText = document.createElement('p');
        noNotificationsText.innerText = 'No notifications yet';
        panelContent.appendChild(noNotificationsText);
    } else {
        notifications.forEach(notification => {
            const notificationElement = document.createElement('div');
            notificationElement.classList.add('notification', 'p-4', 'border-b', 'border-gray-200');

            const typeElement = document.createElement('p');
            typeElement.classList.add('text-xs', 'text-gray-500', 'mb-1');
            typeElement.innerText = `Type: ${notification.type}`;

            const description = document.createElement('p');
            description.classList.add('text-sm', 'text-gray-700', 'mb-2');

            if (notification.type === 'friend_request') {
                description.innerText = `${notification.username} wants to be friends with you!`;

                const userProfileDiv = document.createElement('div');
                userProfileDiv.classList.add('user-profile', 'flex', 'items-center', 'mb-2');

                const profileImage = document.createElement('img');
                profileImage.src = notification.profile_image_url;
                profileImage.alt = notification.username;
                profileImage.classList.add('rounded-full', 'w-12', 'h-12', 'mr-4');
                userProfileDiv.appendChild(profileImage);

                const userDetails = document.createElement('div');
                userDetails.innerHTML = `
                    <p class="font-bold">${notification.username}</p>
                    <p class="text-xs text-gray-500">${new Date(notification.created_at).toLocaleDateString()}</p>
                `;
                userProfileDiv.appendChild(userDetails);

                notificationElement.appendChild(typeElement);
                notificationElement.appendChild(userProfileDiv);

                const actionButtonsDiv = document.createElement('div');
                actionButtonsDiv.classList.add('action-buttons', 'flex', 'gap-2', 'mt-2');

                const acceptButton = document.createElement('button');
                acceptButton.innerText = 'Accept';
                acceptButton.classList.add('btn', 'btn-accept');
                acceptButton.addEventListener('click', () => {
                    handleAccept(notification.request_id);
                });
                actionButtonsDiv.appendChild(acceptButton);

                const declineButton = document.createElement('button');
                declineButton.innerText = 'Decline';
                declineButton.classList.add('btn', 'btn-decline');
                declineButton.addEventListener('click', () => {
                    handleDecline(notification.request_id);
                });
                actionButtonsDiv.appendChild(declineButton);

                notificationElement.appendChild(description);
                notificationElement.appendChild(actionButtonsDiv);
            } else {
                description.innerText = `You have a new notification: ${notification.type}`;
                notificationElement.appendChild(typeElement);
                notificationElement.appendChild(description);
            }

            panelContent.appendChild(notificationElement);
        });
    }

    notificationsPanel.appendChild(panelContent);
    document.body.appendChild(overlay);
    document.body.appendChild(notificationsPanel);

    // Add a short delay to trigger CSS animation
    setTimeout(() => {
        notificationsPanel.classList.add('notifications-panel-open');
        overlay.classList.add('notifications-overlay-active');
    }, 50);

    // Close panel when clicking on the overlay
    overlay.addEventListener('click', () => {
        toggleNotificationsPanel([]);
    });
}

function openNotificationsPanel() {
    fetchNotifications(sessionData.userProfile.user_id)
        .then(notifications => {
            toggleNotificationsPanel(notifications);
            console.log(notifications);
        })
        .catch(error => {
            console.error('Error fetching notifications:', error);
        });
}


//
//
//

function initializeNotifications() {
    
    const profileAndNotifications = document.getElementById('profile-and_notifications');
    const currentPage = window.location.pathname;

    const bellIcon = document.createElement('button');
    bellIcon.type = 'button';
    bellIcon.classList.add('bell-btn', 'relative', 'flex', 'items-center', 'justify-center', 'text-gray-700', 'hover:text-gray-900', 'focus:outline-none', 'rounded-full', 'w-10', 'h-10', 'p-3', 'mr-4');
    bellIcon.innerHTML = `
        <i class="fas fa-bell text-xl"></i>
        <span id="notification-badge" class="absolute top-0 right-0 inline-flex items-center justify-center px-2 py-1 text-xs font-bold leading-none text-white bg-red-600 rounded-full"></span>
    `;

    // Function to add hover effect
    function addHoverEffect(element, hoverColor) {
        element.addEventListener('mouseover', function() {
            element.style.backgroundColor = hoverColor;
        });

        element.addEventListener('mouseout', function() {
            element.style.backgroundColor = ''; // Restore to default or remove inline style
        });
    }

    switch (currentPage) {
        case "/src/index.html":
            bellIcon.style.backgroundColor = "rgb(220,252,231)";
            addHoverEffect(bellIcon, "rgb(200, 252, 220)")
            break;
        case "/src/about.html":
            bellIcon.style.backgroundColor = "rgb(254,249,195)";
            addHoverEffect(bellIcon, "rgb(255, 240, 170)")
            break;
        case "/src/services.html":
            bellIcon.style.backgroundColor = "rgb(252,231,243)";
            addHoverEffect(bellIcon, "rgb(252, 217, 237)")
            break;
        case "/src/quizzes.html":
            bellIcon.style.backgroundColor = "rgb(219,234,254)";
            addHoverEffect(bellIcon, "rgb(207, 227, 253)")
            break;
        default:
            bellIcon.style.backgroundColor = "rgb(31,41,55)";
            addHoverEffect(bellIcon, "#2d3748")
    }

    bellIcon.addEventListener('click', () => {
        openNotificationsPanel();
    });

    profileAndNotifications.insertBefore(bellIcon, profileAndNotifications.firstChild);

    const storedNotificationCount = JSON.parse(localStorage.getItem('notificationCount'));

    if (storedNotificationCount !== null) {
        updateNotificationCount(storedNotificationCount);
    }

    fetchNotifications(sessionData.userProfile.user_id)
        .then(notifications => {
            updateNotificationCount(notifications.length);
        })
        .catch(error => {
            console.error('Error initializing notifications:', error);
            // Optionally handle error display or retry logic here
        });
}

document.addEventListener('DOMContentLoaded', () => {
    initializeNotifications();
});

export { updateNotificationCount, fetchNotifications, initializeNotifications, fetchNotificationCount };