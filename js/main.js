/**
 * YoTeCuido - Landing Page Scripts
 */

(function () {
    'use strict';

    /* ---------- DOM Elements ---------- */
    const header = document.getElementById('header');
    const hamburger = document.getElementById('hamburger');
    const nav = document.getElementById('nav');
    const navLinks = nav ? nav.querySelectorAll('.header__nav-link') : [];
    const currentYearEl = document.getElementById('current-year');

    /* ---------- Mobile Menu ---------- */
    function openMenu() {
        hamburger.classList.add('active');
        hamburger.setAttribute('aria-expanded', 'true');
        nav.classList.add('active');
        document.body.classList.add('menu-open');
    }

    function closeMenu() {
        hamburger.classList.remove('active');
        hamburger.setAttribute('aria-expanded', 'false');
        nav.classList.remove('active');
        document.body.classList.remove('menu-open');
    }

    function toggleMenu() {
        if (nav.classList.contains('active')) {
            closeMenu();
        } else {
            openMenu();
        }
    }

    if (hamburger) {
        hamburger.addEventListener('click', toggleMenu);
    }

    navLinks.forEach(function (link) {
        link.addEventListener('click', closeMenu);
    });

    /* ---------- Header Scroll Effect ---------- */
    function handleHeaderScroll() {
        if (window.scrollY > 10) {
            header.classList.add('scrolled');
        } else {
            header.classList.remove('scrolled');
        }
    }

    window.addEventListener('scroll', handleHeaderScroll, { passive: true });
    handleHeaderScroll();

    /* ---------- Smooth Scrolling ---------- */
    document.querySelectorAll('a[href^="#"]').forEach(function (anchor) {
        anchor.addEventListener('click', function (e) {
            var targetId = this.getAttribute('href');
            if (targetId === '#') return;

            var targetEl = document.querySelector(targetId);
            if (targetEl) {
                e.preventDefault();
                var headerHeight = header.offsetHeight;
                var targetPosition = targetEl.getBoundingClientRect().top + window.scrollY - headerHeight;

                window.scrollTo({
                    top: targetPosition,
                    behavior: 'smooth'
                });
            }
        });
    });

    /* ---------- IntersectionObserver - Animate on Scroll ---------- */
    function setupAnimations() {
        if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
            document.querySelectorAll('.animate-on-scroll').forEach(function (el) {
                el.classList.add('visible');
            });
            return;
        }

        var observerOptions = {
            root: null,
            rootMargin: '0px 0px -60px 0px',
            threshold: 0.1
        };

        var observer = new IntersectionObserver(function (entries) {
            entries.forEach(function (entry) {
                if (entry.isIntersecting) {
                    entry.target.classList.add('visible');
                    observer.unobserve(entry.target);
                }
            });
        }, observerOptions);

        document.querySelectorAll('.animate-on-scroll').forEach(function (el) {
            observer.observe(el);
        });
    }

    setupAnimations();

    /* ---------- Footer Year ---------- */
    if (currentYearEl) {
        currentYearEl.textContent = new Date().getFullYear();
    }

    /* ---------- Testimonial Slider ---------- */
    function setupTestimonialSlider() {
        var track = document.querySelector('.testimonial__track');
        var dots = document.querySelectorAll('.testimonial__dot');
        var slider = document.querySelector('.testimonial__slider');

        if (!track || !dots.length || !slider) return;

        var totalSlides = dots.length;
        var currentSlide = 0;
        var autoPlayInterval = null;
        var autoPlayDelay = 5000;
        var isPaused = false;

        function goToSlide(index) {
            currentSlide = index;
            track.style.transform = 'translateX(-' + (currentSlide * 100) + '%)';

            dots.forEach(function (dot, i) {
                var isActive = i === currentSlide;
                dot.classList.toggle('active', isActive);
                dot.setAttribute('aria-selected', isActive ? 'true' : 'false');
            });
        }

        function nextSlide() {
            var next = (currentSlide + 1) % totalSlides;
            goToSlide(next);
        }

        function startAutoPlay() {
            stopAutoPlay();
            if (!isPaused) {
                autoPlayInterval = setInterval(nextSlide, autoPlayDelay);
            }
        }

        function stopAutoPlay() {
            if (autoPlayInterval) {
                clearInterval(autoPlayInterval);
                autoPlayInterval = null;
            }
        }

        // Dot clicks
        dots.forEach(function (dot) {
            dot.addEventListener('click', function () {
                var slideIndex = parseInt(this.getAttribute('data-slide'), 10);
                goToSlide(slideIndex);
                startAutoPlay();
            });
        });

        // Pause on hover/focus
        slider.addEventListener('mouseenter', function () {
            isPaused = true;
            stopAutoPlay();
        });

        slider.addEventListener('mouseleave', function () {
            isPaused = false;
            startAutoPlay();
        });

        slider.addEventListener('focusin', function () {
            isPaused = true;
            stopAutoPlay();
        });

        slider.addEventListener('focusout', function () {
            isPaused = false;
            startAutoPlay();
        });

        // Keyboard navigation
        slider.addEventListener('keydown', function (e) {
            if (e.key === 'ArrowLeft') {
                e.preventDefault();
                var prev = (currentSlide - 1 + totalSlides) % totalSlides;
                goToSlide(prev);
                startAutoPlay();
            } else if (e.key === 'ArrowRight') {
                e.preventDefault();
                nextSlide();
                startAutoPlay();
            }
        });

        // Respect reduced motion
        if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
            return;
        }

        startAutoPlay();
    }

    setupTestimonialSlider();

})();
