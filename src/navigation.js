window.addEventListener('load', navigator, false)
window.addEventListener('hashchange', navigator, false)

function navigator() {
    console.log(location);

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
}
function searchPage() {
    console.log('SEARCH!!!');
}
function movieDetailPage() {
    console.log('MOVIE DETAIL!!!');
}
function categoryPage() {
    console.log('CATEGORY!!!');
}
function homePage() {
    console.log('HOME!!!');
}
function homePage() {
    console.log('HOME!!!');
    getTrendingMoviesPreview();
    getCategoriesPreview();
    getPopularMovies();
}