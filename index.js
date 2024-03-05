function collapseNavbar() {
    // Get the navbar toggle button
    const navbarToggleButton = document.querySelector('.navbar-toggler');

    // Check if the navbar toggle button is visible and the navbar is currently expanded
    if (navbarToggleButton && !navbarToggleButton.classList.contains('collapsed')) {
        // Simulate a click event on the navbar toggle button to collapse the navbar
        navbarToggleButton.click();
    }
}

// Listen for the scroll event on the window
window.addEventListener('scroll', function() {
    // Call the collapseNavbar function when the user scrolls
    collapseNavbar();
});