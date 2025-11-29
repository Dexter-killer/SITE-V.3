// Валидация формы в лесном стиле с природными эффектами
class ForestFormValidation {
    constructor() {
        this.form = document.querySelector('.forest-form');
        this.init();
    }

    init() {
        if (!this.form) return;
        
        this.setupEventListeners();
        this.setupRealTimeValidation();
        this.setupSubmitHandler();
        this.addValidationStyles();
    }

    setupEventListeners() {
        // Валидация при потере фокуса
        const inputs = this.form.querySelectorAll('input[required], textarea[required], select[required]');
        inputs.forEach(input => {
            input.addEventListener('blur', () => {
                this.validateField(input);
            });
            
            // Эффект роста при фокусе
            input.addEventListener('focus', () => {
                this.createFocusGrowth(input);
            });
        });
    }

    createFocusGrowth(input) {
        const growth = document.createElement('div');
        growth.textContent = '🌱';
        growth.className = 'focus-growth';
        
        const rect = input.getBoundingClientRect();
        growth.style.cssText = `
            position: fixed;
            left: ${rect.left - 20}px;
            top: ${rect.top + rect.height / 2}px;
            font-size: 0px;
            pointer-events: none;
            z-index: 1000;
            animation: focusGrowth 0.6s ease-out;
        `;
        
        document.body.appendChild(growth);
        
        setTimeout(() => {
            growth.remove();
        }, 600);
        
        // Добавляем стили
        if (!document.querySelector('#focus-growth-animation')) {
            const style = document.createElement('style');
            style.id = 'focus-growth-animation';
            style.textContent = `
                @keyframes focusGrowth {
                    0% {
                        font-size: 0px;
                        opacity: 0;
                    }
                    50% {
                        font-size: 20px;
                        opacity: 1;
                    }
                    100% {
                        font-size: 24px;
                        opacity: 0;
                        transform: translateX(-10px);
                    }
                }
            `;
            document.head.appendChild(style);
        }
    }

    setupRealTimeValidation() {
        // Валидация в реальном времени для email
        const emailInput = this.form.querySelector('#email');
        if (emailInput) {
            emailInput.addEventListener('input', () => {
                if (emailInput.value.length > 3) {
                    this.validateEmail(emailInput);
                }
            });
        }

        // Валидация длины сообщения в реальном времени
        const messageInput = this.form.querySelector('#message');
        if (messageInput) {
            messageInput.addEventListener('input', () => {
                this.validateMessageLength(messageInput);
            });
        }
    }

    setupSubmitHandler() {
        this.form.addEventListener('submit', (e) => {
            e.preventDefault();
            this.handleFormSubmit(e);
        });

        // Обработчик сброса формы
        this.form.addEventListener('reset', () => {
            this.resetFormValidation();
        });
    }

    validateField(field) {
        const value = field.value.trim();
        const fieldId = field.id;
        const errorElement = document.getElementById(`${fieldId}-error`);

        // Сбрасываем предыдущее состояние
        this.resetFieldState(field);

        // Проверка на пустое поле
        if (!value) {
            this.markFieldInvalid(field, errorElement, 'Это поле обязательно для заполнения');
            return false;
        }

        // Специфичные проверки для разных полей
        switch (fieldId) {
            case 'name':
                if (value.length < 2) {
                    this.markFieldInvalid(field, errorElement, 'Имя должно содержать минимум 2 символа');
                    return false;
                }
                break;
            
            case 'email':
                if (!this.isValidEmail(value)) {
                    this.markFieldInvalid(field, errorElement, 'Пожалуйста, введите корректный email адрес');
                    return false;
                }
                break;
            
            case 'message':
                if (value.length < 10) {
                    this.markFieldInvalid(field, errorElement, 'Сообщение должно содержать минимум 10 символов');
                    return false;
                }
                if (value.length > 1000) {
                    this.markFieldInvalid(field, errorElement, 'Сообщение не должно превышать 1000 символов');
                    return false;
                }
                break;
        }

        // Если все проверки пройдены
        this.markFieldValid(field);
        return true;
    }

    validateEmail(emailInput) {
        const value = emailInput.value.trim();
        const errorElement = document.getElementById('email-error');

        if (value && !this.isValidEmail(value)) {
            this.markFieldInvalid(emailInput, errorElement, 'Пожалуйста, введите корректный email адрес');
            return false;
        }

        this.markFieldValid(emailInput);
        return true;
    }

    validateMessageLength(messageInput) {
        const value = messageInput.value;
        const errorElement = document.getElementById('message-error');
        const counter = document.getElementById('message-counter');

        // Обновляем счетчик символов
        if (counter) {
            counter.textContent = `${value.length} / 1000`;
            
            if (value.length > 900) {
                counter.style.color = '#ff6b6b';
            } else {
                counter.style.color = 'var(--forest-cream)';
            }
        }

        if (value.length < 10 && value.length > 0) {
            this.markFieldInvalid(messageInput, errorElement, 'Сообщение должно содержать минимум 10 символов');
            return false;
        }

        if (value.length >= 10) {
            this.markFieldValid(messageInput);
        }

        return true;
    }

    isValidEmail(email) {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(email);
    }

    markFieldInvalid(field, errorElement, message) {
        field.classList.add('is-invalid');
        field.classList.remove('is-valid');
        field.setAttribute('aria-invalid', 'true');

        if (errorElement) {
            errorElement.textContent = message;
            errorElement.style.display = 'block';
        }

        // Природный эффект ошибки
        this.createErrorEffect(field);
    }

    markFieldValid(field) {
        field.classList.remove('is-invalid');
        field.classList.add('is-valid');
        field.setAttribute('aria-invalid', 'false');

        const errorElement = document.getElementById(`${field.id}-error`);
        if (errorElement) {
            errorElement.style.display = 'none';
        }

        // Природный эффект успеха
        this.createSuccessEffect(field);
    }

    resetFieldState(field) {
        field.classList.remove('is-invalid', 'is-valid');
        field.setAttribute('aria-invalid', 'false');

        const errorElement = document.getElementById(`${field.id}-error`);
        if (errorElement) {
            errorElement.style.display = 'none';
        }
    }

    resetFormValidation() {
        const fields = this.form.querySelectorAll('input, textarea, select');
        fields.forEach(field => {
            this.resetFieldState(field);
        });

        // Природный эффект сброса
        this.createResetEffect();
    }

    async handleFormSubmit(e) {
        e.preventDefault();

        // Валидация всех полей
        const fields = this.form.querySelectorAll('input[required], textarea[required]');
        let isValid = true;

        fields.forEach(field => {
            if (!this.validateField(field)) {
                isValid = false;
            }
        });

        if (!isValid) {
            this.showFormError('Пожалуйста, исправьте ошибки в форме');
            return;
        }

        // Показываем индикатор загрузки
        const loadingNotification = this.showLoadingState();

        try {
            // Имитация отправки формы
            await this.submitFormData();

            // Успешная отправка
            window.ForestNotifications.hideLoading(loadingNotification);
            this.showSuccessState();
            this.form.reset();
            this.resetFormValidation();
        } catch (error) {
            window.ForestNotifications.hideLoading(loadingNotification);
            this.showFormError('Произошла ошибка при отправке формы. Пожалуйста, попробуйте еще раз.');
        }
    }

    async submitFormData() {
        // Имитация задержки сети
        return new Promise((resolve, reject) => {
            setTimeout(() => {
                // 90% шанс успешной отправки для демонстрации
                if (Math.random() > 0.1) {
                    resolve();
                } else {
                    reject(new Error('Network error'));
                }
            }, 1500);
        });
    }

    showLoadingState() {
        const submitBtn = this.form.querySelector('.forest-btn[type="submit"]');
        if (submitBtn) {
            submitBtn.disabled = true;
            submitBtn.innerHTML = '<span class="spinner">🌀</span> Отправка...';
            submitBtn.classList.add('loading');
        }

        return window.ForestNotifications.showLoading('Отправка сообщения...');
    }

    showSuccessState() {
        window.ForestNotifications.success('Форма успешно отправлена! Спасибо за ваше сообщение 🌿');

        // Обновляем live region для скринридеров
        const statusElement = document.getElementById('form-status');
        if (statusElement) {
            statusElement.textContent = 'Форма успешно отправлена. Спасибо за ваше сообщение!';
        }

        // Природный эффект успеха для всей формы
        this.createFormSuccessEffect();

        // Восстанавливаем кнопку
        const submitBtn = this.form.querySelector('.forest-btn[type="submit"]');
        if (submitBtn) {
            submitBtn.disabled = false;
            submitBtn.innerHTML = '<i class="bi bi-send me-2"></i>Отправить сообщение';
            submitBtn.classList.remove('loading');
        }
    }

    showFormError(message) {
        window.ForestNotifications.error(message);

        // Фокус на первое поле с ошибкой
        const firstError = this.form.querySelector('.is-invalid');
        if (firstError) {
            firstError.focus();
        }
    }

    // Природные эффекты для валидации
    createErrorEffect(field) {
        const rect = field.getBoundingClientRect();
        
        // Анимация тряски с падающим листом
        field.style.animation = 'forestShake 0.5s ease-in-out';
        setTimeout(() => {
            field.style.animation = '';
        }, 500);

        // Падающий листок ошибки
        const leaf = document.createElement('div');
        leaf.textContent = '🍂';
        leaf.style.cssText = `
            position: fixed;
            left: ${rect.right + 10}px;
            top: ${rect.top}px;
            font-size: 20px;
            pointer-events: none;
            z-index: 1000;
            animation: errorLeafFall 1s ease-out;
        `;
        
        document.body.appendChild(leaf);
        
        setTimeout(() => {
            leaf.remove();
        }, 1000);
    }

    createSuccessEffect(field) {
        const rect = field.getBoundingClientRect();

        // Растущий росток успеха
        const sprout = document.createElement('div');
        sprout.textContent = '🌱';
        sprout.style.cssText = `
            position: fixed;
            left: ${rect.right + 10}px;
            top: ${rect.top + rect.height / 2}px;
            font-size: 0px;
            pointer-events: none;
            z-index: 1000;
            animation: successSprout 0.8s ease-out;
        `;
        
        document.body.appendChild(sprout);
        
        setTimeout(() => {
            sprout.remove();
        }, 800);
    }

    createResetEffect() {
        const formRect = this.form.getBoundingClientRect();

        // Эффект ветра сбрасывающего листья
        for (let i = 0; i < 8; i++) {
            setTimeout(() => {
                const leaf = document.createElement('div');
                leaf.textContent = '🍃';
                leaf.style.cssText = `
                    position: fixed;
                    left: ${formRect.left + Math.random() * formRect.width}px;
                    top: ${formRect.top}px;
                    font-size: 16px;
                    pointer-events: none;
                    z-index: 1000;
                    animation: windBlow 1.5s ease-out;
                `;
                
                document.body.appendChild(leaf);
                
                setTimeout(() => {
                    leaf.remove();
                }, 1500);
            }, i * 100);
        }
    }

    createFormSuccessEffect() {
        const form = this.form;
        const formRect = form.getBoundingClientRect();

        // Эффект цветения для всей формы
        form.style.animation = 'formBloom 1s ease-in-out';
        setTimeout(() => {
            form.style.animation = '';
        }, 1000);

        // Создаем несколько цветков успеха
        for (let i = 0; i < 5; i++) {
            setTimeout(() => {
                const flower = document.createElement('div');
                flower.textContent = '🌸';
                flower.style.cssText = `
                    position: fixed;
                    left: ${formRect.left + Math.random() * formRect.width}px;
                    top: ${formRect.top + Math.random() * formRect.height}px;
                    font-size: 0px;
                    pointer-events: none;
                    z-index: 1000;
                    animation: flowerBloom 1.2s ease-out;
                `;
                
                document.body.appendChild(flower);
                
                setTimeout(() => {
                    flower.remove();
                }, 1200);
            }, i * 200);
        }
    }

    addValidationStyles() {
        if (document.querySelector('#forest-validation-styles')) return;

        const style = document.createElement('style');
        style.id = 'forest-validation-styles';
        style.textContent = `
            .forest-form .is-invalid {
                border-color: #ff6b6b !important;
                box-shadow: 0 0 0 0.2rem rgba(255, 107, 107, 0.25) !important;
            }

            .forest-form .is-valid {
                border-color: #6B9B4B !important;
                box-shadow: 0 0 0 0.2rem rgba(107, 155, 75, 0.25) !important;
            }

            .forest-input:focus,
            .forest-select:focus,
            .forest-textarea:focus {
                border-color: var(--forest-light) !important;
                box-shadow: 0 0 0 0.2rem rgba(107, 155, 75, 0.25) !important;
            }

            @keyframes forestShake {
                0%, 100% { transform: translateX(0); }
                25% { transform: translateX(-5px); }
                75% { transform: translateX(5px); }
            }

            @keyframes errorLeafFall {
                0% {
                    transform: translateY(0) rotate(0deg);
                    opacity: 1;
                }
                100% {
                    transform: translateY(50px) rotate(180deg);
                    opacity: 0;
                }
            }

            @keyframes successSprout {
                0% {
                    font-size: 0px;
                    transform: translateY(0);
                    opacity: 0;
                }
                50% {
                    font-size: 24px;
                    opacity: 1;
                }
                100% {
                    font-size: 20px;
                    transform: translateY(-20px);
                    opacity: 0;
                }
            }

            @keyframes windBlow {
                0% {
                    transform: translateY(0) translateX(0) rotate(0deg);
                    opacity: 1;
                }
                100% {
                    transform: translateY(100px) translateX(100px) rotate(360deg);
                    opacity: 0;
                }
            }

            @keyframes formBloom {
                0%, 100% {
                    transform: scale(1);
                }
                50% {
                    transform: scale(1.02);
                }
            }

            @keyframes flowerBloom {
                0% {
                    font-size: 0px;
                    transform: scale(0) rotate(0deg);
                    opacity: 0;
                }
                50% {
                    opacity: 1;
                }
                100% {
                    font-size: 30px;
                    transform: scale(1.5) rotate(180deg);
                    opacity: 0;
                }
            }

            .forest-btn.loading {
                position: relative;
                overflow: hidden;
            }

            .forest-btn .spinner {
                display: inline-block;
                animation: spin 1s linear infinite;
            }

            @keyframes spin {
                from { transform: rotate(0deg); }
                to { transform: rotate(360deg); }
            }

            .invalid-feedback {
                display: none;
                color: #ff6b6b;
                font-size: 0.875rem;
                margin-top: 0.25rem;
            }

            .is-invalid ~ .invalid-feedback {
                display: block;
            }
        `;
        
        document.head.appendChild(style);
    }
}

// Инициализация при загрузке DOM
document.addEventListener('DOMContentLoaded', () => {
    new ForestFormValidation();
    console.log('🌲 ForestFormValidation инициализирован');
});
