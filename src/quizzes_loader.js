// quizzes_loader.js
let quizzesData = null;
let quizzesPromise = null;

function loadQuizzesFromDB() {
    if (quizzesData) {
        return Promise.resolve(quizzesData);
    }
    if (!quizzesPromise) {
        quizzesPromise = fetch('http://localhost:3000/api/quizzes')
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

export {
    loadQuizzesFromDB,
}