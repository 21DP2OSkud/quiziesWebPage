// Import the function from quizzes_loader.js
import { loadNewestQuizzesFromDB } from './quizzes_loader.js';

// Function to create the sliding quizzes
function createNewestLoadedQuizzes(title, description, image) {
    const slidingPanelContainer = document.querySelector('.sliding-panel-container');
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

    // Remove the sliding element after it has completed its animation
    slidingElement.addEventListener('animationend', () => {
        slidingPanelContainer.removeChild(slidingElement);
    });
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

    // Set interval to fetch new quizzes periodically
    setInterval(fetchAndDisplayQuizzes, 600000); // Adjust the interval as needed

    // Set interval to display the next quiz
    setInterval(displayNextQuiz, 12000); // Adjust the interval as needed
});
