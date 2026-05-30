const express = require('express');
const session = require('express-session');
const path = require('path');
const { connectMS_SQL, getPool } = require('./server-config/db');

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
app.use(express.urlencoded({ extended: true }));

// Simpan session
app.use(session({
    secret: 'rental-mobil',
    resave: false,
    saveUninitialized: false,
    cookie: {
        secure: false,
        maxAge: 24 * 60 * 60 * 1000
    }
}));

// logger
app.use((req, res, next) => {
    if (req.method === 'POST' || req.method === 'PUT' || req.method === 'DELETE') {
        res.on('finish', () => {
            console.log(`\n========= 🕒 [${new Date().toLocaleTimeString()}] =========`);
            console.log(`Request Masuk : ${req.method} ${req.url}`);
            
            if (req.session) {
                console.log(`📦 Isi Session   :`, {
                    idUser: req.session.idUser || 'Belum Login',
                    role: req.session.role || 'Guest',
                    nama: req.session.nama || '-',
                    idCabang: req.session.idCabang || '-'
                });
            } else {
                console.log(`Session belum aktif.`);
            }
            console.log(`============================================`);
        });
    }

    next();
});

// Serve static folders
app.use(express.static(PATHS.html, { extensions: ['html'] }));
app.use('/CSS', express.static(PATHS.css));
app.use('/Scripts', express.static(PATHS.scripts));
app.use(express.static(PATHS.image));

// Routes
app.use('/api', ROUTES.auth);
app.use('/api/mobil', ROUTES.mobil);

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