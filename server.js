const express = require('express');
const path = require('path');
const app = express();
const port = process.env.PORT || 3000;

app.use((req, res, next) => {
    res.set({
        'Cache-Control': 'no-store, no-cache, must-revalidate',
        'Pragma': 'no-cache',
        'Expires': '0',
        'Surrogate-Control': 'no-store'
        // Временно убрали Clear-Site-Data для теста стабильности
    });
    next();
});

app.get('/sw.js', (req, res) => {
    res.set('Content-Type', 'application/javascript');
    res.sendFile(path.join(__dirname, 'sw.js'));
});

app.get('/', (req, res) => {
    res.send(`
        <!DOCTYPE html>
        <html>
        <head>
            <meta charset="utf-8">
            <title>Debug Mode</title>
        </head>
        <body>
            <h1>Проверка связи</h1>
            <div id="status">Загрузка картинки...</div>
            <img src="/image.jpg?t=${Date.now()}" onload="document.getElementById('status').innerText='Картинка загружена'" onerror="document.getElementById('status').innerText='Ошибка загрузки'">
            
            <script>
                console.log('Начинаю регистрацию SW...');
                if ('serviceWorker' in navigator) {
                    navigator.serviceWorker.register('/sw.js')
                    .then(() => console.log('SW OK'))
                    .catch(err => console.error('SW FAIL', err));
                }
            </script>
        </body>
        </html>
    `);
});

app.get('/image.jpg', (req, res) => {
    res.sendFile(path.join(__dirname, 'image.jpg'));
});

app.listen(port, () => console.log('Server UP'));
