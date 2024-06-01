document.addEventListener('DOMContentLoaded', function() {
    // Add event listener to the profile icon
    const profileIcon = document.getElementById("profile-icon");
    profileIcon.addEventListener("click", function() {
        // Redirect to the edit profile page
        window.location.href = `profile.html`;
    });



    // Get the current page URL
    const currentPage = window.location.pathname;

    // Get the navigation links
    const homeLink = document.getElementById('home-link');
    const aboutLink = document.getElementById('about-link');
    const servicesLink = document.getElementById('services-link');
    const quizesLink = document.getElementById('quizes-link');
    // Add more links as needed

    // Check the current page and update the active state of the navigation links
    if (currentPage.includes('index.html')) {
        homeLink.classList.add('active');
    } else if (currentPage.includes('about.html')) {
        aboutLink.classList.add('active');
    } else if (currentPage.includes('services.html')) {
        servicesLink.classList.add('active');
    } else if (currentPage.includes('quizzes.html')) {
        quizesLink.classList.add('active');
    }
    // Add more conditions for other pages
});