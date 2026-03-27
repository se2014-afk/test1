const express = require('express');
const app = express();
const port = process.env.PORT || 3000;

// 1. Отдача статики (положите image.jpg в папку public рядом с файлом сервера)
app.use(express.static('public', { etag: false, lastModified: false }));

// 2. Универсальный middleware для отключения кэша
app.use((req, res, next) => {
    res.set({
        'Cache-Control': 'no-store, no-cache, must-revalidate, max-age=0',
        'Pragma': 'no-cache',
        'Connection': 'close'
    });
    next();
});

app.get('/favicon.ico', (req, res) => res.status(204).end());

app.get('/', (req, res) => {
    res.send(`
        <!DOCTYPE html>
        <html style="margin:0; overflow:hidden; background:#000;">
        <body style="margin:0; cursor:pointer;" onclick="window.open('https://youtube.com', '_blank')">
            <img src="/image.jpg?${Date.now()}" 
                 style="display:block; width:100vw; height:100vh; object-fit:contain;">
        </body>
        </html>
    `);
});

app.listen(port);
