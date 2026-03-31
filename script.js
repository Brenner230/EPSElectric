// ==========================================
// 1. UNIVERSAL HEADER FETCH & NAVIGATION
// ==========================================
document.addEventListener("DOMContentLoaded", function() {
    const headerPlaceholder = document.getElementById('header-placeholder');
    
    if (headerPlaceholder) {
        // Fetch the universal header file
        fetch('header.html')
            .then(response => response.text())
            .then(data => {
                headerPlaceholder.innerHTML = data;
                initializeNavigation(); // Start menu logic only AFTER header loads
            })
            .catch(error => console.error("Error loading header:", error));
    } else {
        // Fallback just in case a page hardcoded the header
        initializeNavigation();
    }
});

function initializeNavigation() {
    const hamburger = document.getElementById('hamburger');
    const navMenu = document.getElementById('navMenu');

    // A. Hamburger Menu Toggle
    if (hamburger && navMenu) {
        hamburger.addEventListener('click', () => {
            navMenu.classList.toggle('active');
            hamburger.innerHTML = navMenu.classList.contains('active') ? '✕' : '☰';
        });
    }

    // B. Dynamically Set Active Page Highlight
    const currentPage = window.location.pathname.split('/').pop() || 'index.html';
    const navLinks = document.querySelectorAll('.nav-menu a');
    
    navLinks.forEach(link => {
        // If the href exactly matches the current URL file name, highlight it
        if (link.getAttribute('href') === currentPage) {
            link.classList.add('active-page');
        }
        
        // Close menu on mobile when a link is clicked
        link.addEventListener('click', () => {
            if(navMenu) navMenu.classList.remove('active');
            if(hamburger) hamburger.innerHTML = '☰';
        });
    });

    // C. Multi-Page Smooth Scrolling
    document.querySelectorAll('a[href*="#"]:not(.modal-trigger)').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            const targetPath = this.pathname.replace(/^\//, '');
            const currentPath = location.pathname.replace(/^\//, '');
            
            // Only smooth scroll if we are staying on the same page
            if ((targetPath === currentPath || targetPath === '') && location.hostname == this.hostname) {
                const targetId = this.hash;
                if (targetId) {
                    const targetElement = document.querySelector(targetId);
                    if (targetElement) {
                        e.preventDefault(); 
                        const headerElement = document.querySelector('.site-header');
                        const headerHeight = headerElement ? headerElement.offsetHeight : 0;
                        const elementPosition = targetElement.getBoundingClientRect().top;
                        const offsetPosition = elementPosition + window.pageYOffset - headerHeight;
                        
                        window.scrollTo({ top: offsetPosition, behavior: 'smooth' });
                    }
                }
            }
        });
    });
}

// ==========================================
// 3. INQUIRY FORM LOGIC 
// ==========================================
const phoneInput = document.getElementById('phone');
if (phoneInput) {
    phoneInput.addEventListener('input', (e) => {
        let x = e.target.value.replace(/\D/g, '').match(/(\d{0,3})(\d{0,3})(\d{0,4})/);
        e.target.value = !x[2] ? x[1] : '(' + x[1] + ') ' + x[2] + (x[3] ? '-' + x[3] : '');
    });
}

const categorySelect = document.getElementById('categorySelect');
const serviceSelect = document.getElementById('serviceSelect');

// UPDATED TO MATCH NEW SEO ARCHITECTURE
const services = {
    Residential: [
        "Panel Upgrades & Heavy-Ups",
        "EV Charger Installation",
        "Whole-Home Generators",
        "Troubleshooting & Repair",
        "High-End Remodels",
        "Indoor/Outdoor Lighting",
        "Historic Rewiring (K&T / Aluminum)",
        "Appliance Circuits & Surge Protection",
        "Safety Inspections & Code Corrections"
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
    if(slides[currentSlide]) slides[currentSlide].classList.add('active');
    if(dots[currentSlide]) dots[currentSlide].classList.add('active');
}

function nextSlide() { showSlide(currentSlide + 1); }
function prevSlide() { showSlide(currentSlide - 1); }

if (nextBtn && prevBtn) {
    nextBtn.addEventListener('click', () => { nextSlide(); resetInterval(); });
    prevBtn.addEventListener('click', () => { prevSlide(); resetInterval(); });
}

if (dots.length > 0) {
    dots.forEach((dot, index) => {
        dot.addEventListener('click', () => { showSlide(index); resetInterval(); });
    });
}

function startInterval() { slideInterval = setInterval(nextSlide, 6000); }
function resetInterval() { clearInterval(slideInterval); startInterval(); }
if (slides.length > 0) { startInterval(); }

// ==========================================
// 5. DYNAMIC MODAL SYSTEM (FAQ, Privacy, Terms)
// ==========================================
const modalTriggers = document.querySelectorAll('.modal-trigger');
const closeBtns = document.querySelectorAll('.close-modal');
const modals = document.querySelectorAll('.modal');

modalTriggers.forEach(trigger => {
    trigger.addEventListener('click', (e) => {
        e.preventDefault();
        const href = trigger.getAttribute('href');
        if(href && href.startsWith('#')) {
            const targetId = href.substring(1);
            const targetModal = document.getElementById(targetId);
            if (targetModal) {
                targetModal.classList.add('show');
                document.body.style.overflow = 'hidden'; 
            }
        }
    });
});

closeBtns.forEach(btn => {
    btn.addEventListener('click', () => {
        modals.forEach(modal => modal.classList.remove('show'));
        document.body.style.overflow = 'auto'; 
    });
});

window.addEventListener('click', (e) => {
    modals.forEach(modal => {
        if (e.target === modal) {
            modal.classList.remove('show');
            document.body.style.overflow = 'auto';
        }
    });
});

const faqQuestions = document.querySelectorAll('.faq-question');
if(faqQuestions.length > 0) {
    faqQuestions.forEach(question => {
        question.addEventListener('click', () => {
            question.classList.toggle('active');
            const answer = question.nextElementSibling;
            if (question.classList.contains('active')) {
                answer.style.maxHeight = answer.scrollHeight + "px";
            } else {
                answer.style.maxHeight = 0;
            }
        });
    });
}

// ==========================================
// 6. COOKIE CONSENT LOGIC
// ==========================================
document.addEventListener("DOMContentLoaded", function() {
    const cookieBanner = document.getElementById('cookieBanner');
    const acceptCookiesBtn = document.getElementById('acceptCookies');

    if (cookieBanner && acceptCookiesBtn) {
        if (!localStorage.getItem('cookieConsent')) {
            setTimeout(() => {
                cookieBanner.classList.add('show');
            }, 1500);
        }

        acceptCookiesBtn.addEventListener('click', () => {
            localStorage.setItem('cookieConsent', 'true');
            cookieBanner.classList.remove('show');
        });
    }
});

// ==========================================
// 7. ADVANCED INTERACTIVE SERVICE AREA MAP 
// ==========================================
document.addEventListener("DOMContentLoaded", function() {
    const mapContainer = document.getElementById('serviceMap');
    
    if (mapContainer && typeof L !== 'undefined') {
        const map = L.map('serviceMap').setView([39.2, -76.5], 7);

        L.tileLayer('https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png', {
            attribution: '&copy; OpenStreetMap contributors &copy; CARTO',
            subdomains: 'abcd',
            maxZoom: 20
        }).addTo(map);

        const partialRadius = L.circle([39.4143, -77.4105], {
            color: '#0B2046',
            weight: 2,
            dashArray: '5, 5', 
            fillColor: '#FF6600',
            fillOpacity: 0.15,
            radius: 135000 
        }).addTo(map);
        
        partialRadius.bindPopup("<b>Partial Coverage Area</b><br>Covering select counties within 1.5 hours of Frederick, MD.");

        fetch('https://raw.githubusercontent.com/PublicaMundi/MappingAPI/master/data/geojson/us-states.json')
            .then(response => response.json())
            .then(data => {
                L.geoJSON(data, {
                    filter: function(feature) {
                        return ['Maryland', 'District of Columbia', 'Delaware'].includes(feature.properties.name);
                    },
                    style: function(feature) {
                        return {
                            color: '#0B2046', 
                            weight: 2,
                            fillColor: '#FF6600', 
                            fillOpacity: 0.55
                        };
                    },
                    onEachFeature: function(feature, layer) {
                        layer.bindPopup("<b>" + feature.properties.name + "</b><br>Full Coverage Region");
                    }
                }).addTo(map);
            })
            .catch(err => console.error("Error loading state boundary data: ", err));
    }
});

// ==========================================
// 8. PORTFOLIO LIGHTBOX (For portfolio.html)
// ==========================================
document.addEventListener("DOMContentLoaded", function() {
    const portfolioImages = document.querySelectorAll('.portfolio-lightbox-trigger');
    if (portfolioImages.length > 0) {
        // Create lightbox elements
        const lightboxOverlay = document.createElement('div');
        lightboxOverlay.className = 'portfolio-lightbox-overlay';
        const lightboxImg = document.createElement('img');
        lightboxOverlay.appendChild(lightboxImg);
        document.body.appendChild(lightboxOverlay);

        portfolioImages.forEach(img => {
            img.style.cursor = 'pointer';
            img.addEventListener('click', (e) => {
                lightboxImg.src = e.target.src;
                lightboxOverlay.classList.add('show');
                document.body.style.overflow = 'hidden';
            });
        });

        lightboxOverlay.addEventListener('click', () => {
            lightboxOverlay.classList.remove('show');
            document.body.style.overflow = 'auto';
        });
    }
});

// ==========================================
// 9. ZIP CODE VALIDATION & INTERACTIVE QUIZ
// ==========================================

// Define the Zip Codes (You can add more to these lists later!)
const emergencyZips = ["21701", "21702", "21703", "21704"]; 
const standardZips = ["19701", "19702", "19901", "20814", "20815", "20850"]; 

function validateZip(zip) {
    if (emergencyZips.includes(zip)) {
        return { status: "emergency", msg: "✅ FULL EMERGENCY COVERAGE: You are within our 1.5-hour rapid response zone!" };
    } else if (standardZips.includes(zip)) {
        return { status: "standard", msg: "✔️ STANDARD COVERAGE: We serve your area for standard projects and estimates." };
    } else {
        return { status: "none", msg: "❌ OUTSIDE SERVICE AREA: We currently do not serve this zip code." };
    }
}

// Zip Checker on Homepage
const checkZipBtn = document.getElementById('checkZipBtn');
if (checkZipBtn) {
    checkZipBtn.addEventListener('click', () => {
        const zip = document.getElementById('zipInput').value;
        const resultDiv = document.getElementById('zipResult');
        const validation = validateZip(zip);
        
        resultDiv.innerHTML = validation.msg;
        resultDiv.style.display = "block";
        
        if (validation.status === "emergency") {
            resultDiv.style.background = "#dcfce7"; resultDiv.style.color = "#166534";
        } else if (validation.status === "standard") {
            resultDiv.style.background = "#e0f2fe"; resultDiv.style.color = "#075985";
        } else {
            resultDiv.style.background = "#fee2e2"; resultDiv.style.color = "#991b1b";
        }
    });
}

// Interactive Quiz Logic
let quizData = { type: "", service: "", emergency: "" };
const quizSteps = document.querySelectorAll('.quiz-step');
const quizServices = document.getElementById('quiz-services');

document.querySelectorAll('.quiz-opt').forEach(button => {
    button.addEventListener('click', function() {
        const step = this.closest('.quiz-step');
        const stepNum = parseInt(step.dataset.step);
        const value = this.dataset.value;

        if (stepNum === 1) {
            quizData.type = value;
            populateQuizServices(value);
        } else if (stepNum === 2) {
            quizData.service = value;
        } else if (stepNum === 3) {
            quizData.emergency = value;
        }

        goToStep(stepNum + 1);
    });
});

function populateQuizServices(type) {
    const options = type === "Residential" 
        ? ["Panel Upgrade", "EV Charger", "Lighting", "Remodeling Wiring"] 
        : ["Tenant Improvement", "Commercial Lighting", "Code Audit", "Dedicated Circuits"];
    
    if (quizServices) {
        quizServices.innerHTML = options.map(opt => 
            `<button class="quiz-opt" data-value="${opt}">${opt}</button>`
        ).join('');

        // Re-attach listeners to the new buttons
        quizServices.querySelectorAll('.quiz-opt').forEach(btn => {
            btn.addEventListener('click', function() {
                quizData.service = this.dataset.value;
                goToStep(3);
            });
        });
    }
}

function goToStep(num) {
    quizSteps.forEach(s => {
        s.classList.remove('active');
        s.style.display = 'none';
    });
    const nextStep = document.querySelector(`.quiz-step[data-step="${num}"]`);
    if (nextStep) {
        nextStep.classList.add('active');
        nextStep.style.display = 'block';
    }
}

// Form Submission with Strict Zip Block
const quizForm = document.getElementById('quizForm');
if (quizForm) {
    quizForm.addEventListener('submit', function(e) {
        const zip = document.getElementById('quizZip').value;
        const validation = validateZip(zip);
        
        if (validation.status === "none") {
            e.preventDefault(); // Stop the form from submitting
            alert("We apologize, but we do not currently offer services in your zip code (" + zip + ").");
        } else {
            e.preventDefault(); // Temporarily prevent submission to show success message
            alert("Success! Your " + quizData.type + " project request for " + quizData.service + " has been received.");
            // You can integrate web3forms here later!
        }
    });
}

// ==========================================
// 10. SCROLL PROGRESS BAR & SOCIAL TICKER
// ==========================================
window.addEventListener('scroll', function() {
    const winScroll = document.body.scrollTop || document.documentElement.scrollTop;
    const height = document.documentElement.scrollHeight - document.documentElement.clientHeight;
    const scrolled = (winScroll / height) * 100;
    const bar = document.getElementById("scroll-progress-bar");
    if (bar) bar.style.width = scrolled + "%";
});

const tickerPhrases = [
    "5.0 Rating | Recent 5-Star Review from Vicki L.",
    "Emergency Support available in Frederick, MD & DC",
    "Serving MD, D.C., DE, VA & PA since 2011"
];
let tickerIdx = 0;
setInterval(() => {
    const span = document.querySelector('.ticker-content span');
    if (span) {
        tickerIdx = (tickerIdx + 1) % tickerPhrases.length;
        span.style.opacity = 0;
        setTimeout(() => {
            span.innerText = tickerPhrases[tickerIdx];
            span.style.opacity = 1;
        }, 500);
    }
}, 6000);