// quizzes_loader.js
let quizzesData = null;
let quizzesPromise = null;
import IP from '../appConfig.js';

function loadAllQuizzesFromDB() {
    if (quizzesData) {
        return Promise.resolve(quizzesData);
    }
    if (!quizzesPromise) {
        quizzesPromise = fetch(`http://${IP}:3000/api/quizzes`)
            .then(response => {
                if (!response.ok) {
                    throw new Error('Failed to load quizzes');
                }
                return response.json();
            })
            .then(data => {
                quizzesData = {
                    data: data,
                    ids: data.map(item => item.quiz_id)
                };
                return quizzesData;
            })
            .catch(error => {
                quizzesPromise = null; // Reset the promise in case of error
                console.error(error);
                throw error;
            });
    }
    return quizzesPromise;
}


function loadUserQuizzesFromDB(userId) {
    return fetch(`http://${IP}:3000/api/quizzes?user_id=${userId}`) // api/user-quizzes
        .then(response => {
            if (!response.ok) {
                throw new Error('Failed to load user quizzes');
            }
            return response.json();
        })
        .then(data => {
            return {
                data: data,
                ids: data.map(item => item.quiz_id)
            };
        })
        .catch(error => {
            console.error(error);
            throw error;
        });
}


// Function to load 10 newest quizzes from DB
function loadNewestQuizzesFromDB() {
    return fetch(`http://${IP}:3000/api/newest-quizzes`)
        .then(response => {
            if (!response.ok) {
                throw new Error('Failed to load newest quizzes');
            }
            return response.json();
        })
        .then(data => {
            return {
                data: data,
                ids: data.map(item => item.quiz_id)
            };
        })
        .catch(error => {
            console.error(error);
            throw error;
        });
}


export {
    loadAllQuizzesFromDB,
    loadUserQuizzesFromDB,
    loadNewestQuizzesFromDB,
}