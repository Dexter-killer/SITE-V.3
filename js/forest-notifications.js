// Система уведомлений в лесном стиле
class ForestNotifications {
    constructor() {
        this.container = document.getElementById('notificationContainer');
        this.init();
    }

    init() {
        if (!this.container) {
            this.createContainer();
        }
    }

    createContainer() {
        this.container = document.createElement('div');
        this.container.id = 'notificationContainer';
        this.container.className = 'forest-notifications';
        this.container.style.cssText = `
            position: fixed;
            top: 20px;
            right: 20px;
            z-index: 10000;
            display: flex;
            flex-direction: column;
            gap: 10px;
            pointer-events: none;
        `;
        document.body.appendChild(this.container);
    }

    show(message, type = 'info', duration = 5000) {
        const notification = document.createElement('div');
        notification.className = `forest-notification notification-${type}`;
        
        const icon = this.getIconForType(type);
        const emoji = this.getEmojiForType(type);
        
        notification.innerHTML = `
            <div class="notification-content">
                <div class="notification-icon">${emoji}</div>
                <div class="notification-body">
                    <p class="notification-message">${message}</p>
                </div>
                <button class="notification-close" aria-label="Закрыть уведомление">
                    <i class="bi bi-x"></i>
                </button>
            </div>
        `;
        
        // Стили уведомления
        notification.style.cssText = `
            background: rgba(46, 90, 59, 0.95);
            backdrop-filter: blur(20px);
            border: 1px solid ${this.getBorderColorForType(type)};
            border-radius: 16px;
            padding: 16px 20px;
            min-width: 300px;
            max-width: 400px;
            box-shadow: 0 8px 32px rgba(0, 0, 0, 0.3);
            pointer-events: auto;
            animation: slideInRight 0.4s ease, ${type === 'success' ? 'successGlow' : 'none'} 1s ease;
            position: relative;
            overflow: hidden;
        `;
        
        // Добавляем природный эффект
        this.addNatureEffect(notification, type);
        
        this.container.appendChild(notification);
        
        // Обработчик закрытия
        const closeBtn = notification.querySelector('.notification-close');
        closeBtn.addEventListener('click', () => {
            this.hide(notification);
        });
        
        // Автоматическое скрытие
        if (duration > 0) {
            setTimeout(() => {
                this.hide(notification);
            }, duration);
        }
        
        // ARIA для доступности
        notification.setAttribute('role', type === 'error' ? 'alert' : 'status');
        notification.setAttribute('aria-live', type === 'error' ? 'assertive' : 'polite');
        
        return notification;
    }

    addNatureEffect(notification, type) {
        // Добавляем анимированный природный элемент
        const effect = document.createElement('div');
        effect.className = 'notification-nature-effect';
        
        let emoji = '🍃';
        if (type === 'success') emoji = '🌿';
        if (type === 'error') emoji = '🍂';
        if (type === 'warning') emoji = '🌾';
        
        effect.textContent = emoji;
        effect.style.cssText = `
            position: absolute;
            right: -10px;
            top: -10px;
            font-size: 40px;
            opacity: 0.3;
            animation: leafFloat 3s ease-in-out infinite;
            pointer-events: none;
        `;
        
        notification.appendChild(effect);
        
        // Добавляем стили анимации
        if (!document.querySelector('#notification-animations')) {
            const style = document.createElement('style');
            style.id = 'notification-animations';
            style.textContent = `
                @keyframes slideInRight {
                    from {
                        transform: translateX(100%);
                        opacity: 0;
                    }
                    to {
                        transform: translateX(0);
                        opacity: 1;
                    }
                }
                
                @keyframes slideOutRight {
                    from {
                        transform: translateX(0);
                        opacity: 1;
                    }
                    to {
                        transform: translateX(120%);
                        opacity: 0;
                    }
                }
                
                @keyframes successGlow {
                    0%, 100% {
                        box-shadow: 0 8px 32px rgba(0, 0, 0, 0.3);
                    }
                    50% {
                        box-shadow: 0 8px 32px rgba(107, 155, 75, 0.5),
                                    0 0 40px rgba(107, 155, 75, 0.3);
                    }
                }
                
                @keyframes leafFloat {
                    0%, 100% {
                        transform: rotate(0deg) translateY(0);
                    }
                    50% {
                        transform: rotate(10deg) translateY(-5px);
                    }
                }
                
                .forest-notification {
                    transition: all 0.3s ease;
                }
                
                .forest-notification:hover {
                    transform: translateX(-5px);
                    box-shadow: 0 12px 40px rgba(107, 155, 75, 0.4);
                }
                
                .notification-content {
                    display: flex;
                    align-items: flex-start;
                    gap: 12px;
                }
                
                .notification-icon {
                    font-size: 24px;
                    flex-shrink: 0;
                }
                
                .notification-body {
                    flex: 1;
                }
                
                .notification-message {
                    margin: 0;
                    color: var(--forest-cream);
                    font-size: 14px;
                    line-height: 1.5;
                }
                
                .notification-close {
                    background: transparent;
                    border: none;
                    color: var(--forest-cream);
                    cursor: pointer;
                    padding: 4px;
                    opacity: 0.7;
                    transition: opacity 0.3s ease;
                    flex-shrink: 0;
                }
                
                .notification-close:hover {
                    opacity: 1;
                }
            `;
            document.head.appendChild(style);
        }
    }

    hide(notification) {
        notification.style.animation = 'slideOutRight 0.4s ease forwards';
        
        setTimeout(() => {
            if (notification.parentNode === this.container) {
                this.container.removeChild(notification);
            }
        }, 400);
    }

    getIconForType(type) {
        const icons = {
            success: 'bi-check-circle-fill',
            error: 'bi-x-circle-fill',
            warning: 'bi-exclamation-triangle-fill',
            info: 'bi-info-circle-fill'
        };
        return icons[type] || icons.info;
    }

    getEmojiForType(type) {
        const emojis = {
            success: '🌱',
            error: '🍂',
            warning: '⚠️',
            info: '🌿'
        };
        return emojis[type] || emojis.info;
    }

    getBorderColorForType(type) {
        const colors = {
            success: 'rgba(107, 155, 75, 0.5)',
            error: 'rgba(255, 107, 107, 0.5)',
            warning: 'rgba(255, 179, 71, 0.5)',
            info: 'rgba(139, 159, 109, 0.5)'
        };
        return colors[type] || colors.info;
    }

    // Вспомогательные методы
    success(message, duration) {
        return this.show(message, 'success', duration);
    }

    error(message, duration) {
        return this.show(message, 'error', duration);
    }

    warning(message, duration) {
        return this.show(message, 'warning', duration);
    }

    info(message, duration) {
        return this.show(message, 'info', duration);
    }

    // Специальные уведомления
    showLoading(message = 'Загрузка...') {
        const notification = this.show(message, 'info', 0);
        notification.classList.add('loading-notification');
        
        // Добавляем анимацию загрузки
        const icon = notification.querySelector('.notification-icon');
        icon.innerHTML = '🌀';
        icon.style.animation = 'spin 1s linear infinite';
        
        // Добавляем стили
        if (!document.querySelector('#loading-spin')) {
            const style = document.createElement('style');
            style.id = 'loading-spin';
            style.textContent = `
                @keyframes spin {
                    from { transform: rotate(0deg); }
                    to { transform: rotate(360deg); }
                }
            `;
            document.head.appendChild(style);
        }
        
        return notification;
    }

    hideLoading(loadingNotification) {
        this.hide(loadingNotification);
    }
}

// Создаем глобальный экземпляр
window.ForestNotifications = new ForestNotifications();

// Инициализация при загрузке DOM
document.addEventListener('DOMContentLoaded', () => {
    // Готово к использованию
    console.log('🌲 ForestNotifications готов');
});
