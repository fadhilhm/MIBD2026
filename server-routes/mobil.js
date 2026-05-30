const express = require('express');
const router = express.Router();
const { getPool } = require('../server-config/db');

// mengambil data mobil
router.get('/data_mobil', async (req, res) => {
    try {
        const pool = getPool();

        const result = await pool.request().query(`
            SELECT M.Nopol, MK.NamaMerek, T.NamaTipe, T.Kapasitas, M.HargaSewaMobil, M.TahunPembuatan
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