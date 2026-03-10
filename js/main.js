/* ═══════════════════════════════════════════
   WEBHATRIX — MAIN JS (CREATIVE UPGRADE)
   GSAP ScrollTrigger · 3D Title · Blobs · Parallax
   Slot Counters · SVG Path · Glitch · All original features
   ═══════════════════════════════════════════ */

(function () {
    'use strict';

    /* ── JS Enabled Flag ── */
    document.body.classList.add('js-enabled');

    /* ── Page Loader ── */
    const loader = document.getElementById('pageLoader');
    if (loader) {
        setTimeout(() => loader.classList.add('hide'), 1400);
        setTimeout(() => { if (loader.parentNode) loader.parentNode.removeChild(loader); }, 1900);
    }

    /* ── Scroll Reveal (Intersection Observer) ── */
    const revealEls = document.querySelectorAll('.reveal, .reveal-left, .reveal-right');
    if (revealEls.length) {
        // Reduced motion check
        const isReduced = window.matchMedia('(prefers-reduced-motion:reduce)').matches;

        const obs = new IntersectionObserver((entries) => {
            entries.forEach(e => {
                if (e.isIntersecting) {
                    const delay = e.target.dataset.delay || 0;
                    if (isReduced) {
                        e.target.classList.add('visible');
                    } else {
                        setTimeout(() => e.target.classList.add('visible'), +delay);
                    }
                    obs.unobserve(e.target);
                }
            });
        }, { threshold: 0.15 });
        revealEls.forEach(el => obs.observe(el));
    }

    /* ═══════════════════════════════════════════
       GSAP REGISTRATION
       ═══════════════════════════════════════════ */
    if (typeof gsap !== 'undefined' && typeof ScrollTrigger !== 'undefined') {
        gsap.registerPlugin(ScrollTrigger);
    }

    /* ═══════════════════════════════════════════
       NATIVE SCROLL LOOP (Optimized)
       ═══════════════════════════════════════════ */
    const navbar = document.getElementById('navbar');
    let rafRunning = false;

    const horizSection = document.querySelector('.horiz-section');
    const horizTrack = document.querySelector('.horiz-track');
    const timelineFill = document.querySelector('.timeline-fill');
    const timelineWrap = document.querySelector('.timeline');
    const timelineNodes = document.querySelectorAll('.timeline-node');

    function updateHorizontalScroll() {
        if (!horizSection || !horizTrack) return;
        if (window.innerWidth < 769) return;
        const rect = horizSection.getBoundingClientRect();
        const progress = -rect.top / (rect.height - window.innerHeight);
        const clamped = Math.max(0, Math.min(1, progress));
        const maxTranslate = horizTrack.scrollWidth - window.innerWidth;
        horizTrack.style.transform = `translateX(${-clamped * maxTranslate}px)`;
    }

    function updateTimelineFill() {
        if (!timelineFill || !timelineWrap) return;
        const rect = timelineWrap.getBoundingClientRect();
        const total = timelineWrap.offsetHeight;
        const scrolled = Math.min(Math.max(-rect.top + window.innerHeight * 0.5, 0), total);
        timelineFill.style.height = scrolled + 'px';
        timelineNodes.forEach(n => {
            const nr = n.getBoundingClientRect();
            if (nr.top < window.innerHeight * 0.65) n.classList.add('active');
        });
    }

    function onScroll() {
        if (!rafRunning) {
            rafRunning = true;
            requestAnimationFrame(() => {
                const currentY = window.scrollY;

                if (navbar) navbar.classList.toggle('scrolled', currentY > 60);

                const bar = document.getElementById('scroll-progress');
                if (bar) {
                    const max = document.documentElement.scrollHeight - window.innerHeight;
                    bar.style.width = max > 0 ? (currentY / max * 100) + '%' : '0%';
                }

                const btt = document.getElementById('back-to-top');
                if (btt) btt.classList.toggle('visible', currentY > 500);

                updateHorizontalScroll();
                updateTimelineFill();

                rafRunning = false;
            });
        }
    }

    window.addEventListener('scroll', onScroll, { passive: true });
    // Trigger once on load
    onScroll();

    document.getElementById('back-to-top')?.addEventListener('click', (e) => {
        e.preventDefault();
        window.scrollTo({ top: 0, behavior: 'smooth' });
    });

    /* ═══════════════════════════════════════════
       GPU CURSOR (separate RAF)
       ═══════════════════════════════════════════ */
    const cursorDot = document.querySelector('.cursor-dot');
    const cursorRing = document.querySelector('.cursor-ring');
    let mX = -100, mY = -100, rX = -100, rY = -100;

    // Parallax state
    const parallaxLayers = document.querySelectorAll('.p-layer');
    let heroParallaxX = 0, heroParallaxY = 0;
    let targetParallaxX = 0, targetParallaxY = 0;

    // Global Hero Visibility State
    let isHeroVisible = true;
    const heroObserver = new IntersectionObserver((entries) => {
        entries.forEach(e => isHeroVisible = e.isIntersecting);
    }, { threshold: 0 });
    const mainHeroSec = document.querySelector('.hero');
    if (mainHeroSec) heroObserver.observe(mainHeroSec);

    if (cursorDot && cursorRing && window.matchMedia('(hover:hover)').matches) {
        document.addEventListener('mousemove', e => {
            mX = e.clientX; mY = e.clientY;
            targetParallaxX = (e.clientX / window.innerWidth - 0.5) * 2;
            targetParallaxY = (e.clientY / window.innerHeight - 0.5) * 2;
        }, { passive: true });

        function cursorLoop() {
            cursorDot.style.transform = `translate(${mX - 4}px,${mY - 4}px)`;
            rX += (mX - rX) * 0.14;
            rY += (mY - rY) * 0.14;
            cursorRing.style.transform = `translate(${rX - 18}px,${rY - 18}px)`;

            // UPGRADE 7: Parallax depth layers (only if hero is visible)
            if (isHeroVisible) {
                heroParallaxX += (targetParallaxX - heroParallaxX) * 0.06;
                heroParallaxY += (targetParallaxY - heroParallaxY) * 0.06;
                parallaxLayers.forEach(layer => {
                    const speed = parseFloat(layer.dataset.speed) || 0.05;
                    layer.style.transform = `translate(${heroParallaxX * speed * 100}px, ${heroParallaxY * speed * 100}px)`;
                });
            }

            requestAnimationFrame(cursorLoop);
        }
        cursorLoop();

        // Hover states
        document.querySelectorAll('a,button,.glass-card,.btn,.filter-btn,.faq-question,.portfolio-card,.menu-toggle,.whatsapp-float').forEach(el => {
            el.addEventListener('mouseenter', () => {
                cursorDot.style.background = '#7C3AED';
                cursorDot.style.boxShadow = '0 0 10px #7C3AED, 0 0 20px #7C3AED';
                cursorRing.style.width = '54px'; cursorRing.style.height = '54px';
                cursorRing.style.borderColor = '#7C3AED';
            });
            el.addEventListener('mouseleave', () => {
                cursorDot.style.background = '#00E5FF';
                cursorDot.style.boxShadow = '0 0 10px #00E5FF, 0 0 20px #00E5FF';
                cursorRing.style.width = '36px'; cursorRing.style.height = '36px';
                cursorRing.style.borderColor = 'rgba(0,229,255,0.5)';
            });
        });
    }

    /* ── UPGRADE 2: 3D TITLE PARALLAX ── */
    const hero3d = document.getElementById('hero3d');
    if (hero3d) {
        const titleFront = hero3d.querySelector('.title-front');
        const titleMid = hero3d.querySelector('.title-mid');
        const titleBack = hero3d.querySelector('.title-back');

        document.addEventListener('mousemove', e => {
            if (!isHeroVisible) return;
            const x = (e.clientX / window.innerWidth - 0.5) * 20;
            const y = (e.clientY / window.innerHeight - 0.5) * 10;
            if (titleFront) titleFront.style.transform = 'translate(0,0)';
            if (titleMid) titleMid.style.transform = `translate(${3 + x * 0.3}px, ${3 + y * 0.3}px)`;
            if (titleBack) titleBack.style.transform = `translate(${6 + x * 0.6}px, ${6 + y * 0.6}px)`;
        }, { passive: true });
    }

    /* ═══════════════════════════════════════════
       THREE.JS HERO (45fps cap)
       ═══════════════════════════════════════════ */
    const threeCanvas = document.getElementById('threeCanvas');
    if (threeCanvas && typeof THREE !== 'undefined') {
        const scene = new THREE.Scene();
        const camera = new THREE.PerspectiveCamera(75, threeCanvas.offsetWidth / threeCanvas.offsetHeight, 0.1, 100);
        camera.position.z = 5;
        const renderer = new THREE.WebGLRenderer({ canvas: threeCanvas, antialias: false, alpha: true, powerPreference: 'high-performance' });
        renderer.setPixelRatio(Math.min(window.devicePixelRatio, 1.5));
        renderer.setSize(threeCanvas.offsetWidth, threeCanvas.offsetHeight);
        const geo1 = new THREE.IcosahedronGeometry(2.2, 1);
        const mat1 = new THREE.MeshBasicMaterial({ wireframe: true, color: 0x00E5FF, opacity: 0.13, transparent: true });
        const mesh1 = new THREE.Mesh(geo1, mat1);
        scene.add(mesh1);
        const geo2 = new THREE.IcosahedronGeometry(1.8, 1);
        const mat2 = new THREE.MeshBasicMaterial({ wireframe: true, color: 0x7C3AED, opacity: 0.06, transparent: true });
        const mesh2 = new THREE.Mesh(geo2, mat2);
        scene.add(mesh2);
        let targetRotX = 0, targetRotY = 0;
        document.addEventListener('mousemove', e => {
            targetRotX = (e.clientY / window.innerHeight - 0.5) * 0.4;
            targetRotY = (e.clientX / window.innerWidth - 0.5) * 0.4;
        }, { passive: true });
        let lastFrame = 0; const FPS_INTERVAL = 1000 / 45; let threeActive = true;
        function threeLoop(timestamp) {
            if (!threeActive) return;
            requestAnimationFrame(threeLoop);
            const elapsed = timestamp - lastFrame;
            if (elapsed < FPS_INTERVAL) return;
            lastFrame = timestamp - (elapsed % FPS_INTERVAL);
            mesh1.rotation.x += 0.0007; mesh1.rotation.y += 0.001;
            mesh2.rotation.x -= 0.0005; mesh2.rotation.y -= 0.0008;
            mesh1.rotation.x += (targetRotX - mesh1.rotation.x) * 0.03;
            mesh1.rotation.y += (targetRotY - mesh1.rotation.y) * 0.03;
            renderer.render(scene, camera);
        }
        requestAnimationFrame(threeLoop);
        document.addEventListener('visibilitychange', () => {
            if (document.hidden) { threeActive = false; } else { threeActive = true; requestAnimationFrame(threeLoop); }
        });

        // Use global isHeroVisible tracker to throttle canvas
        const threeCheckInterval = setInterval(() => {
            if (isHeroVisible && !document.hidden && !threeActive) {
                threeActive = true;
                requestAnimationFrame(threeLoop);
            } else if (!isHeroVisible) {
                threeActive = false;
            }
        }, 300);

        let resizeTimer;
        window.addEventListener('resize', () => {
            clearTimeout(resizeTimer);
            resizeTimer = setTimeout(() => {
                camera.aspect = threeCanvas.offsetWidth / threeCanvas.offsetHeight;
                camera.updateProjectionMatrix();
                renderer.setSize(threeCanvas.offsetWidth, threeCanvas.offsetHeight);
            }, 300);
        }, { passive: true });
    }

    /* ── Particle Canvas ── */
    const canvas = document.getElementById('particleCanvas');
    if (canvas) {
        const ctx = canvas.getContext('2d');
        let W, H, particles = [];
        function resize() { W = canvas.width = canvas.offsetWidth; H = canvas.height = canvas.offsetHeight; }
        resize();
        let pResizeTimer;
        window.addEventListener('resize', () => { clearTimeout(pResizeTimer); pResizeTimer = setTimeout(resize, 300); });
        const pCount = document.getElementById('threeCanvas') ? 40 : 130;
        const COLORS = ['rgba(0,229,255,', 'rgba(124,58,237,'];
        for (let i = 0; i < pCount; i++) {
            particles.push({ x: Math.random() * W, y: Math.random() * H, r: Math.random() * 2 + 0.5, vx: (Math.random() - 0.5) * 0.4, vy: (Math.random() - 0.5) * 0.4, c: COLORS[i % 2] });
        }
        let lastParticleFrame = 0;
        const PARTICLE_FPS_INTERVAL = 1000 / 30; // 30 FPS cap

        function drawParticles(timestamp) {
            if (particlesActive) requestAnimationFrame(drawParticles);

            const elapsed = timestamp - lastParticleFrame;
            if (elapsed < PARTICLE_FPS_INTERVAL) return;
            lastParticleFrame = timestamp - (elapsed % PARTICLE_FPS_INTERVAL);

            ctx.clearRect(0, 0, W, H);
            for (let i = 0; i < particles.length; i++) {
                const p = particles[i];
                p.x += p.vx; p.y += p.vy;
                if (p.x < 0) p.x = W; if (p.x > W) p.x = 0;
                if (p.y < 0) p.y = H; if (p.y > H) p.y = 0;
                ctx.beginPath(); ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
                ctx.fillStyle = p.c + '0.7)'; ctx.fill();
                for (let j = i + 1; j < particles.length; j++) {
                    const q = particles[j];
                    const dx = p.x - q.x, dy = p.y - q.y, d = Math.sqrt(dx * dx + dy * dy);
                    if (d < 120) { ctx.beginPath(); ctx.moveTo(p.x, p.y); ctx.lineTo(q.x, q.y); ctx.strokeStyle = 'rgba(0,229,255,' + (1 - d / 120) * 0.15 + ')'; ctx.lineWidth = 0.5; ctx.stroke(); }
                }
            }
        }

        let particlesActive = true;

        // Use global isHeroVisible tracker
        setInterval(() => {
            if (isHeroVisible && !particlesActive) {
                particlesActive = true;
                requestAnimationFrame(drawParticles);
            } else if (!isHeroVisible) {
                particlesActive = false;
            }
        }, 300);

        drawParticles();
    }

    /* ── Typing Animation ── */
    const typingEl = document.getElementById('typingText');
    if (typingEl) {
        const words = ['Web Applications', 'Mobile Apps', 'E-Commerce Platforms', 'SaaS Products', 'AI Integrations', 'Custom APIs'];
        let wi = 0, ci = 0, deleting = false;
        function typeLoop() {
            const word = words[wi];
            if (!deleting) {
                typingEl.textContent = word.substring(0, ++ci);
                if (ci === word.length) { deleting = true; setTimeout(typeLoop, 1800); return; }
                setTimeout(typeLoop, 80);
            } else {
                typingEl.textContent = word.substring(0, --ci);
                if (ci === 0) { deleting = false; wi = (wi + 1) % words.length; setTimeout(typeLoop, 400); return; }
                setTimeout(typeLoop, 40);
            }
        }
        setTimeout(typeLoop, 800);
    }

    /* ═══════════════════════════════════════════
       UPGRADE 1: GSAP SCROLLTRIGGER ANIMATIONS
       ═══════════════════════════════════════════ */
    if (typeof gsap !== 'undefined' && typeof ScrollTrigger !== 'undefined') {

        // Reduced motion accessibility
        if (window.matchMedia('(prefers-reduced-motion:reduce)').matches) {
            return; // Skip complex GSAP animations to prevent opacity traps
        }
        // Batch Section Titles
        document.querySelectorAll('.section-title').forEach(title => {
            const words = title.innerText.split(' ');
            title.innerHTML = words.map(w =>
                `<span class="gsap-word" style="display:inline-block;overflow:hidden"><span style="display:inline-block">${w}</span></span>`
            ).join(' ');
        });

        ScrollTrigger.batch('.section-title', {
            start: 'top 85%',
            once: true,
            onEnter: batch => {
                batch.forEach((title, i) => {
                    gsap.from(title.querySelectorAll('.gsap-word span'), {
                        y: '110%', opacity: 0, duration: 0.8, stagger: 0.08, ease: 'power3.out', delay: i * 0.15
                    });
                });
            }
        });

        // Batch Timeline items
        ScrollTrigger.batch('.timeline-step', {
            start: 'top 80%',
            once: true,
            onEnter: batch => {
                batch.forEach((item, i) => {
                    const node = item.querySelector('.node-circle');
                    if (node) {
                        gsap.from(node, {
                            scale: 0, duration: 0.5, ease: 'back.out(2)', delay: i * 0.1
                        });
                    }
                });
            }
        });

        // Contact — handled by IntersectionObserver reveal

        // Footer — curtain reveal
        gsap.from('footer', {
            scrollTrigger: { trigger: 'footer', start: 'top 95%' },
            y: 40, opacity: 0, duration: 1, ease: 'power2.out'
        });

        // Pinned hero text
        if (document.querySelector('.hero')) {
            gsap.to('.hero-content', {
                scrollTrigger: { trigger: '.hero', start: 'top top', end: 'bottom top', scrub: 1 },
                y: -80, opacity: 0, ease: 'none'
            });
        }

        // UPGRADE 5: SVG Path Drawing
        const processPath = document.getElementById('process-path');
        if (processPath) {
            const length = processPath.getTotalLength();
            processPath.style.strokeDasharray = length;
            processPath.style.strokeDashoffset = length;
            gsap.to(processPath, {
                strokeDashoffset: 0, ease: 'none',
                scrollTrigger: { trigger: '.timeline', start: 'top 70%', end: 'bottom 30%', scrub: 1.5 }
            });
        }

        // GSAP Performance (Debounced)
        let stTimeout;
        const debounceRefresh = () => {
            clearTimeout(stTimeout);
            stTimeout = setTimeout(() => ScrollTrigger.refresh(), 250);
        };
        window.addEventListener('load', debounceRefresh, { passive: true });
        window.addEventListener('resize', debounceRefresh, { passive: true });
        document.fonts.ready.then(debounceRefresh);
        document.addEventListener('click', e => {
            const link = e.target.closest('a[href$=".html"]');
            if (link) ScrollTrigger.killAll();
        });
    }

    /* ── Refresh ScrollTrigger ── */
    setTimeout(() => {
        if (typeof ScrollTrigger !== 'undefined') ScrollTrigger.refresh();
    }, 500);

    /* ── UPGRADE 6: SLOT MACHINE COUNTERS ── */
    function buildSlotCounter(el) {
        const target = el.dataset.count || el.dataset.target;
        if (!target) return;
        const digits = target.toString().split('');
        const container = el.querySelector('.slot-digits');
        // If no slot-digits container, use legacy counter
        if (!container || el.dataset.built) return;
        el.dataset.built = 'true';
        digits.forEach(digit => {
            const col = document.createElement('div');
            col.className = 'slot-col';
            col.style.cssText = 'display:inline-block;overflow:hidden;height:1.1em;vertical-align:bottom;';
            const strip = document.createElement('div');
            strip.className = 'slot-strip';
            strip.style.cssText = 'display:flex;flex-direction:column;transition:transform 1.2s cubic-bezier(0.23,1,0.32,1);transform:translateY(0);';
            for (let i = 0; i <= 9; i++) {
                const d = document.createElement('span');
                d.textContent = i;
                d.style.cssText = "display:block;height:1.1em;line-height:1.1;font-family:'Syne',sans-serif;font-weight:800;color:var(--cyan);";
                strip.appendChild(d);
            }
            const finalD = document.createElement('span');
            finalD.textContent = digit;
            finalD.style.cssText = "display:block;height:1.1em;line-height:1.1;font-family:'Syne',sans-serif;font-weight:800;color:var(--cyan);";
            strip.appendChild(finalD);
            col.appendChild(strip);
            container.appendChild(col);
        });
    }

    function spinSlotCounter(el) {
        if (el.dataset.spun) return;
        el.dataset.spun = 'true';
        el.classList.add('counting');
        el.querySelectorAll('.slot-strip').forEach((strip, i) => {
            setTimeout(() => {
                const itemHeight = strip.parentElement.offsetHeight;
                strip.style.transform = `translateY(-${itemHeight * 10}px)`;
            }, i * 120);
        });
        setTimeout(() => el.classList.remove('counting'), 1800);
    }

    document.querySelectorAll('.slot-counter').forEach(buildSlotCounter);
    const slotObserver = new IntersectionObserver(entries => {
        entries.forEach(e => {
            if (e.isIntersecting) { spinSlotCounter(e.target); slotObserver.unobserve(e.target); }
        });
    }, { threshold: 0.5 });
    document.querySelectorAll('.slot-counter').forEach(el => slotObserver.observe(el));

    /* ── Counter Animation (legacy fallback with glow) ── */
    const counters = document.querySelectorAll('[data-count]:not(.slot-counter)');
    if (counters.length) {
        const cobs = new IntersectionObserver(entries => {
            entries.forEach(e => {
                if (e.isIntersecting) {
                    const el = e.target, target = +el.dataset.count;
                    let current = 0;
                    const step = Math.ceil(target / 60);
                    el.classList.add('counting');
                    const iv = setInterval(() => {
                        current += step;
                        if (current >= target) { current = target; clearInterval(iv); el.classList.remove('counting'); }
                        el.textContent = current + (el.dataset.suffix || '');
                    }, 25);
                    cobs.unobserve(el);
                }
            });
        }, { threshold: 0.5 });
        counters.forEach(c => cobs.observe(c));
    }

    /* ── 3D Tilt Cards ── */
    document.querySelectorAll('.glass-card, .portfolio-card, .project-card, .blog-card').forEach(card => {
        if (window.matchMedia('(hover:none)').matches) return;
        card.classList.add('tilt-card');
        card.style.position = card.style.position || 'relative';
        const glare = document.createElement('div');
        glare.className = 'card-glare';
        card.appendChild(glare);
        card.addEventListener('mousemove', e => {
            const rect = card.getBoundingClientRect();
            const x = (e.clientX - rect.left) / rect.width - 0.5;
            const y = (e.clientY - rect.top) / rect.height - 0.5;
            card.style.transform = `perspective(800px) rotateY(${x * 16}deg) rotateX(${-y * 16}deg) translateZ(10px)`;
            card.style.transition = 'transform 0.1s ease';
            glare.style.background = `radial-gradient(circle at ${x * 100 + 50}% ${y * 100 + 50}%, rgba(255,255,255,0.08), transparent 60%)`;
        });
        card.addEventListener('mouseleave', () => {
            card.style.transform = 'perspective(800px) rotateY(0) rotateX(0) translateZ(0)';
            card.style.transition = 'transform 0.5s ease';
            glare.style.background = 'none';
        });
    });

    /* ── Magnetic Buttons ── */
    document.querySelectorAll('.btn, .nav-cta, .footer-socials a').forEach(btn => {
        if (window.matchMedia('(hover:none)').matches) return;
        btn.addEventListener('mouseenter', () => { btn.style.transition = 'transform 0.1s linear'; });
        btn.addEventListener('mousemove', e => {
            const rect = btn.getBoundingClientRect();
            const x = (e.clientX - rect.left - rect.width / 2) * 0.35;
            const y = (e.clientY - rect.top - rect.height / 2) * 0.35;
            btn.style.transform = `translate(${x}px, ${y}px)`;
        });
        btn.addEventListener('mouseleave', () => {
            btn.style.transform = 'translate(0,0)';
            btn.style.transition = 'transform 0.5s cubic-bezier(0.25,0.46,0.45,0.94)';
        });
    });

    /* ── FAQ Accordion ── */
    document.querySelectorAll('.faq-question').forEach(q => {
        q.addEventListener('click', () => {
            const item = q.parentElement;
            const answer = item.querySelector('.faq-answer');
            const isOpen = item.classList.contains('open');
            document.querySelectorAll('.faq-item.open').forEach(fi => {
                fi.classList.remove('open'); fi.querySelector('.faq-answer').style.maxHeight = '0';
            });
            if (!isOpen) { item.classList.add('open'); answer.style.maxHeight = answer.scrollHeight + 'px'; }
        });
    });

    /* ── Portfolio Filter ── */
    document.querySelectorAll('.filter-btn').forEach(btn => {
        btn.addEventListener('click', () => {
            document.querySelectorAll('.filter-btn').forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
            const cat = btn.dataset.filter;
            document.querySelectorAll('.portfolio-card, .blog-card[data-category]').forEach(card => {
                if (cat === 'all' || card.dataset.category === cat) card.classList.remove('hide');
                else card.classList.add('hide');
            });
        });
    });

    /* ── Project Modal ── */
    const modal = document.getElementById('projectModal');
    if (modal) {
        document.querySelectorAll('[data-project]').forEach(trigger => {
            trigger.addEventListener('click', () => {
                const id = trigger.dataset.project;
                const data = window.__projects && window.__projects[id];
                if (!data) return;
                modal.querySelector('.modal-visual').style.background = data.gradient;
                modal.querySelector('.modal-info .category').textContent = data.category;
                modal.querySelector('.modal-info h2').textContent = data.name;
                modal.querySelector('.modal-desc').textContent = data.desc;
                modal.querySelector('.modal-challenge').textContent = data.challenge;
                modal.querySelector('.modal-solution').textContent = data.solution;
                modal.querySelector('.modal-tech-tags').innerHTML = data.tech.map(t => `<span class="tech-tag">${t}</span>`).join('');
                modal.querySelector('.modal-results').innerHTML = data.results.map(r => `<div class="result"><div class="val">${r.val}</div><div class="rlabel">${r.label}</div></div>`).join('');
                modal.classList.add('open'); document.body.style.overflow = 'hidden';
            });
        });
        function closeModal() { modal.classList.remove('open'); document.body.style.overflow = ''; }
        modal.querySelector('.modal-close').addEventListener('click', closeModal);
        modal.addEventListener('click', e => { if (e.target === modal) closeModal(); });
        document.addEventListener('keydown', e => { if (e.key === 'Escape' && modal.classList.contains('open')) closeModal(); });
    }

    /* ── Contact Form ── */
    /* ── Contact & Quote Forms (Web3Forms) ── */
    const forms = document.querySelectorAll('.contact-form');
    forms.forEach(form => {
        form.addEventListener('submit', async e => {
            e.preventDefault();
            let valid = true;
            form.querySelectorAll('[required]').forEach(inp => {
                const group = inp.closest('.form-group');
                if (!group) return;
                if (!inp.value.trim()) { group.classList.add('error'); group.classList.remove('success'); valid = false; }
                else if (inp.type === 'email' && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(inp.value)) { group.classList.add('error'); group.classList.remove('success'); valid = false; }
                else { group.classList.remove('error'); group.classList.add('success'); }
            });
            if (!valid) return;

            const btn = form.querySelector('.btn-submit');
            btn.classList.add('loading');

            const formData = new FormData(form);

            // Send Data to Make.com Webhook for WhatsApp
            const makeData = Object.fromEntries(formData.entries());
            const services = [];
            for (let [key, value] of formData.entries()) {
                if (key === 'services') services.push(value);
            }
            if (services.length > 0) makeData.services = services.join(', ');

            fetch('https://hook.eu1.make.com/k737q67wcp25mq9s0xam5w3us438vy8k', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(makeData)
            }).catch(e => console.error("Webhook Error:", e));

            try {
                const response = await fetch('https://api.web3forms.com/submit', {
                    method: 'POST',
                    body: formData
                });
                const data = await response.json();

                if (data.success) {
                    btn.classList.remove('loading');
                    form.style.display = 'none';
                    const successMsg = form.parentElement.querySelector('.form-success');
                    if (successMsg) successMsg.classList.add('show');
                } else {
                    console.error('Form Error:', data);
                    alert('Something went wrong submitting your request. Please try again later.');
                    btn.classList.remove('loading');
                }
            } catch (error) {
                console.error('Fetch Error:', error);
                alert('Something went wrong connecting to the server. Please check your connection and try again.');
                btn.classList.remove('loading');
            }
        });

        form.querySelectorAll('input,select,textarea').forEach(inp => {
            inp.addEventListener('input', () => {
                const g = inp.closest('.form-group');
                if (g && inp.value.trim()) g.classList.remove('error');
            });
        });
    });

    /* ── Newsletter Form ── */
    const nlForm = document.getElementById('newsletterForm');
    if (nlForm) {
        nlForm.addEventListener('submit', e => {
            e.preventDefault();
            const inp = nlForm.querySelector('input');
            const btn = nlForm.querySelector('.btn');
            if (!inp.value.trim() || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(inp.value)) { inp.style.borderColor = '#ef4444'; return; }
            btn.innerHTML = '<span>Subscribed ✓</span>'; btn.style.background = '#22c55e'; inp.disabled = true; btn.disabled = true;
        });
    }

    /* ═══════════════════════════════════════════
       ANIMATED GRAIN OVERLAY
       ═══════════════════════════════════════════ */
    const g = document.getElementById('grain');
    const gc = g ? g.getContext('2d') : null;
    function renderGrain() {
        if (!gc) return;
        g.width = window.innerWidth; g.height = window.innerHeight;
        const img = gc.createImageData(g.width, g.height);
        const d = img.data;
        for (let i = 0; i < d.length; i += 4) { const v = Math.random() * 255 | 0; d[i] = d[i + 1] = d[i + 2] = v; d[i + 3] = 255; }
        gc.putImageData(img, 0, 0);
    }
    let grainTick = 0;
    function grainLoop() { if (++grainTick % 4 === 0) renderGrain(); requestAnimationFrame(grainLoop); }
    if (gc) { renderGrain(); grainLoop(); }

    /* ── CURSOR SPARKLE TRAIL ── */
    let lastSparkleTime = 0;
    document.addEventListener('mousemove', e => {
        const now = Date.now();
        if (now - lastSparkleTime < 55) return;
        lastSparkleTime = now;
        const s = document.createElement('div');
        const size = 2 + Math.random() * 4;
        const color = Math.random() > 0.5 ? '#00E5FF' : '#7C3AED';
        const angle = Math.random() * 360;
        const dist = 10 + Math.random() * 20;
        s.style.cssText = `position:fixed;pointer-events:none;z-index:99995;width:${size}px;height:${size}px;border-radius:50%;background:${color};box-shadow:0 0 6px ${color};left:${e.clientX}px;top:${e.clientY}px;transform:translate(-50%,-50%);transition:all 0.65s ease;opacity:1;`;
        document.body.appendChild(s);
        requestAnimationFrame(() => {
            const rad = angle * Math.PI / 180;
            s.style.opacity = '0';
            s.style.left = `${e.clientX + Math.cos(rad) * dist}px`;
            s.style.top = `${e.clientY + Math.sin(rad) * dist}px`;
            s.style.transform = 'translate(-50%,-50%) scale(0)';
        });
        setTimeout(() => s.remove(), 700);
    }, { passive: true });

    /* ── SECTION NAV DOTS ── */
    const sections = document.querySelectorAll('section[id]');
    const dotsNav = document.getElementById('section-dots');
    if (dotsNav && sections.length) {
        sections.forEach((sec) => {
            const dot = document.createElement('div');
            dot.className = 'sdot';
            dot.dataset.label = sec.dataset.label || sec.id;
            dot.addEventListener('click', () => { targetY = sec.offsetTop - 80; if (!rafRunning) startMasterLoop(); });
            dotsNav.appendChild(dot);
        });
        dotsNav.classList.add('visible');
        const dotObserver = new IntersectionObserver(entries => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const idx = [...sections].indexOf(entry.target);
                    dotsNav.querySelectorAll('.sdot').forEach((d, i) => { d.classList.toggle('active', i === idx); });
                }
            });
        }, { threshold: 0.4 });
        sections.forEach(s => dotObserver.observe(s));
    }

    /* ═══════════════════════════════════════════
       UPGRADE 3: MORPHING BLOBS
       ═══════════════════════════════════════════ */
    function animateBlobs() {
        const paths = [document.querySelector('.blob-path-1'), document.querySelector('.blob-path-2')];
        if (!paths[0]) return;
        let t = 0;
        function blobLoop() {
            t += 0.004;
            if (paths[0]) paths[0].setAttribute('d', generateBlobPath(450, 450, 280, t, 4, 0.4));
            if (paths[1]) paths[1].setAttribute('d', generateBlobPath(450, 450, 260, t * 0.8 + 2, 5, 0.3));
            requestAnimationFrame(blobLoop);
        }
        blobLoop();
    }
    function generateBlobPath(cx, cy, r, t, complexity, variance) {
        const points = 12;
        const angleStep = (Math.PI * 2) / points;
        let coords = [];
        for (let i = 0; i < points; i++) {
            const angle = i * angleStep;
            const noise = Math.sin(t + i * complexity) * variance + Math.cos(t * 0.7 + i * 2) * variance * 0.5;
            const radius = r * (1 + noise);
            coords.push([cx + Math.cos(angle) * radius, cy + Math.sin(angle) * radius]);
        }
        let d = `M ${coords[0][0]},${coords[0][1]}`;
        for (let i = 0; i < points; i++) {
            const curr = coords[i];
            const next = coords[(i + 1) % points];
            const cp1x = curr[0] + (next[0] - coords[(i - 1 + points) % points][0]) / 6;
            const cp1y = curr[1] + (next[1] - coords[(i - 1 + points) % points][1]) / 6;
            const cp2x = next[0] - (coords[(i + 2) % points][0] - curr[0]) / 6;
            const cp2y = next[1] - (coords[(i + 2) % points][1] - curr[1]) / 6;
            d += ` C ${cp1x},${cp1y} ${cp2x},${cp2y} ${next[0]},${next[1]}`;
        }
        return d + ' Z';
    }
    animateBlobs();

    /* ═══════════════════════════════════════════
       UPGRADE 8: RANDOM GLITCH ON LOGO
       ═══════════════════════════════════════════ */
    function randomGlitch() {
        const logo = document.querySelector('.nav-logo');
        if (!logo) return;
        const interval = 4000 + Math.random() * 6000;
        setTimeout(() => {
            logo.classList.add('glitch-active');
            setTimeout(() => logo.classList.remove('glitch-active'), 400);
            randomGlitch();
        }, interval);
    }
    randomGlitch();

    /* ═══════════════════════════════════════════
       POLISH: MICRO-ANIMATIONS
       ═══════════════════════════════════════════ */
    // Button Ripple
    document.querySelectorAll('.btn').forEach(btn => {
        btn.style.position = 'relative'; btn.style.overflow = 'hidden';
        btn.addEventListener('click', e => {
            const ripple = document.createElement('span');
            const rect = btn.getBoundingClientRect();
            const size = Math.max(rect.width, rect.height) * 2;
            ripple.style.cssText = `position:absolute;border-radius:50%;width:${size}px;height:${size}px;background:rgba(255,255,255,0.15);left:${e.clientX - rect.left - size / 2}px;top:${e.clientY - rect.top - size / 2}px;transform:scale(0);animation:rippleAnim 0.6s ease-out forwards;pointer-events:none;`;
            btn.appendChild(ripple);
            setTimeout(() => ripple.remove(), 600);
        });
    });

    // Grid Stagger Delays
    document.querySelectorAll('.services-grid, .portfolio-grid, .blog-grid, .team-grid, .awards-grid, .process-why').forEach(grid => {
        [...grid.children].forEach((child, i) => {
            if (!child.classList.contains('reveal')) child.classList.add('reveal');
            child.dataset.delay = child.dataset.delay || (i * 80);
        });
    });

    // Nav Link Magnetic
    document.querySelectorAll('.nav-links a').forEach(link => {
        link.addEventListener('mousemove', e => {
            const rect = link.getBoundingClientRect();
            link.style.transform = `translate(${(e.clientX - rect.left - rect.width / 2) * 0.25}px,${(e.clientY - rect.top - rect.height / 2) * 0.25}px)`;
        });
        link.addEventListener('mouseleave', () => {
            link.style.transform = '';
            link.style.transition = 'transform 0.4s cubic-bezier(0.25,0.46,0.45,0.94)';
        });
    });

})();
