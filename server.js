const express = require('express');
const fs = require('fs');
const path = require('path');
const os = require('os');
const app = express();

// Порт для хостинга или локального запуска
const PORT = process.env.PORT || 3000;

// 1. Настройка заголовков для ПОЛНОГО отключения кэша
app.use((req, res, next) => {
    res.set({
        'Cache-Control': 'no-store, no-cache, must-revalidate, proxy-revalidate',
        'Pragma': 'no-cache',
        'Expires': '0',
        'Surrogate-Control': 'no-store'
    });
    next();
});

// 2. Главная страница (Картинка на весь экран + скрипт по клику)
app.get('/', (req, res) => {
    res.send(`
        <!DOCTYPE html>
        <html style="margin:0; padding:0; height:100vh; overflow:hidden; background:#000;">
        <body style="margin:0; cursor:pointer;" onclick="executeOneTimeScript()">
            <img src="/image.jpg?t=${Date.now()}" 
                 style="display:block; width:100vw; height:100vh; object-fit:contain;">
            
            <script>
                function executeOneTimeScript() {
                    console.log('Запрашиваю одноразовый файл...');
                    const s = document.createElement('script');
                    s.src = '/get-script?t=' + Date.now();
                    document.head.appendChild(s);
                }
            </script>
        </body>
        </html>
    `);
});

// 3. Роут: Создание, отправка и ФИЗИЧЕСКОЕ удаление файла
app.get('/get-script', (req, res) => {
    // Создаем имя файла в системной временной папке (важно для хостинга)
    const fileName = `script_${Date.now()}_${Math.random().toString(36).substr(2, 5)}.js`;
    const filePath = path.join(os.tmpdir(), fileName);

    const scriptContent = `
        console.log('Скрипт запущен. Файл на сервере уже удаляется...');
        window.location.replace('https://www.youtube.com');
    `;

    try {
        // Записываем файл на диск сервера
        fs.writeFileSync(filePath, scriptContent);

        // Отправляем файл
        res.sendFile(filePath, (err) => {
            if (err) {
                console.error('Ошибка отправки файла:', err);
            } else {
                // Удаляем файл СРАЗУ после того, как он улетел в браузер
                fs.unlink(filePath, (unlinkErr) => {
                    if (unlinkErr) console.error('Ошибка удаления:', unlinkErr);
                    else console.log('Успех: Файл ' + fileName + ' физически удален с сервера.');
                });
            }
        });
    } catch (e) {
        console.error('Ошибка при работе с файлом:', e);
        res.status(500).send('console.error("Ошибка на сервере при создании файла");');
    }
});

// 4. Отдача картинки (должна лежать в корне проекта)
app.get('/image.jpg', (req, res) => {
    const imgPath = path.join(__dirname, 'image.jpg');
    if (fs.existsSync(imgPath)) {
        res.sendFile(imgPath);
    } else {
        res.status(404).send('Картинка image.jpg не найдена');
    }
});

app.listen(PORT, () => {
    console.log('--- Сервер запущен на порту ' + PORT + ' ---');
});
