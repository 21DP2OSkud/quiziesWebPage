import { loadNewestQuizzesFromDB } from './quizzes_loader.js';

// Function to create the sliding quizzes
function createNewestLoadedQuizzes(title, description, image) {
    const slidingPanelContainers = document.getElementsByClassName("sliding-panel-container");
    if (slidingPanelContainers.length === 0) {
        console.error('No sliding panel container found');
        return;
    }

    const slidingPanelContainer = slidingPanelContainers[0];
    let imageSrc = "../" + image;

    const slidingElement = document.createElement('div');
    slidingElement.classList.add('sliding-element');

    const newQuiz = document.createElement("div");
    newQuiz.setAttribute("class", "quiz-box");
    newQuiz.innerHTML = `
        <span class="quiz-title font-bold italic">${title}</span>
        <img src="${imageSrc}" alt="${title}" class="quiz-image">
        <div class="description">
            <hr>
            <span class="quiz-description">${description}</span>
        </div>
    `;

    slidingElement.appendChild(newQuiz);
    slidingPanelContainer.appendChild(slidingElement);

    // Calculate the animation duration based on the width of the container and the speed you want the elements to slide
    const containerWidth = slidingPanelContainer.offsetWidth;
    const animationDuration = containerWidth / 50; // Adjust the divisor to control the speed of sliding

    // Set animation duration dynamically
    slidingElement.style.animationDuration = animationDuration + 's';

    // Remove the sliding element after it has fully passed through the container
    const removeElement = () => {
        slidingElement.removeEventListener('animationend', removeElement);
        slidingPanelContainer.removeChild(slidingElement);
    };

    slidingElement.addEventListener('animationend', removeElement);
}

// Load the newest quizzes immediately on page load
document.addEventListener('DOMContentLoaded', () => {
    const maxQuizzes = 10; // Maximum number of quizzes to display
    let quizQueue = []; // Queue to hold the quizzes
    let currentIndex = 0;

    const fetchAndDisplayQuizzes = () => {
        loadNewestQuizzesFromDB()
            .then(data => {
                console.log('Fetched data:', data); // Log fetched data to console
                quizQueue = data.data.slice(0, maxQuizzes); // Get the 10 newest quizzes
                currentIndex = 0; // Reset the index
                displayNextQuiz(); // Display the first quiz immediately after fetching
            })
            .catch(error => {
                console.error('Error fetching data:', error); // Log error to console
            });
    };

    const displayNextQuiz = () => {
        if (quizQueue.length > 0) {
            const quiz = quizQueue[currentIndex];
            const { title, description, imgUrl } = quiz;
            createNewestLoadedQuizzes(title, description, imgUrl);

            currentIndex++;
            if (currentIndex >= quizQueue.length) {
                currentIndex = 0; // Loop back to the start
            }
        }
    };

    // Initial fetch and display
    fetchAndDisplayQuizzes();

    setInterval(fetchAndDisplayQuizzes, 600000); // Refresh quizzes every 10 minutes

    // Set interval to display the next quiz
    setInterval(displayNextQuiz, 4000); // Show next quiz every 12 seconds
});
