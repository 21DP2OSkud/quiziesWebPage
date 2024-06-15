let IP = "81.198.7.240";

async function fetchUserNotifications(user_id) {
    try {
        const response = await fetch(`http://${IP}:3000/api/notifications?user_id=${user_id}`);
        if (!response.ok) {
            throw new Error('Failed to fetch notifications');
        }
        const notifications = await response.json();
        localStorage.setItem('notifications', JSON.stringify(notifications));
        return notifications;
    } catch (error) {
        console.error('Error fetching notifications:', error);
        return null;
    }
}

// Check session on page load
function checkSession() {
    const userProfile = JSON.parse(localStorage.getItem('userProfile'));

    if (userProfile) {
        fetchUserNotifications(userProfile.user_id);
    }

    if (userProfile && userProfile.user_id !== 1 && userProfile.user_id !== 67 && userProfile.user_id !== 68) {
        const notifications = JSON.parse(localStorage.getItem('notifications'));
        return { session: true, userProfile: userProfile, admin: false, notifications: notifications };
    } else if (userProfile && (userProfile.user_id === 1 || userProfile.user_id === 67 || userProfile.user_id === 68)) {
        const notifications = JSON.parse(localStorage.getItem('notifications'));
        return { session: true, userProfile: userProfile, admin: true, notifications: notifications };
    } else {
        return { session: false, userProfile: null, notifications: null };
    }
}

export { checkSession };