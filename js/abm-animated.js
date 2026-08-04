/**
 * ABM FM - 3D Animation & WebGL Engine
 * Three.js WebGL 3D Background Mesh, Interactive Mouse 3D Parallax,
 * Sticky Header Scroll Handler, 3D Tilt Card Effects, Animated Counters & ROI Estimator
 */

document.addEventListener('DOMContentLoaded', () => {
    initHeaderScroll();
    initThreeJs3DScene();
    init3DTiltCards();
    initScrollAnimations();
    initCounterAnimation();
    initServiceTabs();
    initRoiCalculator();
    initSmoothScroll();
    initIndustrialBannerSwitcher();
    init3DBuildingCreationAnimation();
});

/* Sticky Header Scroll Effect */
function initHeaderScroll() {
    const header = document.querySelector('.site-header-abm-floating') || document.querySelector('.site-header');
    if (!header) return;

    const handleScroll = () => {
        if (window.scrollY > 30) {
            header.classList.add('scrolled');
        } else {
            header.classList.remove('scrolled');
        }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll();
}

/* Three.js 3D WebGL Scene in Hero Section */
function initThreeJs3DScene() {
    const container = document.getElementById('heroCanvasContainer') || document.getElementById('heroCanvas')?.parentElement;
    if (!container || typeof THREE === 'undefined') {
        initFallbackCanvas();
        return;
    }

    let width = container.offsetWidth;
    let height = container.offsetHeight;

    // Scene, Camera, Renderer
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(60, width / height, 0.1, 1000);
    camera.position.z = 45;

    const renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true });
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    
    // Replace fallback canvas if existing
    const oldCanvas = document.getElementById('heroCanvas');
    if (oldCanvas) {
        oldCanvas.replaceWith(renderer.domElement);
    } else {
        container.appendChild(renderer.domElement);
    }
    renderer.domElement.id = 'heroCanvas';
    renderer.domElement.className = 'hero-canvas';

    // Create 3D Geometric Facility Node Sphere & Ring
    const geometry = new THREE.IcosahedronGeometry(18, 2);
    const wireframeMaterial = new THREE.MeshBasicMaterial({
        color: 0x00E599,
        wireframe: true,
        transparent: true,
        opacity: 0.22
    });
    const sphereMesh = new THREE.Mesh(geometry, wireframeMaterial);
    scene.add(sphereMesh);

    // Inner 3D Node Mesh
    const innerGeo = new THREE.OctahedronGeometry(10, 1);
    const innerMat = new THREE.MeshBasicMaterial({
        color: 0x36C697,
        wireframe: true,
        transparent: true,
        opacity: 0.35
    });
    const innerMesh = new THREE.Mesh(innerGeo, innerMat);
    scene.add(innerMesh);

    // 3D Outer Torus Ring
    const ringGeo = new THREE.TorusGeometry(26, 0.4, 16, 100);
    const ringMat = new THREE.MeshBasicMaterial({
        color: 0xFFB800,
        wireframe: true,
        transparent: true,
        opacity: 0.2
    });
    const ringMesh = new THREE.Mesh(ringGeo, ringMat);
    ringMesh.rotation.x = Math.PI / 3;
    scene.add(ringMesh);

    // 3D Particle Cloud
    const particleCount = 200;
    const particleGeo = new THREE.BufferGeometry();
    const positions = new Float32Array(particleCount * 3);

    for (let i = 0; i < particleCount * 3; i += 3) {
        positions[i] = (Math.random() - 0.5) * 120;
        positions[i + 1] = (Math.random() - 0.5) * 120;
        positions[i + 2] = (Math.random() - 0.5) * 120;
    }

    particleGeo.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    const particleMat = new THREE.PointsMaterial({
        color: 0x00E599,
        size: 1.2,
        transparent: true,
        opacity: 0.6
    });
    const particlePoints = new THREE.Points(particleGeo, particleMat);
    scene.add(particlePoints);

    // Mouse 3D Parallax Tracking
    let mouseX = 0;
    let mouseY = 0;
    let targetX = 0;
    let targetY = 0;

    window.addEventListener('mousemove', (e) => {
        mouseX = (e.clientX - window.innerWidth / 2) * 0.0008;
        mouseY = (e.clientY - window.innerHeight / 2) * 0.0008;
    });

    window.addEventListener('resize', () => {
        if (!container) return;
        width = container.offsetWidth;
        height = container.offsetHeight;
        camera.aspect = width / height;
        camera.updateProjectionMatrix();
        renderer.setSize(width, height);
    });

    // 3D Animation Loop
    function animate3D() {
        requestAnimationFrame(animate3D);

        targetX += (mouseX - targetX) * 0.05;
        targetY += (mouseY - targetY) * 0.05;

        sphereMesh.rotation.y += 0.003;
        sphereMesh.rotation.x += 0.001;

        innerMesh.rotation.y -= 0.005;
        innerMesh.rotation.z += 0.002;

        ringMesh.rotation.z += 0.002;
        particlePoints.rotation.y += 0.001;

        scene.rotation.y = targetX;
        scene.rotation.x = targetY;

        renderer.render(scene, camera);
    }

    animate3D();
}

/* Fallback 2D Canvas Background */
function initFallbackCanvas() {
    const canvas = document.getElementById('heroCanvas');
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    let width = canvas.width = canvas.parentElement.offsetWidth;
    let height = canvas.height = canvas.parentElement.offsetHeight;

    window.addEventListener('resize', () => {
        if (!canvas.parentElement) return;
        width = canvas.width = canvas.parentElement.offsetWidth;
        height = canvas.height = canvas.parentElement.offsetHeight;
    });

    const particles = [];
    for (let i = 0; i < 40; i++) {
        particles.push({
            x: Math.random() * width,
            y: Math.random() * height,
            radius: Math.random() * 2 + 1,
            vx: (Math.random() - 0.5) * 0.5,
            vy: (Math.random() - 0.5) * 0.5,
            alpha: Math.random() * 0.5 + 0.2
        });
    }

    function render() {
        ctx.clearRect(0, 0, width, height);
        particles.forEach(p => {
            p.x += p.vx;
            p.y += p.vy;
            if (p.x < 0 || p.x > width) p.vx *= -1;
            if (p.y < 0 || p.y > height) p.vy *= -1;

            ctx.beginPath();
            ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
            ctx.fillStyle = `rgba(0, 229, 153, ${p.alpha})`;
            ctx.fill();
        });
        requestAnimationFrame(render);
    }
    render();
}

/* 3D Tilt Card Hover Effect */
function init3DTiltCards() {
    const cards = document.querySelectorAll('.service-card, .industry-card-item, .hero-preview-card, .case-study-card, .roi-calculator-card, .pillar-item');
    if (!cards.length) return;

    cards.forEach(card => {
        card.style.transformStyle = 'preserve-3d';
        card.style.transition = 'transform 0.15s ease-out, box-shadow 0.3s ease';

        card.addEventListener('mousemove', (e) => {
            const rect = card.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;

            const centerX = rect.width / 2;
            const centerY = rect.height / 2;

            const rotateX = ((y - centerY) / centerY) * -8; // max 8 deg tilt
            const rotateY = ((x - centerX) / centerX) * 8;

            card.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale3d(1.02, 1.02, 1.02)`;
        });

        card.addEventListener('mouseleave', () => {
            card.style.transform = 'perspective(1000px) rotateX(0deg) rotateY(0deg) scale3d(1, 1, 1)';
        });
    });
}

/* Intersection Observer for 3D Depth Scroll Animations */
function initScrollAnimations() {
    const animateElements = document.querySelectorAll('.animate-on-scroll');
    
    if (!('IntersectionObserver' in window)) {
        animateElements.forEach(el => el.classList.add('is-visible'));
        return;
    }

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('is-visible');
                observer.unobserve(entry.target);
            }
        });
    }, {
        threshold: 0.15,
        rootMargin: '0px 0px -50px 0px'
    });

    animateElements.forEach(el => observer.observe(el));
}

/* Counter Animation for Metric Stats */
function initCounterAnimation() {
    const counterElements = document.querySelectorAll('.counter-val');
    if (!counterElements.length) return;

    const animateCounter = (el) => {
        const target = parseFloat(el.getAttribute('data-target'));
        const suffix = el.getAttribute('data-suffix') || '';
        const prefix = el.getAttribute('data-prefix') || '';
        const duration = 2000;
        const frameRate = 1000 / 60;
        const totalFrames = Math.round(duration / frameRate);
        let frame = 0;

        const counter = setInterval(() => {
            frame++;
            const progress = frame / totalFrames;
            const currentVal = target * (1 - Math.pow(1 - progress, 3));

            if (frame >= totalFrames) {
                el.innerText = prefix + target.toFixed(0) + suffix;
                clearInterval(counter);
            } else {
                el.innerText = prefix + currentVal.toFixed(0) + suffix;
            }
        }, frameRate);
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                animateCounter(entry.target);
                observer.unobserve(entry.target);
            }
        });
    }, { threshold: 0.5 });

    counterElements.forEach(el => observer.observe(el));
}

/* Interactive Filterable Service Tabs */
function initServiceTabs() {
    const tabBtns = document.querySelectorAll('.tab-btn');
    const serviceCards = document.querySelectorAll('.service-card-item');

    if (!tabBtns.length) return;

    tabBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            const category = btn.getAttribute('data-category');

            tabBtns.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');

            serviceCards.forEach(card => {
                const cardCat = card.getAttribute('data-category');
                if (category === 'all' || cardCat === category) {
                    card.style.display = 'block';
                    setTimeout(() => {
                        card.style.opacity = '1';
                        card.style.transform = 'perspective(1000px) rotateX(0deg) scale(1)';
                    }, 50);
                } else {
                    card.style.opacity = '0';
                    card.style.transform = 'perspective(1000px) rotateX(15deg) scale(0.95)';
                    setTimeout(() => {
                        card.style.display = 'none';
                    }, 300);
                }
            });
        });
    });
}

/* Interactive ROI & Energy Savings Estimator */
function initRoiCalculator() {
    const areaInput = document.getElementById('calcArea');
    const areaValDisplay = document.getElementById('calcAreaValue');
    const typeSelect = document.getElementById('calcType');
    const estSavingsDisplay = document.getElementById('estSavingsDisplay');
    const estCo2Display = document.getElementById('estCo2Display');
    const estRoiDisplay = document.getElementById('estRoiDisplay');

    if (!areaInput || !typeSelect || !estSavingsDisplay) return;

    const calculateROI = () => {
        const areaSqFt = parseFloat(areaInput.value) || 50000;
        const facilityType = typeSelect.value || 'commercial';

        if (areaValDisplay) {
            areaValDisplay.innerText = areaSqFt.toLocaleString() + ' sq ft';
        }

        let energyCostPerSqFt = 2.5;
        let savingsRate = 0.22;

        switch (facilityType) {
            case 'industrial':
                energyCostPerSqFt = 3.8;
                savingsRate = 0.28;
                break;
            case 'garment':
                energyCostPerSqFt = 3.2;
                savingsRate = 0.25;
                break;
            case 'healthcare':
                energyCostPerSqFt = 4.5;
                savingsRate = 0.24;
                break;
            case 'commercial':
            default:
                energyCostPerSqFt = 2.5;
                savingsRate = 0.20;
                break;
        }

        const totalAnnualEnergySpend = areaSqFt * energyCostPerSqFt;
        const estAnnualSavings = totalAnnualEnergySpend * savingsRate;
        const estCo2ReductionTons = Math.round((areaSqFt * 0.012) * (savingsRate / 0.2));
        const paybackMonths = Math.max(4, Math.round(14 - (savingsRate * 20)));

        estSavingsDisplay.innerText = '$' + Math.round(estAnnualSavings).toLocaleString();
        if (estCo2Display) estCo2Display.innerText = estCo2ReductionTons.toLocaleString() + ' Metric Tons / yr';
        if (estRoiDisplay) estRoiDisplay.innerText = paybackMonths + ' Months Payback';
    };

    areaInput.addEventListener('input', calculateROI);
    typeSelect.addEventListener('change', calculateROI);
    calculateROI();
}

/* Smooth Scrolling for Anchor Links */
function initSmoothScroll() {
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            const targetId = this.getAttribute('href');
            if (targetId === '#') return;
            const targetEl = document.querySelector(targetId);
            if (targetEl) {
                e.preventDefault();
                const headerHeight = document.querySelector('.site-header-abm-floating')?.offsetHeight || 80;
                const targetPos = targetEl.getBoundingClientRect().top + window.pageYOffset - headerHeight - 20;
                window.scrollTo({
                    top: targetPos,
                    behavior: 'smooth'
                });
            }
        });
    });
}

/* Interactive Industrial Type Hero Banner Switcher */
function initIndustrialBannerSwitcher() {
    const tabBtns = document.querySelectorAll('.ind-tab-btn');
    const heroSection = document.getElementById('heroFullwidthSection');
    const badgeTitle = document.getElementById('heroBadgeTitle');
    const badgeSub = document.getElementById('heroBadgeSub');
    const badgeStat = document.getElementById('heroBadgeStat');
    const badgeStatLbl = document.getElementById('heroBadgeStatLbl');
    const badgeIcon = document.getElementById('heroBadgeIcon');

    if (!tabBtns.length) return;

    let currentIndex = 0;
    let autoRotateInterval;

    const updateBanner = (btn) => {
        const imgSrc = btn.getAttribute('data-img') || btn.getAttribute('data-bg');
        const title = btn.getAttribute('data-title');
        const sub = btn.getAttribute('data-sub');
        const stat = btn.getAttribute('data-stat');
        const statLbl = btn.getAttribute('data-stat-lbl');
        const iconClass = btn.getAttribute('data-icon');

        tabBtns.forEach(b => b.classList.remove('active'));
        btn.classList.add('active');

        const heroVideo = heroSection ? heroSection.querySelector('.hero-bg-video') : null;
        if (heroSection && imgSrc && !heroVideo) {
            heroSection.style.backgroundImage = `url('${imgSrc}')`;
        }

        if (badgeTitle && title) badgeTitle.innerText = title;
        if (badgeSub && sub) badgeSub.innerText = sub;
        if (badgeStat && stat) badgeStat.innerText = stat;
        if (badgeStatLbl && statLbl) badgeStatLbl.innerText = statLbl;
        if (badgeIcon && iconClass) {
            badgeIcon.className = `fa-solid ${iconClass}`;
        }
    };

    tabBtns.forEach((btn, index) => {
        btn.addEventListener('click', () => {
            currentIndex = index;
            updateBanner(btn);
            resetAutoRotate();
        });
    });

    const autoRotate = () => {
        currentIndex = (currentIndex + 1) % tabBtns.length;
        updateBanner(tabBtns[currentIndex]);
    };

    const startAutoRotate = () => {
        autoRotateInterval = setInterval(autoRotate, 6000);
    };

    const resetAutoRotate = () => {
        clearInterval(autoRotateInterval);
        startAutoRotate();
    };

    startAutoRotate();
}

/* Interactive 3D Building Creation Animation (Three.js WebGL Engine) */
function init3DBuildingCreationAnimation() {
    const banners = document.querySelectorAll('.page-banner-hero');
    if (!banners.length || typeof THREE === 'undefined') return;

    banners.forEach((banner) => {
        // Create 3D Canvas element if not already present
        let canvas = banner.querySelector('.page-banner-3d-canvas');
        if (!canvas) {
            canvas = document.createElement('canvas');
            canvas.className = 'page-banner-3d-canvas';
            banner.insertBefore(canvas, banner.firstChild);
        }

        const width = banner.clientWidth;
        const height = banner.clientHeight;

        const scene = new THREE.Scene();
        const camera = new THREE.PerspectiveCamera(45, width / height, 0.1, 1000);
        camera.position.set(22, 18, 35);
        camera.lookAt(0, 5, 0);

        const renderer = new THREE.WebGLRenderer({ canvas: canvas, alpha: true, antialias: true });
        renderer.setSize(width, height);
        renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

        // Group containing the entire 3D building structure
        const buildingGroup = new THREE.Group();
        scene.add(buildingGroup);

        // Materials for glowing wireframe & structural beams
        const beamMaterial = new THREE.LineBasicMaterial({
            color: 0x00E599,
            transparent: true,
            opacity: 0.85
        });

        const accentBeamMaterial = new THREE.LineBasicMaterial({
            color: 0xFFB800,
            transparent: true,
            opacity: 0.9
        });

        const floorMaterial = new THREE.MeshBasicMaterial({
            color: 0x00E599,
            wireframe: true,
            transparent: true,
            opacity: 0.25
        });

        // 1. Build Multi-Tiered 3D Skyscraper Wireframe
        const floors = 14;
        const floorHeight = 1.2;
        const buildingWidth = 8;
        const buildingDepth = 8;
        const floorMeshes = [];

        for (let i = 0; i < floors; i++) {
            const currentY = i * floorHeight;
            // Taper building upper floors for futuristic architecture
            const scaleFactor = i > 9 ? 0.6 : (i > 5 ? 0.8 : 1.0);
            const w = buildingWidth * scaleFactor;
            const d = buildingDepth * scaleFactor;

            // Floor boundary box
            const boxGeo = new THREE.BoxGeometry(w, floorHeight, d);
            const edgesGeo = new THREE.EdgesGeometry(boxGeo);
            const line = new THREE.LineSegments(edgesGeo, (i % 3 === 0) ? accentBeamMaterial : beamMaterial);
            line.position.set(0, currentY, 0);
            
            // Floor slab grid
            const slabGeo = new THREE.PlaneGeometry(w, d);
            const slabMesh = new THREE.Mesh(slabGeo, floorMaterial);
            slabMesh.rotation.x = -Math.PI / 2;
            slabMesh.position.set(0, currentY, 0);

            const floorGroup = new THREE.Group();
            floorGroup.add(line);
            floorGroup.add(slabMesh);
            floorGroup.userData = { targetY: currentY, floorIndex: i };
            
            buildingGroup.add(floorGroup);
            floorMeshes.push(floorGroup);
        }

        // Spire Roof Antenna
        const spireGeo = new THREE.ConeGeometry(0.8, 6, 4);
        const spireEdges = new THREE.EdgesGeometry(spireGeo);
        const spireLine = new THREE.LineSegments(spireEdges, accentBeamMaterial);
        spireLine.position.set(0, floors * floorHeight + 2.5, 0);
        buildingGroup.add(spireLine);

        // 2. Structural Scanning Grid Laser Plane
        const laserGeo = new THREE.PlaneGeometry(16, 16);
        const laserMat = new THREE.MeshBasicMaterial({
            color: 0x00E599,
            side: THREE.DoubleSide,
            transparent: true,
            opacity: 0.35
        });
        const laserPlane = new THREE.Mesh(laserGeo, laserMat);
        laserPlane.rotation.x = -Math.PI / 2;
        scene.add(laserPlane);

        // 3. Floating Digital Data Particles around 3D Building
        const particleCount = 120;
        const particleGeo = new THREE.BufferGeometry();
        const positions = new Float32Array(particleCount * 3);

        for (let i = 0; i < particleCount * 3; i += 3) {
            positions[i] = (Math.random() - 0.5) * 30;
            positions[i + 1] = Math.random() * 22;
            positions[i + 2] = (Math.random() - 0.5) * 30;
        }

        particleGeo.setAttribute('position', new THREE.BufferAttribute(positions, 3));
        const particleMat = new THREE.PointsMaterial({
            color: 0x00E599,
            size: 0.4,
            transparent: true,
            opacity: 0.8
        });
        const particleSystem = new THREE.Points(particleGeo, particleMat);
        scene.add(particleSystem);

        // Shift building position to the right side of the banner for high impact
        buildingGroup.position.set(8, -4, 0);
        laserPlane.position.set(8, -4, 0);

        // Mouse Parallax Interaction
        let mouseX = 0, mouseY = 0;
        window.addEventListener('mousemove', (e) => {
            mouseX = (e.clientX / window.innerWidth - 0.5) * 0.4;
            mouseY = (e.clientY / window.innerHeight - 0.5) * 0.4;
        });

        // 4. Animation Loop: Sequential 3D Building Construction & Rotation
        let progress = 0;
        const totalHeight = floors * floorHeight;

        function animate() {
            requestAnimationFrame(animate);

            progress += 0.12;
            const currentScanY = (Math.sin(progress * 0.03) * 0.5 + 0.5) * (totalHeight + 4) - 4;
            laserPlane.position.y = currentScanY;

            // Sequential floor rise/construction effect
            floorMeshes.forEach((fl) => {
                const targetY = fl.userData.targetY - 4;
                if (currentScanY >= targetY) {
                    fl.visible = true;
                    fl.position.y += (targetY - fl.position.y) * 0.1;
                } else {
                    fl.position.y = -10;
                    fl.visible = false;
                }
            });

            // Smooth 3D Rotation & Mouse Parallax
            buildingGroup.rotation.y += 0.005;
            buildingGroup.rotation.x = mouseY * 0.3;
            buildingGroup.rotation.z = mouseX * 0.2;

            particleSystem.rotation.y += 0.002;

            renderer.render(scene, camera);
        }

        animate();

        // Responsive Resize
        window.addEventListener('resize', () => {
            const newW = banner.clientWidth;
            const newH = banner.clientHeight;
            camera.aspect = newW / newH;
            camera.updateProjectionMatrix();
            renderer.setSize(newW, newH);
        });
    });
}

