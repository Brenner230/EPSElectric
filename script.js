// ==========================================
// 1. MOBILE MENU TOGGLE (The Hamburger)
// ==========================================
const hamburger = document.getElementById('hamburger');
const navMenu = document.getElementById('navMenu');

hamburger.addEventListener('click', () => {
    navMenu.classList.toggle('active');
    hamburger.innerHTML = navMenu.classList.contains('active') ? '✕' : '☰';
});

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
        e.preventDefault();
        const targetId = this.getAttribute('href');
        const targetElement = document.querySelector(targetId);
        if (targetElement) {
            const headerHeight = document.querySelector('.site-header').offsetHeight;
            const elementPosition = targetElement.getBoundingClientRect().top;
            const offsetPosition = elementPosition + window.pageYOffset - headerHeight;
            window.scrollTo({ top: offsetPosition, behavior: 'smooth' });
        }
    });
});

// ==========================================
// 3. INQUIRY FORM LOGIC (GA Redirect Version)
// ==========================================

// --- A. PHONE NUMBER FORMATTER ---
const phoneInput = document.getElementById('phone');
if (phoneInput) {
    phoneInput.addEventListener('input', (e) => {
        let x = e.target.value.replace(/\D/g, '').match(/(\d{0,3})(\d{0,3})(\d{0,4})/);
        e.target.value = !x[2] ? x[1] : '(' + x[1] + ') ' + x[2] + (x[3] ? '-' + x[3] : '');
    });
}

// --- B. DYNAMIC SERVICE DROPDOWNS ---
const categorySelect = document.getElementById('categorySelect');
const serviceSelect = document.getElementById('serviceSelect');

const services = {
    Residential: [
        "High-End Remodel",
        "Panel Upgrade / Heavy-Up",
        "EV Charger Installation",
        "Landscape Lighting",
        "A/V & Smart Home",
        "General Troubleshooting"
    ],
    Commercial: [
        "Tenant Improvements",
        "Commercial Lighting Retrofit",
        "Dedicated Circuits",
        "Code Compliance Audit",
        "Service Contract Inquiry"
    ]
};

if (categorySelect && serviceSelect) {
    categorySelect.addEventListener('change', function() {
        const selectedCategory = this.value;
        serviceSelect.innerHTML = '<option value="">Select a Service...</option>';
        if (selectedCategory) {
            serviceSelect.disabled = false;
            services[selectedCategory].forEach(service => {
                const option = document.createElement('option');
                option.value = service;
                option.textContent = service;
                serviceSelect.appendChild(option);
            });
        } else {
            serviceSelect.disabled = true;
        }
    });
}

// --- C. FORM SUBMISSION WITH GA REDIRECT ---
const leadForm = document.getElementById('leadForm');

if (leadForm) {
    leadForm.addEventListener('submit', function(e) {
        e.preventDefault();
        
        const submitBtn = leadForm.querySelector('button[type="submit"]');
        const originalBtnText = submitBtn.innerHTML;
        submitBtn.innerHTML = 'Sending Request...';
        
        const formData = new FormData(leadForm);
        const object = Object.fromEntries(formData);

        fetch('https://api.web3forms.com/submit', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json', 'Accept': 'application/json' },
            body: JSON.stringify(object)
        })
        .then(async (response) => {
            if (response.status == 200) {
                // REDIRECT TO SUCCESS PAGE FOR GOOGLE ANALYTICS
                window.location.href = 'success.html';
            } else {
                alert("Something went wrong. Please try calling us directly at (443) 465-7769.");
            }
        })
        .catch(error => {
            alert("Something went wrong. Please try calling us directly at (443) 465-7769.");
        })
        .finally(() => {
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
    slides.forEach(slide => slide.classList.remove('active'));
    dots.forEach(dot => dot.classList.remove('active'));
    currentSlide = (index + slides.length) % slides.length; 
    slides[currentSlide].classList.add('active');
    dots[currentSlide].classList.add('active');
}

function nextSlide() { showSlide(currentSlide + 1); }
function prevSlide() { showSlide(currentSlide - 1); }

if (nextBtn && prevBtn) {
    nextBtn.addEventListener('click', () => { nextSlide(); resetInterval(); });
    prevBtn.addEventListener('click', () => { prevSlide(); resetInterval(); });
}

dots.forEach((dot, index) => {
    dot.addEventListener('click', () => { showSlide(index); resetInterval(); });
});

function startInterval() { slideInterval = setInterval(nextSlide, 6000); }
function resetInterval() { clearInterval(slideInterval); startInterval(); }
if (slides.length > 0) { startInterval(); }

// ==========================================
// 5. INTERACTIVE SERVICE AREA MAP (Leaflet.js)
// ==========================================
document.addEventListener("DOMContentLoaded", function() {
    const mapContainer = document.getElementById('serviceMap');
    
    if (mapContainer) {
        // Initialize the map centered on Frederick, MD (Coordinates: 39.4143, -77.4105)
        // Zoom level set to 8 for a clear view of the 1.5 hour radius
        const map = L.map('serviceMap').setView([39.4143, -77.4105], 8);

        // Load map tiles from CartoDB Voyager to bypass OpenStreetMap's local file 403 error
        L.tileLayer('https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png', {
            attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/attributions">CARTO</a>',
            subdomains: 'abcd',
            maxZoom: 20
        }).addTo(map);

        // Draw a shaded circle to represent the 1.5-hour driving radius
        // 135,000 meters = approx. 84 miles, covering the requested territory beautifully
        const serviceCircle = L.circle([39.4143, -77.4105], {
            color: '#0B2046',        // Navy border
            fillColor: '#FF6600',    // EPS Orange fill
            fillOpacity: 0.2,        // Transparency
            radius: 135000            
        }).addTo(map);

        // Add a popup when someone clicks the shaded area
        serviceCircle.bindPopup("<b>Eminent Power Solutions</b><br>Mid-Atlantic Service Area HQ in Frederick, MD.");
    }
});