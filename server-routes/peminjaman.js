/**
 * Query Data Mobil pada Cabang si Pegawai yang sedang Login
 * Author: Pearce Nathaniel N.
 */

const express = require('express');
const router = express.Router();
const { getPool, sql } = require('../server-config/db');

// Helper function process data dashboard
function formatDataDashboard(data) {
    return data.map(sewa => {
        let biayaSewa = parseInt(sewa.TotalBiaya);
        let totalBiayaFinal = biayaSewa;
        let statusPeminjaman = "";

        if (sewa.TanggalKembali !== null) {
            statusPeminjaman = "Selesai";

            // Hitung Denda
            const tanggalBatas = new Date(sewa.TanggalBatasPengembalian);
            const tanggalKembali = new Date(sewa.TanggalKembali);
            if (tanggalKembali > tanggalBatas) {
                // Selisih dalam ms, ubah ke hari. 
                // (1000 ms/s, 60 s/min, 60 min/h, 24 h/day) 
                const denda = biayaSewa * 10 / 100.0 * Math.ceil((tanggalKembali - tanggalBatas) / (1000 * 60 * 60 * 24));
                // tambahkan ke total denda
                totalBiayaFinal = biayaSewa + denda;
                // insert ke dalam tabel
            }
        } else if (sewa.IDPegawai === 5) {
            statusPeminjaman = "Menunggu Verifikasi";
        } else {
            statusPeminjaman = "Ongoing";
        }

        return {
            // Data tampilan dashboard
            nama: sewa.Nama,
            merek: sewa.NamaMerek,
            nopol: sewa.Nopol,
            tglPeminjaman: sewa.TanggalPeminjaman,
            tglBatas: sewa.TanggalBatasPengembalian,
            tglKembali: sewa.TanggalKembali,
            status: statusPeminjaman,
            totalBiaya: totalBiayaFinal,

            // Data Pop Up Konfirmasi
            idMember: sewa.IDMember,
            kapasitas: sewa.Kapasitas,
            tahunMobil: sewa.TahunPembuatan,
            hargaSewaPerHari: sewa.HargaSewaMobil,
            namaCabang: sewa.NamaCabang,
            namaJalan: sewa.NamaJalan,
            namaTipe: sewa.NamaTipe
        };
    });
}

async function updateDenda(idPeminjaman, denda) {
    const pool = getPool();
    const req = new sql.Request(pool);
    req.input("IDPeminjaman", sql.Int, idPeminjaman);
    req.input("TotalDenda", sql.Decimal, denda);

    const res = await req.query(`
        UPDATE Peminjaman
        SET
            TotalDenda = @TotalDenda
        WHERE IDPeminjaman = @IDPeminjaman
    `);
    
}

// Data dashboard Pegawai
async function queryDataDashboardPegawai(idPegawai) {
    const pool = await getPool();
    const request1 = new sql.Request(pool);


    request1.input('IDPegawaiParam', sql.Int, idPegawai);
    // Cari cabang dulu
    const queryCabangPegawai = `
        SELECT IDCabang
        FROM PEGAWAI
        WHERE IDUser = @IDPegawaiParam
    `;
    const resultCabang = await request1.query(queryCabangPegawai);

    if (resultCabang.recordset.length === 0) {
        return [];
    }

    const idCabangPegawai = resultCabang.recordset[0].IDCabang;

    // Tampilkan data pada cabang itu
    const request2 = new sql.Request(pool);
    request2.input('IDCabangParam', sql.Int, idCabangPegawai);
    const queryDataDashcboard = `
        SELECT 
            PEMINJAMAN.IDMember,
            [USER].Nama,
            MEREK_MOBIL.NamaMerek,
            PEMINJAMAN.Nopol,
            PEMINJAMAN.TanggalPeminjaman,
            PEMINJAMAN.TanggalBatasPengembalian,
            PEMINJAMAN.TanggalKembali,
            PEMINJAMAN.TotalBiaya,
            PEMINJAMAN.IDPegawai,

            -- Data Untuk PopUp
            MOBIL.TahunPembuatan,
            TIPE_MOBIL.Kapasitas,
            MOBIL.HargaSewaMobil,
            CABANG.NamaCabang,
            CABANG.NamaJalan,
            TIPE_MOBIL.NamaTipe

        FROM PEMINJAMAN
            JOIN MEMBER ON PEMINJAMAN.IDMember = MEMBER.IDUser -- Cari idMember utk Nama
            JOIN [USER] ON [USER].IDUser = MEMBER.IDUser -- Cari Nama User
            JOIN MOBIL ON PEMINJAMAN.Nopol = MOBIL.NOPOL -- Cari idMobiil utk Nama Merek
            JOIN MEREK_MOBIL ON MOBIL.IDMerek = MEREK_MOBIL.IDMerek -- Cari Nama Merek
            JOIN CABANG ON MOBIL.IDCabang = CABANG.IDCabang
            JOIN TIPE_MOBIL ON MOBIL.IDTipe = TIPE_MOBIL.IDTipe 
        WHERE MOBIL.IDCabang = @IDCabangParam -- Mobil yang satu cabang dengan pegawai itu.
    `;

    const resultDataDashboard = await request2.query(queryDataDashcboard);
    return resultDataDashboard.recordset;
}

router.get('/peminjaman', async (req, res) => {

    try {
        if (!req.session || !req.session.idUser) {
            // Jika tidak ada, langsung stop di sini dan kirim status 412 (Precondition Failed) atau 401 (Unauthorized)
            return res.status(401).json({
                error: "Akses ditolak. Anda harus login terlebih dahulu untuk melihat dashboard ini."
            });
        }

        const idPegawai = req.session.idUser;
        const records = await queryDataDashboardPegawai(idPegawai);

        const processedData = formatDataDashboard(records);

        return res.json(processedData);
    } catch (error) {
        console.error("Error fetching dashboard records:", error);
        return res.status(500).send("Failed to fetch car data");
    }
});

module.exports = router;


router.get('/get-riwayat-rental', async (req, res) => {
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

// Booking
router.post('/booking', async (req, res) => {
    const { startDate, endDate, nopolMobil, totalHarga } = req.body;
    
    console.log(req.body);

    const cleanTotalHarga = totalHarga.replace(/[^0-9]/g, '');
    const pool = getPool();
    const transaction = new sql.Transaction(pool);

    try {
        await transaction.begin();
        const request = new sql.Request(transaction);

        request.input("IDMember", sql.Int, req.session.idUser);
        request.input("Nopol", sql.VarChar, nopolMobil);
        request.input("IDPegawai", sql.Int, Number(5));
        request.input("TanggalPeminjaman", sql.Date, startDate);
        request.input("TanggalDeadline", sql.Date, endDate);
        request.input("TotalBiaya", sql.Decimal(12, 2), Number(cleanTotalHarga));

        const queryBooking = `
            INSERT INTO PEMINJAMAN (IDMember, Nopol, IDPegawai, TanggalPeminjaman, TanggalKembali, TanggalBatasPengembalian, TotalBiaya)
            VALUES (@IDMember, @Nopol, @IDPegawai, @TanggalPeminjaman, NULL, @TanggalDeadline, @TotalBiaya);
        `;

        await request.query(queryBooking);

        await transaction.commit();

        return res.status(200).json({
            success: true,
            message: "Berhasil di booking"
        });
    } catch (error) {
        await transaction.rollback()
        
        console.log(error);
        return res.status(500).json({ message: "Booking gagal" });
    }
});

module.exports = router;