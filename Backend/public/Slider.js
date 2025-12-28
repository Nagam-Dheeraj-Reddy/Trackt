/* slider.js */

document.addEventListener('DOMContentLoaded', () => {
    const slider = document.getElementById("slider");
    const images = slider.children;
    const totalImages = images.length;
    const dotsContainer = document.getElementById('sliderDots'); // Ensure you have this ID in HTML
    let currentIndex = 0;
    let autoSlideInterval;

    // 1. Initialize Dots (Create them dynamically based on image count)
    // This makes sure you always have the right number of dots
    if (dotsContainer.children.length === 0) {
        for (let i = 0; i < totalImages; i++) {
            const dot = document.createElement('span');
            dot.className = 'slider-dot';
            if (i === 0) dot.classList.add('active');
            dot.addEventListener('click', () => {
                clearInterval(autoSlideInterval);
                currentIndex = i;
                updateSlider();
                startAutoSlide();
            });
            dotsContainer.appendChild(dot);
        }
    }
    
    // Re-select dots after creation
    const dots = document.querySelectorAll('.slider-dot');

    function updateSlider() {
        slider.style.transform = `translateX(-${currentIndex * 100}%)`;
        dots.forEach((dot, index) => {
            dot.classList.toggle('active', index === currentIndex);
        });
    }

    function nextSlide() {
        currentIndex = (currentIndex + 1) % totalImages;
        updateSlider();
    }

    function prevSlide() {
        currentIndex = (currentIndex - 1 + totalImages) % totalImages;
        updateSlider();
    }

    function startAutoSlide() {
        clearInterval(autoSlideInterval);
        autoSlideInterval = setInterval(nextSlide, 3000); // 3 seconds
    }

    // Event Listeners for Arrows
    const leftArrow = document.querySelector('.left-arrow');
    const rightArrow = document.querySelector('.right-arrow');

    if (leftArrow) {
        leftArrow.addEventListener('click', () => {
            clearInterval(autoSlideInterval);
            prevSlide();
            startAutoSlide();
        });
    }

    if (rightArrow) {
        rightArrow.addEventListener('click', () => {
            clearInterval(autoSlideInterval);
            nextSlide();
            startAutoSlide();
        });
    }

    // Pause on Hover
    slider.addEventListener('mouseenter', () => clearInterval(autoSlideInterval));
    slider.addEventListener('mouseleave', startAutoSlide);

    // Initialize
    updateSlider();
    startAutoSlide();
});

// Function preserved from your original code (Just in case other files need it)
function toggleSidebar() {
    const sidebar = document.getElementById("sidebar");
    if (sidebar) {
        sidebar.style.left = sidebar.style.left === "0px" ? "-250px" : "0px";
    }
}