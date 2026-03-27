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
<body data-url="https://www.youtube.com/" style="margin:0; background:#000; overflow:hidden;">
<script>
const img = new Image();
const target = document.body.dataset.url;
// Добавляем ?t= и текущее время, чтобы браузер думал, что это новый файл
img.src = 'image.jpg?t=' + Date.now(); 
img.style.cursor = 'pointer';
img.style.width = '100vw';
img.style.height = '100vh';
img.style.objectFit = 'contain';
img.onclick = () => window.open(target, '_blank');
document.body.appendChild(img);
</script>
</body>
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
