/* =============================================
   ELITE DARK PORTFOLIO — Scripts
   Siraj Patnam
   ============================================= */

document.addEventListener('DOMContentLoaded', () => {
    initScrollProgress();
    initNavbar();
    initCursorGlow();
    initParticles();
    initScrollReveal();
    initCardTilt();
    initTypingEffect();
    initMagneticButtons();
    initSmoothScroll();
});

/* =============================================
   SCROLL PROGRESS
   ============================================= */

function initScrollProgress() {
    const bar = document.createElement('div');
    bar.className = 'scroll-progress';
    document.body.prepend(bar);

    window.addEventListener('scroll', () => {
        const total = document.documentElement.scrollHeight - window.innerHeight;
        bar.style.width = ((window.scrollY / total) * 100) + '%';
    }, { passive: true });
}

/* =============================================
   NAVBAR GLASS ON SCROLL
   ============================================= */

function initNavbar() {
    const nav = document.querySelector('.navbar');
    if (!nav) return;
    window.addEventListener('scroll', () => {
        nav.classList.toggle('scrolled', window.scrollY > 55);
    }, { passive: true });
}

/* =============================================
   CURSOR GLOW (desktop only)
   ============================================= */

function initCursorGlow() {
    if (window.matchMedia('(pointer: coarse)').matches) return;

    const glow = document.createElement('div');
    glow.className = 'cursor-glow';
    document.body.appendChild(glow);

    let cx = window.innerWidth / 2;
    let cy = window.innerHeight / 2;
    let tx = cx, ty = cy;

    document.addEventListener('mousemove', e => {
        tx = e.clientX;
        ty = e.clientY;
    });

    (function loop() {
        cx += (tx - cx) * 0.07;
        cy += (ty - cy) * 0.07;
        glow.style.left = cx + 'px';
        glow.style.top  = cy + 'px';
        requestAnimationFrame(loop);
    })();
}

/* =============================================
   NEURAL PARTICLE SYSTEM (hero only)
   ============================================= */

function initParticles() {
    const hero = document.querySelector('header');
    if (!hero) return;

    const canvas = document.createElement('canvas');
    canvas.id = 'particles-canvas';
    hero.style.position = 'relative';
    hero.insertBefore(canvas, hero.firstChild);

    const ctx = canvas.getContext('2d');
    let particles = [];
    let mouse = { x: -9999, y: -9999 };

    function resize() {
        canvas.width  = hero.offsetWidth;
        canvas.height = hero.offsetHeight;
    }

    function spawn() {
        particles = [];
        const n = Math.min(Math.floor((canvas.width * canvas.height) / 14000), 90);
        for (let i = 0; i < n; i++) {
            particles.push({
                x:  Math.random() * canvas.width,
                y:  Math.random() * canvas.height,
                vx: (Math.random() - 0.5) * 0.45,
                vy: (Math.random() - 0.5) * 0.45,
                r:  Math.random() * 1.4 + 0.5,
                a:  Math.random() * 0.45 + 0.1,
            });
        }
    }

    function draw() {
        ctx.clearRect(0, 0, canvas.width, canvas.height);

        /* connections */
        const LINK_DIST = 130;
        for (let i = 0; i < particles.length; i++) {
            for (let j = i + 1; j < particles.length; j++) {
                const dx = particles[i].x - particles[j].x;
                const dy = particles[i].y - particles[j].y;
                const d  = Math.sqrt(dx * dx + dy * dy);
                if (d < LINK_DIST) {
                    ctx.beginPath();
                    ctx.moveTo(particles[i].x, particles[i].y);
                    ctx.lineTo(particles[j].x, particles[j].y);
                    ctx.strokeStyle = `rgba(0,212,255,${0.07 * (1 - d / LINK_DIST)})`;
                    ctx.lineWidth = 0.6;
                    ctx.stroke();
                }
            }
        }

        /* nodes */
        particles.forEach(p => {
            /* mouse repulsion */
            const mdx = p.x - mouse.x;
            const mdy = p.y - mouse.y;
            const md  = Math.sqrt(mdx * mdx + mdy * mdy);
            if (md < 110) {
                p.vx += (mdx / md) * 0.25;
                p.vy += (mdy / md) * 0.25;
            }

            /* dampen and move */
            p.vx *= 0.995;
            p.vy *= 0.995;
            p.x  += p.vx;
            p.y  += p.vy;

            if (p.x < 0 || p.x > canvas.width)  p.vx *= -1;
            if (p.y < 0 || p.y > canvas.height) p.vy *= -1;

            ctx.beginPath();
            ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
            ctx.fillStyle = `rgba(0,212,255,${p.a})`;
            ctx.fill();
        });

        requestAnimationFrame(draw);
    }

    hero.addEventListener('mousemove', e => {
        const r = hero.getBoundingClientRect();
        mouse.x = e.clientX - r.left;
        mouse.y = e.clientY - r.top;
    });
    hero.addEventListener('mouseleave', () => { mouse.x = -9999; mouse.y = -9999; });

    resize(); spawn(); draw();
    window.addEventListener('resize', () => { resize(); spawn(); });
}

/* =============================================
   SCROLL REVEAL
   ============================================= */

function initScrollReveal() {
    /* mark cards and major sections */
    document.querySelectorAll('.card').forEach((el, i) => {
        el.classList.add('reveal');
        el.style.transitionDelay = `${Math.min(i * 0.08, 0.5)}s`;
    });

    document.querySelectorAll(
        'section > .container > .text-center, ' +
        '.about-section, ' +
        '.col-xxl-8 > .text-center'
    ).forEach(el => el.classList.add('reveal'));

    const obs = new IntersectionObserver(entries => {
        entries.forEach(e => {
            if (e.isIntersecting) {
                e.target.classList.add('visible');
                obs.unobserve(e.target);
            }
        });
    }, { threshold: 0.08, rootMargin: '0px 0px -40px 0px' });

    setTimeout(() => {
        document.querySelectorAll('.reveal, .reveal-left').forEach(el => obs.observe(el));
    }, 100);
}

/* =============================================
   3D CARD TILT
   ============================================= */

function initCardTilt() {
    document.querySelectorAll('.card').forEach(card => {
        card.addEventListener('mousemove', e => {
            const r  = card.getBoundingClientRect();
            const x  = e.clientX - r.left;
            const y  = e.clientY - r.top;
            const rx = ((y - r.height / 2) / r.height) * 6;
            const ry = ((r.width / 2 - x) / r.width) * 6;
            card.style.transform = `perspective(900px) rotateX(${rx}deg) rotateY(${ry}deg) translateY(-4px)`;
        });
        card.addEventListener('mouseleave', () => {
            card.style.transform = 'perspective(900px) rotateX(0) rotateY(0) translateY(0)';
        });
    });
}

/* =============================================
   TYPING EFFECT (hero headline)
   ============================================= */

function initTypingEffect() {
    const el = document.querySelector('.display-3');
    if (!el) return;

    const full = el.textContent.trim();
    el.textContent = '';

    /* blinking cursor */
    const cur = document.createElement('span');
    cur.style.cssText = [
        'display:inline-block',
        'width:3px',
        'height:0.85em',
        'background:#00d4ff',
        'margin-left:5px',
        'vertical-align:middle',
        'border-radius:1px',
        'box-shadow:0 0 10px rgba(0,212,255,0.7)',
        'animation:blink 1s step-end infinite',
    ].join(';');
    el.appendChild(cur);

    let i = 0;
    function type() {
        if (i <= full.length) {
            el.childNodes[0]
                ? el.insertBefore(document.createTextNode(full.slice(0, i)), cur)
                : null;
            /* rebuild cleanly */
            el.innerHTML = '';
            el.appendChild(document.createTextNode(full.slice(0, i)));
            el.appendChild(cur);
            i++;
            setTimeout(type, i === 1 ? 700 : 42);
        } else {
            setTimeout(() => {
                cur.style.animation = 'none';
                cur.style.opacity   = '0';
                cur.style.transition = 'opacity 0.5s';
            }, 1800);
        }
    }
    setTimeout(type, 500);
}

/* =============================================
   MAGNETIC BUTTONS
   ============================================= */

function initMagneticButtons() {
    if (window.matchMedia('(pointer: coarse)').matches) return;

    document.querySelectorAll('.btn').forEach(btn => {
        btn.addEventListener('mousemove', e => {
            const r  = btn.getBoundingClientRect();
            const dx = e.clientX - (r.left + r.width / 2);
            const dy = e.clientY - (r.top  + r.height / 2);
            btn.style.transform = `translate(${dx * 0.18}px, ${dy * 0.18}px)`;
        });
        btn.addEventListener('mouseleave', () => {
            btn.style.transform = '';
        });
    });
}

/* =============================================
   SMOOTH SCROLL
   ============================================= */

function initSmoothScroll() {
    document.querySelectorAll('a[href^="#"]').forEach(a => {
        a.addEventListener('click', e => {
            const target = document.querySelector(a.getAttribute('href'));
            if (target) {
                e.preventDefault();
                target.scrollIntoView({ behavior: 'smooth', block: 'start' });
            }
        });
    });
}
