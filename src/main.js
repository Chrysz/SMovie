const chkHamburgerMenu = document.querySelector('.nav-container .nav-left .nav-hamburger-menu .nav-checkbox');
const leftMenuContainer = document.querySelector('.left-menu-container');

chkHamburgerMenu.addEventListener('click', event => {
    console.log('asdfasdf');
    leftMenuContainer.classList.toggle('inactive');
})