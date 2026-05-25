const express = require('express');
const path = require('path');
const app = express();
const port = 3000;

// serve static folder
app.use('/CSS', express.static(path.join(__dirname, 'CSS')));
app.use(express.static(path.join(__dirname, 'HTML'), { extensions: ['html'] }));
app.use('/Scripts', express.static(path.join(__dirname, 'Scripts')));   

// serve html page
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'HTML', 'index.html'));
});

// start
app.listen(port, () => {
    console.log(`Server is running at http://localhost:${port}`);
});