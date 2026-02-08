class AnimationController {
    constructor() {
        this.observers = new Map();
        this.rafId = null;
        this.scrollY = 0;
        this.init();
    }

    init() {
        this.setupScrollReveal();
        this.setupParallax();
        this.setupSmoothScroll();
        this.handleScroll();
    }

    setupScrollReveal() {
        const config = {
            threshold: 0.1,
            rootMargin: '0px 0px -50px 0px'
        };

        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('revealed');
                    entry.target.style.opacity = '1';
                    entry.target.style.transform = 'translateY(0)';
                }
            });
        }, config);

        document.querySelectorAll('[data-reveal]').forEach(el => {
            el.style.opacity = '0';
            el.style.transform = 'translateY(30px)';
            el.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
            observer.observe(el);
        });

        this.observers.set('reveal', observer);
    }

    setupParallax() {
        const parallaxElements = document.querySelectorAll('[data-parallax]');
        if (!parallaxElements.length) return;

        const updateParallax = () => {
            parallaxElements.forEach(el => {
                const speed = parseFloat(el.dataset.parallax) || 0.5;
                const rect = el.getBoundingClientRect();
                const offset = rect.top * speed;
                el.style.transform = `translateY(${offset}px)`;
            });
        };

        window.addEventListener('scroll', () => {
            if (this.rafId) return;
            this.rafId = requestAnimationFrame(() => {
                updateParallax();
                this.rafId = null;
            });
        }, { passive: true });
    }

    setupSmoothScroll() {
        document.querySelectorAll('a[href^="#"]').forEach(anchor => {
            anchor.addEventListener('click', (e) => {
                const href = anchor.getAttribute('href');
                if (href === '#') return;

                e.preventDefault();
                const target = document.querySelector(href);
                if (!target) return;

                const offsetTop = target.offsetTop - 80;
                window.scrollTo({
                    top: offsetTop,
                    behavior: 'smooth'
                });
            });
        });
    }

    handleScroll() {
        let ticking = false;

        window.addEventListener('scroll', () => {
            this.scrollY = window.scrollY;

            if (!ticking) {
                requestAnimationFrame(() => {
                    this.updateScrollEffects();
                    ticking = false;
                });
                ticking = true;
            }
        }, { passive: true });
    }

    updateScrollEffects() {
        const header = document.querySelector('header');
        if (header) {
            header.style.boxShadow = this.scrollY > 50
                ? '0 4px 20px rgba(0, 0, 0, 0.1)'
                : '0 4px 15px rgba(0, 0, 0, 0.1)';
        }
    }

    destroy() {
        this.observers.forEach(observer => observer.disconnect());
        if (this.rafId) cancelAnimationFrame(this.rafId);
    }
}

class MicroInteractions {
    static init() {
        this.setupHoverEffects();
        this.setupFocusEffects();
        this.setupRippleEffect();
    }

    static setupHoverEffects() {
        document.querySelectorAll('.btn, .service-card, .feature-card').forEach(el => {
            el.addEventListener('mouseenter', function () {
                this.style.transform = 'translateY(-4px)';
            });

            el.addEventListener('mouseleave', function () {
                this.style.transform = 'translateY(0)';
            });
        });
    }

    static setupFocusEffects() {
        document.querySelectorAll('a, button, input, textarea, select').forEach(el => {
            el.addEventListener('focus', function () {
                this.style.outline = '2px solid var(--primary-500)';
                this.style.outlineOffset = '2px';
            });

            el.addEventListener('blur', function () {
                this.style.outline = 'none';
            });
        });
    }

    static setupRippleEffect() {
        document.querySelectorAll('.btn').forEach(button => {
            button.addEventListener('click', function (e) {
                const ripple = document.createElement('span');
                const rect = this.getBoundingClientRect();
                const size = Math.max(rect.width, rect.height);
                const x = e.clientX - rect.left - size / 2;
                const y = e.clientY - rect.top - size / 2;

                ripple.style.width = ripple.style.height = `${size}px`;
                ripple.style.left = `${x}px`;
                ripple.style.top = `${y}px`;
                ripple.classList.add('ripple');

                const existingRipple = this.querySelector('.ripple');
                if (existingRipple) existingRipple.remove();

                this.appendChild(ripple);

                setTimeout(() => ripple.remove(), 600);
            });
        });

        const style = document.createElement('style');
        style.textContent = `
      .btn { position: relative; overflow: hidden; }
      .ripple {
        position: absolute;
        border-radius: 50%;
        background: rgba(255, 255, 255, 0.5);
        transform: scale(0);
        animation: ripple-animation 600ms ease-out;
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
    }
}

document.addEventListener('DOMContentLoaded', () => {
    const animController = new AnimationController();
    MicroInteractions.init();

    document.querySelectorAll('.section-header, .service-card, .feature-card, .hero-content, .hero-image').forEach(el => {
        el.setAttribute('data-reveal', '');
    });

    const images = document.querySelectorAll('img[loading="lazy"]');
    if ('IntersectionObserver' in window) {
        const imageObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const img = entry.target;
                    if (img.dataset.src) {
                        img.src = img.dataset.src;
                        img.removeAttribute('data-src');
                    }
                    imageObserver.unobserve(img);
                }
            });
        });

        images.forEach(img => imageObserver.observe(img));
    }
});
