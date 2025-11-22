// Обратный отсчет до свадьбы 8 мая 2026 года 14:15
function updateCountdown() {
    const weddingDate = new Date('2026-05-08T14:15:00');
    const now = new Date();
    const difference = weddingDate - now;

    if (difference > 0) {
        const days = Math.floor(difference / (1000 * 60 * 60 * 24));
        const hours = Math.floor((difference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
        const minutes = Math.floor((difference % (1000 * 60 * 60)) / (1000 * 60));
        const seconds = Math.floor((difference % (1000 * 60)) / 1000);

        // Добавляем эффект "перелистывания" цифр
        flipNumber('days', days.toString().padStart(2, '0'));
        flipNumber('hours', hours.toString().padStart(2, '0'));
        flipNumber('minutes', minutes.toString().padStart(2, '0'));
        flipNumber('seconds', seconds.toString().padStart(2, '0'));
    } else {
        // Если дата прошла
        document.getElementById('countdown').innerHTML = `
            <div style="text-align: center; padding: 20px;">
                <p style="font-size: 2em; color: #ff0000; font-family: 'Caveat', cursive; font-weight: 700;">
                    <span class="heart">❤</span> Свадьба состоялась! <span class="heart">❤</span>
                </p>
            </div>
        `;
    }
}

// Эффект перелистывания цифр
function flipNumber(elementId, newValue) {
    const element = document.getElementById(elementId);
    if (element.textContent !== newValue) {
        element.style.animation = 'none';
        element.offsetHeight; // Trigger reflow
        element.textContent = newValue;
    }
}

// Добавляем CSS анимацию для перелистывания
const style = document.createElement('style');
style.textContent = `
    @keyframes flip {
        0% { transform: rotateX(0deg) rotate(-1deg); }
        50% { transform: rotateX(90deg) rotate(1deg); }
        100% { transform: rotateX(0deg) rotate(-1deg); }
    }
`;
document.head.appendChild(style);

// Анимации при скролле
document.addEventListener('DOMContentLoaded', function() {
    // Запускаем обратный отсчет
    updateCountdown();
    setInterval(updateCountdown, 1000);

    // Плавная прокрутка
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                target.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
            }
        });
    });

    // Анимация появления элементов
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateY(0)';
                
                // Особенная анимация для таймера
                if (entry.target.classList.contains('countdown')) {
                    const numbers = entry.target.querySelectorAll('.countdown-number');
                    numbers.forEach((number, index) => {
                        number.style.animationDelay = `${index * 0.2}s`;
                    });
                }
            }
        });
    }, observerOptions);

    // Наблюдаем за всеми секциями
    document.querySelectorAll('.section').forEach(section => {
        section.style.opacity = '0';
        section.style.transform = 'translateY(30px)';
        section.style.transition = 'opacity 0.8s ease, transform 0.8s ease';
        observer.observe(section);
    });
});

// Проверка загрузки шрифтов
document.fonts.ready.then(function() {
    document.documentElement.classList.add('fonts-loaded');
    console.log('Шрифты загружены!');
});

// Fallback на случай если шрифты не загрузились за 3 секунды
setTimeout(function() {
    if (!document.documentElement.classList.contains('fonts-loaded')) {
        console.log('Используем резервные шрифты');
        // Можно добавить дополнительную обработку
    }
}, 3000);

// Принудительная проверка основных шрифтов
const checkFont = (fontName) => {
    return document.fonts.check(`1em "${fontName}"`);
};

// Проверяем ключевые шрифты
if (!checkFont('Permanent Marker') || !checkFont('Caveat')) {
    document.documentElement.classList.add('fonts-fallback');
}