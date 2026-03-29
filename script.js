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
// 3. INQUIRY FORM HANDLING (In-Page Success State)
// ==========================================
const leadForm = document.getElementById('leadForm');
const contactFormContainer = document.querySelector('.contact-form');

if (leadForm) {
    leadForm.addEventListener('submit', function(e) {
        e.preventDefault(); // Prevent the default page redirect
        
        // Change button text to show it's working
        const submitBtn = leadForm.querySelector('button[type="submit"]');
        const originalBtnText = submitBtn.innerHTML;
        submitBtn.innerHTML = 'Sending Request...';
        
        const formData = new FormData(leadForm);
        const object = Object.fromEntries(formData);
        const json = JSON.stringify(object);

        fetch('https://api.web3forms.com/submit', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json'
            },
            body: json
        })
        .then(async (response) => {
            if (response.status == 200) {
                // SUCCESS: Replace the form with a clean success message
                contactFormContainer.innerHTML = `
                    <div class="form-success-message">
                        <div class="success-icon">✔</div>
                        <h3>Request Received</h3>
                        <p>Thank you! Your project details have been sent to Eric. We will review your request and get back to you shortly.</p>
                        <button onclick="window.location.reload()" class="btn-secondary" style="margin-top: 20px; width: auto;">Send Another Request</button>
                    </div>
                `;
            } else {
                // Error handling
                console.log(response);
                alert("Something went wrong. Please try calling us directly at (443) 465-7769.");
            }
        })
        .catch(error => {
            console.log(error);
            alert("Something went wrong. Please try calling us directly at (443) 465-7769.");
        })
        .finally(() => {
            // Reset button text (though usually hidden by success state)
            submitBtn.innerHTML = originalBtnText;
        });
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