// Check session on page load
function checkSession() {
    const userProfile = JSON.parse(localStorage.getItem('userProfile'));
    if (userProfile) {
        return { session: true, userProfile: userProfile };
    } else {
        return { session: false, userProfile: null };
    }
}

export {
    checkSession,
}