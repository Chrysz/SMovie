window.addEventListener('load', navigator, false)
window.addEventListener('hashchange', navigator, false)

function navigator() {
    console.log(location);
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
}

function trendsPage() {
    console.log('TRENDS!!!');

    navbar.classList.remove('inactive');
    headerContainer.classList.remove('inactive');
    searchContainer.classList.add('inactive');
    trendingContainer.classList.add('inactive');
    trailerContainer.classList.add('inactive');
    detailBackground.classList.add('inactive');
    movieDetailContainer.classList.add('inactive');
    leftMenuContainer.classList.add('inactive')
    categoryContainer.classList.remove('inactive');
}
function searchPage() {
    console.log('SEARCH!!!');

    navbar.classList.remove('inactive');
    headerContainer.classList.remove('inactive');
    searchContainer.classList.remove('inactive');
    trendingContainer.classList.add('inactive');
    trailerContainer.classList.add('inactive');
    detailBackground.classList.add('inactive');
    movieDetailContainer.classList.add('inactive');
    leftMenuContainer.classList.add('inactive')
    categoryContainer.classList.remove('inactive');
}
function movieDetailPage() {
    console.log('MOVIE DETAIL!!!');

    navbar.classList.add('inactive');
    headerContainer.classList.add('inactive');
    searchContainer.classList.add('inactive');
    trendingContainer.classList.add('inactive');
    trailerContainer.classList.add('inactive');
    detailBackground.classList.remove('inactive');
    movieDetailContainer.classList.remove('inactive');
    leftMenuContainer.classList.add('inactive')
    categoryContainer.classList.add('inactive');
}
function categoryPage() {
    console.log('CATEGORY!!!');

    navbar.classList.remove('inactive');
    headerContainer.classList.remove('inactive');
    searchContainer.classList.add('inactive');
    trendingContainer.classList.add('inactive');
    trailerContainer.classList.add('inactive');
    detailBackground.classList.add('inactive');
    movieDetailContainer.classList.add('inactive');
    leftMenuContainer.classList.add('inactive')
    categoryContainer.classList.remove('inactive');
}
function homePage() {
    console.log('HOME!!!');

    navbar.classList.remove('inactive');
    headerContainer.classList.add('inactive');
    searchContainer.classList.remove('inactive');
    trendingContainer.classList.remove('inactive');
    trailerContainer.classList.remove('inactive');
    detailBackground.classList.add('inactive');
    movieDetailContainer.classList.add('inactive');
    movieDetailContainer.style.background = '';
    leftMenuContainer.classList.add('inactive');
    categoryContainer.classList.add('inactive');

    getTrendingMoviesPreview();
    getPopularMovies();
}