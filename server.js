const express = require('express');
const path = require('path');
const app = express();
const port = process.env.PORT || 3000;

app.use((req, res, next) => {
    res.set({
        'Cache-Control': 'no-store, no-cache, must-revalidate, proxy-revalidate, max-age=0',
        'Pragma': 'no-cache',
        'Expires': '0',
        'Surrogate-Control': 'no-store'
        res.set('Connection', 'close');
    });
    next();
});

app.get('/', (req, res) => {
    res.send(`
        <!DOCTYPE html>
        <html>
        <head>
            <meta charset="utf-8">
            <!-- Мета-теги для старых браузеров -->
            <meta http-equiv="Cache-Control" content="no-cache, no-store, must-revalidate">
            <meta http-equiv="Pragma" content="no-cache">
            <meta http-equiv="Expires" content="0">
            <title>No Trace Mode</title>
        </head>
        <body>
            <h1>Чистая сессия</h1>
            <img src="/image.jpg?t=${Date.now()}" style="width:100%; max-width:600px;">
            <script>
                // Очистка при загрузке
                window.onload = function() {
                    if (window.performance && window.performance.navigation.type === 2) {
                        location.reload(true); // Форсируем обновление при нажатии "Назад"
                    }
                };
                // Попытка удалить регистрацию зависшего воркера, если он остался
                if ('serviceWorker' in navigator) {
                    navigator.serviceWorker.getRegistrations().then(regs => {
                        for(let reg of regs) reg.unregister();
                    });
                }
            </script>
        </body>
        </html>
    `);
});

app.get('/image.jpg', (req, res) => {
    res.set({
        'Cache-Control': 'no-store, no-cache, must-revalidate, proxy-revalidate, max-age=0',
        'Pragma': 'no-cache',
        'Expires': '0',
        'Surrogate-Control': 'no-store'
    });
    res.sendFile(path.join(__dirname, 'image.jpg'));
});


app.listen(port, () => console.log('Server running on ' + port));

app.get('/favicon.ico', (req, res) => res.status(204).end());
