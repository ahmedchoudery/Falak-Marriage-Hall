document.addEventListener('DOMContentLoaded', () => {
    // --- Phase 3: Global Variables ---
    const body = document.body;
    const header = document.getElementById('header');
    const progressBar = document.getElementById('progress-bar');
    const stickyCTA = document.getElementById('sticky-cta');
    const themeToggle = document.getElementById('theme-toggle');
    const preloader = document.getElementById('preloader');

    // --- 1. Theme Toggle Logic ---
    if (themeToggle) {
        const icon = themeToggle.querySelector('i');
        const savedTheme = localStorage.getItem('theme') || 'light';
        body.setAttribute('data-theme', savedTheme);
        updateThemeIcon(savedTheme);

        themeToggle.addEventListener('click', () => {
            const currentTheme = body.getAttribute('data-theme');
            const newTheme = currentTheme === 'light' ? 'dark' : 'light';
            body.setAttribute('data-theme', newTheme);
            localStorage.setItem('theme', newTheme);
            updateThemeIcon(newTheme);
        });

        function updateThemeIcon(theme) {
            if (theme === 'dark') {
                icon.classList.replace('fa-moon', 'fa-sun');
            } else {
                icon.classList.replace('fa-sun', 'fa-moon');
            }
        }
    }

    // --- 2. Preloader & Entrance Animation ---
    window.addEventListener('load', () => {
        if (preloader) {
            preloader.style.opacity = '0';
            setTimeout(() => {
                preloader.style.display = 'none';
                startEntranceAnimation();
            }, 600);
        }
    });

    function startEntranceAnimation() {
        const heroTitle = document.querySelector('.hero-content h1');
        const heroText = document.querySelector('.hero-content p');
        const heroBtns = document.querySelector('.hero-btns');

        if (heroTitle) heroTitle.style.animation = 'fadeUp 1.5s forwards';
        if (heroText) heroText.style.animation = 'fadeUp 1.5s forwards 0.3s';
        if (heroBtns) heroBtns.style.animation = 'fadeUp 1.5s forwards 0.6s';

        const activeSlide = document.querySelector('.slide.active');
        if (activeSlide) {
            activeSlide.style.transition = 'transform 10s ease-out';
            activeSlide.style.transform = 'scale(1.1)';
        }
    }

    // --- 3. Scroll Interactions (Progress, Header, CTA, Active Links) ---
    const sections = document.querySelectorAll('section');
    const navLinks = document.querySelectorAll('.nav-links a');

    window.addEventListener('scroll', () => {
        const winScroll = document.body.scrollTop || document.documentElement.scrollTop;
        const height = document.documentElement.scrollHeight - document.documentElement.clientHeight;
        const scrolled = (winScroll / height) * 100;

        // Progress Bar
        if (progressBar) progressBar.style.width = scrolled + "%";

        // Header Style
        if (header) {
            if (window.scrollY > 50) header.classList.add('scrolled');
            else header.classList.remove('scrolled');
        }

        // Sticky CTA Visibility
        if (stickyCTA) {
            if (window.scrollY > 500) stickyCTA.classList.add('visible');
            else stickyCTA.classList.remove('visible');
        }

        // Active Link Highlighting
        let current = '';
        sections.forEach(section => {
            const sectionTop = section.offsetTop;
            if (window.scrollY >= (sectionTop - 150)) {
                current = section.getAttribute('id');
            }
        });

        navLinks.forEach(link => {
            link.classList.remove('active');
            if (link.getAttribute('href').includes(current)) {
                link.classList.add('active');
            }
        });
    });

    // --- 4. Smooth Scrolling ---
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const targetId = this.getAttribute('href');
            if (targetId === '#') return;
            const targetElement = document.querySelector(targetId);
            if (targetElement) {
                window.scrollTo({
                    top: targetElement.offsetTop - 80,
                    behavior: 'smooth'
                });
                // Close mobile menu if open
                const nav = document.querySelector('.nav-links');
                const menuToggle = document.getElementById('mobile-menu');
                if (nav && nav.classList.contains('active')) {
                    nav.classList.remove('active');
                    if (menuToggle) menuToggle.innerHTML = '<i class="fas fa-bars"></i>';
                }
            }
        });
    });

    // --- 5. Mobile Menu Toggle ---
    const menuToggle = document.getElementById('mobile-menu');
    const nav = document.querySelector('.nav-links');
    if (menuToggle && nav) {
        menuToggle.addEventListener('click', () => {
            nav.classList.toggle('active');
            const isOpen = nav.classList.contains('active');
            menuToggle.innerHTML = isOpen ? '<i class="fas fa-times"></i>' : '<i class="fas fa-bars"></i>';
        });
    }

    // --- 6. Hero Slider Logic ---
    const slides = document.querySelectorAll('.slide');
    const prevBtn = document.querySelector('.prev');
    const nextBtn = document.querySelector('.next');
    const dotsContainer = document.querySelector('.slider-dots');
    let currentSlide = 0;
    let slideInterval;

    if (slides.length > 0 && dotsContainer) {
        slides.forEach((_, i) => {
            const dot = document.createElement('div');
            dot.classList.add('dot');
            if (i === 0) dot.classList.add('active');
            dot.addEventListener('click', () => goToSlide(i));
            dotsContainer.appendChild(dot);
        });

        const dots = document.querySelectorAll('.dot');

        function updateSlider() {
            slides.forEach(slide => {
                slide.classList.remove('active');
                slide.style.transform = 'scale(1)';
            });
            dots.forEach(dot => dot.classList.remove('active'));
            slides[currentSlide].classList.add('active');
            dots[currentSlide].classList.add('active');

            setTimeout(() => {
                slides[currentSlide].style.transition = 'transform 10s ease-out';
                slides[currentSlide].style.transform = 'scale(1.1)';
            }, 100);
        }

        function nextSlide() { currentSlide = (currentSlide + 1) % slides.length; updateSlider(); }
        function prevSlide() { currentSlide = (currentSlide - 1 + slides.length) % slides.length; updateSlider(); }
        function goToSlide(n) { currentSlide = n; updateSlider(); resetTimer(); }
        function startTimer() { slideInterval = setInterval(nextSlide, 5000); }
        function resetTimer() { clearInterval(slideInterval); startTimer(); }

        if (nextBtn) nextBtn.addEventListener('click', () => { nextSlide(); resetTimer(); });
        if (prevBtn) prevBtn.addEventListener('click', () => { prevSlide(); resetTimer(); });
        startTimer();
    }

    // --- 7. Before/After Slider ---
    const sliderHandle = document.getElementById('slider-handle');
    const afterImg = document.getElementById('after-img');
    const comparisonContainer = document.querySelector('.comparison-container');

    if (sliderHandle && comparisonContainer && afterImg) {
        let isDragging = false;
        const moveSlider = (e) => {
            if (!isDragging) return;
            const rect = comparisonContainer.getBoundingClientRect();
            let x = (e.pageX || (e.touches ? e.touches[0].pageX : 0)) - rect.left;
            let containerWidth = comparisonContainer.offsetWidth;
            if (x < 0) x = 0;
            if (x > containerWidth) x = containerWidth;
            let percentage = (x / containerWidth) * 100;
            sliderHandle.style.left = percentage + "%";
            afterImg.style.width = percentage + "%";
        };

        sliderHandle.addEventListener('mousedown', () => isDragging = true);
        sliderHandle.addEventListener('touchstart', () => isDragging = true);
        window.addEventListener('mouseup', () => isDragging = false);
        window.addEventListener('touchend', () => isDragging = false);
        window.addEventListener('mousemove', moveSlider);
        window.addEventListener('touchmove', moveSlider);
    }

    // --- 8. Scroll Reveal & Numbers ---
    const revealElements = document.querySelectorAll('.reveal');
    const numberElements = document.querySelectorAll('.number');

    const sectionObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('active');
                if (entry.target.classList.contains('number')) animateNumber(entry.target);
            }
        });
    }, { threshold: 0.1, rootMargin: '0px 0px -50px 0px' });

    revealElements.forEach(el => sectionObserver.observe(el));
    numberElements.forEach(el => sectionObserver.observe(el));

    function animateNumber(el) {
        const target = parseInt(el.getAttribute('data-target'));
        const duration = 2000;
        const step = target / (duration / 16);
        let current = 0;
        const timer = setInterval(() => {
            current += step;
            if (current >= target) {
                el.innerText = target + (target === 100 ? '%' : '+');
                clearInterval(timer);
            } else {
                el.innerText = Math.floor(current);
            }
        }, 16);
    }

    // --- 9. Testimonial Slider ---
    const testimonials = document.querySelectorAll('.testimonial-card');
    let currentTestimonial = 0;
    if (testimonials.length > 0) {
        function showTestimonial(index) {
            testimonials.forEach(t => t.classList.remove('active'));
            testimonials[index].classList.add('active');
        }
        setInterval(() => {
            currentTestimonial = (currentTestimonial + 1) % testimonials.length;
            showTestimonial(currentTestimonial);
        }, 5000);
        showTestimonial(0);
    }

    // --- 10. Lightbox Modal ---
    const galleryImages = document.querySelectorAll('.gallery-item img');
    galleryImages.forEach(img => {
        img.addEventListener('click', () => {
            const lightbox = document.createElement('div');
            lightbox.className = 'lightbox-active';
            lightbox.innerHTML = `
                <div class="lightbox-content">
                    <img src="${img.src}" alt="Gallery Image">
                    <span class="close-lightbox">&times;</span>
                </div>
            `;
            document.body.appendChild(lightbox);
            lightbox.querySelector('.close-lightbox').addEventListener('click', () => {
                document.body.removeChild(lightbox);
            });
            lightbox.addEventListener('click', (e) => {
                if (e.target === lightbox) document.body.removeChild(lightbox);
            });
        });
    });

    // --- 11. Booking Form Logic ---
    const bookingForm = document.getElementById('bookingForm');
    if (bookingForm) {
        bookingForm.addEventListener('submit', async (e) => {
            e.preventDefault();
            const submitBtn = bookingForm.querySelector('button[type="submit"]');
            const originalText = submitBtn.innerText;
            submitBtn.innerText = 'Processing...';
            submitBtn.disabled = true;

            const formData = new FormData(bookingForm);
            const data = Object.fromEntries(formData.entries());

            try {
                const response = await fetch('/api/booking', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(data)
                });
                const result = await response.json();
                if (result.success) {
                    alert('Success! Your booking enquiry has been sent.');
                    bookingForm.reset();
                } else {
                    alert('Error: ' + result.message);
                }
            } catch (error) {
                alert('Connection error. Please try again later.');
            } finally {
                submitBtn.innerText = originalText;
                submitBtn.disabled = false;
            }
        });
    }
});
