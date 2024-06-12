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

// Log the query parameters
const queryParams = getQuizQueryParams();
console.log('Quiz query Params:', queryParams);