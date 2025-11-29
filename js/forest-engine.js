// Основной движок лесных эффектов - ForestEngine
class ForestEngine {
    constructor() {
        this.isInitialized = false;
        this.particles = [];
        this.leaves = [];
        this.fireflies = [];
    }

    init() {
        if (this.isInitialized) return;
        console.log('🌲 Forest Engine инициализирован');
        this.isInitialized = true;
        
        this.initForestEffects();
        this.initInteractiveElements();
        this.initPerformanceOptimization();
    }

    initForestEffects() {
        // Создание листьев
        this.createFallingLeaves();
        
        // Инициализация светлячков
        this.createFireflies();
        
        // Создание тумана
        this.createFogEffect();
        
        // Запуск анимации
        this.startAnimation();
    }

    createFallingLeaves() {
        const leavesContainer = document.querySelector('.leaves-container');
        if (!leavesContainer) return;

        // Создаём больше листьев динамически
        for (let i = 0; i < 20; i++) {
            setTimeout(() => {
                this.createLeaf(leavesContainer);
            }, i * 500);
        }
    }

    createLeaf(container) {
        const leaf = document.createElement('div');
        leaf.className = 'leaf dynamic-leaf';
        
        const size = Math.random() * 15 + 10;
        const left = Math.random() * 100;
        const delay = Math.random() * 10;
        const duration = Math.random() * 10 + 15;
        const rotationSpeed = Math.random() * 360 + 180;
        
        // Случайные типы листьев
        const leafTypes = ['🍃', '🍂', '🌿'];
        const leafEmoji = leafTypes[Math.floor(Math.random() * leafTypes.length)];
        
        leaf.innerHTML = leafEmoji;
        
        leaf.style.cssText = `
            position: absolute;
            width: ${size}px;
            height: ${size}px;
            left: ${left}%;
            top: -20px;
            font-size: ${size}px;
            animation: leafFall ${duration}s ease-in ${delay}s infinite;
            filter: drop-shadow(0 0 3px rgba(139, 159, 109, 0.5));
            opacity: 0.7;
        `;
        
        container.appendChild(leaf);
        
        // Добавляем стили анимации
        if (!document.querySelector('#leaf-animations')) {
            const style = document.createElement('style');
            style.id = 'leaf-animations';
            style.textContent = `
                @keyframes leafFall {
                    0% {
                        transform: translateY(0) rotate(0deg) translateX(0);
                        opacity: 0;
                    }
                    10% {
                        opacity: 0.8;
                    }
                    25% {
                        transform: translateY(25vh) rotate(90deg) translateX(20px);
                    }
                    50% {
                        transform: translateY(50vh) rotate(180deg) translateX(-10px);
                    }
                    75% {
                        transform: translateY(75vh) rotate(270deg) translateX(30px);
                    }
                    90% {
                        opacity: 0.5;
                    }
                    100% {
                        transform: translateY(100vh) rotate(360deg) translateX(0);
                        opacity: 0;
                    }
                }
            `;
            document.head.appendChild(style);
        }
    }

    createFireflies() {
        const firefliesContainer = document.querySelector('.fireflies-container') || 
                                    document.getElementById('firefliesContainer');
        if (!firefliesContainer) return;

        for (let i = 0; i < 25; i++) {
            setTimeout(() => {
                this.createFirefly(firefliesContainer);
            }, i * 200);
        }
    }

    createFirefly(container) {
        const firefly = document.createElement('div');
        firefly.className = 'firefly dynamic-firefly';
        
        const left = Math.random() * 100;
        const top = Math.random() * 100;
        const size = Math.random() * 3 + 2;
        const delay = Math.random() * 3;
        const duration = Math.random() * 3 + 2;
        const floatDuration = Math.random() * 10 + 8;
        
        firefly.style.cssText = `
            position: absolute;
            width: ${size}px;
            height: ${size}px;
            left: ${left}%;
            top: ${top}%;
            background: #FFE55C;
            border-radius: 50%;
            box-shadow: 0 0 ${size * 3}px #FFE55C, 0 0 ${size * 6}px #FFB347;
            animation: firefly-glow ${duration}s ease-in-out ${delay}s infinite alternate,
                       firefly-float ${floatDuration}s ease-in-out infinite;
        `;
        
        container.appendChild(firefly);
    }

    createFogEffect() {
        const background = document.querySelector('.forest-background');
        if (!background) return;

        const fog = document.createElement('div');
        fog.className = 'fog-layer';
        fog.style.cssText = `
            position: absolute;
            width: 100%;
            height: 40%;
            bottom: 0;
            background: linear-gradient(to top, 
                        rgba(245, 232, 208, 0.1) 0%, 
                        transparent 100%);
            animation: fog-drift 20s infinite ease-in-out;
            pointer-events: none;
        `;
        
        background.appendChild(fog);
    }

    initInteractiveElements() {
        // Добавляем эффекты при наведении на карточки
        this.addCardHoverEffects();
        
        // Эффекты при клике
        this.addClickEffects();
    }

    addCardHoverEffects() {
        const cards = document.querySelectorAll('.forest-glass, .project-card');
        cards.forEach(card => {
            card.addEventListener('mouseenter', (e) => {
                this.createLeafBurst(e, card);
            });
        });
    }

    createLeafBurst(event, element) {
        const rect = element.getBoundingClientRect();
        const x = event.clientX - rect.left;
        const y = event.clientY - rect.top;
        
        // Создаём несколько листочков
        for (let i = 0; i < 5; i++) {
            setTimeout(() => {
                const burst = document.createElement('div');
                burst.textContent = '🍃';
                burst.className = 'leaf-burst';
                
                const angle = (Math.PI * 2 * i) / 5;
                const distance = 30 + Math.random() * 20;
                const finalX = x + Math.cos(angle) * distance;
                const finalY = y + Math.sin(angle) * distance;
                
                burst.style.cssText = `
                    position: absolute;
                    left: ${x}px;
                    top: ${y}px;
                    font-size: 12px;
                    pointer-events: none;
                    z-index: 100;
                    animation: leaf-burst 0.8s ease-out forwards;
                    --final-x: ${finalX}px;
                    --final-y: ${finalY}px;
                `;
                
                element.style.position = 'relative';
                element.appendChild(burst);
                
                setTimeout(() => {
                    if (burst.parentNode === element) {
                        element.removeChild(burst);
                    }
                }, 800);
            }, i * 50);
        }
        
        // Добавляем стили анимации
        if (!document.querySelector('#leaf-burst-animation')) {
            const style = document.createElement('style');
            style.id = 'leaf-burst-animation';
            style.textContent = `
                @keyframes leaf-burst {
                    0% {
                        transform: translate(0, 0) scale(1) rotate(0deg);
                        opacity: 1;
                    }
                    100% {
                        transform: translate(
                            calc(var(--final-x) - ${x}px), 
                            calc(var(--final-y) - ${y}px)
                        ) scale(0.5) rotate(180deg);
                        opacity: 0;
                    }
                }
            `;
            document.head.appendChild(style);
        }
    }

    addClickEffects() {
        document.addEventListener('click', (e) => {
            this.createNatureRipple(e);
        });
    }

    createNatureRipple(event) {
        const ripple = document.createElement('div');
        ripple.className = 'nature-ripple';
        
        ripple.style.cssText = `
            position: fixed;
            top: ${event.clientY}px;
            left: ${event.clientX}px;
            width: 0;
            height: 0;
            border-radius: 50%;
            background: radial-gradient(circle,
                        rgba(107, 155, 75, 0.3) 0%,
                        transparent 70%);
            transform: translate(-50%, -50%);
            pointer-events: none;
            z-index: 9999;
            animation: nature-ripple-expand 0.8s ease-out;
        `;
        
        document.body.appendChild(ripple);
        
        setTimeout(() => {
            if (ripple.parentNode) {
                document.body.removeChild(ripple);
            }
        }, 800);
        
        // Добавляем стили
        if (!document.querySelector('#nature-ripple-animation')) {
            const style = document.createElement('style');
            style.id = 'nature-ripple-animation';
            style.textContent = `
                @keyframes nature-ripple-expand {
                    0% {
                        width: 0;
                        height: 0;
                        opacity: 0.6;
                    }
                    100% {
                        width: 200px;
                        height: 200px;
                        opacity: 0;
                    }
                }
            `;
            document.head.appendChild(style);
        }
    }

    initPerformanceOptimization() {
        // Оптимизация для мобильных устройств
        if (this.isMobileDevice()) {
            this.reduceAnimations();
        }
        
        // Отслеживание производительности
        this.monitorPerformance();
    }

    isMobileDevice() {
        return /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
    }

    reduceAnimations() {
        // Уменьшаем количество частиц на мобильных
        const particles = document.querySelectorAll('.dynamic-leaf, .dynamic-firefly');
        particles.forEach((particle, index) => {
            if (index > 10) {
                particle.style.display = 'none';
            }
        });
    }

    monitorPerformance() {
        let frameCount = 0;
        let lastTime = performance.now();
        
        const checkFPS = () => {
            frameCount++;
            const currentTime = performance.now();
            
            if (currentTime - lastTime >= 1000) {
                const fps = Math.round((frameCount * 1000) / (currentTime - lastTime));
                frameCount = 0;
                lastTime = currentTime;
                
                // Автоматическое снижение качества при низком FPS
                if (fps < 30) {
                    this.reduceEffectsQuality();
                }
            }
            
            requestAnimationFrame(checkFPS);
        };
        checkFPS();
    }

    reduceEffectsQuality() {
        // Упрощаем эффекты при низком FPS
        const effects = document.querySelectorAll('.dynamic-leaf, .dynamic-firefly, .fog-layer');
        effects.forEach(effect => {
            if (Math.random() > 0.5) {
                effect.style.opacity = '0.3';
            }
        });
    }

    startAnimation() {
        // Основной цикл анимации
        const animate = () => {
            this.updateParticles();
            requestAnimationFrame(animate);
        };
        animate();
    }

    updateParticles() {
        // Обновление состояния частиц
        // Можно расширить для более сложной физики
    }

    // Публичные методы для управления эффектами
    createSplash(x, y) {
        this.createNatureRipple({ clientX: x, clientY: y });
    }

    setNatureIntensity(intensity) {
        document.documentElement.style.setProperty('--nature-intensity', intensity);
    }
}

// Создаем глобальный экземпляр
window.ForestEngine = new ForestEngine();

// Автоматическая инициализация при загрузке DOM
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => {
        window.ForestEngine.init();
    });
} else {
    window.ForestEngine.init();
}
