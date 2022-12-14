// Button event
navTitle.addEventListener('click', () => location.hash = '#home')
searchInput.addEventListener('keypress', (e) => {
    if(e.key === 'Enter') {
        location.hash = `#search=${searchInput.value}`;
        e.preventDefault();
    }
});
searchButton.addEventListener('click', () => {
    location.hash = `#search=${searchInput.value}`;
});
trendingButton.addEventListener('click', () => location.hash = '#trends');
headerArrowButton.addEventListener('click', () => history.back());
detailBackArrow.addEventListener('click', () => history.back());

window.addEventListener('load', navigator, false)
window.addEventListener('hashchange', navigator, false)

function navigator() {
    navChkHamburgerMenu.checked = false;
    getCategoriesPreview();
    if (location.hash.startsWith('#trends')){
        trendsPage();
    }
    else if (location.hash.startsWith('#search='))
    {
        searchPage();
    }
    else if (location.hash.startsWith('#movie='))
    {
        movieDetailPage();
    }
    else if (location.hash.startsWith('#category='))
    {
        categoryPage();
    }
    else {
        homePage();
    }

    document.body.scrollTop = 0;
    document.documentElement.scrollTop = 0;
}

function trendsPage() {
    navbar.classList.remove('inactive');
    headerContainer.classList.remove('inactive');
    headerTittle.classList.remove('inactive'); 
    searchContainer.classList.add('inactive');
    trendingContainer.classList.add('inactive');
    trailerContainer.classList.add('inactive');
    detailBackground.classList.add('inactive');
    movieDetailContainer.classList.add('inactive');
    leftMenuContainer.classList.add('inactive')
    genericContainer.classList.remove('inactive');

    headerTittle.innerText = 'Popular Movies';
    getTrendingMovies();
}
function searchPage() {
    navbar.classList.remove('inactive');
    headerContainer.classList.remove('inactive');
    headerTittle.classList.add('inactive');
    searchContainer.classList.remove('inactive');
    trendingContainer.classList.add('inactive');
    trailerContainer.classList.add('inactive');
    detailBackground.classList.add('inactive');
    movieDetailContainer.classList.add('inactive');
    leftMenuContainer.classList.add('inactive')
    genericContainer.classList.remove('inactive');

    //['#search', 'query']
    const [ _ , query ] = location.hash.split('=');
    searchMovies(decodeURI(query));
}
function movieDetailPage() {
    navbar.classList.add('inactive');
    headerContainer.classList.add('inactive');
    searchContainer.classList.add('inactive');
    trendingContainer.classList.add('inactive');
    trailerContainer.classList.add('inactive');
    detailBackground.classList.remove('inactive');
    movieDetailContainer.classList.remove('inactive');
    leftMenuContainer.classList.add('inactive')
    genericContainer.classList.add('inactive');

    const [_, id] = location.hash.split('=');
    getMovieById(id);
}
function categoryPage() {
    navbar.classList.remove('inactive');
    headerContainer.classList.remove('inactive');
    headerTittle.classList.remove('inactive');  
    searchContainer.classList.add('inactive');
    trendingContainer.classList.add('inactive');
    trailerContainer.classList.add('inactive');
    detailBackground.classList.add('inactive');
    movieDetailContainer.classList.add('inactive');
    leftMenuContainer.classList.add('inactive')
    genericContainer.classList.remove('inactive');

    //['#category', 'id-name']
    const [ _ , categoryInfo ] = location.hash.split('=');
    const [ categoryId, categoryName ] = categoryInfo.split('-')
    headerTittle.innerText = decodeURI(categoryName);
    getMoviesByCategory(categoryId);
}
function homePage() {
    searchInput.value = '';
    navbar.classList.remove('inactive');
    headerContainer.classList.add('inactive');
    searchContainer.classList.remove('inactive');
    trendingContainer.classList.remove('inactive');
    trailerContainer.classList.remove('inactive');
    detailBackground.classList.add('inactive');
    movieDetailContainer.classList.add('inactive');
    movieDetailContainer.style.background = '';
    leftMenuContainer.classList.add('inactive');
    genericContainer.classList.add('inactive');

    getTrendingMoviesPreview();
    getPopularMovies();
}