// Import the functions to be used in other files if needed
import * as create_quiz from './quizzes_create_quiz.js';

const {
    createQuizBox,
} = create_quiz;


let data_local;
let arrayOfQuizID = [];

// Load already existing quizzes from DB
function loadQuizzesFromDB() {
    return new Promise((resolve, reject) => { // waiting for the operation to complete
        fetch('http://localhost:3000/api/quizzes')
        .then(response => {
            if (!response.ok) {
                throw new Error('Failed to load quizzes');
            }
            return response.json();
        })
        .then(data => {
            console.log(data);
            data_local = data;
            arrayOfQuizID = data.map(item => item.quiz_id); // Extracting IDs from the data
            data.forEach(item => {
                // Create objects
                const quiz = {
                    id: item.quiz_id,
                    imgPath: item.imgUrl,
                    title: item.title,
                    description: item.description
                };
                // Append objects to DOM
                createQuizBox(quiz.id, quiz.imgPath, quiz.title, quiz.description);
            });
            console.log(data_local);
            resolve({ data: data_local, ids: arrayOfQuizID }); // Resolve the promise with data and IDs
        })
        .catch(error => {
            console.error(error);
            reject(error); // Reject the promise if there's an error
        });
    });
}



// Delete image from server
function deleteImgUrlFromServer(imgUrl) { // Deletes image from server
    const url = new URL('http://localhost:3000/api/quizzes_delete');
    url.searchParams.append('imagePath', imgUrl); // http://localhost:3000/api/quizzes_images?imagePath=server%2Fquizzes_uploaded_images%2Fimage-1713946925650.jpg

    return fetch(url.toString(), {
        method: 'DELETE',
    })
    .then(response => {
        if (!response.ok) {
            throw new Error('Failed to delete image');
        }
        // ELSE
        console.log('Image deleted successfully');
    })
    .catch(error => {
        console.error(error);
    });
}



// Delete record from db
function deleteQuizFromDB(formData) {
    const imagePath = formData.get('imagePath');
    const quiz_id = formData.get('quiz_id');

    return fetch(`http://localhost:3000/api/quizzes_delete?quiz_id=${quiz_id}&imagePath=${imagePath}`, {
        method: 'DELETE'
    })
    .then(response => {
        if (!response.ok) {
            throw new Error('Failed to delete quiz');
        }
        console.log('Quiz deleted successfully');
    })
    .catch(error => {
        console.error(error);
    });
}




// Save uploaded quiz to db
function addNewQuizDB(formData) {
    fetch('http://localhost:3000/api/quizzes', {
        method: 'POST',
        body: formData
    })
    .then(response => {
        if (!response.ok) {
            throw new Error('Failed to add quiz');
        }
        console.log('Quiz added successfully');
    })
    .catch(error => {
        console.error(error);
    });
}



// Add image to server
function updateQuizRecordDataDB(formData) {

    return fetch('http://localhost:3000/api/quizzes', {
        method: 'POST',
        body: formData
    })
    .then(response => {
        if (!response.ok) {
            throw new Error('Failed to add image to server');
        }
        // ELSE
        console.log('DB data seccessfully added to the server!');
    })
}



// REcreate
function updateQuizRecordDB(formData, old_imgUrl, new_imgUrl) {
    if (old_imgUrl !== new_imgUrl) {
        // Delete old image from server
        deleteImgUrlFromServer(old_imgUrl)
            .then(() => {
                // Step 2: Add the new image to the server
                formData.append('image', new_imgUrl);
                updateQuizRecordDataDB(formData)
                    .then(() => {
                        console.log('Quiz updated (with image change)!')
                    })
                    .catch(error => {
                        console.error('Failed to update (with image change):', error);
                    });
            })
            .catch(error => {
                console.error('Failed to delete old image URL:', error);
            });
    }
    else if (old_imgUrl === new_imgUrl) {
        // Record changes without image change
        updateQuizRecordDataDB(formData)
            .then(() => {
                console.log('Quiz updated (without image change)!')
            })
            .catch(error => {
                console.error('Failed to update (without image change):', error);
            });
    }

}



// Export the functions to be used in other files if needed
export {
    loadQuizzesFromDB,
    deleteImgUrlFromServer,
    deleteQuizFromDB,
    addNewQuizDB,
    updateQuizRecordDataDB,
    updateQuizRecordDB,
};