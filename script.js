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

    // Smooth Scrolling for Anchors
    document.querySelectorAll('a[href*="#"]:not(.modal-trigger)').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            const targetPath = this.pathname.replace(/^\//, '');
            const currentPath = location.pathname.replace(/^\//, '');
            
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
// 2. SHARED VALIDATION HELPERS
// ==========================================
// Auto-format phone numbers to (XXX) XXX-XXXX
const phoneInputs = [document.getElementById('contactPhone'), document.getElementById('quizPhone')];
phoneInputs.forEach(input => {
    if (input) {
        input.addEventListener('input', (e) => {
            let x = e.target.value.replace(/\D/g, '').match(/(\d{0,3})(\d{0,3})(\d{0,4})/);
            e.target.value = !x[2] ? x[1] : '(' + x[1] + ') ' + x[2] + (x[3] ? '-' + x[3] : '');
        });
    }
});

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

// ==========================================
// 3. STANDARD CONTACT FORM LOGIC (contact.html)
// ==========================================

// 1. Auto-format phone numbers safely
const contactPhoneInput = document.getElementById('contactPhone');
if (contactPhoneInput) {
    contactPhoneInput.addEventListener('input', (e) => {
        let x = e.target.value.replace(/\D/g, '').match(/(\d{0,3})(\d{0,3})(\d{0,4})/);
        e.target.value = !x[2] ? x[1] : '(' + x[1] + ') ' + x[2] + (x[3] ? '-' + x[3] : '');
    });
}

// 2. Dropdown Logic for Services
const categorySelect = document.getElementById('categorySelect');
const serviceSelect = document.getElementById('serviceSelect');

const contactServicesList = {
    "Residential": [
        "Panel Upgrades & Heavy-Ups", "EV Charging Stations", "Whole-Home Generators",
        "Surge Protection", "Underground Wiring", "High-End Remodels",
        "Indoor Lighting", "Landscape & Security", "Hot Tub & Pool Wiring",
        "Smart Home & A/V", "Appliance Circuits", "Troubleshooting & Repair",
        "Safety Inspections", "Code Corrections", "Knob & Tube Replacement",
        "Aluminum Wiring Repair", "GFCI/AFCI Outlets", "Smoke/CO Detectors"
    ],
    "Commercial": [
        "Commercial Troubleshooting", "Tenant Improvements", "Dedicated Circuits",
        "Commercial Lighting Retrofit", "Code Compliance Audit", "Service Contract Inquiry"
    ]
};

if (categorySelect && serviceSelect) {
    categorySelect.addEventListener('change', function() {
        const selectedCategory = this.value;
        serviceSelect.innerHTML = '<option value="">Select a Service...</option>';
        if (selectedCategory && contactServicesList[selectedCategory]) {
            serviceSelect.disabled = false;
            contactServicesList[selectedCategory].forEach(service => {
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

// 3. Main Form Submission & Validation
const leadForm = document.getElementById('leadForm');
const contactFormWrapper = document.getElementById('contactFormWrapper');
const contactSuccessWrapper = document.getElementById('contactSuccessWrapper');

// Self-contained map to prevent ReferenceErrors if Section 9 is missing
const contactUrlMap = {
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

if (leadForm) {
    leadForm.addEventListener('submit', function(e) {
        e.preventDefault();
        
        // Helper functions defined locally to ensure they never fail
        const setInlineError = (id, msg) => {
            const el = document.getElementById(id);
            if (el) { el.innerText = msg; el.style.display = "block"; }
        };
        const clearErrors = () => {
            document.querySelectorAll('.inline-error').forEach(el => el.style.display = "none");
            document.querySelectorAll('.quiz-input').forEach(el => el.classList.remove('input-error-state'));
        };

        clearErrors();
        let hasError = false;

        // Safely grab values
        const phoneEl = document.getElementById('contactPhone');
        const emailEl = document.getElementById('contactEmail');
        const zipEl = document.getElementById('contactZip');

        const phone = phoneEl ? phoneEl.value.replace(/\D/g, '') : "";
        const email = emailEl ? emailEl.value : "";
        const zip = zipEl ? zipEl.value.trim() : "";

        // Strict Validation
        if (phone.length !== 10) {
            setInlineError('contactPhoneError', "Please enter a valid 10-digit phone number.");
            if(phoneEl) phoneEl.classList.add('input-error-state');
            hasError = true;
        }
        
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) {
            setInlineError('contactEmailError', "Please enter a valid email address.");
            if(emailEl) emailEl.classList.add('input-error-state');
            hasError = true;
        }

        // Safely call global validateZip if it exists, otherwise do basic length check
        let zipCheckStatus = "valid";
        let zipCheckMsg = "";
        if (typeof validateZip === "function") {
            const result = validateZip(zip);
            zipCheckStatus = result.status;
            zipCheckMsg = result.msg;
        } else if (zip.length < 5) {
            zipCheckStatus = "none";
            zipCheckMsg = "Please enter a valid 5-digit zip code.";
        }

        if (zipCheckStatus === "none") {
            setInlineError('contactZipError', zipCheckMsg);
            if(zipEl) zipEl.classList.add('input-error-state');
            hasError = true;
        }

        // Stop submission if ANY errors were found
        if (hasError) return;

        // UI State Update
        const submitBtn = leadForm.querySelector('button[type="submit"]');
        const originalBtnText = submitBtn ? submitBtn.innerHTML : "Submit";
        if (submitBtn) submitBtn.innerHTML = 'Sending Request...';

        // Prepare Data for Web3Forms JSON bypass
        const formData = new FormData(leadForm);
        const object = Object.fromEntries(formData);
        const jsonPayload = JSON.stringify(object);

        fetch('https://api.web3forms.com/submit', {
            method: 'POST',
            headers: { 
                'Content-Type': 'application/json', 
                'Accept': 'application/json' 
            },
            body: jsonPayload
        })
        .then(async (response) => {
            let jsonResponse = await response.json();
            if (response.status == 200) {
                
                // Safely update Dynamic Link
                const dynContactLink = document.getElementById('dynamicContactServiceLink');
                const selectedService = serviceSelect ? serviceSelect.value : null;
                
                if (dynContactLink && selectedService && contactUrlMap[selectedService]) {
                    dynContactLink.href = contactUrlMap[selectedService];
                    dynContactLink.innerText = `Read more about our ${selectedService} process.`;
                }

                // Show Success Screen
                if (contactFormWrapper) contactFormWrapper.style.display = "none";
                if (contactSuccessWrapper) contactSuccessWrapper.style.display = "block";
                
            } else {
                setInlineError('formGlobalError', jsonResponse.message || "Server error. Please call (443) 465-7769.");
            }
        })
        .catch(error => {
            setInlineError('formGlobalError', "Network Error. Please check your connection or call (443) 465-7769.");
        })
        .finally(() => {
            if (submitBtn) submitBtn.innerHTML = originalBtnText;
        });
    });
}

// 4. Reset Button Logic
const resetContactBtn = document.getElementById('resetContactBtn');
if (resetContactBtn) {
    resetContactBtn.addEventListener('click', (e) => {
        e.preventDefault();
        if (leadForm) leadForm.reset();
        
        if(serviceSelect) {
            serviceSelect.innerHTML = '<option value="">Select a Service...</option>';
            serviceSelect.disabled = true;
        }
        
        if (contactSuccessWrapper) contactSuccessWrapper.style.display = "none";
        if (contactFormWrapper) contactFormWrapper.style.display = "block";
        
        // Ensure errors are cleared on reset
        document.querySelectorAll('.inline-error').forEach(el => el.style.display = "none");
        document.querySelectorAll('.quiz-input').forEach(el => el.classList.remove('input-error-state'));
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
    "215", "216", "218", "219", "197", "198", "199", 
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

// Global Validation Helpers
function isValidPhone(phone) { return phone && phone.replace(/\D/g, '').length === 10; }
function isValidEmail(email) { return email && /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email); }

function showInlineError(id, msg) {
    const el = document.getElementById(id);
    if(el) { el.innerText = msg; el.style.display = "block"; }
}
function hideInlineErrors() {
    document.querySelectorAll('.inline-error').forEach(el => el.style.display = "none");
    document.querySelectorAll('.quiz-input').forEach(el => el.classList.remove('input-error-state'));
}

// Homepage Quick Validator Tool
const checkZipBtn = document.getElementById('checkZipBtn');
if (checkZipBtn) {
    checkZipBtn.addEventListener('click', (e) => {
        e.preventDefault(); // Prevents page jump
        const zipInput = document.getElementById('zipInput');
        const resultDiv = document.getElementById('zipResult');
        if (zipInput && resultDiv) {
            const validation = validateZip(zipInput.value.trim());
            resultDiv.innerHTML = validation.msg;
            resultDiv.style.display = "block";
            resultDiv.style.background = validation.status === "valid" ? "#dcfce7" : "#fee2e2";
            resultDiv.style.color = validation.status === "valid" ? "#166534" : "#991b1b";
        }
    });
}

// ----------------------------------------
// 5-Tier Quiz Logic (Wrapped for Safety)
// ----------------------------------------
const quizContainer = document.getElementById('project-quiz');

if (quizContainer) { // ONLY run this code if the quiz exists on the page
    
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

    function populateQuizServices(category) {
        if (quizServices) {
            quizServices.innerHTML = (quizServiceData[category] || []).map(opt => `<button class="quiz-opt" data-value="${opt}"><i class="fa-solid fa-bolt"></i> ${opt}</button>`).join('');
            quizServices.querySelectorAll('.quiz-opt').forEach(btn => {
                btn.addEventListener('click', function(e) {
                    e.preventDefault();
                    quizData.service = this.dataset.value;
                    goToStep(4);
                });
            });
        }
    }

    // Step 1 & 2 Forward Navigation
    document.querySelectorAll('.quiz-step:not([data-step="3"]):not([data-step="4"]):not([data-step="5"]) .quiz-opt').forEach(button => {
        button.addEventListener('click', function(e) {
            e.preventDefault();
            const stepNum = parseInt(this.closest('.quiz-step').dataset.step);
            if (stepNum === 1) { 
                quizData.type = this.dataset.value; 
                goToStep(2); 
            } else if (stepNum === 2) { 
                quizData.category = this.dataset.value; 
                populateQuizServices(this.dataset.value); 
                goToStep(3); 
            }
        });
    });

    // Back Button Navigation
    document.querySelectorAll('.quiz-back-btn').forEach(btn => {
        btn.addEventListener('click', function(e) {
            e.preventDefault();
            hideInlineErrors(); 
            goToStep(parseInt(this.closest('.quiz-step').dataset.step) - 1);
        });
    });

    // Form Submission via JSON (Bypasses Free Tier Restrictions & Passes Honeypot)
    const quizForm = document.getElementById('quizForm');
    if (quizForm) {
        quizForm.addEventListener('submit', function(e) {
            e.preventDefault();
            hideInlineErrors();
            let hasError = false;

            const phoneEl = document.getElementById('quizPhone');
            const emailEl = document.getElementById('quizEmail');
            const zipEl = document.getElementById('quizZip');

            const phone = phoneEl ? phoneEl.value : "";
            const email = emailEl ? emailEl.value : "";
            const zip = zipEl ? zipEl.value : "";

            if (!isValidPhone(phone)) {
                showInlineError('quizPhoneError', "Please enter a valid 10-digit phone number.");
                if(phoneEl) phoneEl.classList.add('input-error-state');
                hasError = true;
            }
            if (!isValidEmail(email)) {
                showInlineError('quizEmailError', "Please enter a valid email address.");
                if(emailEl) emailEl.classList.add('input-error-state');
                hasError = true;
            }
            const zipCheck = validateZip(zip);
            if (zipCheck.status === "none") {
                showInlineError('quizZipError', zipCheck.msg);
                if(zipEl) zipEl.classList.add('input-error-state');
                hasError = true;
            }

            if (hasError) return; 

            const submitBtn = quizForm.querySelector('button[type="submit"]');
            const originalBtnText = submitBtn ? submitBtn.innerHTML : "Submit";
            if(submitBtn) submitBtn.innerHTML = 'Sending Request...';

            const formData = new FormData(quizForm);
            const object = Object.fromEntries(formData);
            
            object.Property_Type = quizData.type;
            object.Project_Category = quizData.category;
            object.Specific_Service_Requested = quizData.service;
            
            const jsonPayload = JSON.stringify(object);

            fetch('https://api.web3forms.com/submit', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Accept': 'application/json'
                },
                body: jsonPayload 
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
                if(submitBtn) submitBtn.innerHTML = originalBtnText;
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
} // End of Quiz Logic wrapper

// ==========================================
// 10. SCROLL PROGRESS BAR & SOCIAL TICKER
// ==========================================

// Scroll Progress Bar
window.addEventListener('scroll', function() {
    const winScroll = document.body.scrollTop || document.documentElement.scrollTop;
    const height = document.documentElement.scrollHeight - document.documentElement.clientHeight;
    const bar = document.getElementById("scroll-progress-bar");
    if (bar && height > 0) {
        bar.style.width = ((winScroll / height) * 100) + "%";
    }
});

// Social Ticker (Defensively Programmed)
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
        span.style.opacity = 0; // Fade out
        
        setTimeout(() => {
            if (span) { // Double check it still exists before updating
                span.innerText = tickerPhrases[tickerIdx];
                span.style.opacity = 1; // Fade in
            }
        }, 500); // Wait for CSS fade transition
    }
}, 6000);