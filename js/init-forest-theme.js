// Централизованная инициализация лесной темы
class ForestThemeInitializer {
    constructor() {
        this.modules = {
            engine: null,
            animations: null,
            interactions: null,
            notifications: null,
            validation: null
        };
        
        this.config = {
            enableAnimations: true,
            enableParticles: true,
            enableSounds: false,
            performanceMode: 'auto', // 'auto', 'high', 'low'
            season: 'auto' // 'auto', 'spring', 'summer', 'autumn', 'winter'
        };
        
        this.isInitialized = false;
    }

    async init() {
        if (this.isInitialized) {
            console.log('🌲 Тема уже инициализирована');
            return;
        }

        console.log('🌲 Инициализация лесной темы...');
        
        // Проверяем готовность DOM
        if (document.readyState === 'loading') {
            await new Promise(resolve => {
                document.addEventListener('DOMContentLoaded', resolve);
            });
        }

        // Определяем конфигурацию на основе устройства
        this.detectDeviceCapabilities();
        
        // Инициализируем модули последовательно
        await this.initializeModules();
        
        // Настраиваем глобальные обработчики
        this.setupGlobalHandlers();
        
        // Применяем пользовательские настройки
        this.applyUserPreferences();
        
        this.isInitialized = true;
        console.log('✅ Лесная тема полностью инициализирована');
        
        // Показываем приветственное уведомление
        this.showWelcomeNotification();
    }

    detectDeviceCapabilities() {
        const isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
        const hasReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
        const connectionSpeed = this.getConnectionSpeed();

        // Автоматическая настройка производительности
        if (this.config.performanceMode === 'auto') {
            if (isMobile || hasReducedMotion || connectionSpeed === 'slow') {
                this.config.performanceMode = 'low';
                console.log('🌲 Режим производительности: низкий');
            } else {
                this.config.performanceMode = 'high';
                console.log('🌲 Режим производительности: высокий');
            }
        }

        // Отключаем анимации при необходимости
        if (hasReducedMotion) {
            this.config.enableAnimations = false;
            console.log('🌲 Анимации отключены (prefers-reduced-motion)');
        }

        // Уменьшаем частицы на слабых устройствах
        if (this.config.performanceMode === 'low') {
            this.config.enableParticles = false;
            console.log('🌲 Частицы отключены для оптимизации');
        }
    }

    getConnectionSpeed() {
        if ('connection' in navigator) {
            const connection = navigator.connection || navigator.mozConnection || navigator.webkitConnection;
            const effectiveType = connection.effectiveType;
            
            if (effectiveType === 'slow-2g' || effectiveType === '2g') {
                return 'slow';
            } else if (effectiveType === '3g') {
                return 'medium';
            } else {
                return 'fast';
            }
        }
        return 'unknown';
    }

    async initializeModules() {
        try {
            // 1. Инициализация основного движка
            console.log('🌲 Инициализация ForestEngine...');
            if (window.ForestEngine) {
                this.modules.engine = window.ForestEngine;
                if (!this.modules.engine.isInitialized) {
                    this.modules.engine.init();
                }
            }

            // 2. Инициализация анимаций
            console.log('🌲 Инициализация ForestAnimations...');
            if (window.ForestAnimations) {
                this.modules.animations = new ForestAnimations();
            }

            // 3. Инициализация взаимодействий
            console.log('🌲 Инициализация ForestInteractions...');
            if (window.ForestInteractions) {
                this.modules.interactions = window.ForestInteractions;
            }

            // 4. Инициализация уведомлений
            console.log('🌲 Инициализация ForestNotifications...');
            if (window.ForestNotifications) {
                this.modules.notifications = window.ForestNotifications;
            }

            // 5. Инициализация валидации форм
            console.log('🌲 Инициализация ForestFormValidation...');
            const form = document.querySelector('.forest-form');
            if (form && window.ForestFormValidation) {
                this.modules.validation = new ForestFormValidation();
            }

            console.log('✅ Все модули инициализированы');
        } catch (error) {
            console.error('❌ Ошибка при инициализации модулей:', error);
        }
    }

    setupGlobalHandlers() {
        // Обработка изменения размера окна
        let resizeTimeout;
        window.addEventListener('resize', () => {
            clearTimeout(resizeTimeout);
            resizeTimeout = setTimeout(() => {
                this.handleResize();
            }, 250);
        });

        // Обработка изменения видимости страницы
        document.addEventListener('visibilitychange', () => {
            this.handleVisibilityChange();
        });

        // Обработка ошибок загрузки изображений
        document.addEventListener('error', (e) => {
            if (e.target.tagName === 'IMG') {
                this.handleImageError(e.target);
            }
        }, true);

        // Обработка онлайн/оффлайн статуса
        window.addEventListener('online', () => {
            this.handleConnectionChange(true);
        });
        
        window.addEventListener('offline', () => {
            this.handleConnectionChange(false);
        });

        // Keyboard navigation accessibility
        this.setupKeyboardNavigation();
    }

    handleResize() {
        console.log('🌲 Обработка изменения размера окна');
        
        // Пересчитываем частицы
        if (this.modules.engine && this.config.enableParticles) {
            const width = window.innerWidth;
            if (width < 768 && this.config.performanceMode !== 'low') {
                this.config.performanceMode = 'low';
                this.modules.engine.reduceAnimations();
            }
        }
    }

    handleVisibilityChange() {
        if (document.hidden) {
            console.log('🌲 Страница скрыта - приостановка анимаций');
            this.pauseAnimations();
        } else {
            console.log('🌲 Страница видима - возобновление анимаций');
            this.resumeAnimations();
        }
    }

    pauseAnimations() {
        // Приостанавливаем тяжелые анимации когда вкладка неактивна
        const particles = document.querySelectorAll('.leaf, .firefly, .dynamic-leaf, .dynamic-firefly');
        particles.forEach(particle => {
            particle.style.animationPlayState = 'paused';
        });
    }

    resumeAnimations() {
        // Возобновляем анимации
        const particles = document.querySelectorAll('.leaf, .firefly, .dynamic-leaf, .dynamic-firefly');
        particles.forEach(particle => {
            particle.style.animationPlayState = 'running';
        });
    }

    handleImageError(img) {
        console.log('🌲 Ошибка загрузки изображения:', img.src);
        
        // Создаем placeholder с природной тематикой
        const placeholder = document.createElement('div');
        placeholder.className = 'forest-image-placeholder';
        placeholder.innerHTML = '🌲';
        placeholder.style.cssText = `
            width: ${img.width || 300}px;
            height: ${img.height || 200}px;
            display: flex;
            align-items: center;
            justify-content: center;
            background: linear-gradient(135deg, var(--forest-deep), var(--forest-medium));
            border-radius: 8px;
            font-size: 48px;
        `;
        
        img.parentNode?.replaceChild(placeholder, img);
    }

    handleConnectionChange(isOnline) {
        if (this.modules.notifications) {
            if (isOnline) {
                this.modules.notifications.success('Соединение восстановлено 🌿', 3000);
            } else {
                this.modules.notifications.warning('Нет соединения с интернетом 🍂', 5000);
            }
        }
    }

    setupKeyboardNavigation() {
        // Улучшенная навигация с клавиатуры
        document.addEventListener('keydown', (e) => {
            // Escape для закрытия модальных окон
            if (e.key === 'Escape') {
                this.closeModals();
            }
            
            // Tab trap для модальных окон
            if (e.key === 'Tab') {
                this.handleTabTrap(e);
            }
        });
    }

    closeModals() {
        const modals = document.querySelectorAll('.modal.show');
        modals.forEach(modal => {
            const closeBtn = modal.querySelector('[data-bs-dismiss="modal"]');
            if (closeBtn) closeBtn.click();
        });
    }

    handleTabTrap(e) {
        const modal = document.querySelector('.modal.show');
        if (!modal) return;

        const focusableElements = modal.querySelectorAll(
            'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
        );
        
        const firstElement = focusableElements[0];
        const lastElement = focusableElements[focusableElements.length - 1];

        if (e.shiftKey && document.activeElement === firstElement) {
            e.preventDefault();
            lastElement.focus();
        } else if (!e.shiftKey && document.activeElement === lastElement) {
            e.preventDefault();
            firstElement.focus();
        }
    }

    applyUserPreferences() {
        // Загружаем сохраненные настройки из localStorage
        const savedPrefs = this.loadPreferences();
        
        if (savedPrefs) {
            console.log('🌲 Применение сохраненных настроек');
            Object.assign(this.config, savedPrefs);
        }

        // Применяем настройки темы
        if (this.config.season !== 'auto') {
            this.setSeason(this.config.season);
        }

        // Применяем настройки производительности
        if (this.config.performanceMode === 'low') {
            this.enableLowPerformanceMode();
        }
    }

    loadPreferences() {
        try {
            const prefs = localStorage.getItem('forestThemePreferences');
            return prefs ? JSON.parse(prefs) : null;
        } catch (error) {
            console.error('Ошибка загрузки настроек:', error);
            return null;
        }
    }

    savePreferences() {
        try {
            localStorage.setItem('forestThemePreferences', JSON.stringify(this.config));
            console.log('🌲 Настройки сохранены');
        } catch (error) {
            console.error('Ошибка сохранения настроек:', error);
        }
    }

    setSeason(season) {
        console.log(`🌲 Установка сезона: ${season}`);
        
        const root = document.documentElement;
        
        const seasonColors = {
            spring: {
                light: '#7BAB5B',
                medium: '#6B9B4B',
                moss: '#9BAF7D'
            },
            summer: {
                light: '#6B9B4B',
                medium: '#5B8B3B',
                moss: '#8B9F6D'
            },
            autumn: {
                light: '#D4A574',
                medium: '#B8915B',
                moss: '#C4A57D'
            },
            winter: {
                light: '#8BA8B0',
                medium: '#6B8890',
                moss: '#A0B8C0'
            }
        };
        
        const colors = seasonColors[season] || seasonColors.summer;
        
        root.style.setProperty('--forest-light', colors.light);
        root.style.setProperty('--forest-medium', colors.medium);
        root.style.setProperty('--forest-moss', colors.moss);
        
        this.config.season = season;
        this.savePreferences();
    }

    enableLowPerformanceMode() {
        console.log('🌲 Включение режима низкой производительности');
        
        // Отключаем частицы
        const particles = document.querySelectorAll('.leaf, .firefly, .dynamic-leaf, .dynamic-firefly');
        particles.forEach((particle, index) => {
            if (index > 5) {
                particle.style.display = 'none';
            }
        });

        // Упрощаем эффекты
        document.documentElement.style.setProperty('--glass-bg', 'rgba(46, 90, 59, 0.3)');
        
        // Отключаем курсор
        const cursor = document.getElementById('cursorGlow');
        if (cursor) {
            cursor.style.display = 'none';
        }
    }

    showWelcomeNotification() {
        if (!this.modules.notifications) return;

        const hour = new Date().getHours();
        let greeting = 'Добро пожаловать';
        let emoji = '🌲';

        if (hour >= 5 && hour < 12) {
            greeting = 'Доброе утро';
            emoji = '🌅';
        } else if (hour >= 12 && hour < 18) {
            greeting = 'Добрый день';
            emoji = '☀️';
        } else if (hour >= 18 && hour < 22) {
            greeting = 'Добрый вечер';
            emoji = '🌆';
        } else {
            greeting = 'Доброй ночи';
            emoji = '🌙';
        }

        setTimeout(() => {
            this.modules.notifications.info(`${greeting}! ${emoji}`, 4000);
        }, 1000);
    }

    // Публичные методы для управления темой
    toggleAnimations(enable) {
        this.config.enableAnimations = enable;
        
        if (enable) {
            this.resumeAnimations();
        } else {
            this.pauseAnimations();
        }
        
        this.savePreferences();
    }

    toggleParticles(enable) {
        this.config.enableParticles = enable;
        
        const particles = document.querySelectorAll('.leaf, .firefly, .dynamic-leaf, .dynamic-firefly');
        particles.forEach(particle => {
            particle.style.display = enable ? 'block' : 'none';
        });
        
        this.savePreferences();
    }

    setPerformanceMode(mode) {
        this.config.performanceMode = mode;
        
        if (mode === 'low') {
            this.enableLowPerformanceMode();
        } else if (mode === 'high' && this.modules.interactions) {
            this.modules.interactions.enableEffects();
        }
        
        this.savePreferences();
    }

    // Методы для отладки
    getStatus() {
        return {
            initialized: this.isInitialized,
            modules: {
                engine: !!this.modules.engine,
                animations: !!this.modules.animations,
                interactions: !!this.modules.interactions,
                notifications: !!this.modules.notifications,
                validation: !!this.modules.validation
            },
            config: this.config
        };
    }

    debug() {
        console.log('🌲 Forest Theme Debug Info:');
        console.table(this.getStatus());
    }
}

// Создаем глобальный экземпляр
window.ForestTheme = new ForestThemeInitializer();

// Автоматическая инициализация
(async function() {
    try {
        await window.ForestTheme.init();
    } catch (error) {
        console.error('❌ Ошибка инициализации лесной темы:', error);
    }
})();

// Экспортируем для удобного доступа
window.ForestAPI = {
    // Управление темой
    setSeason: (season) => window.ForestTheme.setSeason(season),
    toggleAnimations: (enable) => window.ForestTheme.toggleAnimations(enable),
    toggleParticles: (enable) => window.ForestTheme.toggleParticles(enable),
    setPerformanceMode: (mode) => window.ForestTheme.setPerformanceMode(mode),
    
    // Уведомления
    notify: (message, type, duration) => window.ForestNotifications?.show(message, type, duration),
    success: (message, duration) => window.ForestNotifications?.success(message, duration),
    error: (message, duration) => window.ForestNotifications?.error(message, duration),
    warning: (message, duration) => window.ForestNotifications?.warning(message, duration),
    info: (message, duration) => window.ForestNotifications?.info(message, duration),
    
    // Эффекты
    createGrowth: (x, y) => window.NatureUtils?.createGrowth(x, y),
    setForestColor: (color) => window.NatureUtils?.setForestColor(color),
    
    // Отладка
    debug: () => window.ForestTheme.debug(),
    status: () => window.ForestTheme.getStatus()
};

// Выводим справку в консоль
console.log(`
🌲 Лесная тема загружена!

Доступные команды:
- ForestAPI.setSeason('spring|summer|autumn|winter') - изменить сезон
- ForestAPI.toggleAnimations(true/false) - вкл/выкл анимации
- ForestAPI.toggleParticles(true/false) - вкл/выкл частицы
- ForestAPI.setPerformanceMode('high'|'low') - режим производительности
- ForestAPI.notify(message, type, duration) - показать уведомление
- ForestAPI.debug() - показать информацию о теме
- ForestAPI.status() - получить статус модулей

Примеры:
  ForestAPI.setSeason('autumn')
  ForestAPI.success('Всё работает! 🌿')
  ForestAPI.setPerformanceMode('low')
`);
