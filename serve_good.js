const express = require('express');
const path = require('path');
const app = express();
const port = process.env.PORT || 3000;

// Установка агрессивных заголовков против кэширования
app.use((req, res, next) => {
    res.set({
        // Для браузера: не сохранять и не кэшировать
        'Cache-Control': 'no-store, no-cache, must-revalidate, proxy-revalidate, max-age=0',
        'Pragma': 'no-cache',
        'Expires': '0',
        // Для CDN (Railway/Fastly): пробрасывать запрос без кэша
        'Surrogate-Control': 'no-store',
        // Команда браузеру: очистить кэш и хранилище этого сайта
        'Clear-Site-Data': '"cache", "storage"'
    });
    next();
});

// Главная страница
app.get('/', (req, res) => {
    // Используем временную метку для картинки, чтобы URL всегда был уникальным
    const timestamp = Date.now();
    res.send(`
        <!DOCTYPE html>
        <html>
        <head>
            <meta charset="utf-8">
            <title>No Cache Test</title>
        </head>
        <body>
            <h1>Тест без кэша: Активен</h1>
            <p>Последнее обновление: ${new Date().toLocaleTimeString()}</p>
            <img src="/image.jpg?t=${timestamp}" style="width:100%; max-width:600px;">
        </body>
        </html>
    `);
});

// Отдача картинки
app.get('/image.jpg', (req, res) => {
    res.sendFile(path.join(__dirname, 'image.jpg'));
});

app.listen(port, () => {
    console.log(`Server running on port ${port}`);
});
