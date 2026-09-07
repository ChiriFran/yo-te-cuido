/**
 * YoTeCuido - Landing Page Scripts
 */

(function () {
    'use strict';

    /* ---------- DOM Elements ---------- */
    var header = document.getElementById('header');
    var hamburger = document.getElementById('hamburger');
    var nav = document.getElementById('nav');
    var navLinks = nav ? nav.querySelectorAll('.header__nav-link') : [];
    var currentYearEl = document.getElementById('current-year');

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

    // Close menu when clicking outside
    document.addEventListener('click', function (e) {
        if (nav && nav.classList.contains('active')) {
            var isClickInsideNav = nav.contains(e.target);
            var isClickOnHamburger = hamburger && hamburger.contains(e.target);
            if (!isClickInsideNav && !isClickOnHamburger) {
                closeMenu();
            }
        }
    });

    // Close menu on Escape key
    document.addEventListener('keydown', function (e) {
        if (e.key === 'Escape' && nav && nav.classList.contains('active')) {
            closeMenu();
            hamburger.focus();
        }
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

    /* ---------- Card Slider (Value & Process) ---------- */
    function setupCardSlider(sliderName) {
        var wrapper = document.querySelector('[data-slider-dots="' + sliderName + '"]');
        if (!wrapper) return;

        var scrollContainer = wrapper.parentElement.querySelector(
            sliderName === 'value' ? '.value__grid' : '.process__steps'
        );
        var dots = wrapper.querySelectorAll('.slider-dot');
        var leftArrow = wrapper.parentElement.querySelector('.slider-arrow--left');
        var rightArrow = wrapper.parentElement.querySelector('.slider-arrow--right');

        if (!scrollContainer || !dots.length) return;

        var cards = scrollContainer.children;
        var totalCards = cards.length;
        var currentIndex = 0;
        var isMobile = window.matchMedia('(max-width: 768px)').matches;

        function updateActiveDot() {
            if (!isMobile) return;

            var scrollLeft = scrollContainer.scrollLeft;
            var containerWidth = scrollContainer.offsetWidth;
            var cardWidth = cards[0] ? cards[0].offsetWidth + 16 : 280; // gap

            currentIndex = Math.round(scrollLeft / cardWidth);
            currentIndex = Math.max(0, Math.min(currentIndex, totalCards - 1));

            dots.forEach(function (dot, i) {
                dot.classList.toggle('active', i === currentIndex);
            });
        }

        function scrollToCard(index) {
            if (!isMobile || !cards[index]) return;

            var cardWidth = cards[0].offsetWidth + 16; // gap
            scrollContainer.scrollTo({
                left: cardWidth * index,
                behavior: 'smooth'
            });
        }

        // Dot clicks
        dots.forEach(function (dot, i) {
            dot.addEventListener('click', function () {
                scrollToCard(i);
            });
        });

        // Arrow clicks
        if (leftArrow) {
            leftArrow.addEventListener('click', function () {
                var prev = Math.max(0, currentIndex - 1);
                scrollToCard(prev);
            });
        }

        if (rightArrow) {
            rightArrow.addEventListener('click', function () {
                var next = Math.min(totalCards - 1, currentIndex + 1);
                scrollToCard(next);
            });
        }

        // Scroll event to update dots
        var scrollTimeout;
        scrollContainer.addEventListener('scroll', function () {
            clearTimeout(scrollTimeout);
            scrollTimeout = setTimeout(updateActiveDot, 80);
        }, { passive: true });

        // Touch swipe support
        var touchStartX = 0;
        var touchEndX = 0;
        var isSwiping = false;

        scrollContainer.addEventListener('touchstart', function (e) {
            touchStartX = e.changedTouches[0].screenX;
            isSwiping = true;
        }, { passive: true });

        scrollContainer.addEventListener('touchmove', function () {
            isSwiping = true;
        }, { passive: true });

        scrollContainer.addEventListener('touchend', function (e) {
            if (!isSwiping) return;
            isSwiping = false;
            touchEndX = e.changedTouches[0].screenX;
            var diff = touchStartX - touchEndX;

            if (Math.abs(diff) > 50) {
                if (diff > 0 && currentIndex < totalCards - 1) {
                    scrollToCard(currentIndex + 1);
                } else if (diff < 0 && currentIndex > 0) {
                    scrollToCard(currentIndex - 1);
                }
            }
        }, { passive: true });

        // Update on resize
        window.addEventListener('resize', function () {
            isMobile = window.matchMedia('(max-width: 768px)').matches;
            if (!isMobile) {
                dots.forEach(function (dot) {
                    dot.classList.remove('active');
                });
            } else {
                updateActiveDot();
            }
        });

        // Initial state
        if (isMobile) {
            updateActiveDot();
        }
    }

    setupCardSlider('value');
    setupCardSlider('process');

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
