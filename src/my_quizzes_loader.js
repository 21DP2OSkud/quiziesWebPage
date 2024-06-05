import * as session from './gbl_check_session.js';
const { checkSession } = session;
import * as quizzesLoader from './quizzes_loader.js';
const { loadUserQuizzesFromDB } = quizzesLoader;

function createUserLoadedQuizzes(id, imgPath, title, description, likesCount, playCount, starRating) {
    const sessionData = checkSession();
    if (sessionData.session) {
        const quizParentDiv = document.getElementById("my-quizzes-parent-div");

        const quizDiv = document.createElement('div');
        quizDiv.id = "quiz-div";
        quizDiv.setAttribute("class", "flex justify-center gap-4 rounded-xl");
        quizParentDiv.appendChild(quizDiv);

        const newQuiz = document.createElement("div");
        newQuiz.setAttribute("class", "w-[70%] h-[fit-content] bg-gray-200 rounded-xl my-[1%] quiz-box");
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
        quizDiv.appendChild(newQuiz);

        createLoadedQuizzesStatistics(newQuiz, likesCount, playCount, starRating);
    } else {
        alert("Log in to see your quizzes");
    }
}

function createLoadedQuizzesStatistics(parentDiv, likesCount, playCount, starRating) {
    const statsDiv = document.createElement("div");
    const hr = document.createElement("hr");

    statsDiv.id = "stats-div";
    statsDiv.setAttribute("class", "stats-div my-[1%] rounded-xl");

    // Play count
    const playDiv = document.createElement("div");
    const playIcon = document.createElement("i");
    playIcon.classList.add("fas", "fa-play-circle");
    const playLabel = document.createElement("span");
    playLabel.textContent = `: ${playCount}`;
    playDiv.appendChild(playIcon);
    playDiv.appendChild(playLabel);

    // Likes counter
    const likesDiv = document.createElement("div");
    const likesIcon = document.createElement("i");
    likesIcon.classList.add("fas", "fa-thumbs-up");
    const likesLabel = document.createElement("span");
    likesLabel.textContent = `: ${likesCount}`;
    likesDiv.appendChild(likesIcon);
    likesDiv.appendChild(likesLabel);

    // Star rating
    const starDiv = document.createElement("div");
    const starIcon = document.createElement("i");
    starIcon.classList.add("fas", "fa-star");
    const starLabel = document.createElement("span");
    starLabel.textContent = `: ${starRating}`;
    starDiv.appendChild(starIcon);
    starDiv.appendChild(starLabel);

    // Append rows to statsDiv
    statsDiv.appendChild(hr);
    statsDiv.appendChild(playDiv);
    statsDiv.appendChild(likesDiv);
    statsDiv.appendChild(starDiv);

    // Append statsDiv to the parentDiv's parent element
    parentDiv.parentElement.appendChild(statsDiv);

    // Set the min-height of stats-div to match the height of parentDiv
    function adjustStatsDivHeight() {
        statsDiv.style.minHeight = `${parentDiv.offsetHeight}px`;
    }

    adjustStatsDivHeight();

    window.addEventListener('resize', adjustStatsDivHeight);
}

document.addEventListener('DOMContentLoaded', () => {
    const userProfile = JSON.parse(localStorage.getItem('userProfile'));
    if (userProfile) {
        const userId = userProfile.user_id;
        loadUserQuizzesFromDB(userId)
            .then(quizzesData => {
                console.log('quizzesData:', quizzesData);

                quizzesData.data.forEach(quiz => {
                    createUserLoadedQuizzes(quiz.quiz_id, quiz.imgUrl, quiz.title, quiz.description, quiz.likes, quiz.plays, quiz.rating);
                });
            })
            .catch(error => {
                console.error('Error loading user quizzes:', error);
            });
    } else {
        console.log('No user logged in');
    }
});
