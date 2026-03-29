// ==========================================
// 1. MOBILE MENU TOGGLE (The Hamburger)
// ==========================================
const hamburger = document.getElementById('hamburger');
const navMenu = document.getElementById('navMenu');

// Listen for a click on the hamburger icon
hamburger.addEventListener('click', () => {
    // Toggle the 'active' class to show/hide the menu
    navMenu.classList.toggle('active');
    
    // Change the icon from hamburger to an 'X' when open
    if (navMenu.classList.contains('active')) {
        hamburger.innerHTML = '✕';
    } else {
        hamburger.innerHTML = '☰';
    }
});

// Close the mobile menu automatically if a link is clicked
const navLinks = document.querySelectorAll('.nav-menu a');
navLinks.forEach(link => {
    link.addEventListener('click', () => {
        navMenu.classList.remove('active');
        hamburger.innerHTML = '☰';
    });
});

// ==========================================
// 2. SMOOTH SCROLLING FOR NAVIGATION LINKS
// ==========================================
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault(); // Stop the default sudden jump
        
        const targetId = this.getAttribute('href');
        const targetElement = document.querySelector(targetId);
        
        if (targetElement) {
            // Calculate the header height so it doesn't cover the section title
            const headerHeight = document.querySelector('.site-header').offsetHeight;
            const elementPosition = targetElement.getBoundingClientRect().top;
            const offsetPosition = elementPosition + window.pageYOffset - headerHeight;

            window.scrollTo({
                top: offsetPosition,
                behavior: 'smooth'
            });
        }
    });
});

// ==========================================
// 3. INQUIRY FORM HANDLING (MVP Version)
// ==========================================
const contactForm = document.querySelector('.contact-form form');

if (contactForm) {
    contactForm.addEventListener('submit', function(e) {
        e.preventDefault(); // Prevent the page from reloading
        
        // Get the user's name to personalize the message
        const customerName = contactForm.querySelector('input[name="name"]').value;
        
        // Updated to reflect the DMV market
        alert(`Thank you, ${customerName}! Your request has been sent to Eminent Power Solutions. We will contact you shortly to discuss your project in the DMV area.`);
        
        // Clear the form fields after submission
        contactForm.reset();
    });
}