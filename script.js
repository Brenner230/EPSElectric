// ==========================================
// 1. UNIVERSAL HEADER/FOOTER FETCH & NAVIGATION
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

    const footerPlaceholder = document.getElementById('footer-placeholder');
    if (footerPlaceholder) {
        fetch('footer.html')
            .then(response => response.text())
            .then(data => {
                footerPlaceholder.innerHTML = data;
                initializeFooterFeatures(); 
            })
            .catch(error => console.error("Error loading footer:", error));
    } else {
        initializeFooterFeatures();
    }
});

function initializeNavigation() {
    const hamburger = document.getElementById('hamburger');
    const navMenu = document.getElementById('navMenu');
    
    // Main Hamburger Toggle
    if (hamburger && navMenu) {
        hamburger.addEventListener('click', () => {
            navMenu.classList.toggle('active');
            hamburger.innerHTML = navMenu.classList.contains('active') ? '✕' : '☰';
        });
    }

    // Double Dropdown Logic for Mobile Categories
    const categoryHeaders = document.querySelectorAll('.dropdown-header');
    categoryHeaders.forEach(header => {
        header.addEventListener('click', function(e) {
            if (window.innerWidth <= 768) {
                e.preventDefault();
                e.stopPropagation();
                const parentColumn = this.parentElement;
                
                // Close other open categories
                document.querySelectorAll('.dropdown-column').forEach(col => {
                    if (col !== parentColumn) col.classList.remove('sub-open');
                });
                
                // Toggle the clicked category
                parentColumn.classList.toggle('sub-open');
            }
        });
    });

    // Handle normal links
    const currentPage = window.location.pathname.split('/').pop() || 'index.html';
    const navLinks = document.querySelectorAll('.nav-menu a:not(.dropdown-header)');
    navLinks.forEach(link => {
        if (link.getAttribute('href') === currentPage) link.classList.add('active-page');
        
        link.addEventListener('click', (e) => {
            // Main "Services" dropdown toggle for mobile
            if (window.innerWidth <= 768 && link.parentElement.classList.contains('has-dropdown')) {
                e.preventDefault(); 
                link.parentElement.classList.toggle('mobile-open');
                const icon = link.querySelector('i');
                if(icon) icon.style.transform = link.parentElement.classList.contains('mobile-open') ? 'rotate(180deg)' : 'rotate(0deg)';
                return; 
            }
            
            // Close menu when a real link is clicked
            if(navMenu) navMenu.classList.remove('active');
            if(hamburger) hamburger.innerHTML = '☰';
        });
    });
}

function initializeFooterFeatures() {
    const vCardBtns = document.querySelectorAll('.vcard-download-btn');
    vCardBtns.forEach(btn => {
        btn.addEventListener('click', (e) => {
            e.preventDefault();
            const vcardData = `BEGIN:VCARD\nVERSION:3.0\nN:Solutions;Eminent Power;;;\nFN:Eminent Power Solutions (EPS)\nORG:Eminent Power Solutions LLC\nTEL;TYPE=WORK,VOICE:(443) 465-7769\nEMAIL:service@epsdmv.com\nURL:https://epsdmv.com\nPHOTO;VALUE=URI:https://epsdmv.com/images/eps-logo.jpg\nEND:VCARD`;
            const blob = new Blob([vcardData], { type: "text/vcard" });
            const url = URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            a.download = "Eminent_Power_Solutions.vcf";
            document.body.appendChild(a);
            a.click();
            document.body.removeChild(a);
            URL.revokeObjectURL(url);
        });
    });
}

// ==========================================
// 2. GLOBAL UTILITIES, DATA & VALIDATION
// ==========================================

// Shared Service to URL Map
const globalServiceUrlMap = {
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

// Auto-format phone numbers
const phoneInputs = [document.getElementById('contactPhone'), document.getElementById('quizPhone')];
phoneInputs.forEach(input => {
    if (input) {
        input.addEventListener('input', (e) => {
            let x = e.target.value.replace(/\D/g, '').match(/(\d{0,3})(\d{0,3})(\d{0,4})/);
            e.target.value = !x[2] ? x[1] : '(' + x[1] + ') ' + x[2] + (x[3] ? '-' + x[3] : '');
        });
    }
});

// Shared Validation Functions
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

// Zip Code Validation Logic
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

// Homepage Quick Zip Validator Tool
const checkZipBtn = document.getElementById('checkZipBtn');
if (checkZipBtn) {
    checkZipBtn.addEventListener('click', (e) => {
        e.preventDefault(); 
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

// ==========================================
// 3. STANDARD CONTACT FORM LOGIC (contact.html)
// ==========================================
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

const leadForm = document.getElementById('leadForm');
const contactFormWrapper = document.getElementById('contactFormWrapper');
const contactSuccessWrapper = document.getElementById('contactSuccessWrapper');

if (leadForm) {
    leadForm.addEventListener('submit', function(e) {
        e.preventDefault();
        hideInlineErrors();
        let hasError = false;

        const phoneEl = document.getElementById('contactPhone');
        const emailEl = document.getElementById('contactEmail');
        const zipEl = document.getElementById('contactZip');

        const phone = phoneEl ? phoneEl.value.replace(/\D/g, '') : "";
        const email = emailEl ? emailEl.value : "";
        const zip = zipEl ? zipEl.value.trim() : "";

        if (!isValidPhone(phone)) {
            showInlineError('contactPhoneError', "Please enter a valid 10-digit phone number.");
            if(phoneEl) phoneEl.classList.add('input-error-state');
            hasError = true;
        }
        
        if (!isValidEmail(email)) {
            showInlineError('contactEmailError', "Please enter a valid email address.");
            if(emailEl) emailEl.classList.add('input-error-state');
            hasError = true;
        }

        const zipCheck = validateZip(zip);
        if (zipCheck.status === "none") {
            showInlineError('contactZipError', zipCheck.msg);
            if(zipEl) zipEl.classList.add('input-error-state');
            hasError = true;
        }

        if (hasError) return;

        const submitBtn = leadForm.querySelector('button[type="submit"]');
        const originalBtnText = submitBtn ? submitBtn.innerHTML : "Submit";
        if (submitBtn) submitBtn.innerHTML = 'Sending Request...';

        const formData = new FormData(leadForm);
        const object = Object.fromEntries(formData);
        const jsonPayload = JSON.stringify(object);

        fetch('https://api.web3forms.com/submit', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json', 'Accept': 'application/json' },
            body: jsonPayload
        })
        .then(async (response) => {
            let jsonResponse = await response.json();
            if (response.status == 200) {
                const dynContactLink = document.getElementById('dynamicContactServiceLink');
                const selectedService = serviceSelect ? serviceSelect.value : null;
                
                if (dynContactLink && selectedService && globalServiceUrlMap[selectedService]) {
                    dynContactLink.href = globalServiceUrlMap[selectedService];
                    dynContactLink.innerText = `Read more about our ${selectedService} process.`;
                }

                if (contactFormWrapper) contactFormWrapper.style.display = "none";
                if (contactSuccessWrapper) contactSuccessWrapper.style.display = "block";
            } else {
                showInlineError('formGlobalError', jsonResponse.message || "Server error. Please call (443) 465-7769.");
            }
        })
        .catch(error => {
            showInlineError('formGlobalError', "Network Error. Please check your connection or call (443) 465-7769.");
        })
        .finally(() => {
            if (submitBtn) submitBtn.innerHTML = originalBtnText;
        });
    });
}

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
        hideInlineErrors();
    });
}

// ==========================================
// 4. PREMIUM QUIZ WIDGET LOGIC
// ==========================================
const quizContainer = document.getElementById('project-quiz');

if (quizContainer) { 
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

    document.querySelectorAll('.quiz-back-btn').forEach(btn => {
        btn.addEventListener('click', function(e) {
            e.preventDefault();
            hideInlineErrors(); 
            goToStep(parseInt(this.closest('.quiz-step').dataset.step) - 1);
        });
    });

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
                headers: { 'Content-Type': 'application/json', 'Accept': 'application/json' },
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
                        const mappedUrl = globalServiceUrlMap[quizData.service];
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
}

// ==========================================
// 5. TESTIMONIAL CAROUSEL ENGINE
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
// 6. DYNAMIC MODAL & FAQ SYSTEM
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
// 7. COOKIE CONSENT LOGIC
// ==========================================
document.addEventListener("DOMContentLoaded", function() {
    const cookieBanner = document.getElementById('cookieBanner');
    const acceptCookiesBtn = document.getElementById('acceptCookies');

    if (cookieBanner && acceptCookiesBtn) {
        if (!localStorage.getItem('cookieConsent')) {
            setTimeout(() => { cookieBanner.classList.add('show'); }, 1500);
        }
        acceptCookiesBtn.addEventListener('click', () => {
            localStorage.setItem('cookieConsent', 'true');
            cookieBanner.classList.remove('show');
        });
    }
});

// ==========================================
// 8. ADVANCED INTERACTIVE SERVICE AREA MAP 
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
            color: '#0B2046', weight: 2, dashArray: '5, 5', 
            fillColor: '#FF6600', fillOpacity: 0.15, radius: 135000 
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
                        return { color: '#0B2046', weight: 2, fillColor: '#FF6600', fillOpacity: 0.55 };
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
// 9. PORTFOLIO LOGIC (Lightbox, Filters, Drawers)
// ==========================================
document.addEventListener("DOMContentLoaded", function() {
    
    // Lightbox Logic
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

    // Filter Logic
    const filterBtns = document.querySelectorAll('.filter-btn');
    const portCards = document.querySelectorAll('.port-card');

    if(filterBtns.length > 0) {
        filterBtns.forEach(btn => {
            btn.addEventListener('click', () => {
                filterBtns.forEach(b => b.classList.remove('active'));
                btn.classList.add('active');
                const filterValue = btn.getAttribute('data-filter');
                portCards.forEach(card => {
                    if (filterValue === 'all' || card.getAttribute('data-category').includes(filterValue)) {
                        card.classList.remove('hide');
                    } else {
                        card.classList.add('hide');
                    }
                });
            });
        });
    }

    // Expandable Details Logic
    const toggleBtns = document.querySelectorAll('.toggle-drawer-btn');
    toggleBtns.forEach(btn => {
        btn.addEventListener('click', function() {
            const drawer = this.previousElementSibling; 
            if (drawer.classList.contains('open')) {
                drawer.classList.remove('open');
                this.innerHTML = 'View Scope & Details <i class="fa-solid fa-chevron-down" style="margin-left: 5px;"></i>';
            } else {
                drawer.classList.add('open');
                this.innerHTML = 'Close Details <i class="fa-solid fa-chevron-up" style="margin-left: 5px;"></i>';
            }
        });
    });
});

// ==========================================
// 10. UI ENHANCEMENTS (Scroll, Ticker, Flip Cards)
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

// Social Ticker
const tickerPhrases = [
    "5.0 Rating | Recent 5-Star Review from Vicki L.",
    "Emergency Support available in Frederick, MD & DC",
    "Serving MD, D.C., DE, VA, WV & PA since 2011"
];
let tickerIdx = 0;

setInterval(() => {
    const span = document.querySelector('.ticker-content span');
    if (span) {
        tickerIdx = (tickerIdx + 1) % tickerPhrases.length;
        span.style.opacity = 0; 
        setTimeout(() => {
            if (span) { 
                span.innerText = tickerPhrases[tickerIdx];
                span.style.opacity = 1; 
            }
        }, 500); 
    }
}, 6000);

// Flip Card Mobile Tap Logic
document.addEventListener("DOMContentLoaded", function() {
    document.querySelectorAll('.flip-card').forEach(card => {
        card.addEventListener('click', function() {
            this.classList.toggle('flipped');
        });
    });
});

// ==========================================
// 11. INTERACTIVE TABS & MOBILE LOGIC (SERVICE PAGES)
// ==========================================
document.addEventListener("DOMContentLoaded", function() {
    const tabBtns = document.querySelectorAll('.tab-btn');
    const tabPanes = document.querySelectorAll('.tab-pane');
    const header = document.querySelector('.site-header');
    const tabContainer = document.querySelector('.tab-buttons');

    // 1. Dynamic Sticky Seal
    // Calculates the exact height of your header and seals the tabs directly beneath it 
    // so no scrolling text bleeds through the gap.
    if (header && tabContainer && window.innerWidth <= 768) {
        tabContainer.style.top = header.offsetHeight + 'px';
    }

    // 2. Tab Clicking & Auto-Scroll
    if (tabBtns.length > 0) {
        tabBtns.forEach(btn => {
            btn.addEventListener('click', () => {
                // Reset state
                tabBtns.forEach(b => b.classList.remove('active'));
                tabPanes.forEach(p => p.classList.remove('active'));

                // Set active
                btn.classList.add('active');
                const targetId = btn.getAttribute('data-target');
                const targetPane = document.getElementById(targetId);
                
                if (targetPane) {
                    targetPane.classList.add('active');
                    
                    // UX Fix: Auto-scroll content up to the bottom of the sticky tabs
                    if (window.innerWidth <= 768) {
                        const headerHeight = header ? header.offsetHeight : 68;
                        const tabsHeight = tabContainer ? tabContainer.offsetHeight : 60;
                        const elementPosition = targetPane.getBoundingClientRect().top;
                        
                        window.scrollTo({
                            top: elementPosition + window.pageYOffset - headerHeight - tabsHeight - 10,
                            behavior: "smooth"
                        });
                    }
                }
            });
        });
    }

    // 3. Double Dropdown Mobile Menu Logic
    const categoryHeaders = document.querySelectorAll('.dropdown-header');
    categoryHeaders.forEach(catHeader => {
        catHeader.addEventListener('click', function(e) {
            if (window.innerWidth <= 768) {
                e.preventDefault();
                e.stopPropagation();
                const parentColumn = this.parentElement;
                
                // Close other open categories to keep the menu short
                document.querySelectorAll('.dropdown-column').forEach(col => {
                    if (col !== parentColumn) col.classList.remove('sub-open');
                });
                
                // Toggle the clicked category
                parentColumn.classList.toggle('sub-open');
            }
        });
    });
});