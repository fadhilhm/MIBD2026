const express = require('express');
const router = express.Router();
const path = require('path');
const { getPool, sql } = require('../server-config/db');
const { formatToRupiah } = require('../Scripts/api');

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
            WHERE M.isActive = 1
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

        const hargaSewaClean = String(hargaSewa).replace(/\./g, '');

        request.input('Nopol', sql.VarChar, nopol);
        request.input('Merek', sql.VarChar, merek);
        request.input('Tipe', sql.VarChar, tipe);
        request.input('Kapasitas', sql.Int, parseInt(kapasitas));
        request.input('TahunPembuatan', sql.Int, tahunPembuatan);
        request.input('HargaSewa', sql.Decimal(12, 2), parseFloat(hargaSewaClean));
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

// delete mobil
router.delete("/delete-mobil/:nopol", async (req, res) => {
    const nopol = req.params.nopol;
    console.log(nopol);
    
    const version = req.query.version;
    console.log(version);

    const pool = getPool();
    const transaction = new sql.Transaction(pool);

    try {
        await transaction.begin();

        const request = transaction.request(pool);
        request.input("Nopol", sql.VarChar, nopol);
        request.input("Version", sql.Int, parseInt(version));

        const query = `
            UPDATE Mobil
            SET isActive = 0,
                updatedAt = GETDATE(),
                version = version + 1
            WHERE Nopol = @Nopol AND version = @Version
        `

        const result = await request.query(query);
        await transaction.commit();
        if (result.rowsAffected[0] === 0) {
            return res.status(409).json({ 
                success: false, 
                message: "bad requeset" 
            });
        }

        return res.status(200).json({ 
            success: true, 
            message: "Berhasil" 
        });

    } catch (error) {
        await transaction.rollback();
        console.log(error);
        res.status(500).json({ message: "internal problem" });
    }
});

// update mobil
router.put('/update-data-mobil', async (req, res) =>{
    const { nopol, merek, tipe, kapasitas, tahunPembuatan, hargaSewa, version } = req.body;
    console.log(req.body);
    
    const pool = getPool();
    const transaction = new sql.Transaction(pool);
    try {
        await transaction.begin();

        // cek apakah idmerek null ?
        const reqMerek = new sql.Request(transaction);
        reqMerek.input('Merek', sql.VarChar, merek);
        
        let resMerek = await reqMerek.query(`
            SELECT IDMerek 
            FROM MEREK_MOBIL 
            WHERE NamaMerek = @Merek
        `);

        let idMerekFinal;
        
        if (resMerek.recordset.length === 0) {
            // Jika tidak lakukan insert dan ambil ID barunya
            let insMerek = await reqMerek.query(`
                INSERT INTO MEREK_MOBIL (NamaMerek) 
                OUTPUT INSERTED.IDMerek 
                VALUES (@Merek)
            `);
            idMerekFinal = insMerek.recordset[0].IDMerek;
        } else {
            // Jika ada ambil ID yang sudah ada
            idMerekFinal = resMerek.recordset[0].IDMerek;
        }

        const reqTipe = new sql.Request(transaction);
        reqTipe.input('NamaTipe', sql.VarChar, tipe);
        reqTipe.input('Kapasitas', sql.Int, parseInt(kapasitas));

        let resTipe = await reqTipe.query(
            `
            SELECT IDTipe 
            FROM Tipe_Mobil
            WHERE NamaTipe = @NamaTipe AND Kapasitas = @Kapasitas
            `
        )

        let idTipeFinal;

        if(resTipe.recordset.length === 0){
            let insTipe = await reqTipe.query(
                `
                INSERT INTO TIPE_MOBIL(NamaTipe, Kapasitas)
                OUTPUT INSERTED.IDTipe
                VALUES(@NamaTipe, @Kapasitas)
                `
            )
            idTipeFinal = insTipe.recordset[0].IDTipe;
        } else {
            idTipeFinal = resTipe.recordset[0].IDTipe;
        }

        const reqUpdate = transaction.request(pool);

        const hargaSewaClean = String(hargaSewa).replace(/\./g, '');

        reqUpdate.input('Nopol', sql.VarChar, nopol);
        reqUpdate.input('Merek', sql.VarChar, merek);
        reqUpdate.input('Tipe', sql.VarChar, tipe);
        reqUpdate.input('Kapasitas', sql.Int, kapasitas);
        reqUpdate.input('TahunPembuatan', sql.Int, parseInt(tahunPembuatan));
        reqUpdate.input('HargaSewa', sql.Decimal(12, 2), parseFloat(hargaSewaClean));
        reqUpdate.input('Version', sql.Int, parseInt(version));

        const queryUpdate = `
            UPDATE MOBIL
            SET 
                -- IDMerek berdasarkan namanya
                IDMerek = (SELECT IDMerek FROM MEREK_MOBIL WHERE NamaMerek = @Merek),
                
                -- IDTipe berdasarkan namanya dan kapasitasnya
                IDTipe = (SELECT IDTipe FROM TIPE_MOBIL WHERE NamaTipe = @Tipe AND Kapasitas = @Kapasitas),
                
                HargaSewaMobil = @HargaSewa,
                TahunPembuatan = @TahunPembuatan,
                updatedAt = GETDATE(),
                version = version + 1
            WHERE 
                Nopol = @Nopol 
                AND version = @Version;
        `;
        const result = await reqUpdate.query(queryUpdate);
        await transaction.commit();
        if (result.rowsAffected[0] === 0) {
            return res.status(409).json({ success: false, message: 'Conflict, gagal update' });
        }

        return res.status(200).json({ success: true, message: 'Berhasil di update' });

    } catch (error) {
        await transaction.rollback();
        console.error(error);
        return res.status(500).json({ success: false, message: 'Internal Error.' });
    }
})

module.exports = router;