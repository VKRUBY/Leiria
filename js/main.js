/**
 * LEIRIA Engenharia - Main JavaScript File
 */

document.addEventListener('DOMContentLoaded', () => {

    // 1. Mobile Menu Toggle
    const hamburger = document.getElementById('hamburger');
    const navMenu = document.getElementById('nav');

    hamburger.addEventListener('click', () => {
        hamburger.classList.toggle('active');
        navMenu.classList.toggle('active');
    });

    // Close menu when a link is clicked
    document.querySelectorAll('.nav-link').forEach(n => n.addEventListener('click', () => {
        hamburger.classList.remove('active');
        navMenu.classList.remove('active');
    }));

    // 2. Sticky Header on Scroll
    const header = document.getElementById('header');

    window.addEventListener('scroll', () => {
        if (window.scrollY > 50) {
            header.classList.add('scrolled');
        } else {
            header.classList.remove('scrolled');
        }
    });

    // 3. Scroll Animations (Intersection Observer)
    const fadeElements = document.querySelectorAll('[data-animate]');

    const fadeOptions = {
        root: null,
        threshold: 0.15, // Trigger when 15% of the element is visible
        rootMargin: "0px"
    };

    const fadeObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('animated');
                // Optional: Stop observing once animated
                observer.unobserve(entry.target);
            }
        });
    }, fadeOptions);

    fadeElements.forEach(element => {
        fadeObserver.observe(element);
    });

    // 4. Portfolio Carousel Logic
    const track = document.getElementById('portfolio-track');
    const prevBtn = document.querySelector('.prev-btn');
    const nextBtn = document.querySelector('.next-btn');

    if (track && prevBtn && nextBtn) {
        let currentIndex = 0;

        // Define how many items are visible based on screen width
        const getItemsPerView = () => {
            if (window.innerWidth <= 480) return 1;
            if (window.innerWidth <= 1024) return 2;
            return 3;
        };

        const updateCarousel = () => {
            const itemsPerView = getItemsPerView();
            const totalItems = document.querySelectorAll('.portfolio-item-slide').length;
            const itemWidth = document.querySelector('.portfolio-item-slide').offsetWidth;
            const gap = 24; // 1.5rem in pixels

            // Calculate max index to avoid sliding past the last item
            const maxIndex = Math.max(0, totalItems - itemsPerView);

            if (currentIndex > maxIndex) currentIndex = maxIndex;
            if (currentIndex < 0) currentIndex = 0;

            const moveAmount = currentIndex * (itemWidth + gap);
            track.style.transform = `translateX(-${moveAmount}px)`;
        };

        nextBtn.addEventListener('click', () => {
            const itemsPerView = getItemsPerView();
            const totalItems = document.querySelectorAll('.portfolio-item-slide').length;
            const maxIndex = Math.max(0, totalItems - itemsPerView);

            if (currentIndex < maxIndex) {
                currentIndex++;
                updateCarousel();
            }
        });

        prevBtn.addEventListener('click', () => {
            if (currentIndex > 0) {
                currentIndex--;
                updateCarousel();
            }
        });

        // Update on resize
        window.addEventListener('resize', updateCarousel);
    }

    // 5. Set Current Year in Footer
    const yearSpan = document.getElementById('current-year');
    if (yearSpan) {
        yearSpan.textContent = new Date().getFullYear();
    }
});
