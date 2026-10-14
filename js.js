document.addEventListener('DOMContentLoaded', () => {
    // 0. LOGIKA ANIMASI KURSOR FUTURISTIK & PARALLAX 5 MODEL 3D SVG
    const cursorDot = document.querySelector('.cursor-dot');
    const cursorRing = document.querySelector('.cursor-ring');
    const hero3dModel1 = document.querySelector('.hero-3d-container.model-1');
    const hero3dModel2 = document.querySelector('.hero-3d-container.model-2');
    const hero3dModel3 = document.querySelector('.hero-3d-container.model-3');
    const hero3dModel4 = document.querySelector('.hero-3d-container.model-4');
    const hero3dModel5 = document.querySelector('.hero-3d-container.model-5');

    if (cursorDot && cursorRing) {
        let mouseX = window.innerWidth / 2;
        let mouseY = window.innerHeight / 2;
        let ringX = window.innerWidth / 2;
        let ringY = window.innerHeight / 2;
        const speed = 0.15; // Kecepatan lerp (smoothness)

        // Melacak pergerakan kursor & Parallax 3D SVG
        window.addEventListener('mousemove', (e) => {
            mouseX = e.clientX;
            mouseY = e.clientY;
            cursorDot.style.transform = `translate3d(calc(${mouseX}px - 50%), calc(${mouseY}px - 50%), 0)`;

            // Offset Parallax Kursor untuk kelima model 3D
            const xOffset = (e.clientX / window.innerWidth - 0.5);
            const yOffset = (e.clientY / window.innerHeight - 0.5);

            if (hero3dModel1) {
                hero3dModel1.style.transform = `translate(calc(-50% + ${xOffset * 30}px), calc(-50% + ${yOffset * 30}px))`;
            }
            if (hero3dModel2) {
                hero3dModel2.style.transform = `translate(${xOffset * -20}px, ${yOffset * -20}px)`;
            }
            if (hero3dModel3) {
                hero3dModel3.style.transform = `translate(${xOffset * 25}px, ${yOffset * 25}px)`;
            }
            if (hero3dModel4) {
                hero3dModel4.style.transform = `translate(${xOffset * -22}px, ${yOffset * 22}px)`;
            }
            if (hero3dModel5) {
                hero3dModel5.style.transform = `translate(${xOffset * 28}px, ${yOffset * -28}px)`;
            }
        });

        // Loop Animasi untuk Ring dengan efek Easing
        function animateRing() {
            ringX += (mouseX - ringX) * speed;
            ringY += (mouseY - ringY) * speed;
            cursorRing.style.transform = `translate3d(calc(${ringX}px - 50%), calc(${ringY}px - 50%), 0)`;
            requestAnimationFrame(animateRing);
        }
        animateRing();

        // Efek Hover pada Elemen Interaktif
        const interactiveElements = document.querySelectorAll('a, button, input, textarea, .about-card, .project-card, .service-card, .container-hamburger, .macos-mini-window');

        interactiveElements.forEach((el) => {
            el.addEventListener('mouseenter', () => {
                cursorRing.classList.add('hovered');
                cursorDot.classList.add('hovered');
            });
            el.addEventListener('mouseleave', () => {
                cursorRing.classList.remove('hovered');
                cursorDot.classList.remove('hovered');
            });
        });
    }

    // Inisialisasi AOS (Animate On Scroll)
    if (typeof AOS !== 'undefined') {
        AOS.init({
            duration: 800,
            easing: 'ease-out-cubic',
            once: true,
            offset: 100
        });
    }

    // 1. Reset posisi scroll saat halaman direfresh
    if ('scrollRestoration' in history) {
        history.scrollRestoration = 'manual';
    }
    if (window.location.hash) {
        history.replaceState(null, null, window.location.pathname);
    }
    window.scrollTo(0, 0);

    // 2. Logic Open/Close Card Section About
    const aboutCards = document.querySelectorAll('.about-card');
    aboutCards.forEach((card) => {
        card.addEventListener('click', () => {
            const isOpen = card.classList.contains('open');
            aboutCards.forEach((c) => c.classList.remove('open'));
            if (!isOpen) {
                card.classList.add('open');
            }
        });
    });

    // 3. Deklarasi Elemen Navigasi & Sections
    const hamburgerBtn = document.getElementById('hamburgerBtn');
    const tombolHamburger = document.querySelector('.tombol-hamburger');
    const menuNav = document.getElementById('menuNav');
    const menuLinks = document.querySelectorAll('.menu-navigasi li a');
    const sections = document.querySelectorAll('section.panel');

    // 4. Fungsi Buka / Tutup Menu Navigasi
    const setMenuState = (open) => {
        if (!hamburgerBtn || !tombolHamburger || !menuNav) return;

        if (open) {
            tombolHamburger.classList.add('aktif');
            menuNav.classList.add('aktif');
            hamburgerBtn.setAttribute('aria-expanded', 'true');
        } else {
            tombolHamburger.classList.remove('aktif');
            menuNav.classList.remove('aktif');
            hamburgerBtn.setAttribute('aria-expanded', 'false');
        }
    };

    if (hamburgerBtn && tombolHamburger && menuNav) {
        hamburgerBtn.addEventListener('click', (e) => {
            e.preventDefault();
            e.stopPropagation();
            const isOpen = menuNav.classList.contains('aktif');
            setMenuState(!isOpen);
        });
    }

    // 5. Navigasi Pindah Section
    menuLinks.forEach((link) => {
        link.addEventListener('click', (e) => {
            const href = link.getAttribute('href');
            if (href && href.startsWith('#')) {
                e.preventDefault();
                setMenuState(false);
                setTimeout(() => {
                    const targetSection = document.querySelector(href);
                    if (targetSection) {
                        const targetPosition = targetSection.getBoundingClientRect().top + window.pageYOffset;
                        window.scrollTo({
                            top: targetPosition,
                            behavior: 'smooth'
                        });
                    }
                }, 150);
            }
        });
    });

    // Tutup Menu Saat Klik di Luar Area
    document.addEventListener('click', (event) => {
        if (!menuNav || !hamburgerBtn) return;
        const isClickInsideMenu = menuNav.contains(event.target);
        const isClickOnHamburger = hamburgerBtn.contains(event.target);

        if (!isClickInsideMenu && !isClickOnHamburger && menuNav.classList.contains('aktif')) {
            setMenuState(false);
        }
    });

    // 6. API Weather Data (Suhu Karanganyar)
    const fetchLabTemperature = async () => {
        const labTempEl = document.getElementById('labTemp');
        if (!labTempEl) return;

        try {
            const res = await fetch('https://api.open-meteo.com/v1/forecast?latitude=-7.60&longitude=111.08&current_weather=true');
            const data = await res.json();
            const temp = Math.round(data.current_weather.temperature);
            labTempEl.innerText = `${temp}°C`;
        } catch (err) {
            labTempEl.innerText = '26°C';
        }
    };
    fetchLabTemperature();

    // 7. Indikator Active Menu Berdasarkan Scroll
    let isTicking = false;
    const updateActiveMenu = () => {
        const scrollPosition = window.scrollY + (window.innerHeight / 3);

        sections.forEach((section) => {
            const sectionTop = section.offsetTop;
            const sectionHeight = section.offsetHeight;
            const sectionId = section.getAttribute('id');

            if (scrollPosition >= sectionTop && scrollPosition < sectionTop + sectionHeight) {
                menuLinks.forEach((link) => {
                    const href = link.getAttribute('href');
                    if (href && href.includes(`#${sectionId}`)) {
                        link.classList.add('active', 'aktif');
                    } else {
                        link.classList.remove('active', 'aktif');
                    }
                });
            }
        });
        isTicking = false;
    };

    window.addEventListener('scroll', () => {
        if (!isTicking) {
            window.requestAnimationFrame(updateActiveMenu);
            isTicking = true;
        }
    });

    updateActiveMenu();

// 8. Animasi Process Section (macOS Mini Window Controls - High Fidelity)
    const windows = document.querySelectorAll(".macos-mini-window");

    windows.forEach(win => {
        const closeBtn = win.querySelector(".mini-dot.red");
        const minimizeBtn = win.querySelector(".mini-dot.yellow");
        const maximizeBtn = win.querySelector(".mini-dot.green");

        // 1. Tombol Merah: Close dengan efek fade-out & auto-restore yang elegan
        if (closeBtn) {
            closeBtn.addEventListener("click", (e) => {
                e.stopPropagation();
                if (win.classList.contains("is-maximized")) {
                    win.classList.remove("is-maximized");
                }
                win.classList.add("is-closed");
                
                // Mengembalikan jendela setelah 3.5 detik secara mulus
                setTimeout(() => {
                    win.classList.remove("is-closed", "is-minimized");
                }, 3500);
            });
        }

        // 2. Tombol Kuning: Minimize dengan transisi kolaps vertikal
        if (minimizeBtn) {
            minimizeBtn.addEventListener("click", (e) => {
                e.stopPropagation();
                if (win.classList.contains("is-maximized")) {
                    win.classList.remove("is-maximized");
                }
                win.classList.toggle("is-minimized");
            });
        }

        // 3. Tombol Hijau: Fullscreen / Maximize dengan transisi fokus layar tengah
        if (maximizeBtn) {
            maximizeBtn.addEventListener("click", (e) => {
                e.stopPropagation();
                if (win.classList.contains("is-minimized")) {
                    win.classList.remove("is-minimized");
                }
                win.classList.toggle("is-maximized");
            });
        }
    });
});