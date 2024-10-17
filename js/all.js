document.addEventListener('DOMContentLoaded', () => {
    const navLinks = document.querySelectorAll('.nav-link');

    // Get current page from URL
    const currentPage = window.location.pathname.split('/').pop();

    // Loop through each link and add 'active-page' class if it's the current page
    navLinks.forEach(link => {
        const page = link.getAttribute('href').split('/').pop();
        if (currentPage === page) {
            link.classList.add('active-page');
        }
    });
});
