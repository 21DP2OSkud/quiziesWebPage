// Check session on page load
function checkSession() {
    const userProfile = JSON.parse(localStorage.getItem('userProfile'));
    if (userProfile && userProfile.user_id !==  1) {
        return { session: true, userProfile: userProfile, admin: false};
    } else if (userProfile && userProfile.user_id === 1) {
        return { session: true, userProfile: userProfile, admin: true };
    } else {
        return { session: false, userProfile: null };
    }
}

export {
    checkSession,
}