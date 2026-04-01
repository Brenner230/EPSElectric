// ==========================================
// 1. UNIVERSAL HEADER FETCH & NAVIGATION
// ==========================================
document.addEventListener("DOMContentLoaded", function() {
    const headerPlaceholder = document.getElementById('header-placeholder');
    if (headerPlaceholder) {
        fetch('header.html')
            .then(response => response.text())
            .then(data => {
                headerPlaceholder.innerHTML = data;
                initializeNavigation(); 
            })
            .catch(error => console.error("Error loading header:", error));
    } else {
        initializeNavigation();
    }
});

function initializeNavigation() {
    const hamburger = document.getElementById('hamburger');
    const navMenu = document.getElementById('navMenu');
    if (hamburger && navMenu) {
        hamburger.addEventListener('click', () => {
            navMenu.classList.toggle('active');
            hamburger.innerHTML = navMenu.classList.contains('active') ? '✕' : '☰';
        });
    }
    const currentPage = window.location.pathname.split('/').pop() || 'index.html';
    const navLinks = document.querySelectorAll('.nav-menu a');
    navLinks.forEach(link => {
        if (link.getAttribute('href') === currentPage) link.classList.add('active-page');
        link.addEventListener('click', () => {
            if(navMenu) navMenu.classList.remove('active');
            if(hamburger) hamburger.innerHTML = '☰';
        });
    });
}

// ==========================================
// 3. STANDARD CONTACT FORM LOGIC 
// ==========================================
const phoneInputs = [document.getElementById('phone'), document.getElementById('quizPhone')];
phoneInputs.forEach(input => {
    if (input) {
        input.addEventListener('input', (e) => {
            let x = e.target.value.replace(/\D/g, '').match(/(\d{0,3})(\d{0,3})(\d{0,4})/);
            e.target.value = !x[2] ? x[1] : '(' + x[1] + ') ' + x[2] + (x[3] ? '-' + x[3] : '');
        });
    }
});

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
// 5. DYNAMIC MODAL SYSTEM
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
// 8. PORTFOLIO LIGHTBOX 
// ==========================================
document.addEventListener("DOMContentLoaded", function() {
    const portfolioImages = document.querySelectorAll('.portfolio-lightbox-trigger');
    if (portfolioImages.length > 0) {
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
const serviceAreaPrefixes = [
    "217", "208", "209", "210", "211", "212", "214", "207", 
    "200", "202", "203", "204", "205", 
    "201", "220", "221", "222", "223", "226", 
    "172", "173", "254",
    "215", "216", "218", "219", 
    "197", "198", "199", 
    "170", "171", "174", "175", "190", "193", 
    "224", "225", "227", "228" 
]; 

function validateZip(zip) {
    if (!zip || zip.length < 5) return { status: "none", msg: "Please enter a valid 5-digit zip code." };
    const prefix = zip.substring(0, 3);
    if (serviceAreaPrefixes.includes(prefix)) {
        return { status: "valid", msg: "✅ IN SERVICE AREA: We serve your location! Request your quote below." };
    } else {
        return { status: "none", msg: "❌ OUTSIDE SERVICE AREA: We currently do not serve this zip code." };
    }
}

// Homepage Quick Validator
const checkZipBtn = document.getElementById('checkZipBtn');
if (checkZipBtn) {
    checkZipBtn.addEventListener('click', () => {
        const zipInput = document.getElementById('zipInput');
        const resultDiv = document.getElementById('zipResult');
        const validation = validateZip(zipInput.value.trim());
        resultDiv.innerHTML = validation.msg;
        resultDiv.style.display = "block";
        resultDiv.style.background = validation.status === "valid" ? "#dcfce7" : "#fee2e2";
        resultDiv.style.color = validation.status === "valid" ? "#166534" : "#991b1b";
    });
}

// ----------------------------------------
// 5-Tier Quiz Logic with Validation
// ----------------------------------------
let quizData = { type: "", category: "", service: "" };
const quizSteps = document.querySelectorAll('.quiz-step');
const quizServices = document.getElementById('quiz-services');
const progressFill = document.getElementById('quizProgressFill');
const progressText = document.getElementById('quizProgressText');

const quizServiceData = {
    "Power & Infrastructure": ["Panel Upgrades & Heavy-Ups", "EV Charging Stations", "Whole-Home Generators", "Surge Protection", "Underground Wiring"],
    "Remodeling & Lifestyle": ["High-End Remodels", "Indoor Lighting", "Landscape & Security", "Hot Tub & Pool Wiring", "Smart Home & A/V", "Appliance Circuits"],
    "Safety & Historic Homes": ["Troubleshooting & Repair", "Safety Inspections", "Code Corrections", "Knob & Tube Replacement", "Aluminum Wiring Repair", "GFCI/AFCI Outlets", "Smoke/CO Detectors"]
};

const serviceUrlMap = {
    "Panel Upgrades & Heavy-Ups": "panel-upgrades.html",
    "EV Charging Stations": "ev-charger-installation.html",
    "Whole-Home Generators": "whole-home-generators.html",
    "Surge Protection": "whole-house-surge-protection.html",
    "Underground Wiring": "underground-wiring.html",
    "High-End Remodels": "high-end-remodels.html",
    "Indoor Lighting": "indoor-lighting-installation.html",
    "Landscape & Security": "landscape-security-lighting.html",
    "Hot Tub & Pool Wiring": "hot-tub-pool-wiring.html",
    "Troubleshooting & Repair": "electrical-troubleshooting-repair.html",
    "Safety Inspections": "electrical-safety-inspections.html",
    "Code Corrections": "electrical-code-corrections.html",
    "Knob & Tube Replacement": "knob-and-tube-replacement.html",
    "Aluminum Wiring Repair": "aluminum-wiring-repair.html",
    "GFCI/AFCI Outlets": "gfci-afci-outlet-installation.html",
    "Smoke/CO Detectors": "smoke-carbon-monoxide-detectors.html"
};

// Navigation Binding
document.querySelectorAll('.quiz-step:not([data-step="3"]):not([data-step="4"]):not([data-step="5"]) .quiz-opt').forEach(button => {
    button.addEventListener('click', function(e) {
        e.preventDefault();
        const stepNum = parseInt(this.closest('.quiz-step').dataset.step);
        if (stepNum === 1) { quizData.type = this.dataset.value; goToStep(2); } 
        else if (stepNum === 2) { quizData.category = this.dataset.value; populateQuizServices(this.dataset.value); goToStep(3); }
    });
});

document.querySelectorAll('.quiz-back-btn').forEach(btn => {
    btn.addEventListener('click', function(e) {
        e.preventDefault();
        hideInlineErrors(); // Clear errors on back
        goToStep(parseInt(this.closest('.quiz-step').dataset.step) - 1);
    });
});

function populateQuizServices(category) {
    if (quizServices) {
        quizServices.innerHTML = (quizServiceData[category] || []).map(opt => `<button class="quiz-opt" data-value="${opt}">${opt}</button>`).join('');
        quizServices.querySelectorAll('.quiz-opt').forEach(btn => {
            btn.addEventListener('click', function(e) {
                e.preventDefault();
                quizData.service = this.dataset.value;
                goToStep(4);
            });
        });
    }
}

function goToStep(num) {
    quizSteps.forEach(s => { s.classList.remove('active'); s.style.display = 'none'; });
    const targetStep = document.querySelector(`.quiz-step[data-step="${num}"]`);
    if (targetStep) { 
        targetStep.classList.add('active'); 
        targetStep.style.display = 'block'; 
        
        if(progressFill && progressText) {
            if(num === 5) {
                progressFill.style.width = "100%";
                progressFill.style.backgroundColor = "#16a34a"; 
                progressText.innerText = "Complete!";
            } else {
                progressFill.style.width = (num * 25) + "%";
                progressFill.style.backgroundColor = "var(--safety-orange)";
                progressText.innerText = `Step ${num} of 4`;
            }
        }
    }
}

// Validation Helpers
function isValidPhone(phone) { return phone.replace(/\D/g, '').length === 10; }
function isValidEmail(email) { return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email); }
function showInlineError(id, msg) {
    const el = document.getElementById(id);
    if(el) { el.innerText = msg; el.style.display = "block"; }
}
function hideInlineErrors() {
    document.querySelectorAll('.inline-error').forEach(el => el.style.display = "none");
    document.querySelectorAll('.quiz-input').forEach(el => el.classList.remove('input-error-state'));
}

// ----------------------------------------------------
// JSON WEB3FORMS CONNECTION FOR THE QUIZ (Bypasses Free Tier Error)
// ----------------------------------------------------
const quizForm = document.getElementById('quizForm');
if (quizForm) {
    quizForm.addEventListener('submit', function(e) {
        e.preventDefault();
        hideInlineErrors();
        let hasError = false;

        const phone = document.getElementById('quizPhone').value;
        const email = document.getElementById('quizEmail').value;
        const zip = document.getElementById('quizZip').value;

        if (!isValidPhone(phone)) {
            showInlineError('quizPhoneError', "Please enter a valid 10-digit phone number.");
            document.getElementById('quizPhone').classList.add('input-error-state');
            hasError = true;
        }
        if (!isValidEmail(email)) {
            showInlineError('quizEmailError', "Please enter a valid email address.");
            document.getElementById('quizEmail').classList.add('input-error-state');
            hasError = true;
        }
        const zipCheck = validateZip(zip);
        if (zipCheck.status === "none") {
            showInlineError('quizZipError', zipCheck.msg);
            document.getElementById('quizZip').classList.add('input-error-state');
            hasError = true;
        }

        if (hasError) return; // Halt submission

        const submitBtn = quizForm.querySelector('button[type="submit"]');
        const originalBtnText = submitBtn.innerHTML;
        submitBtn.innerHTML = 'Sending Request...';

        // Construct JSON Payload to bypass Web3Forms restrictions
        const formData = new FormData(quizForm);
        const object = Object.fromEntries(formData);
        object.Property_Type = quizData.type;
        object.Project_Category = quizData.category;
        object.Specific_Service_Requested = quizData.service;
        
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
            let jsonResponse = await response.json();
            if (response.status == 200) {
                const successText = document.getElementById('successMessageText');
                if (successText) {
                    successText.innerHTML = `Your <strong>${quizData.type}</strong> project request for <strong>${quizData.service}</strong> has been securely transmitted.`;
                }
                
                const dynLink = document.getElementById('dynamicServiceLink');
                if (dynLink && quizData.service) {
                    const mappedUrl = serviceUrlMap[quizData.service];
                    dynLink.href = mappedUrl || "index.html#services";
                    dynLink.innerText = `Read more about our ${quizData.service} process.`;
                }
                
                goToStep(5);
            } else {
                showInlineError('formGlobalError', jsonResponse.message || "Server error. Please try calling us at (443) 465-7769.");
            }
        })
        .catch(error => {
            showInlineError('formGlobalError', "Network error. Please check your connection or call us at (443) 465-7769.");
        })
        .finally(() => {
            submitBtn.innerHTML = originalBtnText;
        });
    });
}

const resetQuizBtn = document.getElementById('resetQuizBtn');
if (resetQuizBtn) {
    resetQuizBtn.addEventListener('click', function(e) {
        e.preventDefault();
        quizData = { type: "", category: "", service: "" };
        if (quizForm) quizForm.reset();
        hideInlineErrors();
        goToStep(1);
    });
}

// SCROLL PROGRESS BAR
window.addEventListener('scroll', function() {
    const winScroll = document.body.scrollTop || document.documentElement.scrollTop;
    const height = document.documentElement.scrollHeight - document.documentElement.clientHeight;
    const bar = document.getElementById("scroll-progress-bar");
    if (bar) bar.style.width = ((winScroll / height) * 100) + "%";
});

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