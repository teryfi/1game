// Переменные
let clicks = 0;
let laserCount = 0;
let feederCount = 0;
let trainerCount = 0;
let robotPurchased = false;
let hardModeActive = false;
let clicksLastTime = 0;
let autoClickInterval;
let hardModeInterval;
let inverted = false;
let clicksBlocked = false;
let fakeCatActive = false;
let virusCats = [];
let virusActive = false;

// DOM-элементы
const startBtn = document.querySelector('.start-btn');
const startScreen = document.querySelector('.start-screen');
const mainGame = document.querySelector('.container');
const counter = document.querySelector('.counter');
const catImage = document.querySelector('.cat-image');
const jokeDisplay = document.querySelector('.joke-display');
const upgrades = document.querySelectorAll('.upgrade-card');
const modeBtn = document.querySelector('.mode-btn');

// Звуки
const clickSound = new Audio('assets/click.mp3');
const meowSound = new Audio('assets/meow.mp3');
const coinSound = new Audio('assets/coin.mp3');

// Случайные шутки
const jokes = [
    "Ты мне нравишься...",
    "Я — король кликера!",
    "Ешь меня, я вкусный!",
    "Ты мой лучший друг!",
    "Кликай быстрее, я жду!"
];

// Вредные эффекты
const hardModeEffects = [
    // 1. Сброс 30% кликов
    () => {
        clicks = Math.floor(clicks * 0.7);
        alert("Кот обиделся и убежал с 30% твоих кликов!");
    },
    // 2. Инверсия кликов
    () => {
        inverted = true;
        alert("Инверсия активирована! Кликай осторожно...");
        setTimeout(() => inverted = false, 10000);
    },
    // 3. Тряска экрана
    () => {
        document.body.style.animation = "shake 0.5s";
        setTimeout(() => document.body.style.animation = "", 500);
        alert("Кот устроил землетрясение!");
    },
    // 4. Переворот интерфейса
    () => {
        document.body.classList.add('flipped');
        setTimeout(() => document.body.classList.remove('flipped'), 8000);
        alert("Кот перевернул всё! Беги!");
    },
    // 5. Задержка кликов
    () => {
        clicksBlocked = true;
        alert("Кот спит. Кликать можно будет через 10 секунд!");
        setTimeout(() => clicksBlocked = false, 10000);
    },
    // 6. Фальшивый кот
    () => {
        fakeCatActive = true;
        const fakeCat = document.createElement('div');
        fakeCat.className = 'fake-cat';
        fakeCat.style.left = Math.random() * (window.innerWidth - 100) + 'px';
        fakeCat.style.top = Math.random() * (window.innerHeight - 100) + 'px';
        fakeCat.onclick = () => {
            clicks -= 10;
            alert("Фальшивый кот сбежал с твоими кликами!");
            document.body.removeChild(fakeCat);
            fakeCatActive = false;
        };
        document.body.appendChild(fakeCat);
        setTimeout(() => {
            if (fakeCatActive) {
                document.body.removeChild(fakeCat);
                alert("Фальшивый кот исчез сам!");
                fakeCatActive = false;
            }
        }, 15000);
    },
    // 7. Ложная ошибка
    () => {
        alert("Ошибка 418: Кот — чайник. Всё потеряно!");
        setTimeout(() => alert("Шутка 😸"), 1000);
    },
    // 8. "Вирус"
    () => {
        virusActive = true;
        virusCats = [];
        for (let i = 0; i < 5; i++) {
            const cat = document.createElement('div');
            cat.className = 'virus-cats';
            cat.style.left = Math.random() * (window.innerWidth - 100) + 'px';
            cat.style.top = Math.random() * (window.innerHeight - 100) + 'px';
            cat.onclick = () => {
                virusCats = virusCats.filter(c => c !== cat);
                cat.remove();
                if (virusCats.length === 0) {
                    alert("Вирус уничтожен!");
                    virusActive = false;
                }
            };
            virusCats.push(cat);
            document.body.appendChild(cat);
        }
        alert("Вирус! Нажми на всех котов!");
document.body.style.animation = "shake 0.5s";
        setTimeout(() => document.body.style.animation = "", 500);
        alert("Кот устроил землетрясение!");
    },
];  

// Стартовый экран
document.addEventListener('DOMContentLoaded', () => {
    setTimeout(() => {
        startScreen.classList.remove('show');
    }, 3000);
});

// Переключение стартового экрана
startBtn.addEventListener('click', () => {
    startScreen.style.display = 'none';
    mainGame.style.display = 'block';
});

// Обновление интерфейса
function updateUI() {
    counter.textContent = Math.floor(clicks);
    upgrades.forEach(upgrade => {
        const type = upgrade.dataset.type;
        let baseCost = parseInt(upgrade.dataset.baseCost);
        let currentCost;

        switch (type) {
            case 'laser':
                currentCost = 50 * Math.pow(1.5, laserCount);
                break;
            case 'feeder':
                currentCost = 200 * Math.pow(2, feederCount);
                break;
            case 'trainer':
                currentCost = 500 * Math.pow(2, trainerCount);
                break;
            case 'robot':
                currentCost = 1000;
                break;
        }

        const priceElement = upgrade.querySelector('.upgrade-price');
        priceElement.textContent = `${Math.floor(currentCost)} кликов`;
        upgrade.querySelector('.upgrade-btn').disabled = clicks < currentCost;
    });

    modeBtn.textContent = hardModeActive ? "Выключить режим" : "Активировать режим";
}

// Обработчик клика по коту
catImage.addEventListener('click', () => {
    if (Date.now() - clicksLastTime < 500 || clicksBlocked) return;
    clicksLastTime = Date.now();

    clickSound.play();
    let multiplier = 1;
    multiplier *= Math.pow(2, laserCount);
    multiplier *= Math.pow(2, trainerCount);
    multiplier *= inverted ? -1 : 1;

    clicks += Math.floor(1 * multiplier);
    updateUI();

    // Глюки
    if (Math.random() < 0.1) {
        jokeDisplay.textContent = "Кот сделал вид, что тебя не заметил!";
        setTimeout(() => jokeDisplay.textContent = "", 2000);
        return;
    }

    if (Math.random() < 0.05) {
        meowSound.play();
        alert("МЯУ!");
    }

    const joke = jokes[Math.floor(Math.random() * jokes.length)];
    jokeDisplay.textContent = joke;
    setTimeout(() => jokeDisplay.textContent = "", 2000);
});

// Апгрейды
upgrades.forEach(upgrade => {
    const btn = upgrade.querySelector('.upgrade-btn');
    const type = upgrade.dataset.type;

    btn.addEventListener('click', () => {
        let baseCost = parseInt(upgrade.dataset.baseCost);
        let currentCost;

        switch (type) {
            case 'laser':
                currentCost = 50 * Math.pow(1.5, laserCount);
                if (clicks >= currentCost) {
                    clicks -= currentCost;
                    coinSound.play();
                    laserCount++;
                    updateUI();
                }
                break;
            case 'feeder':
                currentCost = 200 * Math.pow(2, feederCount);
                if (clicks >= currentCost) {
                    clicks -= currentCost;
                    coinSound.play();
                    feederCount++;
                    clearInterval(autoClickInterval);
                    autoClickInterval = setInterval(() => {
                        clicks += feederCount * 1;
                        updateUI();
                    }, 1000);
                    updateUI();
                }
                break;
            case 'trainer':
                currentCost = 500 * Math.pow(2, trainerCount);
                if (clicks >= currentCost) {
                    clicks -= currentCost;
                    coinSound.play();
                    trainerCount++;
                    updateUI();
                }
                break;
            case 'robot':
                if (clicks >= 1000 && !robotPurchased) {
                    clicks -= 1000;
                    coinSound.play();
                    robotPurchased = true;
                    clearInterval(autoClickInterval);
                    autoClickInterval = setInterval(() => {
                        clicks += 5;
                        updateUI();
                    }, 1000);
                    updateUI();
                }
                break;
        }
    });
});

// Режим "Невозможный"
modeBtn.addEventListener('click', () => {
    if (!hardModeActive) {
        hardModeActive = true;
        hardModeInterval = setInterval(() => {
            const effect = hardModeEffects[Math.floor(Math.random() * hardModeEffects.length)];
            effect();
            updateUI();
        }, 3000);
    } else {
        hardModeActive = false;
        clearInterval(hardModeInterval);
        inverted = false;
        clicksBlocked = false;
        document.body.classList.remove('flipped');
        virusActive = false;
        virusCats.forEach(cat => document.body.removeChild(cat));
        virusCats = [];
    }
    updateUI();
});

// Инициализация
updateUI();