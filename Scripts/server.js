const sql = require('mssql');
const express = require('express');
const cors = require('cors');

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors());

const config = {
    user: 'adminDWRental',
    password: 'admin1234',
    server: 'localhost',
    database: 'CarRentalDB',
    options: {
        encrypt: true,
        trustServerCertificate: true
    }
};

const regis = app.post("/sign-in", async (req, res) => {

    try {

        const {
            name,
            jenisKelamin,
            tanggalLahir,
            email,
            noTelephone,
            noSIM,
            password
        } = req.body;

        console.log(req.body);
        

        let pool = await sql.connect(config);

        // TRANSACTION supaya semua insert berhasil / gagal bersama
        const transaction = new sql.Transaction(pool);

        await transaction.begin();

        try {
            // user_table
            const userResult = await transaction.request()
                .input('nama', sql.VarChar, name)
                .input('jenisKelamin', sql.Char(1), jenisKelamin)
                .input('tanggalLahir', sql.Date, tanggalLahir)
                .input('pass', sql.VarChar, password)
                .query(`
                    INSERT INTO [User]
                    (nama, jenisKelamin, tanggalLahir, password_user)

                    OUTPUT INSERTED.IDUser

                    VALUES
                    (@nama, @jenisKelamin, @tanggalLahir, @pass)
                `);

            // ambil id user yang baru dibuat
            const idUser = userResult.recordset[0].IDUser;
            console.log(idUser);

            const member_rs = await transaction.request()
                .input('idUser', sql.Int, idUser)
                .input('noSIM', sql.NVarChar, noSIM)
                .query(`
                    INSERT INTO [MEMBER]
                    (IDUser, NoSIM)

                    VALUES
                    (@idUser, @noSIM)
                `);
            
            // email_user
            const email_user_rs = await transaction.request()
                .input('idUser', sql.Int, idUser)
                .input('AlamatEmail', sql.NVarChar, email)
                .query(`
                    INSERT INTO EMAIL_USER
                    (idUser, AlamatEmail)

                    VALUES
                    (@idUser, @AlamatEmail)
                `);

            const nomor_tepl_rs = await transaction.request()
                .input('idUser', sql.Int, idUser)
                .input('NomorTelp', sql.NVarChar, noTelephone)
                .query(`
                    INSERT INTO NOTELP_USER
                    (idUser, NomorTelp)

                    VALUES
                    (@idUser, @NomorTelp)
                `);

            await transaction.commit();

            res.send("Data berhasil ditambahkan");

        } catch (err) {

            await transaction.rollback();
            console.log(err);

            res.status(500).send("Transaction failed");
        }

    } catch (error) {

        console.log(error);
        res.status(500).send("Server Error");
    }

});

app.listen(3000, () => console.log("Running"));