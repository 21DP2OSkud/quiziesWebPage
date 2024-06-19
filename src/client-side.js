import * as session from './gbl_check_session.js';
const {
    checkSession,
} = session;

import IP from '../appConfig.js';

//
// Authentication methods
//

// Register new user
function registerUser(formData) {
    // Log the form data to ensure it's correct
    console.log('Registering user with the following data:');
    for (let [key, value] of formData.entries()) {
        console.log(`${key}: ${value}`);
    }

    fetch(`http://${IP}:3000/api/register`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            username: formData.get('username'),
            email: formData.get('email'),
            password: formData.get('password')
        })
    })
    .then(response => {
        if (!response.ok) {
            throw new Error('Failed to register user');
        }
        console.log('User registered successfully');
    })
    .catch(error => {
        console.error(error);
    });
}


// Login user
function loginUser(formData) {
    return fetch(`http://${IP}:3000/api/login`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            email   : formData.get('email'),
            password: formData.get('password')
        })
    })
    .then(response => {
        if (!response.ok) {
            return response.json().then(errorData => {
                throw new Error(errorData.error);
            });
        }
        return response.json();
    })
    .then(data => {
        // Store session data in local storage
        localStorage.setItem('userProfile', JSON.stringify(data.userProfile));
        return data;
    });
}

//
// Profile
//


function updateUserProfileDB(formData) {
    return fetch(`http://${IP}:3000/api/update-user-profile`, {
        method: 'POST',
        body: formData, // Send the FormData containing the updated user profile data
    })
    .then(response => {
        if (!response.ok) {
            throw new Error('Failed to update user profile');
        }
        return response.text();
    })
    .catch(error => {
        console.error('Failed to update user profile:', error);
        throw error; // Propagate the error to the caller if needed
    });
}



//
// Quizzes
//


// Delete image from server
function deleteImgUrlFromServer(imgUrl) { // Deletes image from server
    const url = new URL(`http://${IP}:3000/api/quizzes_delete`);
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

    return fetch(`http://${IP}:3000/api/quizzes_delete?quiz_id=${quiz_id}&imagePath=${imagePath}`, {
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
    const sessionData = checkSession(); // session data
    if (sessionData.session) {
        const user_id = sessionData.userProfile.user_id; // gets user_id from session data
        formData.append('user_id', user_id); // append user_id to formData
        fetch(`http://${IP}:3000/api/quizzes`, {
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
    } else {
        console.error('No user session found');
        alert('Please log in to create a quiz.');
    }
}



// Update record in the database, with or without an image change
function updateQuizRecordDB(formData, old_imgUrl, new_imgUrl) {
    // Ensure quiz_id is appended to formData
    if (!formData.has('quiz_id')) {
        console.error('quiz_id is missing from formData');
        return;
    }

    if (old_imgUrl !== new_imgUrl) {
        // Delete old image from server
        deleteImgUrlFromServer(old_imgUrl)
            .then(() => {
                // Step 2: Add the new image to the server
                formData.append('image', new_imgUrl);
                updateQuizRecordDataDB(formData)
                    .then(() => {
                        console.log('Quiz updated (with image change)!');
                    })
                    .catch(error => {
                        console.error('Failed to update (with image change):', error);
                    });
            })
            .catch(error => {
                console.error('Failed to delete old image URL:', error);
            });
    } else {
        // Record changes without image change
        updateQuizRecordDataDB(formData)
            .then(() => {
                console.log('Quiz updated (without image change)!');
            })
            .catch(error => {
                console.error('Failed to update (without image change):', error);
            });
    }
}

// Function to handle updating quiz data in the database
function updateQuizRecordDataDB(formData) {
    return fetch(`http://${IP}:3000/api/quizzes`, {
        method: 'POST',
        body: formData
    })
    .then(response => {
        if (!response.ok) {
            throw new Error('Failed to add image to server');
        }
        console.log('DB data successfully added to the server!');
    });
}



// Export the functions to be used in other files if needed
export {
    loginUser,
    registerUser,
    //
    updateUserProfileDB,
    //
    deleteImgUrlFromServer,
    deleteQuizFromDB,
    addNewQuizDB,
    updateQuizRecordDataDB,
    updateQuizRecordDB,
};