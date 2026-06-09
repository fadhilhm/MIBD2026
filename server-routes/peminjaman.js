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
        let hitungTotalDenda = parseInt(sewa.TotalDenda) || 0;

        if (sewa.TanggalKembali !== null) {
            statusPeminjaman = "Selesai";

            // Hitung total biaya Denda
            totalBiayaFinal = biayaSewa + hitungTotalDenda;
        } else if (sewa.IDPegawai === 5) {
            statusPeminjaman = "Menunggu Verifikasi";
            hitungTotalDenda = 0;
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
            totalDenda: hitungTotalDenda,

            // Data Pop Up Konfirmasi
            idMember: sewa.IDMember,
            kapasitas: sewa.Kapasitas,
            tahunMobil: sewa.TahunPembuatan,
            hargaSewaPerHari: sewa.HargaSewaMobil,
            namaCabang: sewa.NamaCabang,
            namaJalan: sewa.NamaJalan,
            namaTipe: sewa.NamaTipe,

            // Foto
            fotoDepanSebelum: sewa.FotoDepanSebelum,
            fotoBelakangSebelum: sewa.FotoBelakangSebelum,
            fotoKananSebelum: sewa.FotoKananSebelum,
            fotoKiriSebelum: sewa.FotoKiriSebelum,

            fotoDepanSesudah: sewa.FotoDepanSesudah,
            fotoBelakangSesudah: sewa.FotoBelakangSesudah,
            fotoKananSesudah: sewa.FotoKananSesudah,
            fotoKiriSesudah: sewa.FotoKiriSesudah

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
            PEMINJAMAN.TotalDenda, 
            PEMINJAMAN.IDPegawai,

            -- Data Untuk PopUp
            MOBIL.TahunPembuatan,
            TIPE_MOBIL.Kapasitas,
            MOBIL.HargaSewaMobil,
            CABANG.NamaCabang,
            CABANG.NamaJalan,
            TIPE_MOBIL.NamaTipe,

            -- SUBQUERY UTK AMBIL 4 FOTO SEBELUM SEWA (Kondisi = 0)
            (SELECT TOP 1 F.Gambar FROM FOTO F WHERE F.Nopol = PEMINJAMAN.Nopol AND F.IDMember = PEMINJAMAN.IDMember AND F.Kondisi = 0 AND F.Deskripsi LIKE '%Depan%') AS FotoDepanSebelum,
            (SELECT TOP 1 F.Gambar FROM FOTO F WHERE F.Nopol = PEMINJAMAN.Nopol AND F.IDMember = PEMINJAMAN.IDMember AND F.Kondisi = 0 AND F.Deskripsi LIKE '%Belakang%') AS FotoBelakangSebelum,
            (SELECT TOP 1 F.Gambar FROM FOTO F WHERE F.Nopol = PEMINJAMAN.Nopol AND F.IDMember = PEMINJAMAN.IDMember AND F.Kondisi = 0 AND F.Deskripsi LIKE '%Kanan%') AS FotoKananSebelum,
            (SELECT TOP 1 F.Gambar FROM FOTO F WHERE F.Nopol = PEMINJAMAN.Nopol AND F.IDMember = PEMINJAMAN.IDMember AND F.Kondisi = 0 AND F.Deskripsi LIKE '%Kiri%') AS FotoKiriSebelum,

            -- SUBQUERY UTK AMBIL 4 FOTO SESUDAH SEWA (Kondisi = 1)
            (SELECT TOP 1 F.Gambar FROM FOTO F WHERE F.Nopol = PEMINJAMAN.Nopol AND F.IDMember = PEMINJAMAN.IDMember AND F.Kondisi = 1 AND F.Deskripsi LIKE '%Depan%') AS FotoDepanSesudah,
            (SELECT TOP 1 F.Gambar FROM FOTO F WHERE F.Nopol = PEMINJAMAN.Nopol AND F.IDMember = PEMINJAMAN.IDMember AND F.Kondisi = 1 AND F.Deskripsi LIKE '%Belakang%') AS FotoBelakangSesudah,
            (SELECT TOP 1 F.Gambar FROM FOTO F WHERE F.Nopol = PEMINJAMAN.Nopol AND F.IDMember = PEMINJAMAN.IDMember AND F.Kondisi = 1 AND F.Deskripsi LIKE '%Kanan%') AS FotoKananSesudah,
            (SELECT TOP 1 F.Gambar FROM FOTO F WHERE F.Nopol = PEMINJAMAN.Nopol AND F.IDMember = PEMINJAMAN.IDMember AND F.Kondisi = 1 AND F.Deskripsi LIKE '%Kiri%') AS FotoKiriSesudah

        FROM PEMINJAMAN
            JOIN MEMBER ON PEMINJAMAN.IDMember = MEMBER.IDUser 
            JOIN [USER] ON [USER].IDUser = MEMBER.IDUser 
            JOIN MOBIL ON PEMINJAMAN.Nopol = MOBIL.NOPOL 
            JOIN MEREK_MOBIL ON MOBIL.IDMerek = MEREK_MOBIL.IDMerek 
            JOIN CABANG ON MOBIL.IDCabang = CABANG.IDCabang
            JOIN TIPE_MOBIL ON MOBIL.IDTipe = TIPE_MOBIL.IDTipe 
        WHERE MOBIL.IDCabang = @IDCabangParam 
        ORDER BY 
            CASE 
                -- 1. Menunggu Verifikasi
                WHEN PEMINJAMAN.IDPegawai IS NULL THEN 1
                
                -- 2. Dipinjam / Ongoing 
                WHEN PEMINJAMAN.IDPegawai IS NOT NULL AND PEMINJAMAN.TanggalKembali IS NULL THEN 2
                
                -- 3. Selesai
                ELSE 3
            END ASC,
            PEMINJAMAN.TanggalPeminjaman DESC;
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

/**
 * Query Pop Up Pegawai (Konfirmasi, Tindakan)
 * Author: Pearce Nathaniel N.
 */
async function querySubmitKonfirmasi(idPegawaiAktif, nopol, idMember, tglPeminjaman, fotoDepan, fotoBelakang, fotoKanan, fotoKiri) {
    const pool = await getPool();
    const transaction = new sql.Transaction(pool);

    try {
        await transaction.begin();
        const request = new sql.Request(transaction);

        const cleanDate = new Date(tglPeminjaman).toISOString().split('T')[0];

        request.input('idPegawai', sql.Int, idPegawaiAktif);
        request.input('nopol', sql.VarChar, nopol)
        request.input('idMember', sql.Int, idMember)
        request.input('tglPeminjaman', sql.Date, cleanDate);

        const queryUpdate = `
            UPDATE PEMINJAMAN
            SET IDPegawai = @idPegawai
            WHERE Nopol = @nopol
            AND IDMember = @idMember
            AND TanggalPeminjaman = @tglPeminjaman;
            `;
        await request.query(queryUpdate);

        // Input Link Foto dari Param
        const fotoArray = [
            { url: fotoDepan, desc: 'Foto Depan Sebelum Sewa' },
            { url: fotoBelakang, desc: 'Foto Belakang Sebelum Sewa' },
            { url: fotoKanan, desc: 'Foto Kanan Sebelum Sewa' },
            { url: fotoKiri, desc: 'Foto Kiri Sebelum Sewa' }
        ];


        for (let i = 0; i < fotoArray.length; i++) {
            if (fotoArray[i].url) {

                const imgRequest = new sql.Request(transaction);
                imgRequest.input('idMember', sql.Int, idMember);
                imgRequest.input('idPegawai', sql.Int, idPegawaiAktif);
                imgRequest.input('nopol', sql.VarChar, nopol);
                imgRequest.input('gambar', sql.VarChar(2048), fotoArray[i].url);
                imgRequest.input('kondisi', sql.Bit, 0); // 0 = Sebelum
                imgRequest.input('deskripsi', sql.VarChar, fotoArray[i].desc);

                const queryInsertFoto = `
                    INSERT INTO FOTO (IDMember, IDPegawai, Nopol, Gambar, Kondisi, Deskripsi)
                    VALUES (@idMember, @idPegawai, @nopol, @gambar, @kondisi, @deskripsi);
                    `;
                await imgRequest.query(queryInsertFoto);
            }
            // } else {
            // console.log(`-> Foto indeks ke-${i} dilewati karena kosong/undefined.`);
        }

        await transaction.commit();
        return { success: true };
    } catch (error) {
        await transaction.rollback();
        throw error;
    }
}

router.post('/konfirmasi', async (req, res) => {
    const {
        nopol,
        idMember,
        tglPeminjaman,
        fotoDepan,
        fotoBelakang,
        fotoKanan,
        fotoKiri
    } = req.body;

    const idPegawaiAktif = req.session.idUser;
    // Validasi session proteksi
    if (!idPegawaiAktif) {
        return res.status(401).json({ success: false, message: "Sesi habis, silahkan login kembali." });
    }

    // Validasi data body
    if (!nopol || !idMember || !tglPeminjaman) {
        return res.status(400).json({ success: false, message: "Parameter transaksi tidak lengkap." });
    }

    try {
        const records = await querySubmitKonfirmasi(
            idPegawaiAktif,
            nopol,
            parseInt(idMember),
            tglPeminjaman,
            fotoDepan,
            fotoBelakang,
            fotoKanan,
            fotoKiri
        );
        return res.status(200).json({
            success: true,
            message: "Transaksi peminjaman berhasil dikonfirmasi ke status Ongoing."
        });
    } catch (error) {
        console.error("SQL Server Error [Konfirmasi]:", error);
        return res.status(500).json({
            success: false,
            message: "Gagal memperbarui database status peminjaman."
        });
    }
});


// Tindakan Pengembalian
async function querySubmitTindakan(nopol, idMember, tglPeminjaman, totalDenda, idPegawaiAktif, fotoDepan, fotoBelakang, fotoKanan, fotoKiri) {
    const pool = await getPool();
    const transaction = new sql.Transaction(pool);

    try {
        await transaction.begin();
        const request = new sql.Request(transaction);


        const cleanDatePeminjaman = new Date(tglPeminjaman).toISOString().split('T')[0];
        const cleanDateKembali = new Date().toISOString().split('T')[0];

        request.input('nopol', sql.VarChar, nopol);
        request.input('idMember', sql.Int, idMember);
        request.input('tglPeminjaman', sql.Date, cleanDatePeminjaman);
        request.input('tanggalKembali', sql.Date, cleanDateKembali);
        request.input('totalDenda', sql.Decimal(12, 2), totalDenda);

        const queryUpdatePeminjaman = `
                UPDATE PEMINJAMAN
                SET 
                    TanggalKembali = @tanggalKembali,
                    TotalDenda = @totalDenda
                WHERE Nopol = @nopol
                AND IDMember = @idMember
                AND TanggalPeminjaman = @tglPeminjaman;
                `;
        const updateResult = await request.query(queryUpdatePeminjaman);
        // console.log(`=== [DEBUG SQL TINDAKAN] Rows Affected: ${updateResult.rowsAffected[0]} ===`);

        const fotoArray = [
            { url: fotoDepan, desc: 'Foto Depan Sesudah Sewa' },
            { url: fotoBelakang, desc: 'Foto Belakang Sesudah Sewa' },
            { url: fotoKanan, desc: 'Foto Kanan Sesudah Sewa' },
            { url: fotoKiri, desc: 'Foto Kiri Sesudah Sewa' }
        ];

        for (let i = 0; i < fotoArray.length; i++) {
            if (fotoArray[i].url) {
                // console.log(`-> Mengeksekusi INSERT FOTO ke-${i}: ${fotoArray[i].desc}`);
                const imgRequest = new sql.Request(transaction);
                imgRequest.input('idMember', sql.Int, idMember);
                imgRequest.input('idPegawai', sql.Int, idPegawaiAktif);
                imgRequest.input('nopol', sql.VarChar, nopol);
                imgRequest.input('gambar', sql.VarChar(2048), fotoArray[i].url);
                imgRequest.input('kondisi', sql.Bit, 1); // 1 = Sesudah
                imgRequest.input('deskripsi', sql.Text, fotoArray[i].desc);

                const queryInsertFoto = `
                        INSERT INTO FOTO (IDMember, IDPegawai, Nopol, Gambar, Kondisi, Deskripsi)
                        VALUES (@idMember, @idPegawai, @nopol, @gambar, @kondisi, @deskripsi);
                        `;
                await imgRequest.query(queryInsertFoto);
            }
            // } else {
            //     console.log(`-> Foto indeks ke-${i} dilewati karena kosong/undefined.`);
            // }
        }

        await transaction.commit();
        return updateResult;

    } catch (error) {
        await transaction.rollback();
        throw error;
    }
}

router.post('/tindakan', async (req, res) => {
    const {
        nopol,
        idMember,
        tglPeminjaman,
        totalDenda,
        fotoDepan,
        fotoBelakang,
        fotoKanan,
        fotoKiri
    } = req.body;

    const idPegawaiAktif = req.session.idUser;

    if (!idPegawaiAktif) {
        return res.status(401).json({ success: false, message: "Sesi habis, silakan login kembali." });
    }
    if (!nopol || !idMember || !tglPeminjaman) {
        return res.status(400).json({ success: false, message: "Parameter tidak lengkap." });
    }

    try {

        // console.log("=== [DEBUG BACKEND RECEIVED] DATA MASUK ===");
        console.log(req.body);

        const result = await querySubmitTindakan(nopol, parseInt(idMember), tglPeminjaman, parseFloat(totalDenda) || 0, idPegawaiAktif, fotoDepan, fotoBelakang, fotoKanan, fotoKiri);

        // console.log("=== [DEBUG SQL RESULT] ROWS AFFECTED ===");
        // console.log(result.rowsAffected);

        return res.status(200).json({
            success: true,
            message: "Mobil berhasil dikembalikan dan denda dicatat!"
        });
    } catch (error) {
        console.error("SQL Server Error [Konfirmasi]:", error);
        return res.status(500).json({ success: false, message: "Gagal menyimpan data pengembalian ke SQL Server." });
    }
});

/**
 * Query Foto Sebelum & Sesudah di pop up peminjaman (Status = "Selesai")
 * Author: Pearce Nathaniel N.
 */

// Query
async function queryGetDetailFoto(nopol, idMember) {
    const pool = await getPool();
    try {
        const request = new sql.Request(pool);

        request.input('nopol', sql.VarChar(20), nopol);
        request.input('idMember', sql.Int, idMember);

        // Menarik Gambar dan Kondisi, diurutkan agar data Sebelum (0) keluar duluan baru data Sesudah (1)
        const querySelect = `
            SELECT Gambar, Kondisi, Deskripsi 
            FROM FOTO
            WHERE Nopol = @nopol AND IDMember = @idMember
            ORDER BY Kondisi ASC, IDFoto ASC;
        `;

        const result = await request.query(querySelect);
        return result.recordset;
    } catch (error) {
        throw error;
    }
}

// Router
router.get('/detail-foto', async (req, res) => {
    // Tangkap parameter nopol dan idMember yang di-pass dari URL Frontend (req.query)
    const { nopol, idMember } = req.query;
    const idPegawaiAktif = req.session.idUser;

    // Proteksi Session Keamanan Pegawai
    if (!idPegawaiAktif) {
        return res.status(401).json({ success: false, message: "Sesi habis, silakan login kembali." });
    }

    // Validasi Kelengkapan Parameter Query URL
    if (!nopol || !idMember) {
        return res.status(400).json({ success: false, message: "Parameter query (nopol/idMember) tidak lengkap." });
    }

    try {
        // Query data ke database
        const daftarFoto = await queryGetDetailFoto(nopol, parseInt(idMember));

        return res.status(200).json({
            success: true,
            data: daftarFoto
        });

    } catch (error) {
        // console.error di catch block dipertahankan untuk memantau jika koneksi mssql bermasalah
        console.error("SQL Server Error [Get Detail Foto]:", error);
        return res.status(500).json({
            success: false,
            message: "Gagal menarik data dokumentasi foto dari database SQL Server."
        });
    }
});

module.exports = router;