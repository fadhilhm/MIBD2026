const sql = require('mssql');
const express = require('express');
const path = require('path');

// const { json } = require('stream/consumers');
const port = 3000;

const PATHS = {
    html: path.join(__dirname, 'HTML'),
    css: path.join(__dirname, 'CSS'),
    scripts: path.join(__dirname, 'Scripts')
};

console.log(PATHS);

const sqlConfig = {
    user: 'adminTester',
    password: 'admin1234',
    server: 'localhost',
    database: 'CarRentalDB',
    port: 1433,
    options: {
        encrypt: false,
        trustServerCertificate: true
    }
}

const app = express();
app.use(express.json());
let pool;

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

// Query Function For Login Page
async function verifyUserLogin(emailInput, passwordInput) {
    const connectionPool = await getPoolConnection();
    const request = new sql.Request(connectionPool);

    request.input('EmailParam', sql.VarChar, emailInput);
    request.input('PasswordParam', sql.VarChar, passwordInput);

    // Query

    const result = await request.query(queryText);
    return result.recordset;
}