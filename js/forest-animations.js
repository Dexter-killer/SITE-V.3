// Анимации природных эффектов для элементов интерфейса
class ForestAnimations {
    constructor() {
        this.observer = null;
        this.init();
    }

    init() {
        this.setupScrollAnimations();
        this.setupHoverEffects();
        this.setupClickAnimations();
        this.initCounters();
    }

    setupScrollAnimations() {
        // Intersection Observer для анимации при скролле
        this.observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    this.animateOnScroll(entry.target);
                }
            });
        }, {
            threshold: 0.1,
            rootMargin: '0px 0px -50px 0px'
        });

        // Наблюдаем за элементами для анимации
        document.querySelectorAll('.card, .skill-item, .achievement-item, .timeline-item').forEach(el => {
            this.observer.observe(el);
        });
    }

    animateOnScroll(element) {
        element.style.animation = 'fadeInUp 0.6s ease forwards';
        
        if (element.classList.contains('skill-item')) {
            this.animateSkillBar(element);
        }
        
        if (element.classList.contains('timeline-item')) {
            this.animateBranch(element);
        }
    }

    animateSkillBar(skillItem) {
        const progressBar = skillItem.querySelector('.forest-progress-bar');
        if (progressBar) {
            const width = progressBar.getAttribute('data-width') || '0';
            setTimeout(() => {
                progressBar.style.width = width + '%';
            }, 200);
        }
    }

    animateBranch(timelineItem) {
        // Анимация ветки для timeline
        const branch = document.createElement('div');
        branch.className = 'growing-branch';
        branch.textContent = '🌿';
        branch.style.cssText = `
            position: absolute;
            left: -30px;
            top: 0;
            font-size: 1.5rem;
            animation: branchGrow 0.8s ease forwards;
            opacity: 0;
        `;
        
        timelineItem.style.position = 'relative';
        timelineItem.appendChild(branch);
        
        // Добавляем стили
        if (!document.querySelector('#branch-grow-animation')) {
            const style = document.createElement('style');
            style.id = 'branch-grow-animation';
            style.textContent = `
                @keyframes branchGrow {
                    0% {
                        transform: scale(0) rotate(-45deg);
                        opacity: 0;
                    }
                    50% {
                        opacity: 1;
                    }
                    100% {
                        transform: scale(1) rotate(0deg);
                        opacity: 1;
                    }
                }
            `;
            document.head.appendChild(style);
        }
    }

    setupHoverEffects() {
        // Эффекты при наведении на карточки проектов
        const projectCards = document.querySelectorAll('.project-card');
        projectCards.forEach(card => {
            card.addEventListener('mouseenter', (e) => {
                this.animateCardHover(card, e);
            });
            card.addEventListener('mouseleave', () => {
                this.animateCardLeave(card);
            });
        });

        // Эффекты для кнопок
        const buttons = document.querySelectorAll('.forest-btn, .forest-outline-btn');
        buttons.forEach(btn => {
            btn.addEventListener('mouseenter', (e) => {
                this.createButtonGrowEffect(btn, e);
            });
        });
    }

    animateCardHover(card, event) {
        const icon = card.querySelector('.project-icon');
        if (icon) {
            icon.style.animation = 'leaf-sway 1.5s ease-in-out';
        }

        const image = card.querySelector('.project-image');
        if (image) {
            image.style.transform = 'scale(1.08) rotate(1deg)';
        }
        
        // Создаём эффект растущих растений
        this.createGrowthEffect(card, event);
    }

    animateCardLeave(card) {
        const icon = card.querySelector('.project-icon');
        if (icon) {
            icon.style.animation = '';
        }

        const image = card.querySelector('.project-image');
        if (image) {
            image.style.transform = 'scale(1) rotate(0deg)';
        }
    }

    createGrowthEffect(card, event) {
        const rect = card.getBoundingClientRect();
        const x = event.clientX - rect.left;
        const y = rect.height;
        
        const plant = document.createElement('div');
        plant.textContent = '🌱';
        plant.className = 'growing-plant';
        
        plant.style.cssText = `
            position: absolute;
            left: ${x}px;
            bottom: 0;
            font-size: 0px;
            pointer-events: none;
            z-index: 10;
            animation: plantGrow 1s ease-out forwards;
        `;
        
        card.style.position = 'relative';
        card.appendChild(plant);
        
        setTimeout(() => {
            if (plant.parentNode === card) {
                card.removeChild(plant);
            }
        }, 1000);
        
        // Добавляем стили
        if (!document.querySelector('#plant-grow-animation')) {
            const style = document.createElement('style');
            style.id = 'plant-grow-animation';
            style.textContent = `
                @keyframes plantGrow {
                    0% {
                        font-size: 0px;
                        transform: translateY(0);
                        opacity: 0;
                    }
                    50% {
                        opacity: 1;
                    }
                    100% {
                        font-size: 24px;
                        transform: translateY(-30px);
                        opacity: 0;
                    }
                }
            `;
            document.head.appendChild(style);
        }
    }

    createButtonGrowEffect(button, event) {
        const vine = document.createElement('span');
        vine.classList.add('button-vine');
        
        const rect = button.getBoundingClientRect();
        const x = event.clientX - rect.left;
        const y = event.clientY - rect.top;
        
        vine.style.cssText = `
            position: absolute;
            left: ${x}px;
            top: ${y}px;
            width: 0;
            height: 2px;
            background: linear-gradient(90deg, var(--forest-light), var(--forest-moss));
            transform-origin: left center;
            animation: vineGrow 0.6s ease-out;
            pointer-events: none;
        `;
        
        button.style.position = 'relative';
        button.style.overflow = 'hidden';
        button.appendChild(vine);
        
        setTimeout(() => {
            vine.remove();
        }, 600);
        
        // Добавляем стили
        if (!document.querySelector('#vine-grow-animation')) {
            const style = document.createElement('style');
            style.id = 'vine-grow-animation';
            style.textContent = `
                @keyframes vineGrow {
                    0% {
                        width: 0;
                        opacity: 1;
                    }
                    100% {
                        width: 100px;
                        opacity: 0;
                    }
                }
            `;
            document.head.appendChild(style);
        }
    }

    setupClickAnimations() {
        document.addEventListener('click', (e) => {
            this.createBodyBloom(e);
        });
    }

    createBodyBloom(event) {
        const bloom = document.createElement('div');
        bloom.classList.add('body-bloom');
        bloom.textContent = '🌸';
        
        bloom.style.cssText = `
            position: fixed;
            top: ${event.clientY}px;
            left: ${event.clientX}px;
            font-size: 0px;
            pointer-events: none;
            z-index: 9998;
            animation: bloomExpand 1.2s ease-out;
        `;
        
        document.body.appendChild(bloom);
        
        setTimeout(() => {
            bloom.remove();
        }, 1200);
        
        // Добавляем стили
        if (!document.querySelector('#bloom-animation')) {
            const style = document.createElement('style');
            style.id = 'bloom-animation';
            style.textContent = `
                @keyframes bloomExpand {
                    0% {
                        font-size: 0px;
                        transform: translate(-50%, -50%) rotate(0deg) scale(0);
                        opacity: 0;
                    }
                    20% {
                        opacity: 1;
                    }
                    80% {
                        opacity: 0.7;
                    }
                    100% {
                        font-size: 40px;
                        transform: translate(-50%, -50%) rotate(180deg) scale(1.5);
                        opacity: 0;
                    }
                }
            `;
            document.head.appendChild(style);
        }
    }

    initCounters() {
        const counters = document.querySelectorAll('.counter');
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    this.animateCounter(entry.target);
                    observer.unobserve(entry.target);
                }
            });
        });
        
        counters.forEach(counter => observer.observe(counter));
    }

    animateCounter(counter) {
        const target = +counter.getAttribute('data-target');
        const duration = 2000; // 2 seconds
        const step = target / (duration / 16); // 60fps
        let current = 0;
        
        const timer = setInterval(() => {
            current += step;
            if (current >= target) {
                counter.textContent = target;
                clearInterval(timer);
            } else {
                counter.textContent = Math.floor(current);
            }
        }, 16);
    }
}

// Инициализация
document.addEventListener('DOMContentLoaded', () => {
    new ForestAnimations();
});
