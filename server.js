const express = require('express');
const fs = require('fs');
const path = require('path');
const os = require('os');
const app = express();

const PORT = process.env.PORT || 3000;

app.use((req, res, next) => {
    res.set({
        'Cache-Control': 'no-store, no-cache, must-revalidate, proxy-revalidate',
        'Pragma': 'no-cache',
        'Expires': '0'
    });
    next();
});

app.get('/', (req, res) => {
    res.send(`
        <!DOCTYPE html>
        <html style="margin:0;padding:0;overflow:hidden;background:#000;">
        <body style="margin:0;cursor:pointer;" onclick="const s=document.createElement('script');s.src='/get-script?t='+Date.now();document.head.appendChild(s)">
            <img src="/image.jpg" style="display:block;width:100vw;height:100vh;object-fit:contain;">
        </body>
        </html>
    `);
});

app.get('/get-script', (req, res) => {
    const fileName = `temp_${Date.now()}.js`;
    const filePath = path.join(os.tmpdir(), fileName);
    const content = "window.location.replace('https://www.youtube.com');";

    try {
        fs.writeFileSync(filePath, content);
        res.sendFile(filePath, (err) => {
            if (!err) {
                fs.unlink(filePath, () => console.log('Файл удален:', fileName));
            }
        });
    } catch (e) {
        res.status(500).end();
    }
});

app.get('/image.jpg', (req, res) => {
    const imgPath = path.join(__dirname, 'image.jpg');
    fs.existsSync(imgPath) ? res.sendFile(imgPath) : res.status(404).end();
});

app.listen(PORT, () => console.log('Server running on port ' + PORT));
