const express = require('express');
const app = express();
const port = process.env.PORT || 3000;
const path = require('path');
app.get('/image.jpg', (req, res) => {
res.sendFile(path.join(__dirname, 'image.jpg'));
});
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
<body style="overflow:hidden;margin:0;cursor:pointer;" onclick="window.open('https://youtube.com','_blank')">
<img src="/image.jpg?${Date.now()}" 
style="display:block;width:100vw;height:100vh;object-fit:contain;">
</body>
`);
});
app.listen(port);
