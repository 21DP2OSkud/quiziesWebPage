// quizzes_search.js
import * as quizzesLoader from './quizzes_loader.js';
const {
    loadAllQuizzesFromDB,
} = quizzesLoader;

import * as create_quiz from './quizzes_create_loaded_quizzes.js';
const {
    createLoadedQuizzes,
} = create_quiz;


document.addEventListener('DOMContentLoaded', function() {
    loadAllQuizzesFromDB().then(({ data, ids }) => {
        data.forEach(item => {
            const quiz = {
                id: item.quiz_id,
                imgPath: item.imgUrl,
                title: item.title,
                description: item.description,
                creator_id: item.creator_id,
                play_count: item.play_count,
                likes: item.likes,
                rating: item.rating,
            };
            createLoadedQuizzes(quiz.id, quiz.imgPath, quiz.title, quiz.description, quiz.creator_id, quiz.play_count, quiz.likes, quiz.rating); // Parameters
        });
        console.log('Quizzes loaded:', data);
    }).catch(error => {
        console.error('Error loading quizzes:', error);
    });

    document.getElementById("searchBtn").addEventListener("click", function() {
        searchIconPressed();
    });

    document.querySelector('.search-bar-input').addEventListener('keyup', function(event) {
        if (event.key === 'Enter') {
            enterPressed();
        }
    });

    const searchInput = document.getElementById('search-input');
    searchInput.addEventListener('input', dynamicSearch);

    function searchIconPressed() {
        alert("Icon pressed!");
    }

    function enterPressed() {
        alert("Enter pressed");
    }

    function dynamicSearch() {
        const searchInputValue = searchInput.value.toLowerCase();
        const quizzes = document.querySelectorAll('.quiz-box');

        quizzes.forEach(quiz => {
            const title = quiz.querySelector('.quiz-title').textContent.toLowerCase();
            if (title.includes(searchInputValue)) {
                quiz.style.display = '';
            } else {
                quiz.style.display = 'none';
            }
        });
    }
});
