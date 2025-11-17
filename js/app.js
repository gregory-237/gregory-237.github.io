// Данные товаров (в реальном приложении будут приходить с бэкенда)
const PRODUCTS_DATA = {
    "drinks": [
        {
            id: 1,
            name: "ЭМОПЛЕ",
            description: "Сигнал: МАРКО-МАРКОФИЛЬЕСКА",
            price: "350 ₽",
            stock: 3,
            image: "💧"
        },
        {
            id: 2,
            name: "COLLAGEN",
            description: "ПРЕВОЗМОЖНОСТЬ: МОЛМАРИ",
            price: "420 ₽",
            stock: 22,
            image: "✨"
        },
        {
            id: 3,
            name: "СТАНОВКА",
            description: "ПЛАНСИРУЮТ С КАБИНО",
            price: "290 ₽",
            stock: 4,
            image: "⚡"
        },
        {
            id: 7,
            name: "ENERGY DRINK",
            description: "Заряд энергии",
            price: "180 ₽",
            stock: 12,
            image: "⚡"
        }
    ],
    "pp_food": [
        {
            id: 4,
            name: "ПП Батончик",
            description: "Протеиновый батончик",
            price: "120 ₽",
            stock: 15,
            image: "🍫"
        },
        {
            id: 8,
            name: "Протеиновый коктейль",
            description: "Шоколадный вкус",
            price: "280 ₽",
            stock: 7,
            image: "🥤"
        }
    ],
    "supplements": [
        {
            id: 5,
            name: "Витамин D3",
            description: "Поддержка иммунитета",
            price: "560 ₽",
            stock: 8,
            image: "💊"
        },
        {
            id: 9,
            name: "Омега-3",
            description: "Рыбий жир",
            price: "890 ₽",
            stock: 6,
            image: "🐟"
        }
    ],
    "promotions": [
        {
            id: 6,
            name: "Набор Wellness",
            description: "Специальное предложение",
            price: "890 ₽",
            stock: 5,
            image: "🎁"
        },
        {
            id: 10,
            name: "Скидка 20%",
            description: "На все напитки",
            price: "от 280 ₽",
            stock: 0,
            image: "🔥"
        }
    ]
};

// Инициализация Telegram Web App
let tg = window.Telegram.WebApp;
tg.expand();

// Текущая активная категория
let currentCategory = 'drinks';

// Инициализация при загрузке страницы
document.addEventListener('DOMContentLoaded', function() {
    if (document.getElementById('productsGrid')) {
        initializeCatalog();
    }
});

// Инициализация каталога
function initializeCatalog() {
    // Загрузка товаров для активной категории
    loadProducts(currentCategory);
    
    // Обработчики для кнопок категорий
    document.querySelectorAll('.category-btn').forEach(btn => {
        btn.addEventListener('click', function() {
            // Убираем активный класс у всех кнопок
            document.querySelectorAll('.category-btn').forEach(b => b.classList.remove('active'));
            // Добавляем активный класс текущей кнопке
            this.classList.add('active');
            
            // Загружаем товары для выбранной категории
            currentCategory = this.dataset.category;
            loadProducts(currentCategory);
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
        <div class="product-image">${product.image}</div>
        <div class="product-name">${product.name}</div>
        <div class="product-description">${product.description}</div>
        <div class="product-price">${product.price}</div>
        <div class="product-stock">В наличии: ${product.stock} шт.</div>
    `;
    
    card.addEventListener('click', () => {
        tg.showPopup({
            title: product.name,
            message: `${product.description}\n\nЦена: ${product.price}\nВ наличии: ${product.stock} шт.`,
            buttons: [
                {id: 'buy', type: 'default', text: 'Купить'},
                {type: 'cancel'}
            ]
        }, function(buttonId) {
            if (buttonId === 'buy') {
                tg.showAlert('Товар добавлен в корзину!');
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
    showDevelopmentPage('Чат', 'Функционал чата находится в разработке');
}

function showTasks() {
    showDevelopmentPage('Задания', 'Система заданий появится в ближайшее время');
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
                <button onclick="showCatalog()" style="
                    padding: 12px 24px;
                    background: var(--tg-theme-button-color, #2481cc);
                    color: var(--tg-theme-button-text-color, #ffffff);
                    border: none;
                    border-radius: 8px;
                    cursor: pointer;
                ">Вернуться в магазин</button>
            </div>
            <footer class="bottom-nav">
                <button class="nav-btn" onclick="showCatalog()">
                    <span>🏪</span>
                    <span>Магазин</span>
                </button>
                <button class="nav-btn ${title === 'Чат' ? 'active' : ''}" onclick="showChat()">
                    <span>💬</span>
                    <span>Чат</span>
                </button>
                <button class="nav-btn ${title === 'Задания' ? 'active' : ''}" onclick="showTasks()">
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
