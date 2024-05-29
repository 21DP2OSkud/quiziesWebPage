// quizzes_search.js
import { loadQuizzesFromDB } from './quizzes_loader.js';

import * as create_quiz from './quizzes_create_quiz.js';

const {
    createLoadedQuizzes,
} = create_quiz;

document.addEventListener('DOMContentLoaded', function() {
    loadQuizzesFromDB().then(({ data, ids }) => {
        data.forEach(item => {
            const quiz = {
                id: item.quiz_id,
                imgPath: item.imgUrl,
                title: item.title,
                description: item.description
            };
            createLoadedQuizzes(quiz.id, quiz.imgPath, quiz.title, quiz.description);
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
