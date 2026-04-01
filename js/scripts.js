/* ==============================================
   SIRAJ PATNAM — SPACE TECH PORTFOLIO
   Animations & Interactions
   ============================================== */

document.addEventListener('DOMContentLoaded', () => {
    initScrollProgress();
    initNavbar();
    initCursorGlow();
    initStarfield();
    initScrollReveal();
    initCardTilt();
    initTypingEffect();
    initMagneticButtons();
    initCountUp();
});

/* ---------- SCROLL PROGRESS ---------- */
function initScrollProgress() {
    const bar = document.createElement('div');
    bar.className = 'scroll-progress';
    document.body.prepend(bar);
    window.addEventListener('scroll', () => {
        const t = document.documentElement.scrollHeight - window.innerHeight;
        bar.style.width = (t > 0 ? (window.scrollY / t) * 100 : 0) + '%';
    }, { passive: true });
}

/* ---------- NAVBAR ---------- */
function initNavbar() {
    const nav = document.querySelector('.navbar');
    if (!nav) return;

    window.addEventListener('scroll', () => {
        nav.classList.toggle('scrolled', window.scrollY > 50);
    }, { passive: true });

    /* mobile toggle */
    const toggle = document.querySelector('.nav-toggle');
    const links  = document.querySelector('.nav-links');
    if (toggle && links) {
        toggle.addEventListener('click', () => links.classList.toggle('open'));
        links.querySelectorAll('a').forEach(a =>
            a.addEventListener('click', () => links.classList.remove('open'))
        );
    }
}

/* ---------- CURSOR GLOW ---------- */
function initCursorGlow() {
    if (window.matchMedia('(pointer: coarse)').matches) return;
    const g = document.createElement('div');
    g.className = 'cursor-glow';
    document.body.appendChild(g);
    let cx = -500, cy = -500, tx = -500, ty = -500;
    document.addEventListener('mousemove', e => { tx = e.clientX; ty = e.clientY; });
    (function loop() {
        cx += (tx - cx) * .06; cy += (ty - cy) * .06;
        g.style.left = cx + 'px'; g.style.top = cy + 'px';
        requestAnimationFrame(loop);
    })();
}

/* ---------- STARFIELD CANVAS ---------- */
function initStarfield() {
    const canvas = document.getElementById('starfield');
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    const hero = canvas.parentElement;
    let stars = [], shooters = [], mouse = { x: -9999, y: -9999 };

    function resize() {
        canvas.width  = hero.offsetWidth;
        canvas.height = hero.offsetHeight;
    }

    function spawn() {
        stars = [];
        const n = Math.min(Math.floor((canvas.width * canvas.height) / 6000), 200);
        for (let i = 0; i < n; i++) {
            stars.push({
                x: Math.random() * canvas.width,
                y: Math.random() * canvas.height,
                r: Math.random() * 1.4 + .3,
                a: Math.random() * .7 + .1,
                twinkleSpeed: Math.random() * .02 + .005,
                twinklePhase: Math.random() * Math.PI * 2,
                vx: (Math.random() - .5) * .15,
                vy: (Math.random() - .5) * .15,
            });
        }
    }

    function maybeShoot() {
        if (Math.random() < .008) {
            shooters.push({
                x: Math.random() * canvas.width,
                y: 0,
                len: Math.random() * 80 + 40,
                speed: Math.random() * 6 + 4,
                angle: Math.PI / 4 + (Math.random() - .5) * .3,
                a: 1,
            });
        }
    }

    function draw() {
        ctx.clearRect(0, 0, canvas.width, canvas.height);

        /* connections near mouse */
        for (let i = 0; i < stars.length; i++) {
            const dx = stars[i].x - mouse.x;
            const dy = stars[i].y - mouse.y;
            const d  = Math.sqrt(dx * dx + dy * dy);
            if (d < 160) {
                for (let j = i + 1; j < stars.length; j++) {
                    const dx2 = stars[j].x - mouse.x;
                    const dy2 = stars[j].y - mouse.y;
                    const d2  = Math.sqrt(dx2 * dx2 + dy2 * dy2);
                    if (d2 < 160) {
                        const dd = Math.sqrt((stars[i].x-stars[j].x)**2 + (stars[i].y-stars[j].y)**2);
                        if (dd < 120) {
                            ctx.beginPath();
                            ctx.moveTo(stars[i].x, stars[i].y);
                            ctx.lineTo(stars[j].x, stars[j].y);
                            ctx.strokeStyle = `rgba(0,229,255,${.1 * (1 - dd/120)})`;
                            ctx.lineWidth = .5;
                            ctx.stroke();
                        }
                    }
                }
            }
        }

        /* stars */
        const t = performance.now() / 1000;
        stars.forEach(s => {
            /* mouse interaction */
            const mdx = s.x - mouse.x;
            const mdy = s.y - mouse.y;
            const md  = Math.sqrt(mdx * mdx + mdy * mdy);
            if (md < 120) {
                s.vx += (mdx / md) * .08;
                s.vy += (mdy / md) * .08;
            }
            s.vx *= .99; s.vy *= .99;
            s.x += s.vx; s.y += s.vy;
            if (s.x < 0 || s.x > canvas.width)  s.vx *= -1;
            if (s.y < 0 || s.y > canvas.height) s.vy *= -1;

            const twinkle = .5 + .5 * Math.sin(t * s.twinkleSpeed * 60 + s.twinklePhase);
            const alpha = s.a * twinkle;
            ctx.beginPath();
            ctx.arc(s.x, s.y, s.r, 0, Math.PI * 2);
            ctx.fillStyle = `rgba(200,220,255,${alpha})`;
            ctx.fill();

            /* glow on bigger stars */
            if (s.r > 1) {
                ctx.beginPath();
                ctx.arc(s.x, s.y, s.r * 3, 0, Math.PI * 2);
                ctx.fillStyle = `rgba(0,229,255,${alpha * .08})`;
                ctx.fill();
            }
        });

        /* shooting stars */
        maybeShoot();
        shooters = shooters.filter(s => s.a > .01);
        shooters.forEach(s => {
            s.x += Math.cos(s.angle) * s.speed;
            s.y += Math.sin(s.angle) * s.speed;
            s.a *= .97;
            const ex = s.x - Math.cos(s.angle) * s.len;
            const ey = s.y - Math.sin(s.angle) * s.len;
            const grad = ctx.createLinearGradient(s.x, s.y, ex, ey);
            grad.addColorStop(0, `rgba(255,255,255,${s.a})`);
            grad.addColorStop(1, 'rgba(255,255,255,0)');
            ctx.beginPath();
            ctx.moveTo(s.x, s.y);
            ctx.lineTo(ex, ey);
            ctx.strokeStyle = grad;
            ctx.lineWidth = 1.5;
            ctx.stroke();
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

/* ---------- SCROLL REVEAL ---------- */
function initScrollReveal() {
    const obs = new IntersectionObserver(entries => {
        entries.forEach(e => {
            if (e.isIntersecting) { e.target.classList.add('visible'); obs.unobserve(e.target); }
        });
    }, { threshold: .08, rootMargin: '0px 0px -30px 0px' });

    document.querySelectorAll(
        '.project-card, .skill-group, .edu-card, .cert-card, .timeline-item, ' +
        '.stat-card, .section-header, .contact-wrapper, .about-text, .about-stats'
    ).forEach((el, i) => {
        el.classList.add('reveal');
        el.style.transitionDelay = `${Math.min(i * .06, .5)}s`;
        obs.observe(el);
    });
}

/* ---------- 3D CARD TILT ---------- */
function initCardTilt() {
    if (window.matchMedia('(pointer: coarse)').matches) return;
    document.querySelectorAll('.project-card, .skill-group, .edu-card').forEach(card => {
        card.addEventListener('mousemove', e => {
            const r = card.getBoundingClientRect();
            const x = e.clientX - r.left;
            const y = e.clientY - r.top;
            const rx = ((y - r.height / 2) / r.height) * 6;
            const ry = ((r.width / 2 - x) / r.width) * 6;
            card.style.transform = `perspective(900px) rotateX(${rx}deg) rotateY(${ry}deg) translateY(-5px)`;
        });
        card.addEventListener('mouseleave', () => {
            card.style.transform = '';
        });
    });
}

/* ---------- TYPING EFFECT ---------- */
function initTypingEffect() {
    const el = document.querySelector('.hero-title .gradient');
    if (!el) return;
    const full = el.textContent.trim();
    el.textContent = '';

    const cursor = document.createElement('span');
    cursor.className = 'cursor';
    el.parentElement.appendChild(cursor);

    let i = 0;
    function type() {
        if (i <= full.length) {
            el.textContent = full.slice(0, i);
            i++;
            setTimeout(type, i === 1 ? 600 : 40);
        } else {
            setTimeout(() => {
                cursor.style.animation = 'none';
                cursor.style.opacity = '0';
                cursor.style.transition = 'opacity .6s';
            }, 2000);
        }
    }
    setTimeout(type, 400);
}

/* ---------- MAGNETIC BUTTONS ---------- */
function initMagneticButtons() {
    if (window.matchMedia('(pointer: coarse)').matches) return;
    document.querySelectorAll('.btn').forEach(btn => {
        btn.addEventListener('mousemove', e => {
            const r = btn.getBoundingClientRect();
            const dx = e.clientX - (r.left + r.width / 2);
            const dy = e.clientY - (r.top + r.height / 2);
            btn.style.transform = `translate(${dx * .2}px, ${dy * .2}px)`;
        });
        btn.addEventListener('mouseleave', () => { btn.style.transform = ''; });
    });
}

/* ---------- COUNT UP ---------- */
function initCountUp() {
    const nums = document.querySelectorAll('.stat-number');
    if (!nums.length) return;
    const obs = new IntersectionObserver(entries => {
        entries.forEach(e => {
            if (e.isIntersecting) {
                const el = e.target;
                const end = el.dataset.count;
                const suffix = el.dataset.suffix || '';
                let current = 0;
                const step = Math.max(1, Math.ceil(end / 50));
                const iv = setInterval(() => {
                    current += step;
                    if (current >= end) { current = end; clearInterval(iv); }
                    el.textContent = current + suffix;
                }, 30);
                obs.unobserve(el);
            }
        });
    }, { threshold: .5 });
    nums.forEach(n => obs.observe(n));
}
