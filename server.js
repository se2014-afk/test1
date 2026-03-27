const express = require('express');
const path = require('path');
const app = express();
const port = process.env.PORT || 3000;

app.use((req, res, next) => {
    res.set({
        'Cache-Control': 'no-store, no-cache, must-revalidate, proxy-revalidate, max-age=0',
        'Pragma': 'no-cache',
        'Expires': '0',
        'Surrogate-Control': 'no-store',
        'Service-Worker-Allowed': '/',
        'Clear-Site-Data': '"cache", "storage"'
    });
    next();
});

// Раздача файла Service Worker
app.get('/sw.js', (req, res) => {
    res.sendFile(path.join(__dirname, 'sw.js'));
});

app.get('/', (req, res) => {
    const timestamp = Date.now();
    res.send(`
        <!DOCTYPE html>
        <html>
        <head>
            <meta charset="utf-8">
            <title>Zero Cache SW</title>
            <script>
                if ('serviceWorker' in navigator) {
                    navigator.serviceWorker.register('/sw.js')
                    .then(reg => console.log('SW Registered'))
                    .catch(err => console.log('SW Error', err));
                }
            </script>
        </head>
        <body>
            <h1>Радикальный метод: Service Worker + Headers</h1>
            <img src="/image.jpg?t=${timestamp}" style="width:100%; max-width:600px;">
        </body>
        </html>
    `);
});

app.get('/image.jpg', (req, res) => {
    res.sendFile(path.join(__dirname, 'image.jpg'));
});

app.listen(port, () => console.log('Server running'));
