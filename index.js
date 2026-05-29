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

// validation, check if exist in DB
app.post('/api/validate', async (req, res) => {
    const { email } = req.body;
    
    const transaction = new sql.Transaction(pool);

    try {
        await transaction.begin();

        const validation = new sql.Request(transaction);

        validation.input('Email', sql.VarChar, email);

        const validationQuery = `
            SELECT IDEmail
            FROM EMAIL_USER
            WHERE AlamatEmail = @Email;
        `;

        const result = await validation.query(validationQuery);

        if (result.recordset.length > 0) {
            await transaction.commit();

            return res.json({
                exists: true,   
                message: 'Email sudah dipakai...'
            });
        }

        return res.json({
            exists: false
        });
    } catch (error) {
        console.error('Error ketika memvalidasi email:', error);
        return res.json({ message: 'Something wrong happened...'});
    }
});

// signup
app.post('/api/signup', async (req, res) => {
    const { nama, jenisKelamin, tanggalLahir, email, phone, noSIM, password } = req.body;

    const transaction = new sql.Transaction(pool);

    try {
        await transaction.begin();

        const userRequest = new sql.Request(transaction);

        userRequest.input('Nama', sql.VarChar, nama);
        userRequest.input('JenisKelamin', sql.Char, jenisKelamin);
        userRequest.input('TanggalLahir', sql.Date, tanggalLahir);
        userRequest.input('UserPassword', sql.VarChar, password);

        const userQuery = `
            INSERT INTO [USER] (Nama, TanggalLahir, JenisKelamin, UserPassword)
            VALUES (@Nama, @TanggalLahir, @JenisKelamin, @UserPassword);
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
        res.status(200).json({
            success: true, 
            message: 'Registrasi berhasil!'
        });
    } catch (error) {
        await transaction.rollback();
        console.error('Error:', error);
        res.json({ 
            success: false,
            message: 'Registrasi gagal...' 
        });
    }
});

// login
app.post('/api/login', async (req, res) => {
    const { email, password } = req.body;

    const transaction = new sql.Transaction(pool);

    try {
        await transaction.begin();

        const userRequest = new sql.Request(transaction);

        userRequest.input('Email', sql.VarChar, email);

        const userResult = await userRequest.query(`
            SELECT IDUser 
            FROM EMAIL_USER 
            WHERE AlamatEmail = @Email;
        `)

        if (userResult.recordset.length == 0) {
            alert('Email atau Password salah...');
            return null;
        }

        const memberID = userResult.recordset[0].IDUser;

        console.log(memberID);

        
    } catch (error) {
        
    }
});