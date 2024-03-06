function collapseNavbar() {
    const navbarToggleButton = document.querySelector('.navbar-toggler');

    if (navbarToggleButton && !navbarToggleButton.classList.contains('collapsed')) {
        navbarToggleButton.click();
    }
}


window.addEventListener('scroll', function() {
    
    collapseNavbar();
});
window.addEventListener('click', function() {
    
    collapseNavbar();
});

const idLinks = document.querySelectorAll('a[href^="#"]');
idLinks.forEach(link => {

    link.addEventListener('click', function() {
        collapseNavbar();
    });
});
