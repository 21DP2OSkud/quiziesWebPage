// Import the functions to be used in other files if needed
import * as clientSide from './client-side.js';
import * as ui from './gbl_create_ui.js';

const {
    loadQuizzesFromDB,
    deleteImgUrlFromServer,
    deleteQuizFromDB,
    addNewQuizDB,
    updateQuizRecordDataDB,
    updateQuizRecordDB
} = clientSide;

const {
    createOverlay,
    closeUI
} = ui;



// Lai varētu loadot
function createLoadedQuizzes(id, imgPath, title, description) {
    const quizParentDiv = document.getElementById("quizzes-parent-div");

    const newQuiz = document.createElement("div");
    newQuiz.setAttribute("class", "w-[30%] bg-gray-200 rounded-xl my-[1%] quiz-box");
    newQuiz.setAttribute("id", "quiz-" + id);

    const newQuizImg = document.createElement("img");
    newQuizImg.src = "../" + imgPath;

    const newQuizDescription = document.createElement("div");
    newQuizDescription.setAttribute("class", "description");

    const newQuizTitle = document.createElement("span");
    newQuizTitle.setAttribute("class", "quiz-title font-bold italic");
    newQuizTitle.textContent = title;

    const newQuizHr = document.createElement("hr");

    const newQuizDescriptionText = document.createElement("span");
    newQuizDescriptionText.setAttribute("class", "quiz-description");
    newQuizDescriptionText.textContent = description;

    const btn_editQuiz = document.createElement("button");
    btn_editQuiz.setAttribute("class", "edit-quiz-button btn-primary btn-sm");
    btn_editQuiz.setAttribute("id", "edit-quiz-" + id);

    const btn_editQuizIcon = document.createElement("i");
    btn_editQuizIcon.setAttribute("class", "fas fa-edit");


    newQuizDescription.appendChild(newQuizDescriptionText);
    newQuizDescription.appendChild(newQuizHr);
    newQuizDescription.appendChild(newQuizTitle);
    newQuiz.appendChild(newQuizImg);
    newQuiz.appendChild(newQuizDescription);
    btn_editQuiz.appendChild(btn_editQuizIcon);
    newQuiz.appendChild(btn_editQuiz);
    quizParentDiv.appendChild(newQuiz);
}



// UI
function createQuizUI(){
    // Create overlay div
    createOverlay();

    // UI Create quiz
    const UI = document.createElement("div");
    UI.setAttribute("class", "ui create-quiz-ui bg-gradient-to-b rounded-lg from-blue-100 to-emerald-100 bg-opacity-0");


    // UI Image upload
    const quizImgWrapper = document.createElement("div");
    quizImgWrapper.setAttribute("class", "ui-img-wrapper");
    /* child of quizImgWeapper */
    const quizImgH2 = document.createElement("h2");
    quizImgH2.textContent = "Create Quiz";
    const quizImgDiv = document.createElement("div");
    quizImgDiv.setAttribute("class", "ui-display-img");      
    /* child of quizImgDiv */
    const quizImg = document.createElement("img");
    quizImg.setAttribute("src", "quizzes_images/default_quiz_img.png");    
    /* child of quizImgDiv */
    const imgInput = document.createElement("input");
    imgInput.setAttribute("type", "file");
    imgInput.setAttribute("id", "file-path");
    imgInput.setAttribute("class", "user-file");
    imgInput.setAttribute("accept", "image/jpeg, image/png, image/jpg");
    quizImg.addEventListener("click", function() {
        imgInput.click();
    });


    // UI Input fields
    const inputFieldDiv = document.createElement("div");
    inputFieldDiv.setAttribute("class", "input-field-div flex flex-col");
    /* child of inputFieldDiv */
    const titleLabel = document.createElement("label");
    titleLabel.textContent = "Quiz Title";
    /* child of inputFieldDiv */
    const titleInput = document.createElement("input");
    titleInput.setAttribute("type", "text");
    titleInput.setAttribute("class", "");
    titleInput.setAttribute("id", "quiz-title");
    /* child of inputFieldDiv */
    const descriptionLabel = document.createElement("label");
    descriptionLabel.textContent = "Quiz Description";
    /* child of inputFieldDiv */
    const descriptionInput = document.createElement("textarea");
    descriptionInput.setAttribute("type", "text");
    descriptionInput.setAttribute("class", "");
    descriptionInput.setAttribute("id", "quiz-description");


    // UI Buttons
    const btnDiv = document.createElement("div");
    btnDiv.setAttribute("class", "flex justify-evenly button-div");
    /* child of btnDiv */
    const btn_closeUI = document.createElement("button");
    btn_closeUI.setAttribute("class", "rounded-lg px-8 py-1 mx-4");
    btn_closeUI.textContent = "close";
    btn_closeUI.addEventListener("click", function() {
        closeCreateQuizUI();
    });
    /* child of btnDiv */
    const btn_addQuestions = document.createElement("button");
    btn_addQuestions.setAttribute("class", "rounded-lg px-8 py-1 mx-4");
    btn_addQuestions.textContent = "Add Questions";
    /* child of btnDiv */
    const btn_saveUI = document.createElement("button");
    btn_saveUI.setAttribute("class", "rounded-lg px-8 py-1 mx-4");
    btn_saveUI.textContent = "save";


    // Append UI Elements
    quizImgDiv.appendChild(quizImg);
    quizImgDiv.appendChild(imgInput);
    quizImgWrapper.appendChild(quizImgH2);
    quizImgWrapper.appendChild(quizImgDiv);
    UI.appendChild(quizImgWrapper);
    inputFieldDiv.appendChild(titleLabel);
    inputFieldDiv.appendChild(titleInput);
    inputFieldDiv.appendChild(descriptionLabel);
    inputFieldDiv.appendChild(descriptionInput);
    UI.appendChild(inputFieldDiv);
    btnDiv.appendChild(btn_closeUI);
    btnDiv.appendChild(btn_addQuestions);
    btnDiv.appendChild(btn_saveUI);
    UI.appendChild(btnDiv);
    document.body.appendChild(UI);


    const quizImage = document.querySelector(".ui-display-img img"); /* No ui-display-img div paņem img */
    const userFile = document.querySelector(".user-file");
    userFile.onchange = function(){
        quizImage.src = URL.createObjectURL(this.files[0]); /* (userFile.files[0]) */
    }


    btn_addQuestions.addEventListener("click", function() {
        fileName = "#quiz-edit.html";
        console.log(fileName);
        alert("Next you will need to select which type of quiz you are going to create");
    });


    btn_saveUI.addEventListener("click", function() {
        const quizImageFile = document.querySelector(".user-file").files[0]; /* No ui-display-img div paņem img */
        const quizTitle = document.querySelector("#quiz-title").value;
        const quizDescription = document.querySelector("#quiz-description").value;

        if (quizTitle.value == "" || quizDescription.value == "") {
            alert("Please fill in all the fields and select an image");
        }
        else {
            const formData = new FormData();
            formData.append('image', quizImageFile);
            formData.append('title', quizTitle);
            formData.append('description', quizDescription);

            // Call the functions
            addNewQuizDB(formData);
            console.log(quizImageFile);
            closeUI(UI);
        }
    });
}


function closeCreateQuizUI() {
    // Remove both the "create-quiz-ui" div and the overlay div
    document.getElementsByClassName("create-quiz-ui")[0].remove();
    document.getElementsByClassName("overlay")[0].remove();
}




//
export {
    createLoadedQuizzes,
    createQuizUI
};