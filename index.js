const sql = require('mssql');
const express = require('express');
const path = require('path');
const port = 3000;

const PATHS = {
    html: path.join(__dirname, 'HTML'),
    css: path.join(__dirname, 'CSS'),
    scripts: path.join(__dirname, 'Scripts')
};

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

// connect ms sql
async function connectMS_SQL() {
    try {
        console.log("Connecting to SQL Server...");
        let pool = await sql.connect(sqlConfig);
        console.log("Connected to SQL Server!");

        let result = await pool.request().query("SELECT @@VERSION as SQL_Version");
        console.log("\nQuery Test Result:");
        console.table(result.recordset);

        await sql.close();
    } catch (error) {
        console.error("Database connection failed :(\n", error);
    }
}
connectMS_SQL();

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