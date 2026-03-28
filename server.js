const express = require('express');
const app = express();
const port = process.env.PORT || 3000;
const path = require('path');
app.get('/image.jpg', (req, res) => {
res.sendFile(path.join(__dirname, 'image.jpg'));
});
app.use((req, res, next) => {
res.send(`
<body style="margin:0;overflow:hidden;cursor:pointer;">
<img src="/image.jpg?t=${Date.now()}" style="object-fit:contain;width:100vw;height:100vh;">
</body>
<script>
document.body.addEventListener('click', function() {
window.open('https://www.youtube.com', '_blank');
});
</script>
`);
});
app.listen(port);
