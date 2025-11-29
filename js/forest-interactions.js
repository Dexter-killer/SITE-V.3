// Взаимодействия и оптимизация для лесной темы
class ForestInteractions {
    constructor() {
        this.cursorGlow = document.getElementById('cursorGlow');
        this.init();
    }

    init() {
        this.setupCursorGlow();
        this.setupSmoothScrolling();
        this.setupPerformanceMonitor();
        this.setupMobileOptimizations();
        this.setupSeasonalEffects();
    }

    setupCursorGlow() {
        if (!this.cursorGlow) return;

        document.addEventListener('mousemove', (e) => {
            this.moveCursorGlow(e);
        });

        document.addEventListener('mouseenter', () => {
            this.showCursorGlow();
        });

        document.addEventListener('mouseleave', () => {
            this.hideCursorGlow();
        });

        // Интерактивные элементы
        this.setupInteractiveHover();
    }

    moveCursorGlow(e) {
        this.cursorGlow.style.left = (e.clientX - 20) + 'px';
        this.cursorGlow.style.top = (e.clientY - 20) + 'px';
    }

    showCursorGlow() {
        this.cursorGlow.style.opacity = '1';
    }

    hideCursorGlow() {
        this.cursorGlow.style.opacity = '0';
    }

    setupInteractiveHover() {
        const interactiveElements = document.querySelectorAll(
            'a, button, .nav-link, .card, .project-card, .forest-btn, .forest-outline-btn'
        );

        interactiveElements.forEach(el => {
            el.addEventListener('mouseenter', (e) => {
                this.expandCursorGlow();
                this.createLeafTrail(e);
            });
            
            el.addEventListener('mouseleave', () => {
                this.shrinkCursorGlow();
            });
        });
    }

    expandCursorGlow() {
        this.cursorGlow.style.width = '60px';
        this.cursorGlow.style.height = '60px';
        this.cursorGlow.style.background = 'radial-gradient(circle, rgba(107, 155, 75, 0.6) 0%, rgba(75, 139, 59, 0.3) 40%, transparent 70%)';
    }

    shrinkCursorGlow() {
        this.cursorGlow.style.width = '40px';
        this.cursorGlow.style.height = '40px';
        this.cursorGlow.style.background = 'radial-gradient(circle, rgba(107, 155, 75, 0.4) 0%, rgba(75, 139, 59, 0.2) 40%, transparent 70%)';
    }

    createLeafTrail(event) {
        const trail = document.createElement('div');
        trail.textContent = '🍃';
        trail.className = 'cursor-leaf-trail';
        
        trail.style.cssText = `
            position: fixed;
            left: ${event.clientX}px;
            top: ${event.clientY}px;
            font-size: 12px;
            pointer-events: none;
            z-index: 9997;
            animation: leafTrail 1s ease-out forwards;
        `;
        
        document.body.appendChild(trail);
        
        setTimeout(() => {
            trail.remove();
        }, 1000);
        
        // Добавляем стили
        if (!document.querySelector('#leaf-trail-animation')) {
            const style = document.createElement('style');
            style.id = 'leaf-trail-animation';
            style.textContent = `
                @keyframes leafTrail {
                    0% {
                        transform: translate(-50%, -50%) rotate(0deg) scale(1);
                        opacity: 1;
                    }
                    100% {
                        transform: translate(-50%, -80px) rotate(180deg) scale(0.3);
                        opacity: 0;
                    }
                }
            `;
            document.head.appendChild(style);
        }
    }

    setupSmoothScrolling() {
        // Плавная прокрутка для якорных ссылок
        document.querySelectorAll('a[href^="#"]').forEach(anchor => {
            anchor.addEventListener('click', function (e) {
                e.preventDefault();
                const target = document.querySelector(this.getAttribute('href'));
                if (target) {
                    target.scrollIntoView({
                        behavior: 'smooth',
                        block: 'start'
                    });
                    
                    // Эффект роста при скролле
                    if (window.ForestInteractions) {
                        window.ForestInteractions.createScrollGrowth(target);
                    }
                }
            });
        });
    }

    createScrollGrowth(target) {
        const growth = document.createElement('div');
        growth.textContent = '🌿';
        growth.style.cssText = `
            position: fixed;
            left: 50%;
            top: 50%;
            transform: translate(-50%, -50%);
            font-size: 0px;
            pointer-events: none;
            z-index: 9999;
            animation: scrollGrowth 0.8s ease-out;
        `;
        
        document.body.appendChild(growth);
        
        setTimeout(() => {
            growth.remove();
        }, 800);
        
        // Добавляем стили
        if (!document.querySelector('#scroll-growth-animation')) {
            const style = document.createElement('style');
            style.id = 'scroll-growth-animation';
            style.textContent = `
                @keyframes scrollGrowth {
                    0% {
                        font-size: 0px;
                        opacity: 0;
                    }
                    50% {
                        font-size: 60px;
                        opacity: 1;
                    }
                    100% {
                        font-size: 80px;
                        opacity: 0;
                    }
                }
            `;
            document.head.appendChild(style);
        }
    }

    setupPerformanceMonitor() {
        // Мониторинг FPS
        let frameCount = 0;
        let lastTime = performance.now();
        let fps = 60;

        const checkFPS = () => {
            frameCount++;
            const currentTime = performance.now();
            
            if (currentTime - lastTime >= 1000) {
                fps = Math.round((frameCount * 1000) / (currentTime - lastTime));
                frameCount = 0;
                lastTime = currentTime;

                // Автоматическая оптимизация при низком FPS
                if (fps < 30) {
                    this.optimizeForLowFPS();
                }
            }
            
            requestAnimationFrame(checkFPS);
        };
        checkFPS();
    }

    optimizeForLowFPS() {
        console.log('🌲 Оптимизация для низкого FPS');
        
        // Уменьшаем количество анимаций
        const particles = document.querySelectorAll('.leaf, .firefly, .dynamic-leaf, .dynamic-firefly');
        particles.forEach((particle, index) => {
            if (index % 2 === 0) {
                particle.style.display = 'none';
            }
        });

        // Упрощаем эффекты стекла
        document.documentElement.style.setProperty('--glass-bg', 'rgba(46, 90, 59, 0.25)');
    }

    setupMobileOptimizations() {
        if (this.isMobileDevice()) {
            this.applyMobileOptimizations();
        }

        // Обработка изменения ориентации
        window.addEventListener('orientationchange', () => {
            setTimeout(() => {
                this.handleOrientationChange();
            }, 300);
        });
    }

    isMobileDevice() {
        return window.matchMedia('(max-width: 768px)').matches ||
               /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
    }

    applyMobileOptimizations() {
        console.log('🌲 Применение мобильных оптимизаций');
        
        // Убираем сложные эффекты на мобильных
        if (this.cursorGlow) {
            this.cursorGlow.style.display = 'none';
        }

        // Уменьшаем количество частиц
        const particles = document.querySelectorAll('.leaf, .firefly');
        particles.forEach((particle, index) => {
            if (index > 8) {
                particle.style.display = 'none';
            }
        });

        // Упрощаем анимации
        document.documentElement.style.setProperty('--animation-speed', '10s');
    }

    handleOrientationChange() {
        // Пересчитываем размеры после изменения ориентации
        setTimeout(() => {
            if (window.ForestEngine) {
                window.ForestEngine.init();
            }
        }, 100);
    }

    setupSeasonalEffects() {
        // Определяем "сезон" на основе времени суток
        const hour = new Date().getHours();
        let season = 'day';
        
        if (hour >= 6 && hour < 12) {
            season = 'morning';
        } else if (hour >= 12 && hour < 18) {
            season = 'afternoon';
        } else if (hour >= 18 && hour < 22) {
            season = 'evening';
        } else {
            season = 'night';
        }
        
        this.applySeasonalTheme(season);
    }

    applySeasonalTheme(season) {
        const root = document.documentElement;
        
        switch(season) {
            case 'morning':
                root.style.setProperty('--forest-light', '#7BAB5B');
                root.style.setProperty('--forest-moss', '#9BAF7D');
                break;
            case 'afternoon':
                root.style.setProperty('--forest-light', '#6B9B4B');
                root.style.setProperty('--forest-moss', '#8B9F6D');
                break;
            case 'evening':
                root.style.setProperty('--forest-light', '#5B8B3B');
                root.style.setProperty('--forest-moss', '#7B8F5D');
                break;
            case 'night':
                root.style.setProperty('--forest-light', '#4B7B2B');
                root.style.setProperty('--forest-moss', '#6B7F4D');
                // Больше светлячков ночью
                this.increaseFireflies();
                break;
        }
    }

    increaseFireflies() {
        const container = document.querySelector('.fireflies-container') || 
                          document.getElementById('firefliesContainer');
        if (!container || !window.ForestEngine) return;
        
        // Добавляем больше светлячков
        for (let i = 0; i < 10; i++) {
            setTimeout(() => {
                window.ForestEngine.createFirefly(container);
            }, i * 100);
        }
    }

    // Публичные методы для управления взаимодействиями
    enableEffects() {
        if (this.cursorGlow) {
            this.cursorGlow.style.display = 'block';
        }

        const particles = document.querySelectorAll('.leaf, .firefly');
        particles.forEach(particle => {
            particle.style.display = 'block';
        });
    }

    disableEffects() {
        if (this.cursorGlow) {
            this.cursorGlow.style.display = 'none';
        }

        const particles = document.querySelectorAll('.leaf, .firefly');
        particles.forEach(particle => {
            particle.style.display = 'none';
        });
    }
}

// Утилиты для работы с природными эффектами
class NatureUtils {
    static createGrowth(x, y, intensity = 1) {
        if (window.ForestEngine) {
            window.ForestEngine.createSplash(x, y);
        }
    }

    static setForestColor(color) {
        document.documentElement.style.setProperty('--forest-light', color);
    }

    static animateElement(element, animationName) {
        element.style.animation = `${animationName} 0.6s ease forwards`;
    }

    static createBirdSound() {
        // Можно интегрировать Web Audio API для звуков птиц
        console.log('🐦 Звук птиц');
    }
}

// Инициализация
document.addEventListener('DOMContentLoaded', () => {
    const interactions = new ForestInteractions();
    
    // Глобальные утилиты
    window.ForestInteractions = interactions;
    window.NatureUtils = NatureUtils;
});

// Обработчики для touch устройств
document.addEventListener('touchstart', function(e) {
    // Создаем эффект при касании
    if (window.NatureUtils) {
        const touch = e.touches[0];
        window.NatureUtils.createGrowth(touch.clientX, touch.clientY, 0.5);
    }
}, { passive: true });
