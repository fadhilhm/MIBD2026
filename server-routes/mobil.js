const express = require('express');
const router = express.Router();
const multer = require('multer');
const path = require('path');
const { getPool, sql } = require('../server-config/db');

// multer untuk upload foto mobil
const storage = multer.diskStorage({
    destination: function(req, file, cb) {
        cb(null, 'public/image/');
    },
    filename: function(req, file, cb) {
        const merekRaw = req.body.merek;
        const tipeRaw = req.body.tipe;
        const nopolRaw = req.body.nopol;

        const merekClean = merekRaw.toLowerCase().trim();
        const tipeClean = tipeRaw.toLowerCase().trim();
        const nopolClean = nopolRaw.trim();

        const extension = path.extname(file.originalname).toLowerCase();

        const namaFile = `${merekClean}_${tipeClean}_${nopolClean}${extension}`;

        cb(null, namaFile);
    }
});
const upload = multer({ storage: storage });

// mengambil data mobil
router.get('/get-data-mobil', async (req, res) => {
    try {
        const pool = getPool();

        const result = await pool.request().query(`
            SELECT M.Nopol, MK.NamaMerek, T.NamaTipe, T.Kapasitas, M.HargaSewaMobil, M.TahunPembuatan, C.NamaJalan
            FROM MOBIL M
            JOIN MEREK_MOBIL MK ON M.IDMerek = MK.IDMerek
            JOIN TIPE_MOBIL T ON M.IDTipe = T.IDTipe 
            JOIN CABANG C ON M.IDCabang = C.IDCabang
        `);
        return res.json(result.recordset); 
    } catch (error) {
        console.error(error);
        return res.status(500).send("Failed to fetch car data");
    }
});

// menambahhkan data mobil yang baru
router.post('/add-data-mobil', upload.single('fotoMobil'), async (req, res) => {
    const { nopol, tipe, merek, kapasitas, tahunPembuatan, hargaSewa } = req.body;
    
    if (!req.session.role || req.session.role !== 'pegawai') {
        return res.status(403).json({ 
            success: false, 
            message: 'Akses ditolak. Hanya pegawai yang boleh menambahkan data Mobil!' 
        });
    }

    const idCabangPegawai = req.session.idCabang;

    try {
        const hargaSewaClean = parseFloat(hargaSewa.replace(/\./g, ''));

        const pool = getPool();
        const request = pool.request();


        request.input('Nopol', sql.VarChar, nopol);
        request.input('Merek', sql.VarChar, merek);
        request.input('Tipe', sql.VarChar, tipe);
        request.input('Kapasitas', sql.Int, parseInt(kapasitas));
        request.input('TahunPembuatan', sql.Int, tahunPembuatan);
        request.input('HargaSewa', sql.Decimal(12, 2), hargaSewaClean);
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

        return res.status(201).json({ 
            success: true,
            message: 'Mobil baru sukses didaftarkan di cabang Anda!'
        })
    } catch (error) {
        console.error(error);
        return res.status(500).json({
            success: false,
            message: error.message
        });
    }
});

// Author : Steven
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
        return res.status(500).json({ message: "Booking failed" });
    }
});

module.exports = router;