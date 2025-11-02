// Animate stat numbers
function animateStats() {
    const statNumbers = document.querySelectorAll('.stat-number');
    
    const animateValue = (element, target) => {
        const duration = 2000; // 2 seconds
        const start = 0;
        const increment = target / (duration / 16); // 60fps
        let current = start;
        
        const timer = setInterval(() => {
            current += increment;
            if (current >= target) {
                element.textContent = target === 999 ? '999+' : target;
                clearInterval(timer);
            } else {
                element.textContent = Math.floor(current);
            }
        }, 16);
    };
    
    // Intersection Observer to trigger animation when section is visible
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const target = parseInt(entry.target.getAttribute('data-target'));
                animateValue(entry.target, target);
                observer.unobserve(entry.target);
            }
        });
    }, { threshold: 0.5 });
    
    statNumbers.forEach(stat => {
        observer.observe(stat);
    });
}

// Create floating hearts dynamically
function createFloatingHearts() {
    const hearts = ['❤️', '💖', '💕', '💗', '💝', '💞'];
    const container = document.querySelector('.hearts-container');
    
    setInterval(() => {
        const heart = document.createElement('div');
        heart.className = 'heart';
        heart.textContent = hearts[Math.floor(Math.random() * hearts.length)];
        heart.style.left = Math.random() * 100 + '%';
        heart.style.animationDuration = (Math.random() * 10 + 10) + 's';
        heart.style.fontSize = (Math.random() * 20 + 20) + 'px';
        
        container.appendChild(heart);
        
        setTimeout(() => {
            heart.remove();
        }, 20000);
    }, 1000);
}


// Add click effect to cards
function addCardEffects() {
    const cards = document.querySelectorAll('.card');
    cards.forEach(card => {
        card.addEventListener('click', function(e) {
            const ripple = document.createElement('span');
            const rect = this.getBoundingClientRect();
            const size = Math.max(rect.width, rect.height);
            const x = e.clientX - rect.left - size / 2;
            const y = e.clientY - rect.top - size / 2;
            
            ripple.style.width = ripple.style.height = size + 'px';
            ripple.style.left = x + 'px';
            ripple.style.top = y + 'px';
            ripple.classList.add('ripple');
            
            this.appendChild(ripple);
            
            setTimeout(() => {
                ripple.remove();
            }, 600);
        });
    });
}

// Image Carousel Functionality
let carouselInterval;
let currentCarouselIndex = 0;

function initImageCarousel() {
    const carouselImages = document.querySelectorAll('.carousel-image');
    const prevBtn = document.querySelector('.prev-btn');
    const nextBtn = document.querySelector('.next-btn');
    const carouselContainer = document.querySelector('.image-carousel-container');
    
    if (carouselImages.length === 0) return;
    
    function showImage(index) {
        carouselImages.forEach((img, i) => {
            img.classList.toggle('active', i === index);
        });
    }
    
    function nextImage() {
        currentCarouselIndex = (currentCarouselIndex + 1) % carouselImages.length;
        showImage(currentCarouselIndex);
    }
    
    function prevImage() {
        currentCarouselIndex = (currentCarouselIndex - 1 + carouselImages.length) % carouselImages.length;
        showImage(currentCarouselIndex);
    }
    
    // Auto-rotate
    function startCarousel() {
        carouselInterval = setInterval(nextImage, 3000);
    }
    
    function stopCarousel() {
        clearInterval(carouselInterval);
    }
    
    // Pause on hover
    if (carouselContainer) {
        carouselContainer.addEventListener('mouseenter', stopCarousel);
        carouselContainer.addEventListener('mouseleave', startCarousel);
    }
    
    // Manual controls
    if (nextBtn) nextBtn.addEventListener('click', () => {
        nextImage();
        stopCarousel();
        startCarousel();
    });
    
    if (prevBtn) prevBtn.addEventListener('click', () => {
        prevImage();
        stopCarousel();
        startCarousel();
    });
    
    startCarousel();
    showImage(0);
}

// Lightbox Functionality
let currentLightboxIndex = 0;
let lightboxImages = [];

function initLightbox() {
    const lightbox = document.getElementById('lightbox');
    const lightboxImage = document.querySelector('.lightbox-image');
    const closeBtn = document.querySelector('.lightbox-close');
    const prevBtn = document.querySelector('.lightbox-prev');
    const nextBtn = document.querySelector('.lightbox-next');
    
    // Collect all clickable images
    const galleryImages = document.querySelectorAll('.gallery-image, .testimonial-image, .about-image, .carousel-image');
    
    galleryImages.forEach((img, index) => {
        img.addEventListener('click', () => {
            openLightbox(index);
        });
        
        lightboxImages.push(img.src);
    });
    
    function openLightbox(index) {
        currentLightboxIndex = index;
        if (lightbox && lightboxImage) {
            lightboxImage.src = lightboxImages[index];
            lightbox.classList.add('active');
            document.body.style.overflow = 'hidden';
        }
    }
    
    function closeLightbox() {
        if (lightbox) {
            lightbox.classList.remove('active');
            document.body.style.overflow = '';
        }
    }
    
    function showNext() {
        currentLightboxIndex = (currentLightboxIndex + 1) % lightboxImages.length;
        if (lightboxImage) {
            lightboxImage.src = lightboxImages[currentLightboxIndex];
        }
    }
    
    function showPrev() {
        currentLightboxIndex = (currentLightboxIndex - 1 + lightboxImages.length) % lightboxImages.length;
        if (lightboxImage) {
            lightboxImage.src = lightboxImages[currentLightboxIndex];
        }
    }
    
    if (closeBtn) closeBtn.addEventListener('click', closeLightbox);
    if (nextBtn) nextBtn.addEventListener('click', showNext);
    if (prevBtn) prevBtn.addEventListener('click', showPrev);
    
    if (lightbox) {
        lightbox.addEventListener('click', (e) => {
            if (e.target === lightbox) {
                closeLightbox();
            }
        });
    }
    
    // Keyboard navigation
    document.addEventListener('keydown', (e) => {
        if (!lightbox || !lightbox.classList.contains('active')) return;
        
        if (e.key === 'Escape') {
            closeLightbox();
        } else if (e.key === 'ArrowRight') {
            showNext();
        } else if (e.key === 'ArrowLeft') {
            showPrev();
        }
    });
}

// Lazy Loading with Intersection Observer
function initLazyLoading() {
    const images = document.querySelectorAll('img[loading="lazy"]');
    
    if ('IntersectionObserver' in window) {
        const imageObserver = new IntersectionObserver((entries, observer) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const img = entry.target;
                    img.style.opacity = '0';
                    img.style.transition = 'opacity 0.3s';
                    
                    img.addEventListener('load', () => {
                        img.style.opacity = '1';
                    });
                    
                    observer.unobserve(img);
                }
            });
        }, {
            rootMargin: '50px'
        });
        
        images.forEach(img => imageObserver.observe(img));
    }
}

// Enhanced Parallax Effect
function addParallaxEffect() {
    window.addEventListener('scroll', () => {
        const scrolled = window.pageYOffset;
        
        // Hero background images parallax
        const heroBgImages = document.querySelectorAll('.hero-bg-img');
        heroBgImages.forEach((img, index) => {
            const speed = 0.3 + (index * 0.1);
            img.style.transform = `translateY(${scrolled * speed}px)`;
        });
        
        // Decorative images parallax
        const aboutImages = document.querySelectorAll('.about-image');
        aboutImages.forEach((img, index) => {
            const rect = img.getBoundingClientRect();
            if (rect.top < window.innerHeight && rect.bottom > 0) {
                const speed = 0.1 + (index % 3) * 0.05;
                img.style.transform = `translateY(${scrolled * speed}px)`;
            }
        });
    });
}

// Initialize all effects when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    animateStats();
    createFloatingHearts();
    addParallaxEffect();
    addCardEffects();
    initImageCarousel();
    initLightbox();
    initLazyLoading();
});

// Add ripple effect styles dynamically
const style = document.createElement('style');
style.textContent = `
    .card {
        position: relative;
        overflow: hidden;
    }
    .ripple {
        position: absolute;
        border-radius: 50%;
        background: rgba(255, 255, 255, 0.6);
        transform: scale(0);
        animation: ripple-animation 0.6s ease-out;
        pointer-events: none;
    }
    @keyframes ripple-animation {
        to {
            transform: scale(4);
            opacity: 0;
        }
    }
`;
document.head.appendChild(style);

