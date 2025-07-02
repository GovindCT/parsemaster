
const express = require('express');
const cors = require('cors');
const multer = require('multer');
const xml2js = require('xml2js');
const fs = require('fs');
const path = require('path');

const app = express();
const port = 3000;

app.use(cors());

const upload = multer({dest: 'uploads/'});

app.post('/upload', upload.single('logfile'), (req,res)=> {
    console.log('File received:',req.file);
    res.json({ message: 'File uploaded successfully', file:req.file});
});

app.listen(port,()=>{
    console.log(`Parsemaster backend running at http://localhost:${port}`);
});