const IMG_BASE_URL = 'https://image.tmdb.org/t/p/w500';

const axiosApi = axios.create({
    baseURL: 'https://api.themoviedb.org/3/',
    params: {
        'api_key': API_KEY
    }
});

const chkHamburgerMenu = document.querySelector('.nav-container .nav-left .nav-hamburger-menu .nav-checkbox');
const leftMenuContainer = document.querySelector('.left-menu-container');

chkHamburgerMenu.addEventListener('click', event => {
    leftMenuContainer.classList.toggle('inactive');
})

async function getTrendingMoviesPreview() {
    const { data } = await axiosApi('trending/movie/day');

    const movies = data.results;
    
    const trendingContainer = document.querySelector('.trending-container .trending-preview');
    movies.forEach(movie => {
        const movieImg = document.createElement('img');
        movieImg.classList.add('movie-img');
        movieImg.setAttribute('alt', movie.title);
        movieImg.setAttribute('src', `${IMG_BASE_URL}/${movie.poster_path}`);

        trendingContainer.appendChild(movieImg);
    });
}

async function getCategoriesPreview() {
    const { data } = await axiosApi('/genre/movie/list');

    const categories = data.genres;
    const leftMenuCategories = document.querySelector('.left-menu-container .left-menu-categories');
    categories.forEach(category => {
        const categoryText = document.createElement('text');
        categoryText.classList.add('left-menu-category');
        categoryText.setAttribute('id', category.id);
        categoryText.textContent = category.name
        leftMenuCategories.appendChild(categoryText);
    });
}

async function getPopularMovies() {
    try {
        const { data } = await axiosApi('/movie/popular');

        const movies = data.results;
        const trailerContainer = document.querySelector('.trailer-container .trailer-preview');
        movies.forEach(movie => {
            const previewImg = document.createElement('img');
            previewImg.classList.add('movie-img');
            previewImg.setAttribute('alt', movie.name);
            previewImg.setAttribute('src', `${IMG_BASE_URL}/${movie.poster_path}`);

            trailerContainer.appendChild(previewImg);
        });
    } catch (error) {
        console.error(error)
    }
}