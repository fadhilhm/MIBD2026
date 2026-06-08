


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

USE CarRentalDB;
GO

USE CarRentalDB;
GO

-- =========================================================================
-- MASTER RESET: BERSIHKAN DATA HINGGA AKAR (URUTAN RELASIONAL AMAN)
-- =========================================================================

-- 1. Hapus dari tabel FOTO (Tabel anak paling ujung)
DELETE FROM FOTO 
WHERE IDPegawai = 10 
   OR IDMember IN (11, 12, 13)
   OR Nopol IN ('D 1111 TST', 'B 2222 TST', 'D 3333 TST', 'D 911 TST', 'B 1000 EV', 'D 777 LBO');

-- 2. Hapus dari tabel PEMINJAMAN 
DELETE FROM PEMINJAMAN 
WHERE IDPegawai = 10 
   OR IDMember IN (11, 12, 13)
   OR Nopol IN ('D 1111 TST', 'B 2222 TST', 'D 3333 TST', 'D 911 TST', 'B 1000 EV', 'D 777 LBO');

-- 3. Hapus dari tabel MOBIL (Hanya tipe testing kita agar tidak mengganggu data asli Anda)
DELETE FROM MOBIL 
WHERE Nopol IN ('D 1111 TST', 'B 2222 TST', 'D 3333 TST', 'D 911 TST', 'B 1000 EV', 'D 777 LBO');

-- 4. Hapus dari tabel Sub-Class User
DELETE FROM MEMBER WHERE IDUser IN (11, 12, 13);
DELETE FROM PEGAWAI WHERE IDUser = 10;

-- 5. Hapus dari tabel [USER] Utama
DELETE FROM [USER] WHERE IDUser IN (10, 11, 12, 13);
GO

-- Paksa IDPegawai Arthur Dent menjadi NULL agar statusnya kembali ke "Menunggu Verifikasi"

-- =========================================================================
-- 2. SUNTIK / PASTIKAN DATA MASTER DASAR TERSEDIA (Aman dari Duplikasi)
-- =========================================================================

-- Cek dan Masukkan Tipe Mobil jika belum ada
IF NOT EXISTS (SELECT 1 FROM TIPE_MOBIL WHERE NamaTipe = 'SUV')   INSERT INTO TIPE_MOBIL (NamaTipe, Kapasitas) VALUES ('SUV', 7);
IF NOT EXISTS (SELECT 1 FROM TIPE_MOBIL WHERE NamaTipe = 'Sedan') INSERT INTO TIPE_MOBIL (NamaTipe, Kapasitas) VALUES ('Sedan', 5);

-- Cek dan Masukkan Merek Mobil jika belum ada
IF NOT EXISTS (SELECT 1 FROM MEREK_MOBIL WHERE NamaMerek = 'Toyota') INSERT INTO MEREK_MOBIL (NamaMerek) VALUES ('Toyota');
IF NOT EXISTS (SELECT 1 FROM MEREK_MOBIL WHERE NamaMerek = 'Honda')  INSERT INTO MEREK_MOBIL (NamaMerek) VALUES ('Honda');

-- Cek dan Masukkan Cabang Utama jika belum ada
IF NOT EXISTS (SELECT 1 FROM CABANG WHERE IDCabang = 1)
BEGIN
    SET IDENTITY_INSERT CABANG ON;
    INSERT INTO CABANG (IDCabang, NamaCabang, NamaJalan, AlamatEmail, NoTelp) 
    VALUES (1, 'Cabang Pusat Bandung', 'Jl. Merdeka No. 12', 'bandung@rental.com', '022-7890');
    SET IDENTITY_INSERT CABANG OFF;
END;
GO


-- =========================================================================
-- 3. SUNTIK POOL USER SECURITY (Pegawai ID 10 & Member ID 11, 12, 13)
-- =========================================================================
SET IDENTITY_INSERT [USER] ON;
INSERT INTO [USER] (IDUser, Nama, TanggalLahir, JenisKelamin, AlamatEmail, UserPassword, NomorTelp, [Role]) VALUES
(10, 'Steven (Pegawai Id 10)', '1998-05-05', 'Pria', 'steven@rental.com', '123', '081234', 1),
(11, 'Arthur Dent (TEST-KONFIRMASI)', '1990-01-01', 'Pria', 'arthur@galaxy.com', '42', '0811', 0),
(12, 'Bruce Banner (TEST-TINDAKAN)', '1980-02-02', 'Pria', 'hulk@avengers.com', 'smash', '0812', 0),
(13, 'Diana Prince (TEST-SELESAI)', '1985-03-03', 'Wanita', 'diana@themyscira.com', 'lasso', '0813', 0);
SET IDENTITY_INSERT [USER] OFF;

INSERT INTO PEGAWAI (IDUser, IDCabang) VALUES (10, 1);
INSERT INTO MEMBER (IDUser, NoSIM) VALUES (11, 'SIM-11'), (12, 'SIM-12'), (13, 'SIM-13');
GO


-- =========================================================================
-- 4. SUNTIK DATA MOBIL TESTING (Mengikat ID secara Dinamis)
-- =========================================================================
DECLARE @idSUV INT = (SELECT TOP 1 IDTipe FROM TIPE_MOBIL WHERE NamaTipe='SUV');
DECLARE @idSedan INT = (SELECT TOP 1 IDTipe FROM TIPE_MOBIL WHERE NamaTipe='Sedan');
DECLARE @idToyota INT = (SELECT TOP 1 IDMerek FROM MEREK_MOBIL WHERE NamaMerek='Toyota');
DECLARE @idHonda INT = (SELECT TOP 1 IDMerek FROM MEREK_MOBIL WHERE NamaMerek='Honda');

INSERT INTO MOBIL (Nopol, IDTipe, IDMerek, HargaSewaMobil, TahunPembuatan, IDCabang) VALUES
('D 1111 TST', @idSUV, @idToyota, 400000, 2023, 1),
('B 2222 TST', @idSedan, @idHonda, 500000, 2024, 1),
('D 3333 TST', @idSUV, @idToyota, 450000, 2024, 1);
GO


-- =========================================================================
-- 5. SUNTIK DATA PEMINJAMAN UTAMA & DATA HISTORIS FOTO
-- =========================================================================

-- 🟡 Skenario 1: Arthur Dent -> Status "Menunggu Verifikasi" (Tombol Kuning "Konfirmasi")
INSERT INTO PEMINJAMAN (IDMember, Nopol, IDPegawai, TanggalPeminjaman, TanggalKembali, TanggalBatasPengembalian, TotalBiaya, TotalDenda)
VALUES (11, 'D 1111 TST', 10, '2026-06-08', NULL, '2026-06-12', 1600000, 0);

-- 🔵 Skenario 2: Bruce Banner -> Status "Dipinjam" (Tombol Biru "Tindakan")
INSERT INTO PEMINJAMAN (IDMember, Nopol, IDPegawai, TanggalPeminjaman, TanggalKembali, TanggalBatasPengembalian, TotalBiaya, TotalDenda)
VALUES (12, 'B 2222 TST', 10, '2026-06-01', NULL, '2026-06-05', 2000000, 0);

-- 🟢 Skenario 3: Diana Prince -> Status "Selesai" (Label Hijau "✓ Selesai")
INSERT INTO PEMINJAMAN (IDMember, Nopol, IDPegawai, TanggalPeminjaman, TanggalKembali, TanggalBatasPengembalian, TotalBiaya, TotalDenda)
VALUES (13, 'D 3333 TST', 10, '2026-05-20', '2026-05-24', '2026-05-23', 2250000, 450000);

-- Hubungkan data bukti gambar multivalue historis milik Diana Prince ke tabel FOTO
INSERT INTO FOTO (IDMember, IDPegawai, Nopol, Gambar, Kondisi, Deskripsi) VALUES
(13, 10, 'D 3333 TST', 'https://images.unsplash.com/photo-1549399542-7e3f8b79c341?w=600', 0, 'Foto Depan Sebelum Sewa (Diana)'),
(13, 10, 'D 3333 TST', 'https://images.unsplash.com/photo-1552519507-da3b142c6e3d?w=600', 1, 'Foto Depan Sesudah Sewa (Diana)');
GO


-- =========================================================================
-- CEK HASIL AKHIR PENYUNTIKAN DATA
-- =========================================================================
SELECT 'PEMINJAMAN RECORDS' AS TableName, p.Nopol, u.Nama AS NamaMember, p.IDPegawai, p.TotalDenda 
FROM PEMINJAMAN p INNER JOIN [USER] u ON p.IDMember = u.IDUser
WHERE p.Nopol IN ('D 1111 TST', 'B 2222 TST', 'D 3333 TST');

SELECT 'DOKUMEN FOTO MULTIVALUE' AS TableName, IDFoto, Nopol, Kondisi, Gambar, Deskripsi 
FROM FOTO WHERE Nopol IN ('D 1111 TST', 'B 2222 TST', 'D 3333 TST');


UPDATE PEMINJAMAN
SET IDPegawai = 5
WHERE IDMember = 11 AND Nopol = 'D 1111 TST';
GO