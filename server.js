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
<body style="margin:0;overflow:hidden;cursor:pointer;">
<img src="/image.jpg?t=${Date.now()}" style="object-fit:contain;width:100vw;height:100vh;">
</body>
`);
});
app.listen(port);
