const express = require('express');
const path = require('path');
const app = express();
const port = 3000;

const PATHS = {
    html: path.join(__dirname, 'HTML'),
    css: path.join(__dirname, 'CSS'),
    scripts: path.join(__dirname, 'Scripts')
};

// serve static folder
app.use(express.static(PATHS.html, { extensions: ['html'] }));
app.use('/CSS', express.static(PATHS.css));
app.use('/Scripts', express.static(PATHS.scripts));   

// serve html page
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'HTML', 'index.html'));
});

// start
app.listen(port, () => {
    console.log(`Server is running at http://localhost:${port}`);
});