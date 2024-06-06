// quizzes_loader.js
let quizzesData = null;
let quizzesPromise = null;


function loadAllQuizzesFromDB() {
    if (quizzesData) {
        return Promise.resolve(quizzesData);
    }
    if (!quizzesPromise) {
        quizzesPromise = fetch('http://87.110.86.104:3000/api/quizzes')
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
    return fetch(`http://87.110.86.104:3000/api/user-quizzes?user_id=${userId}`)
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
    return fetch('http://87.110.86.104:3000/api/newest-quizzes')
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