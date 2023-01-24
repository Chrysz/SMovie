// Variables
let maxPages;
let page = 1;
let infiniteScroll;

// Button event
navTitle.addEventListener('click', () => location.hash = '')
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

// Language Caption
const enCaptions = {
    searchInputLabel: 'Search movie',
    popularMoviesTitle: 'Popular Movies',
    viewMoreBtnLabel: 'View More',
    newTrailersTitle: 'New Trailers',
    favoritesTitle: 'Favorites',
    categoryTitle: 'Categories',
}
const esCaptions = {
    searchInputLabel: 'Buscar película',
    popularMoviesTitle: 'Películas Populares',
    viewMoreBtnLabel: 'Ver Más',
    newTrailersTitle: 'Sinopsis',
    favoritesTitle: 'Favoritos',
    categoryTitle: 'Categorias',
}
const frCaptions = {
    searchInputLabel: 'Rechercher un film',
    popularMoviesTitle: 'Films Populaires',
    viewMoreBtnLabel: 'Voir Plus',
    newTrailersTitle: 'Nouveaux Synopsis',
    favoritesTitle: 'Favoris',
    categoryTitle: 'Catégories',
}

window.addEventListener('DOMContentLoaded', () => {
    setPageLanguage();
    fillPageLanguageSelector();
}, false);
window.addEventListener('load', navigate, false);
window.addEventListener('hashchange', navigate, false);
window.addEventListener('scroll', infiniteScroll, false);

function navigate() {
    if(infiniteScroll) {
        window.removeEventListener('scroll', infiniteScroll, { passive: false });
        infiniteScroll = undefined;
        page = 1;
        maxPages = undefined;
    }

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

    if(infiniteScroll) {
        window.addEventListener('scroll', infiniteScroll, false);
    }
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
    likedContainer.classList.add('inactive');

    headerTittle.innerText = getPageLanguage(localStorage.getItem('current_language')).captions.popularMoviesTitle;
    getTrendingMovies();
    infiniteScroll = GenericInfiniteScroll(getTrendingMovies);
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
    likedContainer.classList.add('inactive');

    //['#search', 'query']
    const [ _ , query ] = location.hash.split('=');
    searchMovies(decodeURI(query))();
    infiniteScroll = GenericInfiniteScroll(searchMovies(decodeURI(query)));
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
    likedContainer.classList.add('inactive');

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
    likedContainer.classList.add('inactive');

    //['#category', 'id-name']
    const [ _ , categoryInfo ] = location.hash.split('=');
    const [ categoryId, categoryName ] = categoryInfo.split('-')
    headerTittle.innerText = decodeURI(categoryName);
    getMoviesByCategory(categoryId)();
    infiniteScroll = GenericInfiniteScroll(getMoviesByCategory(categoryId))
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
    
    const obj = likedMoviesList();
    if(Object.keys(obj).length !== 0)
        likedContainer.classList.remove('inactive');

    getTrendingMoviesPreview();
    getPopularMovies();
    getLikedMovies();
}

// Generic Infinite Scroll
function GenericInfiniteScroll(callback){
    return async function () {
        const { scrollTop, clientHeight, scrollHeight } = document.documentElement;
        const scrollIsBottom = (scrollTop + clientHeight) >= (scrollHeight - 15);
        let isNotMaxPage = page < maxPages;
        if (scrollIsBottom && isNotMaxPage)
        {
            page++;
            callback();
        }
    }
}

// Multilanguage
function setPageLanguage() {
    const languages = {
        'en': {
            name: 'English',
            flag: '🇺🇸',
            captions: enCaptions,
        },
        'es': {
            name: 'Spanish',
            flag: '🇪🇸',
            captions: esCaptions,
        },
        'fr': {
            name: 'French',
            flag: '🇫🇷',
            captions: frCaptions,
        },
    }

    localStorage.setItem('page_languages', JSON.stringify(languages));
}
function getPageLanguage(languageCode) {
    const result = JSON.parse(localStorage.getItem('page_languages'));
    if(languageCode)
        return result[languageCode];
    
    return result;
}
function fillPageLanguageSelector() {
    const browserLanguage = window.navigator.language?.split('-')[0] ?? 'en';

    const select = document.createElement('select');
    const languages = getPageLanguage();
    Object.getOwnPropertyNames(languages).map(lang => {
        const opt = new Option(`${languages[lang].flag} ${languages[lang].name}`, lang, browserLanguage === lang);
        select.add(opt);
    });
    select.addEventListener('change', (event) => {
        localStorage.setItem('current_language', event.target.value);
        fillCaptions(event.target.value);
        navigate();
    });

    navLanguageContainer.appendChild(select);
    select.dispatchEvent(new Event('change'));
}
function fillCaptions(languageCode) {
    const language = getPageLanguage(languageCode);
    // Search placeholder
    searchInput.setAttribute('placeHolder', language.captions.searchInputLabel);
    // Trending
    trendingTitle.innerText = language.captions.popularMoviesTitle;
    trendingButton.innerText = language.captions.viewMoreBtnLabel;
    // Trailers
    trailerTitle.innerText = language.captions.newTrailersTitle;
    // Favorites
    likedTitle.innerText = language.captions.favoritesTitle;
    // Left Menu
    leftMenuContainerTitle.innerText = language.captions.categoryTitle;
}
function getCurrentLanguage() {
    return localStorage.getItem('current_language');
}