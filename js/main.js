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
       UNIFIED INPUT & ANIMATION LOOP (Optimized)
       ═══════════════════════════════════════════ */
    const cursorDot = document.querySelector('.cursor-dot');
    const cursorRing = document.querySelector('.cursor-ring');
    const parallaxLayers = document.querySelectorAll('.p-layer');
    const hero3d = document.getElementById('hero3d');
    const titleMid = hero3d?.querySelector('.title-mid');
    const titleBack = hero3d?.querySelector('.title-back');

    let mX = -100, mY = -100, rX = -100, rY = -100;
    let tPX = 0, tPY = 0, hPX = 0, hPY = 0; // Parallax
    let isHeroVisible = true;

    // Intersection Observer for Hero
    const heroSec = document.querySelector('.hero');
    if (heroSec) {
        new IntersectionObserver(([e]) => isHeroVisible = e.isIntersecting, { threshold: 0 }).observe(heroSec);
    }

    const isDesktop = window.matchMedia('(hover:hover)').matches;

    if (isDesktop && cursorDot && cursorRing) {
        window.addEventListener('mousemove', e => {
            mX = e.clientX; mY = e.clientY;
            tPX = (e.clientX / window.innerWidth - 0.5) * 2;
            tPY = (e.clientY / window.innerHeight - 0.5) * 2;
        }, { passive: true });

        // Event Delegation for Hover Effects
        document.body.addEventListener('mouseover', e => {
            const target = e.target.closest('a, button, .glass-card, .btn, .filter-btn, .faq-question, .portfolio-card, .menu-toggle, .whatsapp-float');
            if (target) {
                cursorDot.style.background = '#7C3AED';
                cursorDot.style.boxShadow = '0 0 10px #7C3AED, 0 0 20px #7C3AED';
                cursorRing.style.width = '54px'; cursorRing.style.height = '54px';
                cursorRing.style.borderColor = '#7C3AED';
            }
        });

        document.body.addEventListener('mouseout', e => {
            const target = e.target.closest('a, button, .glass-card, .btn, .filter-btn, .faq-question, .portfolio-card, .menu-toggle, .whatsapp-float');
            if (target) {
                cursorDot.style.background = '#00E5FF';
                cursorDot.style.boxShadow = '0 0 10px #00E5FF, 0 0 20px #00E5FF';
                cursorRing.style.width = '36px'; cursorRing.style.height = '36px';
                cursorRing.style.borderColor = 'rgba(0,229,255,0.5)';
            }
        });

        function unifiedLoop() {
            // Cursor
            cursorDot.style.transform = `translate(${mX - 4}px,${mY - 4}px)`;
            rX += (mX - rX) * 0.15;
            rY += (mY - rY) * 0.15;
            cursorRing.style.transform = `translate(${rX - 18}px,${rY - 18}px)`;

            if (isHeroVisible) {
                // Background Parallax
                hPX += (tPX - hPX) * 0.08;
                hPY += (tPY - hPY) * 0.08;
                parallaxLayers.forEach(l => {
                    const s = parseFloat(l.dataset.speed) || 0.05;
                    l.style.transform = `translate(${hPX * s * 100}px, ${hPY * s * 100}px)`;
                });

                // Title Parallax
                if (titleMid && titleBack) {
                    const tx = tPX * 15;
                    const ty = tPY * 8;
                    titleMid.style.transform = `translate(${3 + tx * 0.3}px, ${3 + ty * 0.3}px)`;
                    titleBack.style.transform = `translate(${6 + tx * 0.6}px, ${6 + ty * 0.6}px)`;
                }
            }
            requestAnimationFrame(unifiedLoop);
        }
        unifiedLoop();
    }


    /* ═══════════════════════════════════════════
       Hanging features removed (Three.js and Particle Canvas)
       ═══════════════════════════════════════════ */

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

    /* ── 3D Tilt Cards (Optimized — No per-frame mouse listener) ── */
    document.querySelectorAll('.glass-card, .portfolio-card, .project-card, .blog-card').forEach(card => {
        if (isDesktop) {
            card.classList.add('tilt-card');
            const glare = document.createElement('div');
            glare.className = 'card-glare';
            card.appendChild(glare);
            card.addEventListener('mousemove', e => {
                const rect = card.getBoundingClientRect();
                const x = (e.clientX - rect.left) / rect.width - 0.5;
                const y = (e.clientY - rect.top) / rect.height - 0.5;
                card.style.transform = `perspective(800px) rotateY(${x * 12}deg) rotateX(${-y * 12}deg) translateZ(10px)`;
                glare.style.background = `radial-gradient(circle at ${x * 100 + 50}% ${y * 100 + 50}%, rgba(255,255,255,0.06), transparent 60%)`;
            }, { passive: true });
            card.addEventListener('mouseleave', () => {
                card.style.transform = 'perspective(800px) rotateY(0) rotateX(0) translateZ(0)';
                glare.style.background = 'none';
            });
        }
    });

    /* ── Magnetic Buttons (Optimized) ── */
    document.querySelectorAll('.btn, .nav-cta, .footer-socials a').forEach(btn => {
        if (isDesktop) {
            btn.addEventListener('mousemove', e => {
                const rect = btn.getBoundingClientRect();
                const x = (e.clientX - rect.left - rect.width / 2) * 0.25;
                const y = (e.clientY - rect.top - rect.height / 2) * 0.25;
                btn.style.transform = `translate(${x}px, ${y}px)`;
            }, { passive: true });
            btn.addEventListener('mouseleave', () => {
                btn.style.transform = 'translate(0,0)';
            });
        }
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

                    // ── WhatsApp Redirection ──
                    const services = [];
                    for (let [key, value] of formData.entries()) {
                        if (key === 'services') services.push(value);
                    }
                    const waData = Object.fromEntries(formData.entries());
                    if (services.length > 0) waData.services = services.join(', ');

                    let waMessage = `*🚀 NEW INQUIRY FROM WEBHATRIX*\n\n`;
                    const labels = {
                        name: 'Name',
                        email: 'Email',
                        phone: 'Phone',
                        company: 'Company',
                        projectType: 'Project Type',
                        services: 'Services',
                        budget: 'Budget',
                        timeline: 'Timeline',
                        description: 'Description',
                        references: 'References',
                        source: 'Heard From'
                    };

                    for (const key in waData) {
                        if (labels[key] && waData[key]) {
                            waMessage += `• *${labels[key]}:* ${waData[key]}\n\n`;
                        }
                    }

                    const waUrl = `https://wa.me/917569645049?text=${encodeURIComponent(waMessage)}`;
                    
                    // Small delay to let the user see the success message
                    setTimeout(() => {
                        window.location.href = waUrl;
                    }, 1500);

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

    /* Morphing Blobs hanging section removed */

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
