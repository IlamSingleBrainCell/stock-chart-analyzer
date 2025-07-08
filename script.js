document.addEventListener('DOMContentLoaded', () => {
    const menuToggle = document.getElementById('menuToggle');
    const sidebar = document.querySelector('.sidebar');
    const mainContent = document.querySelector('.main-content'); // To close menu on content click

    if (menuToggle && sidebar) {
        menuToggle.addEventListener('click', (event) => {
            event.stopPropagation(); // Prevents click from bubbling to document
            sidebar.classList.toggle('active');
            menuToggle.classList.toggle('active'); // For potential styling of the toggle itself

            // Optional: Change menu icon
            if (menuToggle.classList.contains('active')) {
                menuToggle.innerHTML = '&times; Close'; // "X" symbol and text
            } else {
                menuToggle.innerHTML = '&#9776; Menu'; // Hamburger icon and text
            }
        });

        // Close sidebar if user clicks outside of it (on main content)
        document.addEventListener('click', (event) => {
            if (sidebar.classList.contains('active') && !sidebar.contains(event.target) && event.target !== menuToggle) {
                sidebar.classList.remove('active');
                menuToggle.classList.remove('active');
                menuToggle.innerHTML = '&#9776; Menu'; // Reset hamburger icon
            }
        });

        // Close sidebar if a navigation link is clicked
        const navLinks = sidebar.querySelectorAll('.sidebar-nav a');
        navLinks.forEach(link => {
            link.addEventListener('click', () => {
                if (sidebar.classList.contains('active')) {
                    sidebar.classList.remove('active');
                    menuToggle.classList.remove('active');
                    menuToggle.innerHTML = '&#9776; Menu';
                }
            });
        });
    }
});
