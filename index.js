const express = require('express');
const path = require('path');
const { connectMS_SQL } = require('./server-config/db');

const app = express();
const port = 3000;

const ROUTES = {
    auth: require('./server-routes/auth'),
    mobil: require('./server-routes/mobil')
}

const PATHS = {
    html: path.join(__dirname, 'HTML'),
    css: path.join(__dirname, 'CSS'),
    scripts: path.join(__dirname, 'Scripts'),
    image: path.join(__dirname, 'public')
};

app.use(express.json());

// Serve static folders
app.use(express.static(PATHS.html, { extensions: ['html'] }));
app.use('/CSS', express.static(PATHS.css));
app.use('/Scripts', express.static(PATHS.scripts));
app.use(express.static(PATHS.image));

// Routes
app.use('/api', ROUTES.auth);
app.use('/api', ROUTES.mobil);

// Serve HTML page utama
app.get('/', (req, res) => {
    res.sendFile(path.join(PATHS.html, 'index.html'));
});

// Connect ke MS SQL
connectMS_SQL().then(() => {
    app.listen(port, () => {
        console.log(`Server is running at http://localhost:${port}`);
    });
}).catch(err => {
    console.error("Server gagal berjalan karena koneksi DB error.", err);
});