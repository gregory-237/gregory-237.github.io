// Данные товаров с использованием ваших изображений
const PRODUCTS_DATA = {
    "drinks": [
        {
            id: 1,
            name: "ЭМОПЛЕ",
            description: "Сигнал: МАРКО-МАРКОФИЛЬЕСКА",
            price: "350 ₽",
            stock: 3,
            image: "img/5.png"
        },
        {
            id: 2,
            name: "COLLAGEN",
            description: "ПРЕВОЗМОЖНОСТЬ: МОЛМАРИ",
            price: "420 ₽",
            stock: 22,
            image: "img/6.png"
        },
        {
            id: 3,
            name: "СТАНОВКА",
            description: "ПЛАНСИРУЮТ С КАБИНО",
            price: "290 ₽",
            stock: 4,
            image: "img/7.png"
        },
        {
            id: 7,
            name: "ENERGY DRINK",
            description: "Заряд энергии на весь день",
            price: "180 ₽",
            stock: 12,
            image: "img/8.png"
        }
    ],
    "pp_food": [
        {
            id: 4,
            name: "ПП Батончик",
            description: "Протеиновый батончик с орехами",
            price: "120 ₽",
            stock: 15,
            image: "img/5.png"
        },
        {
            id: 8,
            name: "Протеиновый коктейль",
            description: "Шоколадный вкус, 30г белка",
            price: "280 ₽",
            stock: 7,
            image: "img/6.png"
        }
    ],
    "supplements": [
        {
            id: 5,
            name: "Витамин D3",
            description: "Поддержка иммунитета и костей",
            price: "560 ₽",
            stock: 8,
            image: "img/7.png"
        },
        {
            id: 9,
            name: "Омега-3",
            description: "Рыбий жир высшей очистки",
            price: "890 ₽",
            stock: 6,
            image: "img/8.png"
        }
    ],
    "promotions": [
        {
            id: 6,
            name: "Набор Wellness",
            description: "Специальное предложение со скидкой",
            price: "890 ₽",
            stock: 5,
            image: "img/5.png"
        },
        {
            id: 10,
            name: "Скидка 20%",
            description: "На все напитки этой недели",
            price: "от 280 ₽",
            stock: 0,
            image: "img/6.png"
        }
    ]
};

// Инициализация Telegram Web App
let tg = window.Telegram.WebApp;
tg.expand();
tg.setBackgroundColor('#f8f4e9');

// Текущая активная категория
let currentCategory = 'drinks';

// Инициализация при загрузке страницы
document.addEventListener('DOMContentLoaded', function() {
    if (document.getElementById('productsGrid')) {
        initializeCatalog();
    }
    if (document.querySelector('.stats-circles')) {
        initializeProfile();
    }
});

// Инициализация каталога
function initializeCatalog() {
    loadProducts(currentCategory);
    
    // Обработчики для кнопок категорий
    document.querySelectorAll('.category-btn').forEach(btn => {
        btn.addEventListener('click', function() {
            document.querySelectorAll('.category-btn').forEach(b => b.classList.remove('active'));
            this.classList.add('active');
            
            currentCategory = this.dataset.category;
            loadProducts(currentCategory);
            
            // Плавная прокрутка к товарам
            document.getElementById('productsGrid').scrollIntoView({ 
                behavior: 'smooth',
                block: 'start'
            });
        });
    });
    
    // Обработчик поиска
    const searchInput = document.querySelector('.search-input');
    const searchBtn = document.querySelector('.search-btn');
    
    searchBtn.addEventListener('click', performSearch);
    searchInput.addEventListener('keypress', function(e) {
        if (e.key === 'Enter') {
            performSearch();
        }
    });
}

// Инициализация профиля
function initializeProfile() {
    // Анимируем круги прогресса
    document.querySelectorAll('.circle-progress').forEach(circle => {
        const percent = circle.dataset.percent;
        circle.style.setProperty('--percent', `${percent}%`);
    });
}

// Загрузка товаров по категории
function loadProducts(category) {
    const productsGrid = document.getElementById('productsGrid');
    const products = PRODUCTS_DATA[category] || [];
    
    productsGrid.innerHTML = '';
    
    if (products.length === 0) {
        productsGrid.innerHTML = '<div class="no-products">Товары не найдены</div>';
        return;
    }
    
    products.forEach(product => {
        const productCard = createProductCard(product);
        productsGrid.appendChild(productCard);
    });
}

// Создание карточки товара
function createProductCard(product) {
    const card = document.createElement('div');
    card.className = 'product-card';
    card.innerHTML = `
        <div class="product-image">
            <img src="${product.image}" alt="${product.name}" onerror="this.style.display='none'; this.parentNode.innerHTML='🛒';">
        </div>
        <div class="product-name">${product.name}</div>
        <div class="product-price">${product.price}</div>
        <div class="product-description">${product.description}</div>
        <div class="product-stock">В наличии: ${product.stock} шт.</div>
    `;
    
    card.addEventListener('click', () => {
        tg.showPopup({
            title: product.name,
            message: `${product.description}\n\nЦена: ${product.price}\nВ наличии: ${product.stock} шт.`,
            buttons: [
                {id: 'buy', type: 'default', text: '🛒 Купить'},
                {type: 'cancel'}
            ]
        }, function(buttonId) {
            if (buttonId === 'buy') {
                tg.showAlert('Товар добавлен в корзину!');
                tg.HapticFeedback.impactOccurred('medium');
            }
        });
    });
    
    return card;
}

// Поиск товаров
function performSearch() {
    const searchTerm = document.querySelector('.search-input').value.toLowerCase().trim();
    
    if (!searchTerm) {
        loadProducts(currentCategory);
        return;
    }
    
    const allProducts = Object.values(PRODUCTS_DATA).flat();
    const filteredProducts = allProducts.filter(product => 
        product.name.toLowerCase().includes(searchTerm) ||
        product.description.toLowerCase().includes(searchTerm)
    );
    
    const productsGrid = document.getElementById('productsGrid');
    productsGrid.innerHTML = '';
    
    if (filteredProducts.length === 0) {
        productsGrid.innerHTML = '<div class="no-products">По вашему запросу ничего не найдено</div>';
        return;
    }
    
    filteredProducts.forEach(product => {
        const productCard = createProductCard(product);
        productsGrid.appendChild(productCard);
    });
}

// Навигация между страницами
function showCatalog() {
    window.location.href = 'index.html';
}

function showProfile() {
    window.location.href = 'profile.html';
}

function showChat() {
    showDevelopmentPage('💬 Чат', 'Функционал чата находится в разработке');
}

function showTasks() {
    showDevelopmentPage('🎯 Задания', 'Система заданий появится в ближайшее время');
}

function goBack() {
    window.history.back();
}

// Показать страницу "в разработке"
function showDevelopmentPage(title, message) {
    document.body.innerHTML = `
        <div class="app-container">
            <header class="profile-header">
                <button class="back-btn" onclick="goBack()">← Назад</button>
                <h1>${title}</h1>
            </header>
            <div class="dev-page">
                <h2>🚧 В разработке</h2>
                <p>${message}</p>
                <button class="back-to-shop" onclick="showCatalog()">Вернуться в магазин</button>
            </div>
            <footer class="bottom-nav">
                <button class="nav-btn" onclick="showCatalog()">
                    <span>🏪</span>
                    <span>Магазин</span>
                </button>
                <button class="nav-btn ${title.includes('Чат') ? 'active' : ''}" onclick="showChat()">
                    <span>💬</span>
                    <span>Чат</span>
                </button>
                <button class="nav-btn ${title.includes('Задания') ? 'active' : ''}" onclick="showTasks()">
                    <span>🎯</span>
                    <span>Задания</span>
                </button>
                <button class="nav-btn" onclick="showProfile()">
                    <span>👤</span>
                    <span>Профиль</span>
                </button>
            </footer>
        </div>
    `;
}

// Обработка данных от Telegram
tg.onEvent('viewportChanged', function() {
    // Адаптация под изменение размера окна
});

// Отправка данных в бот
function sendDataToBot(data) {
    tg.sendData(JSON.stringify(data));
}
