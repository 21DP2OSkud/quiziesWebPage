import * as session from './gbl_check_session.js';
const {
    checkSession,
} = session;


// Lai varētu loadot
function createLoadedQuizzes(id, imgPath, title, description, creator_id, play_count, likes, rating) {
    const quizParentDiv = document.getElementById("quizzes-parent-div");

    // Create the main container div for each quiz
    const quizContainer = document.createElement("div");
    quizContainer.setAttribute("class", "quiz-container relative w-[30%] bg-gray-200 rounded-xl my-[1%] flex flex-col");

    // Create the quiz box div
    const quizBox = document.createElement("div");
    quizBox.setAttribute("class", "quiz-box rounded-t-lg");
    quizBox.setAttribute("id", "quiz-" + id);
    quizBox.addEventListener("click", function() {
            console.log("Creator ID: " + creator_id, "Play_count: " + play_count, "Likes: "+ likes, "Rating: " + rating);
            const quizQueryParams = new URLSearchParams({
                creator_id: creator_id,
                title: title,
                imgPath: imgPath,
                description: description,
                play_count: play_count,
                likes: likes,
                rating: rating
            }).toString();
            window.location.href = 'quiz-main-page-template.html?' + quizQueryParams;
    });

    // Create the quiz image
    const quizImg = document.createElement("img");
    quizImg.src = "../" + imgPath;

    // Create the description div
    const quizDescription = document.createElement("div");
    quizDescription.setAttribute("class", "description");

    // Create the title span
    const quizTitle = document.createElement("span");
    quizTitle.setAttribute("class", "quiz-title font-bold italic");
    quizTitle.textContent = title;

    // Create the horizontal rule
    const quizHr = document.createElement("hr");

    // Create the description text span
    const quizDescriptionText = document.createElement("span");
    quizDescriptionText.setAttribute("class", "quiz-description");
    quizDescriptionText.textContent = description;

    // Append elements to description div
    quizDescription.appendChild(quizDescriptionText);
    quizDescription.appendChild(quizHr);
    quizDescription.appendChild(quizTitle);

    // Append elements to quiz box div
    quizBox.appendChild(quizImg);
    quizBox.appendChild(quizDescription);

    // Append quiz box to the main container
    quizContainer.appendChild(quizBox);

    // Create the stats div for play count, likes, and rating
    const statsDiv = document.createElement("div");
    statsDiv.setAttribute("class", "flex justify-evenly items-center p-2 text-gray-600");

    // Create icons and text for play count, likes, and rating
    const playIcon = document.createElement("i");
    playIcon.classList.add("fas", "fa-play-circle");
    const playText = document.createElement("span");
    playText.textContent = play_count;

    const likesIcon = document.createElement("i");
    likesIcon.classList.add("fas", "fa-thumbs-up");
    const likesText = document.createElement("span");
    likesText.textContent = likes;

    const starIcon = document.createElement("i");
    starIcon.classList.add("fas", "fa-star");
    const starText = document.createElement("span");
    starText.textContent = rating;

    const btn_editQuiz = document.createElement("button");
    btn_editQuiz.setAttribute("class", "edit-quiz-button btn-primary btn-sm");
    btn_editQuiz.setAttribute("id", "edit-quiz-" + id);

    const btn_editQuizIcon = document.createElement("i");
    btn_editQuizIcon.setAttribute("class", "fas fa-edit");


    const sessionData = checkSession();
    if (sessionData.session) {
        btn_editQuiz.appendChild(btn_editQuizIcon);
        quizBox.appendChild(btn_editQuiz);
    }
    else {
        console.log("Edit button not available");
    }


    // Append icons and text to stats div
    statsDiv.appendChild(playIcon);
    statsDiv.appendChild(playText);
    statsDiv.appendChild(likesIcon);
    statsDiv.appendChild(likesText);
    statsDiv.appendChild(starIcon);
    statsDiv.appendChild(starText);

    // Append stats div to the main container
    quizContainer.appendChild(statsDiv);

    // Append the main container to the parent div
    quizParentDiv.appendChild(quizContainer);
}

//
export {
    createLoadedQuizzes,
};