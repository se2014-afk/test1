const express = require('express');
const path = require('path');
const app = express();
const port = process.env.PORT || 3000;

// Установка заголовков для ВСЕХ ответов сервера
app.use((req, res, next) => {
    res.set({
        'Cache-Control': 'no-store, no-cache, must-revalidate, proxy-revalidate, max-age=0',
        'Pragma': 'no-cache',
        'Expires': '0'
    });
    next();
});

// Главная страница (ваш HTML 200 байт)
app.get('/', (req, res) => {
    res.send(`
        <!DOCTYPE html>
        <html>
        <head><meta charset="utf-8"></head>
        <body>
            <h1>Тест без кэша</h1>
            <img src="/image.jpg" style="width:100%; max-width:600px;">
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
