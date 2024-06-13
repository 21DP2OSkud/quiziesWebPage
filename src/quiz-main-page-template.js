function getQuizQueryParams() {
    const params = new URLSearchParams(window.location.search);
    const creator_id = params.get('creator_id');
    const title = params.get('title');
    const image = params.get('imgPath');
    const description = params.get('description');
    const play_count = params.get('play_count');
    const likes = params.get('likes');
    const rating = params.get('rating');

    return { creator_id, title, image, description, play_count, likes, rating };
}

function createQuizCard(quiz) {
    return `
        <div class="quiz-card">
            <div class="quiz-content">
                <div class="image-container">
                    <div class="image-div">
                        <img src="${"../" + quiz.image}" alt="${quiz.title}">
                    </div>
                    <div class="creator-info">
                        Created by: ${quiz.creator_id}
                    </div>
                </div>
                <div class="description-div">
                    <div class="quiz-title">${quiz.title}</div>
                    <p class="quiz-description">${quiz.description}</p>
                </div>
            </div>
            <div class="quiz-stats">
                <div>
                    <i class="fas fa-play-circle text-blue-500"></i>
                    Play Count: ${quiz.play_count}
                </div>
                <div>
                    <i class="fas fa-thumbs-up text-green-500"></i>
                    Likes: ${quiz.likes}
                </div>
                <div>
                    <i class="fas fa-star text-yellow-500"></i>
                    Rating: ${quiz.rating} / 5
                </div>
            </div>
            <div class="button-div">
                <button class="play-button">Play Quiz</button>
            </div>
        </div>
    `;
}

document.addEventListener('DOMContentLoaded', () => {
    const pageContent = document.getElementById('page-content');
    const queryParams = getQuizQueryParams();
    const quizCard = createQuizCard(queryParams);
    pageContent.innerHTML = quizCard;
});