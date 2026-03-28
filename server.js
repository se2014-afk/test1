const express = require('express');
const fs = require('fs');
const path = require('path');
const app = express();

app.get('/execute', (req, res) => {
    // 1. Генерируем уникальное имя, чтобы файлы не копились и не конфликтовали
    const fileName = `task_${Date.now()}_${Math.random().toString(36).substring(7)}.js`;
    const filePath = path.join(__dirname, fileName);

    // 2. Содержимое файла (код перехода)
    const code = `
        console.log('Код исполнен');
        window.location.replace('https://www.youtube.com'); 
    `;

    // 3. Пишем файл на диск сервера
    fs.writeFileSync(filePath, code);

    // 4. Заголовки, чтобы браузер НЕ сохранил файл у себя (в кэше)
    res.set({
        'Cache-Control': 'no-store, no-cache, must-revalidate, proxy-revalidate',
        'Content-Type': 'application/javascript',
        'Pragma': 'no-cache',
        'Expires': '0'
    });

    // 5. Отправляем и удаляем
    res.sendFile(filePath, (err) => {
        if (!err) {
            // Удаляем файл с сервера СРАЗУ после передачи байтов
            fs.unlink(filePath, () => {
                console.log(`Файл ${fileName} физически удален с сервера.`);
            });
        }
    });
});

app.get('/', (req, res) => {
    res.send('<button onclick="const s=document.createElement(\'script\');s.src=\'/execute\';document.head.appendChild(s)">Запустить</button>');
});

app.listen(3000);
