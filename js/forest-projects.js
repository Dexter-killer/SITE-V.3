// Специальная логика для страницы проектов с лесной темой
class ForestProjects {
    constructor() {
        this.projectsGrid = document.getElementById('projectsGrid');
        this.filterButtons = document.querySelectorAll('.filter-btn');
        this.projects = [];
        this.currentFilter = 'all';
        this.init();
    }

    init() {
        if (!this.projectsGrid) return;
        
        console.log('🌲 Инициализация ForestProjects');
        
        this.setupFilters();
        this.setupProjectCards();
        this.setupSearch();
        this.loadProjects();
    }

    setupFilters() {
        this.filterButtons.forEach(btn => {
            btn.addEventListener('click', (e) => {
                this.handleFilterClick(e.target);
            });
        });
    }

    handleFilterClick(button) {
        const filter = button.getAttribute('data-filter');
        
        // Обновляем активную кнопку
        this.filterButtons.forEach(btn => {
            btn.classList.remove('active', 'forest-btn');
            btn.classList.add('forest-outline-btn');
        });
        
        button.classList.add('active', 'forest-btn');
        button.classList.remove('forest-outline-btn');
        
        // Применяем фильтр
        this.currentFilter = filter;
        this.filterProjects(filter);
        
        // Создаем природный эффект
        this.createFilterEffect(button);
    }

    filterProjects(filter) {
        const projectItems = this.projectsGrid.querySelectorAll('.project-item');
        let delay = 0;
        
        projectItems.forEach((item, index) => {
            const categories = item.getAttribute('data-category') || '';
            const shouldShow = filter === 'all' || categories.includes(filter);
            
            if (shouldShow) {
                // Показываем с анимацией
                setTimeout(() => {
                    item.style.display = 'block';
                    item.style.animation = 'fadeInUp 0.6s ease forwards';
                }, delay);
                delay += 100;
            } else {
                // Скрываем с анимацией
                item.style.animation = 'fadeOut 0.4s ease forwards';
                setTimeout(() => {
                    item.style.display = 'none';
                }, 400);
            }
        });
        
        // Уведомление о фильтрации
        const visibleCount = Array.from(projectItems).filter(item => {
            const categories = item.getAttribute('data-category') || '';
            return filter === 'all' || categories.includes(filter);
        }).length;
        
        if (window.ForestNotifications) {
            const filterNames = {
                'all': 'Все проекты',
                'html': 'HTML/CSS',
                'js': 'JavaScript',
                'react': 'React',
                'fullstack': 'FullStack'
            };
            
            window.ForestNotifications.info(
                `${filterNames[filter]}: ${visibleCount} ${this.pluralize(visibleCount, ['проект', 'проекта', 'проектов'])}`,
                2000
            );
        }
    }

    createFilterEffect(button) {
        const rect = button.getBoundingClientRect();
        
        // Создаем эффект роста растений
        for (let i = 0; i < 5; i++) {
            setTimeout(() => {
                const plant = document.createElement('div');
                plant.textContent = '🌿';
                plant.style.cssText = `
                    position: fixed;
                    left: ${rect.left + rect.width / 2 + (Math.random() - 0.5) * 40}px;
                    top: ${rect.bottom}px;
                    font-size: 0px;
                    pointer-events: none;
                    z-index: 1000;
                    animation: filterPlantGrow 1s ease-out;
                `;
                
                document.body.appendChild(plant);
                
                setTimeout(() => {
                    plant.remove();
                }, 1000);
            }, i * 100);
        }
        
        // Добавляем стили
        if (!document.querySelector('#filter-plant-animation')) {
            const style = document.createElement('style');
            style.id = 'filter-plant-animation';
            style.textContent = `
                @keyframes filterPlantGrow {
                    0% {
                        font-size: 0px;
                        transform: translateY(0) rotate(0deg);
                        opacity: 0;
                    }
                    50% {
                        font-size: 20px;
                        opacity: 1;
                    }
                    100% {
                        font-size: 16px;
                        transform: translateY(-50px) rotate(180deg);
                        opacity: 0;
                    }
                }
            `;
            document.head.appendChild(style);
        }
    }

    setupProjectCards() {
        const projectCards = document.querySelectorAll('.project-card');
        
        projectCards.forEach(card => {
            // Hover эффекты
            card.addEventListener('mouseenter', (e) => {
                this.createCardHoverEffect(card, e);
            });
            
            // Click эффекты
            card.addEventListener('click', (e) => {
                if (!e.target.closest('button')) {
                    this.createCardClickEffect(card);
                }
            });
        });
    }

    createCardHoverEffect(card, event) {
        const rect = card.getBoundingClientRect();
        const x = event.clientX - rect.left;
        const y = event.clientY - rect.top;
        
        // Создаем эффект прорастающих листьев
        for (let i = 0; i < 3; i++) {
            setTimeout(() => {
                const leaf = document.createElement('div');
                leaf.textContent = '🍃';
                leaf.style.cssText = `
                    position: absolute;
                    left: ${x}px;
                    top: ${y}px;
                    font-size: 16px;
                    pointer-events: none;
                    z-index: 100;
                    animation: cardLeafSpread 0.8s ease-out;
                    --angle: ${(i * 120)}deg;
                `;
                
                card.appendChild(leaf);
                
                setTimeout(() => {
                    leaf.remove();
                }, 800);
            }, i * 100);
        }
        
        // Добавляем стили
        if (!document.querySelector('#card-leaf-animation')) {
            const style = document.createElement('style');
            style.id = 'card-leaf-animation';
            style.textContent = `
                @keyframes cardLeafSpread {
                    0% {
                        transform: translate(-50%, -50%) rotate(0deg) scale(0);
                        opacity: 0;
                    }
                    50% {
                        opacity: 1;
                    }
                    100% {
                        transform: translate(
                            calc(-50% + 40px * cos(var(--angle))),
                            calc(-50% + 40px * sin(var(--angle)))
                        ) rotate(180deg) scale(0.5);
                        opacity: 0;
                    }
                }
            `;
            document.head.appendChild(style);
        }
    }

    createCardClickEffect(card) {
        // Эффект цветения при клике
        const rect = card.getBoundingClientRect();
        const centerX = rect.left + rect.width / 2;
        const centerY = rect.top + rect.height / 2;
        
        const bloom = document.createElement('div');
        bloom.textContent = '🌸';
        bloom.style.cssText = `
            position: fixed;
            left: ${centerX}px;
            top: ${centerY}px;
            font-size: 0px;
            pointer-events: none;
            z-index: 1000;
            animation: cardBloom 1s ease-out;
        `;
        
        document.body.appendChild(bloom);
        
        setTimeout(() => {
            bloom.remove();
        }, 1000);
    }

    setupSearch() {
        const searchInput = document.getElementById('projectSearch');
        if (!searchInput) return;
        
        let searchTimeout;
        searchInput.addEventListener('input', (e) => {
            clearTimeout(searchTimeout);
            searchTimeout = setTimeout(() => {
                this.searchProjects(e.target.value);
            }, 300);
        });
    }

    searchProjects(query) {
        const projectItems = this.projectsGrid.querySelectorAll('.project-item');
        const searchQuery = query.toLowerCase().trim();
        
        if (!searchQuery) {
            this.filterProjects(this.currentFilter);
            return;
        }
        
        let foundCount = 0;
        
        projectItems.forEach(item => {
            const title = item.querySelector('.card-title')?.textContent.toLowerCase() || '';
            const description = item.querySelector('.card-text')?.textContent.toLowerCase() || '';
            const badges = Array.from(item.querySelectorAll('.badge')).map(b => b.textContent.toLowerCase()).join(' ');
            
            const matches = title.includes(searchQuery) || 
                          description.includes(searchQuery) || 
                          badges.includes(searchQuery);
            
            if (matches) {
                item.style.display = 'block';
                item.style.animation = 'fadeInUp 0.6s ease forwards';
                foundCount++;
            } else {
                item.style.animation = 'fadeOut 0.4s ease forwards';
                setTimeout(() => {
                    item.style.display = 'none';
                }, 400);
            }
        });
        
        // Уведомление о результатах поиска
        if (window.ForestNotifications) {
            if (foundCount > 0) {
                window.ForestNotifications.success(
                    `Найдено: ${foundCount} ${this.pluralize(foundCount, ['проект', 'проекта', 'проектов'])} 🔍`,
                    2000
                );
            } else {
                window.ForestNotifications.warning('Проекты не найдены 🍂', 2000);
            }
        }
    }

    loadProjects() {
        // Можно загружать проекты динамически из API
        console.log('🌲 Проекты загружены');
    }

    pluralize(number, forms) {
        const cases = [2, 0, 1, 1, 1, 2];
        return forms[(number % 100 > 4 && number % 100 < 20) ? 2 : cases[Math.min(number % 10, 5)]];
    }
}

// Инициализация при загрузке DOM
document.addEventListener('DOMContentLoaded', () => {
    if (document.getElementById('projectsGrid')) {
        new ForestProjects();
        console.log('🌲 ForestProjects инициализирован');
    }
});
