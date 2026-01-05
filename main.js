import "./sass/style.scss";

document.addEventListener('DOMContentLoaded', () => {

    // ==========================================
    // 0. ARRANQUE INTELIGENTE (SAFARI FRIENDLY)
    // ==========================================
    const video = document.getElementById('bg-video');
    const playIcon = document.getElementById('play-icon');

    if (video) {
        // 1. Configuramos propiedades clave
        video.muted = true;
        video.defaultMuted = true;
        video.playsInline = true;

        // 2. NO forzamos play inmediatamente.
        // Safari odia que le interrumpan si ya está intentando hacer autoplay por HTML.
        
        // 3. Comprobación de seguridad a los 50ms
        setTimeout(() => {
            // Solo si Safari NO ha arrancado solo, le ayudamos
            if (video.paused) {
                console.log("⚠️ Safari dormido. Dando empujón...");
                var promise = video.play();
                
                if (promise !== undefined) {
                    promise.then(() => {
                        console.log("✅ Video arrancado por JS.");
                        if(playIcon) {
                            playIcon.classList.remove("fa-play");
                            playIcon.classList.add("fa-pause");
                        }
                    }).catch(error => {
                        console.log("❌ Bloqueo total. Requiere click.");
                        // Si falla aquí, es por Ahorro de Energía o configuración estricta del usuario.
                        // No podemos hacer nada más legalmente hasta que toquen.
                    });
                }
            } else {
                console.log("✅ Safari arrancó el video nativamente.");
                if(playIcon) {
                    playIcon.classList.remove("fa-play");
                    playIcon.classList.add("fa-pause");
                }
            }
        }, 100); // Pequeño retraso para dejar respirar al navegador
    }

    // ==========================================
    // 1. LENIS SCROLL
    // ==========================================
    if (typeof Lenis !== 'undefined') {
        window.lenis = new Lenis({ 
            duration: 1.5, 
            easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)), 
            direction: 'vertical',
            gestureDirection: 'vertical',
            smooth: true,
            mouseMultiplier: 1,
            smoothTouch: false, 
            touchMultiplier: 2,
        });

        function raf(time) {
            lenis.raf(time);
            requestAnimationFrame(raf);
        }
        requestAnimationFrame(raf);
    }
    
    // ==========================================
    // 2. NAVEGACIÓN
    // ==========================================
    const currentLocation = window.location.href;
    const menuItems = document.querySelectorAll('.nav .menu a');
    const yearSpan = document.getElementById("year");
    if(yearSpan) yearSpan.textContent = new Date().getFullYear();

    menuItems.forEach(item => {
        if(item.href === currentLocation) item.classList.add('active');
        if (currentLocation.endsWith('/') && item.getAttribute('href') === 'index.html') item.classList.add('active');
    });

    const navToggle = document.getElementById("nav-toggle");
    if(navToggle) {
        document.querySelectorAll(".menu a").forEach(a => {
            a.addEventListener("click", () => navToggle.checked = false);
        });
    }

    // ==========================================
    // 3. CONTROLES DEL VIDEO
    // ==========================================
    const soundBtn = document.getElementById('sound-btn');
    const btnIcon = document.getElementById('sound-icon');
    const btnText = document.getElementById('sound-text');
    const playPauseBtn = document.getElementById('play-pause-btn');
    const playText = document.getElementById('play-text');
    const replayBtn = document.getElementById('replay-btn');
    const scrollHint = document.querySelector('.scroll-down-hint');
    const fullscreenBtn = document.getElementById('fullscreen-btn');

    if (video) {
        if(playText) playText.textContent = "";
        if(btnText) btnText.textContent = "";

        // SONIDO
        if(soundBtn) {
            soundBtn.addEventListener('click', (e) => {
                e.preventDefault(); 
                if (video.muted) {
                    video.muted = false; 
                    video.volume = 1.0; 
                    if(btnIcon) {
                        btnIcon.classList.remove("fa-volume-xmark");
                        btnIcon.classList.add("fa-volume-high");
                    }
                } else {
                    video.muted = true; 
                    if(btnIcon) {
                        btnIcon.classList.remove("fa-volume-high");
                        btnIcon.classList.add("fa-volume-xmark");
                    }
                }
            });
        }

        // PLAY / PAUSE
        if (playPauseBtn) {
            playPauseBtn.addEventListener('click', (e) => {
                e.preventDefault();
                if (video.paused || video.ended) {
                    video.play();
                    if(playIcon) {
                        playIcon.classList.remove("fa-play");
                        playIcon.classList.add("fa-pause");
                    }
                    if(replayBtn) replayBtn.style.display = 'none';
                    if(soundBtn) soundBtn.style.opacity = '1';
                } else {
                    video.pause();
                    if(playIcon) {
                        playIcon.classList.remove("fa-pause");
                        playIcon.classList.add("fa-play");
                    }
                }
            });
        }

        // ENDED
        video.addEventListener('ended', () => {
            if(replayBtn) {
                replayBtn.style.display = 'flex'; 
                replayBtn.classList.add('animate__animated', 'animate__fadeIn');
            }
            if(playIcon) {
                playIcon.classList.remove("fa-pause");
                playIcon.classList.add("fa-play");
            }
            if(scrollHint) scrollHint.style.opacity = '0';
        });

        // REPLAY
        if(replayBtn) {
            replayBtn.addEventListener('click', (e) => {
                e.preventDefault();
                video.currentTime = 0;
                video.play();
                if(playIcon) {
                    playIcon.classList.remove("fa-play");
                    playIcon.classList.add("fa-pause");
                }
                replayBtn.style.display = 'none';
                if(soundBtn) soundBtn.style.opacity = '1';
                if(scrollHint) scrollHint.style.opacity = '1';
            });
        }

        // FULLSCREEN
        if (fullscreenBtn) {
            fullscreenBtn.addEventListener('click', (e) => {
                e.preventDefault();
                if (video.requestFullscreen) {
                    video.requestFullscreen();
                } else if (video.webkitEnterFullscreen) { 
                    video.webkitEnterFullscreen();
                } else if (video.webkitRequestFullscreen) { 
                    video.webkitRequestFullscreen();
                }
            });
        }
    }

    // ==========================================
    // 4. CURSOR
    // ==========================================
    const cursor = document.querySelector('.custom-cursor');
    if (cursor) {
        document.addEventListener('mousemove', e => {
            cursor.style.left = `${e.clientX}px`;
            cursor.style.top = `${e.clientY}px`;
        });
        const interactiveSelectors = '.card, .btn, .menu a, .brand, a, .slider-btn, .prev-btn, .sound-toggle-btn, .replay-btn, .hero-arrow, .control-btn';
        document.querySelectorAll(interactiveSelectors).forEach(el => {
            el.addEventListener('mouseenter', () => cursor.style.opacity = '1');
            el.addEventListener('mouseleave', () => cursor.style.opacity = '0');
        });
    }

    // ==========================================
    // 5. CARRUSEL
    // ==========================================
    const gridProjects = document.querySelector('.grid-projects');
    const nextBtnProject = document.querySelector('.slider-btn.next-btn');
    const prevBtnProject = document.querySelector('.slider-btn.prev-btn');

    if (nextBtnProject && prevBtnProject && gridProjects) {
        const scrollProjects = (direction) => {
            const cardWidth = 300; 
            const gap = 32;
            const scrollAmount = cardWidth + gap;
            gridProjects.scrollBy({
                left: direction === 'next' ? scrollAmount : -scrollAmount,
                behavior: 'smooth'
            });
        };
        nextBtnProject.addEventListener('click', () => scrollProjects('next'));
        prevBtnProject.addEventListener('click', () => scrollProjects('prev'));
    }

    // ==========================================
    // 6. PARALLAX (MODO CINE: ZOOM + BLUR + GIRO)
    // ==========================================
    const heroSection = document.getElementById('hero-frames');
    const stickyContent = document.querySelector('.hero-sticky-content');
    const layers = document.querySelectorAll('.frame-layer');
    
    if (layers.length > 0 && heroSection) {
        const projectFrames = Array.from(layers); 
        const totalAnimationDuration = 0.6; 
        const startOffset = 0; 
        if (stickyContent) stickyContent.style.visibility = 'visible'; 
        
        const handleFrameScroll = () => {
            const rect = heroSection.getBoundingClientRect();
            const scrollRange = heroSection.offsetHeight - window.innerHeight;
            const scrollProgress = Math.max(0, Math.min(1, -rect.top / scrollRange));
            const frameAnimationProgress = Math.max(0, Math.min(1, (scrollProgress - startOffset) / totalAnimationDuration));
            
            // Indicador de scroll
            const indicator = document.getElementById('scroll-indicator');
            if (indicator) {
                if (scrollProgress > 0.05) indicator.classList.add('indicator-hidden');
                else indicator.classList.remove('indicator-hidden');
            }

            // Texto Sticky
            if (stickyContent) {
                const OPACITY_START = 0.55; 
                const OPACITY_DURATION = 0.40; 
                const slowTextProgress = Math.max(0, Math.min(1, (scrollProgress - OPACITY_START) / OPACITY_DURATION));
                const textOpacity = slowTextProgress; 
                const textScale = 0.9 + (0.1 * slowTextProgress);
                stickyContent.style.opacity = textOpacity;
                stickyContent.style.transform = `translate(-50%, -50%) scale(${textScale})`;
            }

            // Mover Frames
            projectFrames.forEach((frameLayer) => {
                const isLogo = frameLayer.getAttribute('data-frame-id') === '1';
                let frameOpacity = 1; 
                if (!isLogo) frameOpacity = Math.min(1, frameAnimationProgress * 4); 
                frameLayer.style.opacity = frameOpacity;

                const computedStyles = window.getComputedStyle(frameLayer);
                const finalXString = computedStyles.getPropertyValue('--final-x').trim() || '0vw';
                const finalYString = computedStyles.getPropertyValue('--final-y').trim() || '0vh';
                // En móvil ignoramos la rotación del CSS para controlarla por JS
                const cssRotation = computedStyles.getPropertyValue('--rot').trim() || '0deg'; 
                const finalX = parseFloat(finalXString); 
                const finalY = parseFloat(finalYString); 
                
                const translateX = finalX * frameAnimationProgress;
                const translateY = finalY * frameAnimationProgress;

                // --- LÓGICA SPECTACULAR PARA MÓVIL (MASTERPIECE) ---
                if (isLogo && window.innerWidth < 900) {
                    
                    // 1. CALCULO DE "FRENADA SUAVE" (Easing)
                    // Esto convierte el movimiento lineal robótico en movimiento natural.
                    // Empieza rápido y frena suavemente al final.
                    const easeOut = 1 - Math.pow(1 - frameAnimationProgress, 3);

                    // 2. ZOOM: De 0.4 a 1.0
                    // Usamos el progreso lineal aquí para que el tamaño vaya a la par del dedo
                    const startScale = 0.4; 
                    const endScale = 1.0;
                    let currentScale = startScale + (frameAnimationProgress * (endScale - startScale));
                    currentScale = Math.max(startScale, Math.min(1.1, currentScale));

                    // 3. ROTACIÓN: 1080 grados con FRENADA
                    // ¡OJO! Aquí usamos 'easeOut' en vez de 'frameAnimationProgress'
                    const startRot = 1080; 
                    const endRot = 0;
                    let currentRot = startRot + (easeOut * (endRot - startRot));
                    
                    // 4. DESENFOQUE (Blur): De 10px a 0px
                    // Usamos easeOut para que se enfoque rápido y quede nítido antes
                    const startBlur = 1; 
                    let currentBlur = startBlur - (easeOut * startBlur);
                    currentBlur = Math.max(0, currentBlur); 

                    // 5. BRILLO Y COLOR (NUEVO: Grayscale)
                    // Empieza en blanco y negro (100%) y acaba en color (0%)
                    let currentGrayscale = 100 - (frameAnimationProgress * 100);
                    let currentBrightness = 0.8 + (frameAnimationProgress * 0.2);

                    // APLICAR TRANSFORMACIONES
                    frameLayer.style.transform = `translate(-50%, -50%) translate3d(${translateX}vw, ${translateY}vh, 0) scale(${currentScale}) rotate(${currentRot}deg)`;
                    
                    // APLICAR FILTROS (Blur + Brillo + Blanco y Negro)
                    frameLayer.style.filter = `blur(${currentBlur}px) brightness(${currentBrightness}) grayscale(${currentGrayscale}%)`;

                } else {
                    // COMPORTAMIENTO DESKTOP
                    frameLayer.style.transform = `translate(-50%, -50%) translate3d(${translateX}vw, ${translateY}vh, 0) rotate(${cssRotation})`;
                    frameLayer.style.filter = 'none'; 
                }
            });
        };

        if (window.lenis) {
            window.lenis.on('scroll', handleFrameScroll);
        } else {
            window.addEventListener('scroll', handleFrameScroll, { passive: true });
        }
        window.addEventListener('resize', handleFrameScroll);

        // EJECUTAR AL INICIO (Evita el salto visual)
        handleFrameScroll(); 
    }

    // ==========================================
    // 7. HERO VIDEO SLIDER
    // ==========================================
    const videoSources = [
        "/videos/entrada.mp4", 
        "/videos/trailer_carneycal.mp4",
        "/videos/oso.mp4", 
        "/videos/musica.mp4",
        
    ];
    let currentVideoIndex = 0;
    const heroVideo = document.getElementById('bg-video');
    const heroPrevBtn = document.getElementById('hero-prev');
    const heroNextBtn = document.getElementById('hero-next');
    const dotsContainer = document.getElementById('hero-dots');

    function initHeroDots() {
        if (!dotsContainer) return;
        dotsContainer.innerHTML = ''; 
        videoSources.forEach((_, index) => {
            const dot = document.createElement('div');
            dot.classList.add('hero-dot');
            if (index === 0) dot.classList.add('active'); 
            dot.addEventListener('click', () => goToVideo(index));
            dotsContainer.appendChild(dot);
        });
    }
    function updateDotsState() {
        const dots = document.querySelectorAll('.hero-dot');
        dots.forEach((dot, index) => {
            if (index === currentVideoIndex) dot.classList.add('active');
            else dot.classList.remove('active');
        });
    }
    function goToVideo(index) {
        if (index === currentVideoIndex) return;
        currentVideoIndex = index;
        changeHeroVideoLogic();
    }
    function changeHeroVideo(direction) {
        if (!heroVideo) return;
        if (direction === 'next') currentVideoIndex = (currentVideoIndex + 1) % videoSources.length;
        else currentVideoIndex = (currentVideoIndex - 1 + videoSources.length) % videoSources.length;
        changeHeroVideoLogic();
    }
    function changeHeroVideoLogic() {
        updateDotsState();
        if (replayBtn) replayBtn.style.display = 'none';
        if (playIcon) {
            playIcon.classList.remove("fa-play");
            playIcon.classList.add("fa-pause");
        }
        heroVideo.style.opacity = '0';
        setTimeout(() => {
            if (heroVideo.hasAttribute('poster')) heroVideo.removeAttribute('poster');
            heroVideo.src = videoSources[currentVideoIndex];
            heroVideo.load(); 
            const playPromise = heroVideo.play();
            if (playPromise !== undefined) {
                playPromise.then(_ => {}).catch(error => console.log("Auto-play prevenido al cambiar."));
            }
            heroVideo.style.opacity = '0.8'; 
        }, 300); 
    }
    initHeroDots(); 
    if (heroPrevBtn && heroNextBtn) {
        heroPrevBtn.addEventListener('click', () => changeHeroVideo('prev'));
        heroNextBtn.addEventListener('click', () => changeHeroVideo('next'));
    }

}); // Fin DOMContentLoaded

// ==========================================
// 8. LOADER
// ==========================================
window.addEventListener('load', () => {
    const loader = document.getElementById('loader-wrapper');
    if (loader) loader.classList.add('loader-hidden');

    if (typeof ScrollReveal !== 'undefined') {
        ScrollReveal().reveal('.section h2, .section p.sub', { delay: 200, distance: '50px', origin: 'bottom', easing: 'ease-in-out' });
        ScrollReveal().reveal('#projects .slider-wrapper', { delay: 400, distance: '30px', origin: 'bottom', easing: 'ease-in-out' });
        ScrollReveal().reveal('.contact', { delay: 400, distance: '50px', origin: 'bottom', easing: 'ease-in-out' });
    }
});