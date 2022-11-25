const IMG_BASE_URL_300 = 'https://image.tmdb.org/t/p/w300';
const IMG_BASE_URL_500 = 'https://image.tmdb.org/t/p/w500';

const axiosApi = axios.create({
    baseURL: 'https://api.themoviedb.org/3/',
    params: {
        'api_key': API_KEY
    }
});

// Utils
function createMovies(movies, container)
{
    container.innerHTML = '';
    movies.forEach(movie => {
        const previewImg = document.createElement('img');
        previewImg.classList.add('movie-img');
        previewImg.setAttribute('alt', movie.name);
        previewImg.setAttribute('src', `${IMG_BASE_URL_300}/${movie.poster_path}`);
        previewImg.addEventListener('click', () => location.hash=`movie=${movie.id}` );

        container.appendChild(previewImg);
    });
}
function createCategories(categories, container){
    container.innerHTML = '';
    categories.forEach(category => {
        const categoryText = document.createElement('text');
        categoryText.classList.add('left-menu-category');
        categoryText.setAttribute('id', category.id);
        categoryText.textContent = category.name
        categoryText.addEventListener('click', () => location.hash = `#category=${category.id}-${category.name}`);
        container.appendChild(categoryText);
    });
}


// Llamados API
navChkHamburgerMenu.addEventListener('click', event => {
    leftMenuContainer.classList.toggle('inactive');
})

async function getTrendingMoviesPreview() {
    const { data } = await axiosApi('trending/movie/day');
    const movies = data.results;
    createMovies(movies, trendingPreview);
}

async function getTrendingMovies() {
    const { data } = await axiosApi('trending/movie/day');
    const movies = data.results;
    createMovies(movies, genericPreview)
}

async function getCategoriesPreview() {
    const { data } = await axiosApi('/genre/movie/list');
    const categories = data.genres;
    createCategories(categories, leftMenuCategories);
}

async function getPopularMovies() {
    try {
        const { data } = await axiosApi('/movie/popular');
        const movies = data.results;
        createMovies(movies, trailerPreview);
    } catch (error) {
        console.error(error)
    }
}

async function getMoviesByCategory(categoryId) {
    const { data } = await axiosApi('discover/movie', {
        params: {
            'with_genres': categoryId
        }
    });
    const movies = data.results;
    createMovies(movies, genericPreview);
}

async function searchMovies(query) {
    const { data } = await axiosApi('/search/movie', {
        params: {
            'query': query
        }
    });
    const movies = data.results;
    createMovies(movies, genericPreview);
}

async function getMovieById(id) {
    clearMovieDetail();
    
    // se renombra data a movie
    const { data: movie } = await axiosApi(`/movie/${id}`);
    console.log(movie);

    detailBackground.style.background = `
        linear-gradient(
            180deg,
            rgba(0,0,0,0.35) 19.27%,
            rgba(0,0,0,0) 29.17%
        ),
        url(${IMG_BASE_URL_500}/${movie.poster_path})
    `
    movieDetailTitle.innerHTML = movie.title;
    movieDetailScore.innerHTML = movie.vote_average;
    movieDetailDescription.innerHTML = movie.overview;
    movieDetailCategory.innerHTML = movie.genres.map((gen) => gen.name).join(',');
}

function clearMovieDetail() {
    movieDetailTitle.innerHTML = '';
    movieDetailScore.innerHTML = '';{}
    movieDetailDescription.innerHTML = '';
    movieDetailDescription.innerHTML = '';
    movieDetailSimilar.innerHTML = '';
    detailBackground.style.background = `
        linear-gradient(
            180deg,
            rgba(0,0,0,0.35) 19.27%,
            rgba(0,0,0,0) 29.17%
        )
    `
}