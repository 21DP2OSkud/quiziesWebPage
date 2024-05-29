// Import the functions to be used in other files if needed
import * as clientSide from './client-side.js';
import * as ui from './gbl_create_ui.js';
import * as create_quiz from './quizzes_create_quiz.js';

const {
    createOverlay,
} = ui;

const {
    createQuizUI,
} = create_quiz

const {
    deleteImgUrlFromServer,
    deleteQuizFromDB,
    addNewQuizDB,
    updateQuizRecordDataDB,
    updateQuizRecordDB,
} = clientSide;

//
function createEditQuizUI(record) {

    // Function to toggle visibility
    function toggleVisibility() {
        // Toggle the 'hidden' class on the element
        editQuizUI.classList.toggle('hidden');
    }


    function deleteQuizWarningUI(quiz_id, imagePath) {
        const formData = new FormData();
        formData.append('quiz_id', quiz_id);
        formData.append('imagePath', imagePath);
        console.log(JSON.stringify(Object.fromEntries(formData)));

        const quiz_id_to_delete = quiz_id;
        const imagePath_to_delete = imagePath;
        console.log('If you press delete, you will delete quiz with id ' + quiz_id_to_delete + ' and image path ' + imagePath_to_delete);

        const deleteQuizWarningUIDiv = document.createElement("div");
        deleteQuizWarningUIDiv.setAttribute("class", "delete-quiz-warning-ui ui bg-gradient-to-b rounded-lg from-blue-100 to-emerald-100");
        // Label div
        const deleteQuizLabelDiv = document.createElement("div");
        deleteQuizLabelDiv.setAttribute("class", "delete-quiz-label-div flex justify-evenly");
        const deleteQuizLabel = document.createElement("label");
        deleteQuizLabel.textContent = "Are you sure you want to delete this quiz?";
        const deleteQuizBtnDiv = document.createElement("div");
        deleteQuizBtnDiv.setAttribute("class", "delete-quiz-btn-div flex justify-evenly button-div");
        // cancel
        const btn_cancelDeleteQuiz = document.createElement("button");
        btn_cancelDeleteQuiz.setAttribute("class", "rounded-lg px-8 py-1 mx-4");
        btn_cancelDeleteQuiz.textContent = "No (Cancel)";
        btn_cancelDeleteQuiz.addEventListener("click", function() {
            deleteQuizWarningUIDiv.remove();
            toggleVisibility();
        });
        // delete
        const btn_deleteQuiz = document.createElement("button");
        btn_deleteQuiz.setAttribute("class", "delete-button rounded-lg px-8 py-1 mx-4");
        btn_deleteQuiz.textContent = "Yes (Delete)";
        btn_deleteQuiz.addEventListener("click", function() {
            deleteQuizWarningUIDiv.remove();
            toggleVisibility();
            console.log(quiz_id); // You can access quiz_id directly here because it's in the same scope
        
            deleteQuizFromDB(formData); // Using the formData object from the outer scope
            console.log(formData);
        
            editQuizUI.remove();
        });

        deleteQuizBtnDiv.appendChild(btn_cancelDeleteQuiz);
        deleteQuizBtnDiv.appendChild(btn_deleteQuiz);
        deleteQuizLabelDiv.appendChild(deleteQuizLabel);
        deleteQuizWarningUIDiv.appendChild(deleteQuizLabelDiv);
        deleteQuizWarningUIDiv.appendChild(deleteQuizBtnDiv);
        document.body.appendChild(deleteQuizWarningUIDiv);
    }


    // Edit UI
    createOverlay();


    // Get data from json record
    const { quiz_id, imgUrl, title, description, created_at } = record;

    const uiDisplayImg = "../" + imgUrl; // ../  - to go to the previous directory of src

    if ( imgUrl === null ) {
        uiDisplayImg = "quizzes_images/default_quiz_img.png";
    }


    // UI Create quiz
    const editQuizUI = document.createElement("div");
    editQuizUI.setAttribute("class", "ui edit-quiz-ui bg-gradient-to-b rounded-lg from-blue-100 to-emerald-100 bg-opacity-0");

    /* child of quizImgWeapper */
    const editQuizUITitleH2 = document.createElement("h2");
    editQuizUITitleH2.setAttribute("class", "absolute top-0 left-1/2 transform -translate-x-1/2");
    editQuizUITitleH2.textContent = "Editing "+ quiz_id +"'th quiz";

    const editQuizUICreationDate = document.createElement("h3");
    editQuizUICreationDate.setAttribute("class", "absolute top-0 left-1/2 transform text-gray-400 italic -translate-x-1/2");
    editQuizUICreationDate.textContent = "Created on: " + created_at; //+ new Date(quiz.created_at).toDateString();

    const editQuizUIParentDiv = document.createElement("div");
    editQuizUIParentDiv.setAttribute("class", "relative h-full w-full rounded-lg");


    // Ui image edit
    const editQuizWrapperDiv = document.createElement("div");
    editQuizWrapperDiv.setAttribute("class", "absolute left-0 top-0 h-full w-1/2 flex flex-col justify-center items-center image-wrapper-div ");
    /* child of editQuizWrapperDiv */
    const quizImgWrapper = document.createElement("div");
    quizImgWrapper.setAttribute("class", "ui-img-wrapper");
    /* child of quizImgWeapper */
    const quizImgDiv = document.createElement("div");
    quizImgDiv.setAttribute("class", "ui-display-img");
    /* child of quizImgDiv */
    const quizImg = document.createElement("img");
    quizImg.setAttribute("src", uiDisplayImg); // 
    /* child of quizImg */
    const imgInput = document.createElement("input");
    imgInput.setAttribute("type", "file");
    imgInput.setAttribute("id", "file-path");
    imgInput.setAttribute("class", "user-file");
    imgInput.setAttribute("accept", "image/jpeg, image/png, image/jpg");
    imgInput.setAttribute("name", "image");
    quizImg.addEventListener("click", function() {
        imgInput.click();
    });
    /* child of  */
    const imgChangeLabel = document.createElement("label");
    imgChangeLabel.setAttribute("class", "text-sm italic text-gray-400 mt-1");
    imgChangeLabel.textContent = "(to change the image press onto it)";


    // UI Input fields
    const inputFieldDiv = document.createElement("div");
    inputFieldDiv.setAttribute("class", "absolute right-0 top-0 h-full w-1/2 bg-gray-300 input-field-div flex flex-col");
    /* child of inputFieldDiv */
    const titleDiv = document.createElement("div");
    titleDiv.setAttribute("class", "title-div mt-[10%] flex items-center flex-col");
    /* child of titledDiv */
    const titleLabel = document.createElement("label");
    titleLabel.setAttribute("class", "");
    titleLabel.textContent = "Quiz Title";
    /* child of titleDiv */
    const titleInput = document.createElement("input");
    titleInput.setAttribute("type", "text");
    titleInput.setAttribute("class", "text-slate-600");
    titleInput.setAttribute("id", "quiz-title");
    titleInput.value = title;
    /* child of descriptionDiv */
    const descriptionDiv = document.createElement("div");
    descriptionDiv.setAttribute("class", "description-div items-center flex flex-col");
    const descriptionLabel = document.createElement("label");
    descriptionLabel.setAttribute("class", "");
    descriptionLabel.textContent = "Quiz Description";
    /* child of descriptionDiv */
    const descriptionInput = document.createElement("textarea");
    descriptionInput.setAttribute("type", "text");
    descriptionInput.setAttribute("class", "text-slate-600");
    descriptionInput.setAttribute("id", "quiz-description");
    descriptionInput.value = description;


    // UI Buttons
    const btnDiv = document.createElement("div");
    btnDiv.setAttribute("class", "absolute bottom-0 left-0 w-full h-1/3 bg-gray-400 flex justify-center items-end button-div");
    /* child of btnDiv */
    const deleteContainer = document.createElement("div");
    deleteContainer.setAttribute("class", "delete-container");
    /* child of deleteContainer */
    const btn_deleteQuiz = document.createElement("button");
    btn_deleteQuiz.setAttribute("class", "delete-button flex items-center rounded-lg py-1");
    const btn_deleteQuizSymbol = document.createElement("i");
    btn_deleteQuizSymbol.setAttribute("class", "fas fa-trash-alt");
    btn_deleteQuiz.addEventListener("click", function() {
        toggleVisibility();
        const imagePath = imgUrl;
        deleteQuizWarningUI(quiz_id, imagePath); // Warrning
        console.log(quiz_id);
    })
    /* child of btnDiv */
    const btn_closeUI = document.createElement("button");
    btn_closeUI.setAttribute("class", "rounded-lg px-8 py-1 mx-4");
    btn_closeUI.textContent = "Cancel";
    btn_closeUI.addEventListener("click", function() {
        closeEditQuizUI();
    });
    /* child of btnDiv */
    const btn_addQuestions = document.createElement("button");
    btn_addQuestions.setAttribute("class", "rounded-lg px-8 py-1 mx-4");
    btn_addQuestions.textContent = "Edit Quiz Page";
    btn_addQuestions.addEventListener("click", function() {
        alert("Will redirect to quiz edit page");
    });
    /* child of btnDiv */
    const btn_saveUI = document.createElement("button");
    btn_saveUI.setAttribute("class", "rounded-lg px-8 py-1 mx-4");
    btn_saveUI.textContent = "Save";


    // Append UI Elements
    editQuizUI.appendChild(editQuizUIParentDiv);

    quizImgDiv.appendChild(quizImg);
    quizImgDiv.appendChild(imgInput);
    quizImgWrapper.appendChild(quizImgDiv);
    editQuizWrapperDiv.appendChild(quizImgWrapper);
    editQuizWrapperDiv.appendChild(imgChangeLabel);
    editQuizUIParentDiv.appendChild(editQuizWrapperDiv);

    titleDiv.appendChild(titleLabel);
    titleDiv.appendChild(titleInput);
    inputFieldDiv.appendChild(titleDiv);
    descriptionDiv.appendChild(descriptionLabel);
    descriptionDiv.appendChild(descriptionInput);
    inputFieldDiv.appendChild(descriptionDiv);
    editQuizUIParentDiv.appendChild(inputFieldDiv);

    btn_deleteQuiz.appendChild(btn_deleteQuizSymbol);
    deleteContainer.appendChild(btn_deleteQuiz);
    btnDiv.appendChild(deleteContainer);
    btnDiv.appendChild(btn_closeUI);
    btnDiv.appendChild(btn_addQuestions);
    btnDiv.appendChild(btn_saveUI);
    editQuizUIParentDiv.appendChild(btnDiv);

    editQuizUIParentDiv.appendChild(editQuizUITitleH2);
    editQuizUIParentDiv.appendChild(editQuizUICreationDate);
    document.body.appendChild(editQuizUI);


    // Functions
    const quizImage = document.querySelector(".ui-display-img img"); /* selecto img no ui-display-img div */
    const userFile = document.querySelector(".user-file"); //img input ID
    let imageChanged = false;
    userFile.onchange = function(){
        quizImage.src = URL.createObjectURL(this.files[0]); /* (userFile.files[0]) */
        imageChanged = true;
    }


    btn_saveUI.addEventListener("click", function() {
        // New values for data
        let old_imgUrl;
        let new_imgUrl;

        if (imageChanged) { 
            old_imgUrl = imgUrl;
            new_imgUrl = userFile.files[0];
            //deleteImgUrlFromDB(imgUrl);
            console.log("New quiz image: " + new_imgUrl);
            console.log(old_imgUrl);
            console.log(new_imgUrl);
        }
        else {
            new_imgUrl = imgUrl; // Image haven't changed
            old_imgUrl = imgUrl; // Image haven't changed
            console.log("No image change");
            console.log(old_imgUrl);
            console.log(new_imgUrl);
        }


        const new_title = document.getElementById("quiz-title").value;
        const new_description = document.getElementById("quiz-description").value;

        //new_record = { new_quiz_id, new_imgUrl, new_title, new_description }

        const formData = new FormData();
            formData.append('quiz_id', quiz_id) // Origināli sūtīto id arī atgriež
            formData.append('title', new_title)
            formData.append('description', new_description)

        updateQuizRecordDB(formData, old_imgUrl, new_imgUrl);

        // Update the record in the DB
        console.log("image changed: " + imageChanged);
        closeEditQuizUI(); // Close the UI
    });
}


function closeEditQuizUI() {
    // Remove both the "create-quiz-ui" div and the overlay div
    document.getElementsByClassName("edit-quiz-ui")[0].remove();
    document.getElementsByClassName("overlay")[0].remove();
}


// quizzes_edit_quiz.js
import { loadQuizzesFromDB } from './quizzes_loader.js';

document.addEventListener('DOMContentLoaded', function() {
    loadQuizzesFromDB()
        .then(({ data, ids }) => {
            addEditButtonEventListeners(data, ids);
            console.log('Quiz IDs:', ids);
        })
        .catch(error => {
            console.error('Error loading quizzes:', error);
        });

    document.getElementById("btn-create-quiz").addEventListener("click", function() {
        createQuizUI();
    });

    function addEditButtonEventListeners(data_local, idsArray) {
        let ids = idsArray || [];

        ids.forEach(quizID => {
            document.getElementById("edit-quiz-" + quizID).addEventListener("click", function() {
                console.log(data_local);

                const record = data_local.find(item => item.quiz_id === quizID);
                if (record) {
                    createEditQuizUI(record);
                    console.log("Quiz edit button with id: " + quizID + " was pressed!");
                    console.log(record);
                } else {
                    console.log("Quiz with id " + quizID + " not found.");
                }
            });
        });
    }
});