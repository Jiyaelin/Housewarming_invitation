document.addEventListener('DOMContentLoaded', () => {
    
    // ==========================================
    // 1. CONTINUOUS FLOATING GOLD SPARKLES CANVAS
    // ==========================================
    const canvas = document.getElementById('sparkle-canvas');
    let triggerBurst = null;

    if (canvas) {
        const ctx = canvas.getContext('2d');
        let width = canvas.width = window.innerWidth;
        let height = canvas.height = window.innerHeight;

        window.addEventListener('resize', () => {
            width = canvas.width = window.innerWidth;
            height = canvas.height = window.innerHeight;
        });

        const particles = [];
        const burstParticles = [];
        const particleCount = 45;

        for (let i = 0; i < particleCount; i++) {
            particles.push({
                x: Math.random() * width,
                y: Math.random() * height,
                radius: Math.random() * 2.2 + 0.8,
                speedY: Math.random() * 0.45 + 0.18,
                speedX: (Math.random() - 0.5) * 0.35,
                alpha: Math.random() * 0.6 + 0.2,
                alphaSpeed: Math.random() * 0.012 + 0.004,
                hue: Math.floor(Math.random() * 15) + 38, // Warm golden tone
                isStar: Math.random() > 0.68,
                rotation: Math.random() * Math.PI,
                rotSpeed: (Math.random() - 0.5) * 0.02
            });
        }

        triggerBurst = function(originX, originY) {
            for (let i = 0; i < 45; i++) {
                const angle = Math.random() * Math.PI * 2;
                const speed = Math.random() * 4.5 + 1.8;
                burstParticles.push({
                    x: originX,
                    y: originY,
                    vx: Math.cos(angle) * speed,
                    vy: Math.sin(angle) * speed - 1.2,
                    radius: Math.random() * 2.6 + 1.2,
                    alpha: 1,
                    decay: Math.random() * 0.018 + 0.012,
                    hue: Math.floor(Math.random() * 16) + 38,
                    isStar: Math.random() > 0.5
                });
            }
        };

        function drawStar(ctx, cx, cy, spikes, outerRadius, innerRadius, color) {
            let rot = Math.PI / 2 * 3;
            let x = cx;
            let y = cy;
            const step = Math.PI / spikes;

            ctx.save();
            ctx.beginPath();
            ctx.moveTo(cx, cy - outerRadius);
            for (let i = 0; i < spikes; i++) {
                x = cx + Math.cos(rot) * outerRadius;
                y = cy + Math.sin(rot) * outerRadius;
                ctx.lineTo(x, y);
                rot += step;

                x = cx + Math.cos(rot) * innerRadius;
                y = cy + Math.sin(rot) * innerRadius;
                ctx.lineTo(x, y);
                rot += step;
            }
            ctx.lineTo(cx, cy - outerRadius);
            ctx.closePath();
            ctx.fillStyle = color;
            ctx.shadowBlur = outerRadius * 2.5;
            ctx.shadowColor = color;
            ctx.fill();
            ctx.restore();
        }

        function animateParticles() {
            ctx.clearRect(0, 0, width, height);

            // 1. Ambient Golden Particles
            particles.forEach(p => {
                p.y -= p.speedY;
                p.x += p.speedX;
                p.alpha += p.alphaSpeed;
                p.rotation += p.rotSpeed;

                if (p.alpha >= 0.88 || p.alpha <= 0.15) {
                    p.alphaSpeed = -p.alphaSpeed;
                }

                if (p.y < -15) {
                    p.y = height + 15;
                    p.x = Math.random() * width;
                }

                if (p.isStar) {
                    const color = `hsla(${p.hue}, 90%, 75%, ${p.alpha})`;
                    drawStar(ctx, p.x, p.y, 4, p.radius * 2.2, p.radius * 0.7, color);
                } else {
                    ctx.save();
                    ctx.beginPath();
                    ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
                    ctx.fillStyle = `hsla(${p.hue}, 88%, 68%, ${p.alpha})`;
                    ctx.shadowBlur = p.radius * 3.5;
                    ctx.shadowColor = `hsla(${p.hue}, 90%, 60%, ${p.alpha})`;
                    ctx.fill();
                    ctx.restore();
                }
            });

            // 2. Celebratory Burst Particles (on Open Invitation)
            for (let i = burstParticles.length - 1; i >= 0; i--) {
                const bp = burstParticles[i];
                bp.x += bp.vx;
                bp.y += bp.vy;
                bp.vy += 0.08;
                bp.vx *= 0.98;
                bp.alpha -= bp.decay;

                if (bp.alpha <= 0) {
                    burstParticles.splice(i, 1);
                    continue;
                }

                const color = `hsla(${bp.hue}, 95%, 70%, ${bp.alpha})`;
                if (bp.isStar) {
                    drawStar(ctx, bp.x, bp.y, 4, bp.radius * 2.4, bp.radius * 0.8, color);
                } else {
                    ctx.save();
                    ctx.beginPath();
                    ctx.arc(bp.x, bp.y, bp.radius, 0, Math.PI * 2);
                    ctx.fillStyle = color;
                    ctx.shadowBlur = bp.radius * 4;
                    ctx.shadowColor = color;
                    ctx.fill();
                    ctx.restore();
                }
            }

            requestAnimationFrame(animateParticles);
        }

        animateParticles();
    }


    // ==========================================
    // 2. OPEN INVITATION BUTTON INTERACTION
    // ==========================================
    const openInvitationBtn = document.getElementById('openInvitationBtn');
    const letterScene = document.getElementById('letter-scene');

    if (openInvitationBtn && letterScene) {
        openInvitationBtn.addEventListener('click', (e) => {
            if (triggerBurst) {
                const rect = openInvitationBtn.getBoundingClientRect();
                triggerBurst(rect.left + rect.width / 2, rect.top + rect.height / 2);
            }

            letterScene.classList.add('fade-out');
            setTimeout(() => {
                letterScene.style.display = 'none';
                window.scrollTo({ top: 0, behavior: 'smooth' });
                
                // Trigger visibility of first items immediately
                document.querySelectorAll('.invitation-folio').forEach(el => {
                    el.classList.add('visible');
                });
            }, 800);
        });
    }


    // ==========================================
    // 3. ACCURATE COUNTDOWN TIMER
    // ==========================================
    // Target: Saturday, Nov 7, 2026 at 11:00 AM
    const countDownDate = new Date("Nov 7, 2026 11:00:00").getTime();

    const timerInterval = setInterval(function() {
        const now = new Date().getTime();
        const distance = countDownDate - now;

        const days = Math.floor(distance / (1000 * 60 * 60 * 24));
        const hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
        const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
        const seconds = Math.floor((distance % (1000 * 60)) / 1000);

        const daysEl = document.getElementById("days");
        const hoursEl = document.getElementById("hours");
        const minutesEl = document.getElementById("minutes");
        const secondsEl = document.getElementById("seconds");

        if (daysEl) daysEl.innerText = days < 10 ? '0' + days : days;
        if (hoursEl) hoursEl.innerText = hours < 10 ? '0' + hours : hours;
        if (minutesEl) minutesEl.innerText = minutes < 10 ? '0' + minutes : minutes;
        if (secondsEl) secondsEl.innerText = seconds < 10 ? '0' + seconds : seconds;

        if (distance < 0) {
            clearInterval(timerInterval);
            const countdownContainer = document.getElementById("countdown");
            if (countdownContainer) {
                countdownContainer.innerHTML = "<h2 style='font-family: var(--font-head); color: var(--gold-light);'>The Blessed Day is Here!</h2>";
            }
        }
    }, 1000);


    // ==========================================
    // 4. IMAGE LIGHTBOX MODAL (Hero House Photo)
    // ==========================================
    const heroImage = document.querySelector('.hero-img');
    
    if (heroImage) {
        heroImage.style.cursor = 'zoom-in';
        heroImage.addEventListener('click', () => {
            const modal = document.createElement('div');
            modal.style.position = 'fixed';
            modal.style.top = '0';
            modal.style.left = '0';
            modal.style.width = '100vw';
            modal.style.height = '100vh';
            modal.style.backgroundColor = 'rgba(15, 25, 20, 0.92)';
            modal.style.backdropFilter = 'blur(10px)';
            modal.style.display = 'flex';
            modal.style.justifyContent = 'center';
            modal.style.alignItems = 'center';
            modal.style.zIndex = '2000';
            modal.style.cursor = 'zoom-out';
            modal.style.opacity = '0';
            modal.style.transition = 'opacity 0.3s ease';

            const modalImg = document.createElement('img');
            modalImg.src = heroImage.src;
            modalImg.style.maxWidth = '92%';
            modalImg.style.maxHeight = '88%';
            modalImg.style.borderRadius = '12px';
            modalImg.style.border = '2px solid rgba(197, 160, 89, 0.5)';
            modalImg.style.boxShadow = '0 25px 60px rgba(0,0,0,0.5)';

            modal.appendChild(modalImg);
            document.body.appendChild(modal);

            setTimeout(() => {
                modal.style.opacity = '1';
            }, 10);

            modal.addEventListener('click', () => {
                modal.style.opacity = '0';
                setTimeout(() => modal.remove(), 300);
            });
        });
    }


    // ==========================================
    // 5. SMOOTH SCROLL REVEAL OBSERVER
    // ==========================================
    if ('IntersectionObserver' in window) {
        const revealObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('visible');
                }
            });
        }, {
            threshold: 0.12,
            rootMargin: '0px 0px -30px 0px'
        });

        const revealElements = document.querySelectorAll(
            '.detail-card, .verse-quote-box, .personal-message, .countdown-section, .map-section, .footer-section'
        );

        revealElements.forEach(el => {
            el.classList.add('fade-up-element');
            revealObserver.observe(el);
        });
    }

});
