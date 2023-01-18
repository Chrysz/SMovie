const IMG_BASE_URL_300 = 'https://image.tmdb.org/t/p/w300';
const IMG_BASE_URL_500 = 'https://image.tmdb.org/t/p/w500';

const axiosApi = axios.create({
    baseURL: 'https://api.themoviedb.org/3/',
    params: {
        'api_key': API_KEY
    }
});

// Devolver el array de peliculas en el LocalStorage
function likedMoviesList() {
    const item = JSON.parse(localStorage.getItem('liked_movies'));
    return item ? item : {};
}

function likeMovie(movie) {
    const likedMovies = likedMoviesList();

    if(likedMovies[movie.id])
        likedMovies[movie.id] = undefined;
    else
        likedMovies[movie.id] = movie;

    localStorage.setItem('liked_movies', JSON.stringify(likedMovies));

    if (location.hash == ''){
        getTrendingMoviesPreview();
        getPopularMovies();
        getLikedMovies();
    }
}

// Utils

// const lazyLoader = new IntersectionObserver(callback, options)
// si se omite opciones, observa todo el body
const lazyLoader = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
        if(entry.isIntersecting){
            const url = entry.target.getAttribute('data-img');
            entry.target.setAttribute('src', url);
        }
    });
});
function createMovies(movies, container, { lazyLoad = false, cleanContainer = true, } = {})
{
    if (cleanContainer)
        container.innerHTML = '';

    movies.forEach(movie => {
        const imgContainer = document.createElement('div');
        imgContainer.classList.add('movie-container');

        const previewImg = document.createElement('img');
        previewImg.classList.add('movie-img');
        previewImg.setAttribute('alt', movie.title);
        previewImg.setAttribute(lazyLoad ? 'data-img' : 'src', `${IMG_BASE_URL_300}/${movie.poster_path}`);
        previewImg.addEventListener('error', () => {
            previewImg.setAttribute('src', 'assets/FilmNotFound.jpg');
        });
        previewImg.addEventListener('click', () => location.hash=`movie=${movie.id}` );

        const movieBtn = document.createElement('button');
        movieBtn.classList.add('movie-btn');
        likedMoviesList()[movie.id] && movieBtn.classList.add('movie-btn--liked');
        movieBtn.addEventListener('click', () => {
            movieBtn.classList.toggle('movie-btn--liked'); 
            likeMovie(movie);
        });

        if(lazyLoad) 
            lazyLoader.observe(previewImg);
        
        imgContainer.appendChild(previewImg);
        imgContainer.appendChild(movieBtn);
        container.appendChild(imgContainer);
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
    createMovies(movies, trendingPreview, { lazyLoad: true });
}

async function getTrendingMovies() {
    let firstPage = isFirstPage();
    if(firstPage)
        imgSkelLoading(genericPreview);

    const { data } = await axiosApi('trending/movie/day', {
        params: {
            page,
        }
    });

    if(firstPage)
        maxPages = data.total_pages;

    const movies = data.results;
    createMovies(movies, genericPreview, { lazyLoad: true, cleanContainer: firstPage })
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
        createMovies(movies, trailerPreview, { lazyLoad: true });
    } catch (error) {
        console.error(error)
    }
}

function getMoviesByCategory(categoryId) {
    return async function () {
        let firstPage = isFirstPage();
        if(firstPage)
            imgSkelLoading(genericPreview);
        
        const { data } = await axiosApi('discover/movie', {
            params: {
                'with_genres': categoryId,
                page,
            }
        });

        if(firstPage)
            maxPages = data.total_pages;

        const movies = data.results;
        createMovies(movies, genericPreview, { lazyLoad: true, cleanContainer: firstPage });
    }    
}

function searchMovies(query) {
    return async function () {
        let firstPage = isFirstPage()
        if(firstPage)
            imgSkelLoading(genericPreview);
        
        const { data } = await axiosApi('/search/movie', {
            params: {
                'query': query,
                page,
            }
        });

        if(firstPage)
            maxPages = data.total_pages;

        const movies = data.results;
        createMovies(movies, genericPreview, { lazyLoad: true, cleanContainer: firstPage });
    }    
}

async function getMovieById(id) {
    clearMovieDetail();
    
    // se renombra data a movie
    const { data: movie } = await axiosApi(`/movie/${id}`);
    detailBackground.style.background = `
        linear-gradient(
            180deg,
            rgba(0,0,0,0.35) 19.27%,
            rgba(0,0,0,0) 29.17%
        ),
        url(${IMG_BASE_URL_500}/${movie.poster_path})
    `
    movieDetailTitle.innerHTML = movie.title;
    movieDetailScore.innerHTML = movie.vote_average.toFixed(1);
    movieDetailDescription.innerHTML = movie.overview;
    movieDetailCategory.innerHTML = movie.genres.map((gen) => gen.name).join(',');
    getRelatedMovieById(movie.id);
}

function clearMovieDetail() {
    movieDetailTitle.innerHTML = '';
    movieDetailScore.innerHTML = '';
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

async function getRelatedMovieById(id){
    imgSkelLoading(movieDetailSimilar);
    const { data } = await axiosApi(`/movie/${id}/recommendations`);
    const relatedMovies = data.results;

    createMovies(relatedMovies, movieDetailSimilar, { lazyLoad: true });
}

function getLikedMovies() {
    const likedMovies = likedMoviesList();
    const moviesArray = Object.values(likedMovies);

    createMovies(moviesArray, likedPreview, { lazyLoad: true, cleanContainer: true })
}

// Shared Skeleton Img Loading
function imgSkelLoading(container){
    const qty = 4;
    container.innerHTML = '';
    for(var i = 0; i < qty; i++) {
        const skelLoading = document.createElement('div');
        skelLoading.classList.add('skeleton--loading');
        container.appendChild(skelLoading);
    }
}

function isFirstPage(){
    return page === 1;
}