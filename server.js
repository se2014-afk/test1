const express = require('express');
const path = require('path');
const app = express();
const port = process.env.PORT || 3000;

// 1. Глобальные заголовки против кэша
app.use((req, res, next) => {
    res.set({
        'Cache-Control': 'no-store, no-cache, must-revalidate, proxy-revalidate, max-age=0',
        'Pragma': 'no-cache',
        'Expires': '0',
        'Surrogate-Control': 'no-store',
        'Connection': 'close'
    });
    next();
});

// 2. Заглушка для иконки (чтобы браузер не ждал вечно)
app.get('/favicon.ico', (req, res) => res.status(204).end());

// 3. Главная страница
app.get('/', (req, res) => {
    res.send(`
        <!DOCTYPE html>
        <html>
        <head>
            <meta charset="utf-8">
            <title>Final No-Cache</title>
            <style>
                body { cursor: pointer; min-height: 100vh; margin: 0; padding: 20px; font-family: sans-serif; }
            </style>
        </head>
        <body>
                       <img src="/image.jpg?t=${Date.now()}" style="style="margin:0; background:#000; overflow:hidden;">

            <script>
                // Обработчик клика по всей странице
                document.body.addEventListener('click', function() {
                    window.open('https://www.youtube.com', '_blank');
                });

                // Очистка следов Service Worker (на всякий случай)
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


// 4. Отдача картинки (Безопасный метод)
app.get('/image.jpg', (req, res) => {
    const filePath = path.join(__dirname, 'image.jpg');
    
    // Устанавливаем тип контента вручную для надежности
    res.type('image/jpeg');
    
    res.sendFile(filePath, (err) => {
        if (err) {
            console.error("Ошибка при передаче файла:", err);
            if (!res.headersSent) {
                res.status(404).send('File not found');
            }
        }
    });
});

app.listen(port, () => {
    console.log('Server is running on port ' + port);
});
