const express = require('express');
const fs = require('fs');
const path = require('path');
const app = express();
const port = 3000;

// Middleware для отключения кэша во всех ответах
app.use((req, res, next) => {
    res.set({
        'Cache-Control': 'no-store, no-cache, must-revalidate, proxy-revalidate',
        'Pragma': 'no-cache',
        'Expires': '0'
    });
    next();
});

// Главная страница
app.get('/', (req, res) => {
    res.send(`
        <!DOCTYPE html>
        <html style="margin:0; padding:0; overflow:hidden; background:#000;">
        <body style="margin:0; cursor:pointer;" onclick="runTempScript()">
            <img src="/image.jpg?${Date.now()}" 
                 style="display:block; width:100vw; height:100vh; object-fit:contain;">
            
            <script>
                function runTempScript() {
                    const s = document.createElement('script');
                    // Запрашиваем создание и запуск временного файла
                    s.src = '/get-script';
                    document.head.appendChild(s);
                }
            </script>
        </body>
        </html>
    `);
});

// Роут, который создает, отдает и УДАЛЯЕТ физический файл
app.get('/get-script', (req, res) => {
    const fileName = `temp_${Date.now()}.js`;
    const filePath = path.join(__dirname, fileName);

    // Код, который исполнится у пользователя
    const scriptContent = `
        console.log('Скрипт получен и исполняется...');
        window.location.replace('https://www.youtube.com');
    `;

    // 1. Создаем файл физически на диске сервера
    fs.writeFileSync(filePath, scriptContent);

    // 2. Отправляем файл пользователю
    res.sendFile(filePath, (err) => {
        if (!err) {
            // 3. СРАЗУ после отправки удаляем файл с сервера
            fs.unlink(filePath, (unlinkErr) => {
                if (!unlinkErr) console.log('--- Файл ' + fileName + ' удален с сервера.');
            });
        }
    });
});

// Отдача картинки
app.get('/image.jpg', (req, res) => {
    const imgPath = path.join(__dirname, 'image.jpg');
    if (fs.existsSync(imgPath)) {
        res.sendFile(imgPath);
    } else {
        res.status(404).send('Картинка image.jpg не найдена в папке сервера');
    }
});

app.listen(port, () => {
    console.log(`Сервер запущен: http://localhost:${port}`);
    console.log('Положите image.jpg в папку с этим файлом!');
});
