const express = require('express');
const router = express.Router();
const { getPool, sql } = require('../server-config/db');

// Author : Pearce Nathaniel N.
// validasi akun dalam login
async function verifyUserLogin(emailInput, passwordInput) {
    const pool = getPool();
    const request = new sql.Request(pool);

    request.input('EmailParam', sql.VarChar, emailInput);
    request.input('PasswordParam', sql.VarChar, passwordInput);

    const queryText = `
        SELECT u.IDUser, u.Nama, e.AlamatEmail, u.UserPassword, u.[Role], p.IDCabang
        FROM [USER] AS u
        INNER JOIN EMAIL_USER AS e ON u.IDUser = e.IDUser
        LEFT JOIN PEGAWAI AS p ON u.IDUser = p.IDUser
        WHERE e.AlamatEmail = @EmailParam AND u.UserPassword = @PasswordParam;
    `;

    const result = await request.query(queryText);
    return result.recordset;
}

// masukkan data user ke dalam db
async function executeUserRegistration(userData) {
    const { nama, jenisKelamin, tanggalLahir, email, phone, noSIM, password } = userData;
    const pool = getPool();
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
        `;
        const userResult = await userRequest.query(userQuery);
        const newUserID = userResult.recordset[0].NewUserID;

        const memberRequest = new sql.Request(transaction);
        memberRequest.input('IDUser', sql.Int, newUserID);
        memberRequest.input('NoSIM', sql.VarChar, noSIM);
        await memberRequest.query(`INSERT INTO MEMBER(IDUser, NoSIM) VALUES (@IDUser, @NoSIM);`);

        const emailRequest = new sql.Request(transaction);
        emailRequest.input('IDUser', sql.Int, newUserID);
        emailRequest.input('Email', sql.VarChar, email);
        await emailRequest.query(`INSERT INTO EMAIL_USER (IDUser, AlamatEmail) VALUES (@IDUser, @Email);`);

        const phoneRequest = new sql.Request(transaction);
        phoneRequest.input('IDUser', sql.Int, newUserID);
        phoneRequest.input('Phone', sql.VarChar, phone);
        await phoneRequest.query(`INSERT INTO NOTELP_USER (IDUser, NomorTelp) VALUES (@IDUser, @Phone);`);

        await transaction.commit();
        return true;
    } catch (error) {
        await transaction.rollback();
        throw error; 
    }
}

// register
router.post('/register', async (req, res) => {
    try {
        await executeUserRegistration(req.body);
        return res.status(201).json({ message: 'Registration Success!' });
    } catch (error) {
        console.error('Registration Error Context:', error);
        return res.status(500).json({ message: 'Registration Failed...' });
    }
});

// login
router.post('/login', async (req, res) => {
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
        let userRole = 
                    user.Role === 1 ? 'member' : 
                    user.Role === 2 ? 'pegawai' : 'user';

        req.session.idUser = user.IDUser;
        req.session.role = userRole;
        req.session.nama = user.Nama

        if (userRole == 'pegawai') req.session.idCabang = user.IDCabang;
        else req.session.idCabang = '-';

        return res.status(200).json({
            success: true,
            message: `Login berhasil! Selamat datang kembali, ${user.Nama}.`,
            redirectUrl: userRole === 'pegawai' ? 'kelola-mobil' : 'dashboard-member',
            user: { id: user.IDUser, name: user.Nama, role: userRole }
        });
    } catch (error) {
        console.error(`Login Error: `, error);
        return res.status(500).json({ success: false, message: 'Internal server error.' });
    }
});

module.exports = router;