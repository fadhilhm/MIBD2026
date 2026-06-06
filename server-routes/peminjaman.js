const express = require('express');
const router = express.Router();
const { getPool, sql } = require('../server-config/db');

// Data dashboard Pegawai
router.get('/dashboard-pegawai', async(req, res) =>{
    try {
        const pool = await getPool();

        const query = ``;
    } catch (error) {
        
    }
})

router.get('/get-riwayat-rental', async(req,res) => {
    try {
        const pool = getPool();

        const idUser = req.session.idUser;

        const result = await pool.request().input('IDUser', idUser).query(`
            SELECT
                M.Nopol,
                MK.NamaMerek,
                P.TanggalPeminjaman,
                P.TanggalKembali,
                P.TanggalBatasPengembalian,
                P.TotalBiaya
            FROM
                PEMINJAMAN P
            JOIN
                MOBIL M ON P.Nopol = M.Nopol
            JOIN
                MEREK_MOBIL MK ON MK.IDMerek = M.IDMerek  
            WHERE
                IDMember = @IDUser
        `);

        return res.json(result.recordset);
    } catch (error) {
        console.log(error);
        return res.status(500).send("Gagal mengambil data riwayat rental");
    }
});

module.exports = router;