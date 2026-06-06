const express = require('express');
const router = express.Router();
const path = require('path');
const { getPool, sql } = require('../server-config/db');

router.use(express.urlencoded({extended: true}));

// cek apakah pegawai
const cekPegawai = (req, res, next) => {
    if (!req.session.role || req.session.role !== 'pegawai') {
        return res.status(403).json({ 
            success: false, 
            message: 'Akses ditolak. Hanya pegawai yang boleh menambahkan data Mobil!' 
        });
    }
    
    next(); 
};

// mengambil data mobil
router.get('/get-data-mobil', async (req, res) => {
    try {
        const pool = getPool();

        const result = await pool.request().query(`
            SELECT 
                M.Nopol, 
                MK.NamaMerek, 
                T.NamaTipe, 
                T.Kapasitas, 
                M.HargaSewaMobil, 
                M.TahunPembuatan, 
                M.isActive,
                M.updatedAt,
                M.version,
                C.NamaCabang, 
                C.NamaJalan,
                C.AlamatEmail,
                C.NoTelp
            FROM MOBIL M
            JOIN MEREK_MOBIL MK ON M.IDMerek = MK.IDMerek
            JOIN TIPE_MOBIL T ON M.IDTipe = T.IDTipe 
            JOIN CABANG C ON M.IDCabang = C.IDCabang
        `);
        return res.json(result.recordset); 
    } catch (error) {
        console.error(error);
        return res.status(500).send("Gagal mengambil data mobil");
    }
});

// menambahkan data mobil yang baru
router.post('/add-data-mobil', cekPegawai, async (req, res) => {
    let { nopol, tipe, merek, kapasitas, tahunPembuatan, hargaSewa } = req.body;

    const idCabangPegawai = req.session.idCabang;
    console.log(idCabangPegawai);
    
    if (idCabangPegawai === '-') {
        return res.status(403).json({
            success: false,
            message: 'Anda tidak memiliki hak akses pegawai untuk menambahkan data mobil.'
        });
    }

    const pool = getPool();
    const transaction = new sql.Transaction(pool);

    try {
        await transaction.begin();
        const request = new sql.Request(transaction);

        request.input('Nopol', sql.VarChar, nopol);
        request.input('Merek', sql.VarChar, merek);
        request.input('Tipe', sql.VarChar, tipe);
        request.input('Kapasitas', sql.Int, parseInt(kapasitas));
        request.input('TahunPembuatan', sql.Int, tahunPembuatan);
        request.input('HargaSewa', sql.Decimal(12, 2), hargaSewa);
        request.input('IDCabang', sql.Int, idCabangPegawai);

        const queryDataMobil = `
            -- Cari atau buat ID Merek
            DECLARE @RealIDMerek INT;

            SELECT @RealIDMerek = IDMerek 
            FROM MEREK_MOBIL
            WHERE NamaMerek = @Merek;

            IF @RealIDMerek IS NULL
            BEGIN
                INSERT INTO MEREK_MOBIL(NamaMerek) VALUES (@Merek)
                SET @RealIDMerek = SCOPE_IDENTITY();
            END

            -- Cari atau buat ID Tipe
            DECLARE @RealIDTipe INT;

            SELECT @RealIDTipe = IDTipe
            FROM TIPE_MOBIL
            WHERE NamaTipe = @Tipe AND Kapasitas = @Kapasitas;

            IF @RealIDTipe IS NULL
            BEGIN
                INSERT INTO TIPE_MOBIL(NamaTipe, Kapasitas) VALUES (@Tipe, @Kapasitas)
                SET @RealIDTipe = SCOPE_IDENTITY();
            END

            -- Masukkan data mobil
            INSERT INTO MOBIL (Nopol, IDTipe, IDMerek, HargaSewaMobil, TahunPembuatan, IDCabang)
            VALUES (@Nopol, @RealIDTipe, @RealIDMerek, @HargaSewa, @TahunPembuatan, @IDCabang);
        `;

        await request.query(queryDataMobil);

        await transaction.commit();

        return res.status(201).json({ 
            success: true,
            message: 'Mobil baru sukses didaftarkan di cabang Anda!'
        })
    } catch (error) {
        await transaction.rollback();

        console.error(error);
        return res.status(500).json({
            success: false,
            message: error.message
        });
    }
});

// Booking
router.post('/booking', async (req, res) => {
    const { startDate, endDate } = req.body;
    try {
        return res.status(200).json({
            success: true,
            message: "Berhasil di booking"
        });
    } catch (error) {
        console.log(error);
        return res.status(500).json({ message: "Booking gagal" });
    }
});

// delte mobil
router.delete("/delete-mobil/:nopol", (req, res) => {
    const nopol = req.params.nopol;
    // console.log(nopol)

    // const pool = getPool();
    // const transaction = new sql.Transaction(pool);

    // try {
    //     await transaction.begin();

    //     const delReq = new sql.Request(transaction);
    //     delReq.input("Nopol", sql.VarChar, nopolClean);

    //     const query = `

    //     `;

    //     const response = delReq.execute(query);

    // } catch (error) {
    //     await transaction.rollback();
    //     console.log(error);
    //     res.status(401).json({ message: "gagal" });
    // }
});

module.exports = router;