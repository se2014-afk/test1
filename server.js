const express=require('express');
const path=require('path');
const app=express();
const port=process.env.PORT || 3000;
app.use((req, res, next)=>{
res.set({
'Cache-Control': 'no-store, no-cache, must-revalidate, proxy-revalidate, max-age=0',
'Pragma': 'no-cache',
'Expires': '0',
'Surrogate-Control': 'no-store',
'Connection': 'close'
});
next();
});
app.get('/favicon.ico',(req, res)=>res.status(204).end());
app.get('/',(req,res)=>{
res.send(`
<body style="margin:0;overflow:hidden;cursor:pointer;">
<img src="/image.jpg" style="object-fit:contain;width:100vw;height:100vh;">
</body>
<script>
document.body.addEventListener('click',function() {
window.open('https://www.youtube.com','_blank');
});
</script>
`);
});
app.get('/image.jpg',(req,res)=>{
const filePath = path.join(__dirname,'image.jpg');
res.type('image/jpeg');
res.sendFile(filePath);
});
app.listen(port);
