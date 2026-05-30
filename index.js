const sql = require('mssql');
const express = require('express');
const path = require('path');
// const { json } = require('stream/consumers');
const port = 3000;

const PATHS = {
    html: path.join(__dirname, 'HTML'),
    css: path.join(__dirname, 'CSS'),
    scripts: path.join(__dirname, 'Scripts'),
    image: path.join(__dirname, 'public')
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
app.use(express.static(PATHS.image));

// serve html page
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'HTML', 'index.html'));
});

// start
app.listen(port, () => {
    console.log(`Server is running at http://localhost:${port}`);
});

// connect ms sql
async function connectMS_SQL() {
    try {
        console.log("Connecting to SQL Server...");
        pool = await sql.connect(sqlConfig);
        console.log("Connected to SQL Server!");
    } catch (error) {
        console.error("Database connection failed :(\n", error);
    }
}
connectMS_SQL();

// register
app.post('/api/register', async (req, res) => {
    const { nama, jenisKelamin, tanggalLahir, email, phone, noSIM, password } = req.body;

    const transaction = new sql.Transaction(pool);

    try {
        await transaction.begin();

        const userRequest = new sql.Request(transaction);

        userRequest.input('Nama', sql.VarChar, nama);
        userRequest.input('JenisKelamin', sql.Char, jenisKelamin);
        userRequest.input('TanggalLahir', sql.Date, tanggalLahir);
        userRequest.input('UserPassword', sql.VarChar, password);
        userRequest.input('Role', sql.Int, 1);

        const userQuery = `
            INSERT INTO [USER] (Nama, TanggalLahir, JenisKelamin, UserPassword, [Role])
            VALUES (@Nama, @TanggalLahir, @JenisKelamin, @UserPassword, @Role);
            SELECT SCOPE_IDENTITY() AS NewUserID;
        `

        const userResult = await userRequest.query(userQuery);
        const newUserID = userResult.recordset[0].NewUserID;

        const memberRequest = new sql.Request(transaction);
        memberRequest.input('IDUser', sql.Int, newUserID);
        memberRequest.input('NoSIM', sql.VarChar, noSIM);

        const memberQuery = `
            INSERT INTO MEMBER(IDUser, NoSIM)
            VALUES (@IDUser, @NoSIM);
        `;

        await memberRequest.query(memberQuery);

        const emailRequest = new sql.Request(transaction);
        emailRequest.input('IDUser', sql.Int, newUserID);
        emailRequest.input('Email', sql.VarChar, email);

        await emailRequest.query(`
            INSERT INTO EMAIL_USER (IDUser, AlamatEmail)
            VALUES (@IDUser, @Email);
        `)

        const phoneRequest = new sql.Request(transaction);
        phoneRequest.input('IDUser', sql.Int, newUserID);
        phoneRequest.input('Phone', sql.VarChar, phone);
        await phoneRequest.query(`
            INSERT INTO NOTELP_USER (IDUser, NomorTelp) 
            VALUES (@IDUser, @Phone)
        `);

        await transaction.commit();
        res.status(201).json({ message: 'Registration Success!' });
    } catch (error) {
        await transaction.rollback();
        console.error('Error:', error);
        res.status(500).json({ message: 'Registration Failed...' });
    }
});

/**
 * Author : Pearce Nathaniel N.
 * @param {*} emailInput 
 * @param {*} passwordInput 
 * @returns 
 */
// Query Function For Login Page
async function verifyUserLogin(emailInput, passwordInput) {
    const request = new sql.Request(pool);

    request.input('EmailParam', sql.VarChar, emailInput);
    request.input('PasswordParam', sql.VarChar, passwordInput);

    // Query
    const queryText = `
    SELECT u.IDUser, u.Nama, e.AlamatEmail, u.UserPassword, u.[Role]
    FROM [USER] AS u
    INNER JOIN EMAIL_USER AS e 
    ON u.IDUser = e.IDUser
    WHERE e.AlamatEmail = @EmailParam AND u.UserPassword = @PasswordParam;
    `;

    const result = await request.query(queryText);

    console.log(result.recordset);
    return result.recordset;
}

app.post('/api/login', async (req, res) => {
    // console.log("BODY RECEIVED: ", req.body);
    const { emailInput, passwordInput } = req.body;

    if (!emailInput || !passwordInput) {
        return res.status(400).json({ success: false, message: 'Email and password are required.' });
    }

    try {
        const records = await verifyUserLogin(emailInput, passwordInput);
        if (records.length === 0) {
            return res.status(401).json({ success: false, message: 'Email atau password salah.' });
        }

        const user = records[0];
        let userRole = 'User';
        if (user.Role === 1) {
            userRole = 'Member';
        } else if (user.Role === 2) {
            userRole = 'Pegawai'
        }

        return res.status(200).json({
            success: true,
            message: `Login berhasil! Selamat datang kembali, ${user.Nama}.`,
            user: {
                id: user.IDUser,
                name: user.Nama,
                role: userRole
            }
        });
    } catch (error) {
        console.error(`Login Endpoint Router processing error context: `, error);
        return res.status(500).json({ success: false, message: 'Internal server error.' });
    }
});

// Author : Steven
// Booking
app.post('/api/booking', async (req, res) => {
    const { startDate, endDate } = req.body;

    try {
        return res.status(200).json({
            success: true,
            message: "Berhasil di booking"
        });
    } catch (error) {
        console.log(error);
    }
});