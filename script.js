// ==========================================================================
// Venice City ER - Enhanced Animations & Interactions 2026
// ==========================================================================

// Utility: throttle per eventi scroll (migliora prestazioni)
function throttle(fn, wait) {
    let time = Date.now();
    return function() {
        if ((time + wait - Date.now()) < 0) {
            fn();
            time = Date.now();
        }
    }
}

// Smooth scroll to section
function scrollToSection(selector) {
    const element = document.querySelector(selector);
    if (element) {
        const headerOffset = 80; // altezza navbar approssimativa
        const elementPosition = element.getBoundingClientRect().top;
        const offsetPosition = elementPosition + window.pageYOffset - headerOffset;

        window.scrollTo({
            top: offsetPosition,
            behavior: 'smooth'
        });
    }
}

// Copy to clipboard with feedback
function copyToClipboard(text) {
    navigator.clipboard.writeText(text)
        .then(() => {
            const btn = event.target;
            const originalText = btn.textContent;
            btn.textContent = 'Copiato! ✓';
            btn.style.background = 'linear-gradient(135deg, #22c55e, #16a34a)';
            setTimeout(() => {
                btn.textContent = originalText;
                btn.style.background = '';
            }, 2000);
        })
        .catch(err => console.error('Errore copia:', err));
}

// Shop filter with staggered animation
function filterShop(category) {
    const items = document.querySelectorAll('.shop-item');
    const buttons = document.querySelectorAll('.filter-btn');

    buttons.forEach(btn => btn.classList.remove('active'));
    event.target.classList.add('active');

    items.forEach((item, index) => {
        item.style.opacity = '0';
        item.style.transform = 'translateY(30px)';
        item.style.transition = 'opacity 0.5s ease, transform 0.6s ease';

        setTimeout(() => {
            if (category === 'all' || item.dataset.category === category) {
                item.style.display = 'block';
                setTimeout(() => {
                    item.style.opacity = '1';
                    item.style.transform = 'translateY(0)';
                }, 50 + index * 80); // staggered effect
            } else {
                item.style.display = 'none';
            }
        }, 100);
    });
}

// Mobile menu toggle with smooth transition
const hamburger = document.querySelector('.hamburger');
const navLinks = document.querySelector('.nav-links');

if (hamburger && navLinks) {
    hamburger.addEventListener('click', () => {
        navLinks.classList.toggle('active');
        hamburger.classList.toggle('active');
    });

    // Chiudi menu cliccando fuori o su link
    document.addEventListener('click', e => {
        if (!navLinks.contains(e.target) && !hamburger.contains(e.target)) {
            navLinks.classList.remove('active');
            hamburger.classList.remove('active');
        }
    });

    // Chiudi menu dopo click su link
    navLinks.querySelectorAll('a').forEach(link => {
        link.addEventListener('click', () => {
            navLinks.classList.remove('active');
            hamburger.classList.remove('active');
        });
    });
}

// Active nav link on scroll (con throttle)
const sections = document.querySelectorAll('section[id]');
const navItems = document.querySelectorAll('.nav-link');

const updateActiveLink = throttle(() => {
    let current = '';

    sections.forEach(section => {
        const sectionTop = section.offsetTop - 200;
        if (window.scrollY >= sectionTop) {
            current = section.getAttribute('id');
        }
    });

    navItems.forEach(item => {
        item.classList.remove('active');
        if (item.getAttribute('href').slice(1) === current) {
            item.classList.add('active');
        }
    });
}, 100);

window.addEventListener('scroll', updateActiveLink);
updateActiveLink(); // chiama subito all'avvio



// Intersection Observer per animazioni on-scroll
const observerOptions = {
    threshold: 0.15,
    rootMargin: '0px 0px -80px 0px'
};

const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            const el = entry.target;
            el.classList.add('in-view');
            // Opzionale: unobserve se vuoi animazione solo una volta
            // observer.unobserve(el);
        }
    });
}, observerOptions);

// Osserva elementi
document.querySelectorAll(
    '.feature-card, .server-detail, .contact-item, .hero-stat, .shop-item'
).forEach(el => observer.observe(el));

// Scroll to top button con pulse
const scrollTopBtn = document.createElement('button');
scrollTopBtn.innerHTML = '↑';
scrollTopBtn.className = 'scroll-to-top';
scrollTopBtn.setAttribute('aria-label', 'Torna in cima');

document.body.appendChild(scrollTopBtn);

window.addEventListener('scroll', throttle(() => {
    scrollTopBtn.classList.toggle('visible', window.scrollY > 400);
}, 150));

scrollTopBtn.addEventListener('click', () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
});

// Navbar scroll effect + shrink
const navbar = document.querySelector('.navbar');
let lastScroll = 0;

window.addEventListener('scroll', throttle(() => {
    const current = window.scrollY;

    if (current > 80) {
        navbar.classList.add('scrolled');
    } else {
        navbar.classList.remove('scrolled');
    }

    // Nascondi navbar quando scrolla verso il basso, mostra verso l'alto
    if (current > lastScroll && current > 300) {
        navbar.style.transform = 'translateY(-100%)';
    } else {
        navbar.style.transform = 'translateY(0)';
    }
    lastScroll = current;
}, 100));

// Aggiungi classe per animazioni hover bottoni
document.querySelectorAll('.btn, .btn-shop, .filter-btn').forEach(btn => {
    btn.addEventListener('mouseenter', () => {
        btn.style.transform = 'translateY(-4px) scale(1.04)';
        btn.style.boxShadow = '0 12px 30px rgba(139, 92, 246, 0.45)';
    });

    btn.addEventListener('mouseleave', () => {
        btn.style.transform = 'translateY(0) scale(1)';
        btn.style.boxShadow = '';
    });
});

// CSS dinamico per animazioni
const style = document.createElement('style');
style.textContent = `
    .scroll-to-top {
        position: fixed;
        bottom: 30px;
        right: 30px;
        width: 54px;
        height: 54px;
        border-radius: 50%;
        background: linear-gradient(135deg, #7c3aed, #ec4899);
        color: white;
        font-size: 24px;
        border: none;
        cursor: pointer;
        opacity: 0;
        visibility: hidden;
        transition: all 0.4s cubic-bezier(0.34, 1.56, 0.64, 1);
        z-index: 9999;
        box-shadow: 0 8px 25px rgba(124, 58, 237, 0.5);
    }

    .scroll-to-top.visible {
        opacity: 1;
        visibility: visible;
        transform: scale(1);
    }

    .scroll-to-top:hover {
        transform: scale(1.15);
        box-shadow: 0 12px 35px rgba(236, 72, 153, 0.6);
    }

    .navbar.scrolled {
        background: rgba(12, 12, 22, 0.92) !important;
        backdrop-filter: blur(16px);
        box-shadow: 0 6px 25px rgba(0,0,0,0.45) !important;
        padding: 0.9rem 0 !important;
    }

    .in-view {
        animation: fadeInUp 0.8s cubic-bezier(0.22, 1, 0.36, 1) forwards;
    }

    @keyframes fadeInUp {
        from {
            opacity: 0;
            transform: translateY(45px);
        }
        to {
            opacity: 1;
            transform: translateY(0);
        }
    }

    @keyframes neonPulse {
        0%, 100% { text-shadow: 0 0 8px #c084fc, 0 0 16px #a855f7; }
        50%      { text-shadow: 0 0 20px #c084fc, 0 0 40px #a855f7; }
    }

    .neon-glow {
        animation: neonPulse 3s infinite ease-in-out;
    }
`;
document.head.appendChild(style);

// Esegui al caricamento
window.addEventListener('load', () => {
    document.body.classList.add('loaded');

    // Piccola animazione iniziale hero
    if (heroContent) {
        heroContent.style.opacity = '0';
        setTimeout(() => {
            heroContent.style.transition = 'opacity 1.2s ease, transform 1.2s ease';
            heroContent.style.opacity = '1';
        }, 300);
    }
});

// Console welcome (rimasto ma più stilizzato)
console.log('%c✦ Venice City ER - Emergency Response Evolution ✦', 'font: bold 20px Orbitron; color: #a78bfa; text-shadow: 0 0 15px #7dd3fc;');
console.log('%cFuturistic Venice | Roblox 2026 | Join the Neon Revolution', 'font: 14px Inter; color: #7dd3fc;');