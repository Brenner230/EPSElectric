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

// ==========================================
// 4. TESTIMONIAL CAROUSEL ENGINE
// ==========================================
const slides = document.querySelectorAll('.carousel-slide');
const dots = document.querySelectorAll('.dot');
const prevBtn = document.getElementById('prevBtn');
const nextBtn = document.getElementById('nextBtn');
let currentSlide = 0;
let slideInterval;

function showSlide(index) {
    // Remove active class from all slides and dots
    slides.forEach(slide => slide.classList.remove('active'));
    dots.forEach(dot => dot.classList.remove('active'));

    // Handle wrap-around (going past the last or before the first)
    currentSlide = (index + slides.length) % slides.length; 
    
    // Add active class to the current target
    slides[currentSlide].classList.add('active');
    dots[currentSlide].classList.add('active');
}

function nextSlide() {
    showSlide(currentSlide + 1);
}

function prevSlide() {
    showSlide(currentSlide - 1);
}

// Event Listeners for manual clicking
if (nextBtn && prevBtn) {
    nextBtn.addEventListener('click', () => {
        nextSlide();
        resetInterval(); // Pause auto-play when user clicks
    });
    prevBtn.addEventListener('click', () => {
        prevSlide();
        resetInterval(); 
    });
}

dots.forEach((dot, index) => {
    dot.addEventListener('click', () => {
        showSlide(index);
        resetInterval();
    });
});

// Auto-play feature
function startInterval() {
    slideInterval = setInterval(nextSlide, 6000); // Changes slide every 6 seconds
}

function resetInterval() {
    clearInterval(slideInterval);
    startInterval();
}

// Start the auto-play when the page loads
if (slides.length > 0) {
    startInterval();
}