


-- =======

-- =======================================
-- Query show all Peminjaman di Dashboard-Pegawai pada Cabangnya
-- =======================================

USE CarRentalDB
GO
-- Cari ID Cabang Pegawai yg login
SELECT IDCabang
FROM PEGAWAI
WHERE IDUser = @IDPegawaiParam

-- Cari Data untuk dashboard Pegawai di Cabangnya 
SELECT [USER].Nama,
    MEREK_MOBIL.NamaMerek,
    PEMINJAMAN.Nopol,
    PEMINJAMAN.TanggalPeminjaman,
    PEMINJAMAN.TanggalBatasPengembalian,
    PEMINJAMAN.TanggalKembali,
    PEMINJAMAN.TotalBiaya,
    PEMINJAMAN.PersentaseDenda,
    PEMINJAMAN.IDPegawai
FROM PEMINJAMAN
    JOIN MEMBER ON PEMINJAMAN.IDMember = MEMBER.IDUser -- Cari idMember utk Nama
    JOIN [USER] ON [USER].IDUser = MEMBER.IDUser -- Cari Nama User
    JOIN MOBIL ON PEMINJAMAN.Nopol = MOBIL.NOPOL -- Cari idMobiil utk Nama Merek
    JOIN MEREK_MOBIL ON MOBIL.IDMerek = MEREK_MOBIL.IDMerek
-- Cari Nama Merek
WHERE PEGAWAI.IDCabang = @IDCabangParam
-- Mobil yang satu cabang dengan pegawai itu.


-- =======================================
-- Query Pop Up pegawai
-- =======================================

-- Query dijalankan saat tombol "Konfirmasi" di dalam pop-up disetujui (Menunggu Verifikasi" => "Ongoing")
UPDATE Peminjaman
        SET 
            IDPegawai = @idPegawai,
            FotoDepanSebelum = @fotoDepan,
            FotoBelakangSebelum = @fotoBelakang,
            FotoKananSebelum = @fotoKanan,
            FotoKiriSebelum = @fotoKiri
        WHERE Nopol = @nopol
          AND IDMember = @idMember
          AND TanggalPeminjaman = @tglPeminjaman;

-- Query dijalankan saat form pengembalian mobil disimpan ("Ongoing" => "Selesai")
UPDATE Peminjaman
SET 
    TanggalKembali = @tanggalKembaliHariIni,
    TotalDenda = @totalDendaMurniRupiah
WHERE 
    Nopol = @nopol
    AND IDMember = @idMember
    AND TanggalPeminjaman = @tglPeminjaman;




USE CarRentalDB;
GO

-- TEST AJA

USE CarRentalDB;
GO

-- =========================================================================
-- TAHAP 1: BERSIHKAN DATA LAMA
-- =========================================================================
DELETE FROM FOTO;
DELETE FROM PEMINJAMAN;
DELETE FROM PEGAWAI;
DELETE FROM MEMBER;
DELETE FROM MOBIL;
DELETE FROM CABANG;
DELETE FROM [USER];
DELETE FROM TIPE_MOBIL;
DELETE FROM MEREK_MOBIL;
GO

-- =========================================================================
-- TAHAP 2: INSERT USER (ID 5 DITETAPKAN UNTUK SISTEM VENDOR)
-- =========================================================================
SET IDENTITY_INSERT [USER] ON;

INSERT INTO [USER] (IDUser, Nama, TanggalLahir, JenisKelamin, AlamatEmail, UserPassword, NomorTelp, [Role]) VALUES 
(1, 'Pearce Nathaniel', '2005-01-01', 'Laki-laki', 'pearce@rental.com', 'pass123', '08123456789', 1), -- 1 = Pegawai Riil
(2, 'Stephanie Eunike', '2005-03-15', 'Perempuan', 'stephanie@member.com', 'pass123', '08987654321', 0), -- 0 = Member
(5, 'Sistem Dummy Verif', '2000-01-01', 'Laki-laki', 'system@rental.com', 'pass123', '000', 1);       -- 🟢 REVISI: ID 5 Akun Sistem

SET IDENTITY_INSERT [USER] OFF;

-- =========================================================================
-- TAHAP 3: INSERT MASTER DATA KANDUNGAN
-- =========================================================================
INSERT INTO CABANG (NamaCabang, NamaJalan, AlamatEmail, NoTelp) VALUES 
('Unpar Central', 'Jl. Ciumbuleuit No. 94', 'unpar@rental.com', '022-123456');

DECLARE @idCabang INT;
SELECT TOP 1 @idCabang = IDCabang FROM CABANG WHERE NamaCabang = 'Unpar Central';

-- Ikat Pegawai ke Cabang
INSERT INTO PEGAWAI (IDUser, IDCabang) VALUES (1, @idCabang);
INSERT INTO PEGAWAI (IDUser, IDCabang) VALUES (5, @idCabang); -- 🟢 Mengikat ID 5

-- Isi Data Member & Mobil
INSERT INTO MEMBER (IDUser, NoSIM) VALUES (2, 'SIM-999888777');

SET IDENTITY_INSERT MEREK_MOBIL ON;
INSERT INTO MEREK_MOBIL (IDMerek, NamaMerek) VALUES (1, 'Toyota Avanza');
SET IDENTITY_INSERT MEREK_MOBIL OFF;

SET IDENTITY_INSERT TIPE_MOBIL ON;
INSERT INTO TIPE_MOBIL (IDTipe, NamaTipe, Kapasitas) VALUES (1, 'MPV', 7);
SET IDENTITY_INSERT TIPE_MOBIL OFF;

INSERT INTO MOBIL (Nopol, IDTipe, IDMerek, HargaSewaMobil, TahunPembuatan, IDCabang, isActive) VALUES 
('D 1234 ABC', 1, 1, 500000.00, 2022, @idCabang, 1),
('D 5678 DEF', 1, 1, 500000.00, 2023, @idCabang, 1),
('D 9999 XYZ', 1, 1, 500000.00, 2021, @idCabang, 1);
GO

-- =========================================================================
-- TAHAP 4: INSERT DATA PEMINJAMAN (LOGIKA STATUS FIX)
-- =========================================================================

-- KASUS 1: MENUNGGU VERIFIKASI (Kuning) -> Diikat ke IDPegawai = 5
INSERT INTO PEMINJAMAN (IDMember, Nopol, IDPegawai, TanggalPeminjaman, TanggalKembali, TanggalBatasPengembalian, TotalBiaya, TotalDenda) VALUES 
(2, 'D 1234 ABC', 5, '2026-06-08', NULL, '2026-06-10', 1000000.00, 0.00);

-- KASUS 2: ONGOING & TELAT (Biru) -> Diurus Pearce (ID 1)
INSERT INTO PEMINJAMAN (IDMember, Nopol, IDPegawai, TanggalPeminjaman, TanggalKembali, TanggalBatasPengembalian, TotalBiaya, TotalDenda) VALUES 
(2, 'D 5678 DEF', 1, '2026-06-01', NULL, '2026-06-05', 2000000.00, 0.00);

-- KASUS 3: SELESAI & HISTORI DENDA (Hijau) -> Diurus Pearce (ID 1)
INSERT INTO PEMINJAMAN (IDMember, Nopol, IDPegawai, TanggalPeminjaman, TanggalKembali, TanggalBatasPengembalian, TotalBiaya, TotalDenda) VALUES 
(2, 'D 9999 XYZ', 1, '2026-06-04', '2026-06-08', '2026-06-06', 1100000.00, 100000.00);
GO

-- =========================================================================
-- TAHAP 5: DATA FOTO PENDUKUNG
-- =========================================================================
INSERT INTO FOTO (IDMember, IDPegawai, Nopol, Gambar, Kondisi, Deskripsi) VALUES 
(2, 1, 'D 9999 XYZ', 'https://yes.com/depan-sebelum.png', 0, 'Foto Depan Sebelum'),
(2, 1, 'D 9999 XYZ', 'https://yes.com/belakang-sebelum.png', 0, 'Foto Belakang Sebelum'),
(2, 1, 'D 9999 XYZ', 'https://yes.com/kanan-sebelum.png', 0, 'Foto Kanan Sebelum'),
(2, 1, 'D 9999 XYZ', 'https://yes.com/kiri-sebelum.png', 0, 'Foto Kiri Sebelum'),
(2, 1, 'D 9999 XYZ', 'https://yes.com/depan-sesudah.png', 1, 'Foto Depan Sesudah'),
(2, 1, 'D 9999 XYZ', 'https://yes.com/belakang-sesudah.png', 1, 'Foto Belakang Sesudah'),
(2, 1, 'D 9999 XYZ', 'https://yes.com/kanan-sesudah.png', 1, 'Foto Kanan Sesudah'),
(2, 1, 'D 9999 XYZ', 'https://yes.com/kiri-sesudah.png', 1, 'Foto Kiri Sesudah');
GO