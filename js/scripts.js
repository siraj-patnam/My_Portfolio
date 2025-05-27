/*!
* Start Bootstrap - Personal v1.0.1 (https://startbootstrap.com/template-overviews/personal)
* Copyright 2013-2023 Start Bootstrap
* Licensed under MIT (https://github.com/StartBootstrap/startbootstrap-personal/blob/master/LICENSE)
*/
// This file is intentionally blank
// Use this file to add JavaScript to your project
// Dark Mode Toggle Script - Add this to your js/scripts.js file

document.addEventListener('DOMContentLoaded', function() {
    // Create dark mode toggle button
    const toggleButton = document.createElement('button');
    toggleButton.className = 'theme-toggle';
    toggleButton.innerHTML = '<i class="bi bi-moon-fill"></i>';
    toggleButton.setAttribute('aria-label', 'Toggle dark mode');
    document.body.appendChild(toggleButton);

    // Check for saved theme preference or default to light mode
    const currentTheme = localStorage.getItem('theme') || 'light';
    document.documentElement.setAttribute('data-theme', currentTheme);
    
    // Update button icon based on current theme
    updateToggleIcon(currentTheme);

    // Add click event listener to toggle button
    toggleButton.addEventListener('click', function() {
        const currentTheme = document.documentElement.getAttribute('data-theme');
        const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
        
        // Apply new theme
        document.documentElement.setAttribute('data-theme', newTheme);
        localStorage.setItem('theme', newTheme);
        
        // Update button icon
        updateToggleIcon(newTheme);
    });

    function updateToggleIcon(theme) {
        const icon = toggleButton.querySelector('i');
        if (theme === 'dark') {
            icon.className = 'bi bi-sun-fill';
        } else {
            icon.className = 'bi bi-moon-fill';
        }
    }
    
});

// Add these enhancements to your js/scripts.js (after existing dark mode code)

document.addEventListener('DOMContentLoaded', function() {
    
    // Scroll Progress Indicator
    function createScrollIndicator() {
        const indicator = document.createElement('div');
        indicator.className = 'scroll-indicator';
        document.body.appendChild(indicator);
        
        window.addEventListener('scroll', () => {
            const winScroll = document.body.scrollTop || document.documentElement.scrollTop;
            const height = document.documentElement.scrollHeight - document.documentElement.clientHeight;
            const scrolled = (winScroll / height) * 100;
            indicator.style.width = scrolled + '%';
        });
    }
    
    // Navbar Scroll Effect
    function enhanceNavbar() {
        const navbar = document.querySelector('.navbar');
        if (navbar) {
            window.addEventListener('scroll', () => {
                if (window.scrollY > 50) {
                    navbar.classList.add('scrolled');
                } else {
                    navbar.classList.remove('scrolled');
                }
            });
        }
    }
    
    // Smooth Scroll for Navigation Links
    function addSmoothScroll() {
        document.querySelectorAll('a[href^="#"]').forEach(anchor => {
            anchor.addEventListener('click', function(e) {
                e.preventDefault();
                const target = document.querySelector(this.getAttribute('href'));
                if (target) {
                    target.scrollIntoView({
                        behavior: 'smooth',
                        block: 'start'
                    });
                }
            });
        });
    }
    
    // Intersection Observer for Animations
    function addScrollAnimations() {
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('loading-animation');
                    observer.unobserve(entry.target);
                }
            });
        }, {
            threshold: 0.1,
            rootMargin: '0px 0px -50px 0px'
        });
        
        // Observe cards and sections
        document.querySelectorAll('.card, section, .timeline-item').forEach(el => {
            observer.observe(el);
        });
    }
    
    // Enhanced Card Interactions
    function enhanceCards() {
        document.querySelectorAll('.card').forEach(card => {
            card.classList.add('project-card', 'interactive-element');
            
            // Add mouse move effect for cards
            card.addEventListener('mousemove', (e) => {
                const rect = card.getBoundingClientRect();
                const x = e.clientX - rect.left;
                const y = e.clientY - rect.top;
                
                const centerX = rect.width / 2;
                const centerY = rect.height / 2;
                
                const rotateX = (y - centerY) / 10;
                const rotateY = (centerX - x) / 10;
                
                card.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) translateY(-5px)`;
            });
            
            card.addEventListener('mouseleave', () => {
                card.style.transform = 'perspective(1000px) rotateX(0deg) rotateY(0deg) translateY(0px)';
            });
        });
    }
    
    // Typing Animation for Hero Text
    function addTypingAnimation() {
        const heroText = document.querySelector('.display-3');
        if (heroText) {
            const text = heroText.textContent;
            heroText.textContent = '';
            heroText.style.borderRight = '2px solid #1e30f3';
            
            let i = 0;
            function typeWriter() {
                if (i < text.length) {
                    heroText.textContent += text.charAt(i);
                    i++;
                    setTimeout(typeWriter, 100);
                } else {
                    // Remove cursor after typing
                    setTimeout(() => {
                        heroText.style.borderRight = 'none';
                    }, 1000);
                }
            }
            
            // Start typing animation after a short delay
            setTimeout(typeWriter, 500);
        }
    }
    
    // Particle Background Effect
    function createParticleBackground() {
        const hero = document.querySelector('header');
        if (hero) {
            const canvas = document.createElement('canvas');
            canvas.style.position = 'absolute';
            canvas.style.top = '0';
            canvas.style.left = '0';
            canvas.style.width = '100%';
            canvas.style.height = '100%';
            canvas.style.pointerEvents = 'none';
            canvas.style.zIndex = '1';
            hero.style.position = 'relative';
            hero.appendChild(canvas);
            
            const ctx = canvas.getContext('2d');
            let particles = [];
            
            function resizeCanvas() {
                canvas.width = hero.offsetWidth;
                canvas.height = hero.offsetHeight;
            }
            
            function createParticles() {
                for (let i = 0; i < 50; i++) {
                    particles.push({
                        x: Math.random() * canvas.width,
                        y: Math.random() * canvas.height,
                        vx: (Math.random() - 0.5) * 0.5,
                        vy: (Math.random() - 0.5) * 0.5,
                        size: Math.random() * 2 + 1
                    });
                }
            }
            
            function animateParticles() {
                ctx.clearRect(0, 0, canvas.width, canvas.height);
                
                particles.forEach(particle => {
                    particle.x += particle.vx;
                    particle.y += particle.vy;
                    
                    if (particle.x < 0 || particle.x > canvas.width) particle.vx *= -1;
                    if (particle.y < 0 || particle.y > canvas.height) particle.vy *= -1;
                    
                    ctx.beginPath();
                    ctx.arc(particle.x, particle.y, particle.size, 0, Math.PI * 2);
                    ctx.fillStyle = 'rgba(30, 48, 243, 0.1)';
                    ctx.fill();
                });
                
                requestAnimationFrame(animateParticles);
            }
            
            resizeCanvas();
            createParticles();
            animateParticles();
            
            window.addEventListener('resize', resizeCanvas);
        }
    }
    
    // Add Loading States
    function addLoadingStates() {
        // Add loading class to body initially
        document.body.classList.add('loading');
        
        // Remove loading class when everything is loaded
        window.addEventListener('load', () => {
            setTimeout(() => {
                document.body.classList.remove('loading');
                document.body.classList.add('loaded');
            }, 500);
        });
    }
    
    // Enhanced Mobile Menu
    function enhanceMobileMenu() {
        const navbarToggler = document.querySelector('.navbar-toggler');
        const navbarCollapse = document.querySelector('.navbar-collapse');
        
        if (navbarToggler && navbarCollapse) {
            navbarToggler.addEventListener('click', () => {
                setTimeout(() => {
                    if (navbarCollapse.classList.contains('show')) {
                        navbarCollapse.style.animation = 'slideDown 0.3s ease';
                    }
                }, 10);
            });
        }
    }
    
    // Lazy Loading for Images
    function addLazyLoading() {
        const images = document.querySelectorAll('img');
        const imageObserver = new IntersectionObserver((entries, observer) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const img = entry.target;
                    img.classList.add('loaded');
                    observer.unobserve(img);
                }
            });
        });
        
        images.forEach(img => {
            img.classList.add('lazy');
            imageObserver.observe(img);
        });
    }
    
    // Performance Monitoring
    function addPerformanceMonitoring() {
        // Monitor Core Web Vitals
        if ('web-vital' in window) {
            import('https://unpkg.com/web-vitals@3/dist/web-vitals.js').then(({ getCLS, getFID, getFCP, getLCP, getTTFB }) => {
                getCLS(console.log);
                getFID(console.log);
                getFCP(console.log);
                getLCP(console.log);
                getTTFB(console.log);
            });
        }
    }
    
    // Initialize all enhancements
    createScrollIndicator();
    enhanceNavbar();
    addSmoothScroll();
    addScrollAnimations();
    enhanceCards();
    // addTypingAnimation(); // Uncomment if you want typing effect
    // createParticleBackground(); // Uncomment for particle effect
    addLoadingStates();
    enhanceMobileMenu();
    addLazyLoading();
    
    // Initialize performance monitoring in production
    // addPerformanceMonitoring();
    
    console.log('✨ Portfolio enhancements loaded successfully!');
});

// Add CSS animations via JavaScript
const style = document.createElement('style');
style.textContent = `
    @keyframes slideDown {
        from { opacity: 0; transform: translateY(-10px); }
        to { opacity: 1; transform: translateY(0); }
    }
    
    .loading * {
        transition: none !important;
        animation: none !important;
    }
    
    .loaded .loading-animation {
        animation: fadeInUp 0.8s ease forwards;
    }
    
    img.lazy {
        opacity: 0;
        transition: opacity 0.3s ease;
    }
    
    img.lazy.loaded {
        opacity: 1;
    }
`;
document.head.appendChild(style);
