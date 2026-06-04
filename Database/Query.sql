SELECT *
FROM [USER]
SELECT *
FROM PEGAWAI
SELECT *
FROM MEMBER
SELECT *
FROM EMAIL_USER
SELECT *
FROM MOBIL
SELECT *
FROM CABANG

-- Delete rows from table 'TableName'
DELETE FROM [USER]
GO

-- Log In
SELECT EMAIL_USER.AlamatEmail, [USER].UserPassword
FROM [USER]
    INNER JOIN EMAIL_USER
    ON [USER].IDUser = EMAIL_USER.IDUser

-- Dummy Data
-- DROP DB dulu
USE master;
GO

ALTER DATABASE CarRentalDB 
SET SINGLE_USER 
WITH ROLLBACK IMMEDIATE;
GO

DROP DATABASE CarRentalDB;
GO

-- run CarRental_MIBD.sql, kemudian kasih login adminTester OWNER
USE CarRentalDB;
GO

INSERT INTO [USER]
    (Nama, TanggalLahir, JenisKelamin, UserPassword, [Role])
VALUES
    -- user
    ('Fadhil', '20200112', 'M', 'fadhil', 1),
    ('Pearce', '20200412', 'M', 'pearce', 1),
    -- admin
    ('Steven', '20200212', 'M', 'steven', 2),
    ('Kenneth', '20200312', 'M', 'kenneth', 2);

INSERT INTO CABANG
    (NamaCabang, NamaJalan)
VALUES
    ('Cabang Citarum', 'Jl. Diporogero No. 22')

INSERT INTO PEGAWAI
    (IDUser, IDCabang)
VALUES
    (24, 8),
    (25, 8)

INSERT INTO EMAIL_USER
    (IDUser, AlamatEmail)
VALUES
    (22, 'fadhil@gmail.com'),
    (23, 'pearce@gmail.com'),
    (24, 'steven@gmail.com'),
    (25, 'kenneth@gmail.com')

INSERT INTO MEMBER
    (IDUser, NoSIM)
VALUES
    (22, '1234567890123456'),
    (23, '1234567890654321')


-- =======================================
-- Query show all Peminjaman di Dashboard-Pegawai pada Cabangnya
-- =======================================

USE CarRentalDB
GO

SELECT [USER].Nama,
    MEREK_MOBIL.NamaMerek,
    PEMINJAMAN.Nopol,
    PEMINJAMAN.TanggalPeminjaman,
    PEMINJAMAN.TanggalBatasPengembalian,
    PEMINJAMAN.TanggalKembali,
    PEMINJAMAN.TotalBiaya + (PEMINJAMAN.TotalBiaya * PEMINJAMAN.PersentaseDenda /100.0) AS TotalBiayaPlusDenda

FROM PEMINJAMAN
    JOIN MEMBER ON PEMINJAMAN.IDMember = MEMBER.IDUser
    JOIN MOBIL ON PEMINJAMAN.Nopol = MOBIL.NOPOL
    JOIN MEREK_MOBIL ON MOBIL.IDMerek = MEREK_MOBIL.IDMerek
    JOIN [USER] ON [USER].IDUser = MEMBER.IDUser
WHERE PEMINJAMAN.IDPegawai IN (
    SELECT PEGAWAI.IDUser
FROM PEGAWAI JOIN CABANG ON PEGAWAI.IDCabang = CABANG.IDCabang
WHERE CABANG.NamaCabang = 'Cabang Citarum');
GO


-- ========================================================
-- 1. INSERT DUMMY DATA CABANG (Otomatis IDCabang = 1)
-- ========================================================

USE CarRentalDB;
GO
INSERT INTO CABANG (NamaCabang, NamaJalan)
VALUES ('Cabang Citarum', 'Jl. Diponegoro No. 22');
GO

-- ========================================================
-- 2. INSERT DATA MASTER USER (Otomatis IDUser = 1 sampai 5)
-- ========================================================
INSERT INTO [USER] (Nama, TanggalLahir, JenisKelamin, UserPassword, [Role])
VALUES
    ('Fadhil', '2020-01-12', 'M', 'fadhil', 1),                -- IDUser = 1 (Member)
    ('Pearce', '2020-04-12', 'M', 'pearce', 1),                -- IDUser = 2 (Member)
    ('Steven', '2020-02-12', 'M', 'steven', 2),                -- IDUser = 3 (Pegawai/Admin)
    ('Kenneth', '2020-03-12', 'M', 'kenneth', 2),              -- IDUser = 4 (Pegawai/Admin)
    ('SISTEM AUTOMATION', '2026-01-01', 'M', 'sys_pass', 2);   -- IDUser = 5 (Dummy PK / Sistem)
GO

-- ========================================================
-- 3. INSERT DATA SUBTYPE & MULTIVALUED USER
-- ========================================================
-- Hubungkan ke PEGAWAI (Terikat ke Cabang Citarum ID = 1)
INSERT INTO PEGAWAI (IDUser, IDCabang)
VALUES 
    (3, 1), -- Steven
    (4, 1), -- Kenneth
    (5, 1); -- Akun Sistem

-- Hubungkan ke MEMBER
INSERT INTO MEMBER (IDUser, NoSIM)
VALUES
    (1, '1234567890123456'), -- Fadhil
    (2, '1234567890654321'); -- Pearce

-- Hubungkan ke EMAIL_USER (IDEmail otomatis increment dari 1 untuk setiap baris)
INSERT INTO EMAIL_USER (IDUser, AlamatEmail)
VALUES
    (1, 'fadhil@gmail.com'),
    (2, 'pearce@gmail.com'),
    (3, 'steven@gmail.com'),
    (4, 'kenneth@gmail.com');

-- Hubungkan ke NOTELP_USER
INSERT INTO NOTELP_USER (IDUser, NomorTelp)
VALUES
    (1, '081234567890'),
    (2, '081298765432'),
    (3, '081311223344'),
    (4, '081355667788');
GO

-- ========================================================
-- 4. INSERT ATRIBUT MULTIVALUED CABANG (IDCabang = 1)
-- ========================================================
INSERT INTO EMAIL_CABANG (IDCabang, AlamatEmail)
VALUES (1, 'citarum@carrental.com');

INSERT INTO NOTELP_CABANG (IDCabang, NomorTelp)
VALUES (1, '(022) 4201234');
GO

-- ========================================================
-- 5. INSERT MASTER SPESIFIKASI MOBIL (Identity Reset ke 1)
-- ========================================================
INSERT INTO TIPE_MOBIL (NamaTipe, Kapasitas) 
VALUES ('MPV', 7), ('Sedan', 5); -- IDTipe = 1 (MPV), IDTipe = 2 (Sedan)

INSERT INTO MEREK_MOBIL (NamaMerek) 
VALUES ('Toyota'), ('Honda');   -- IDMerek = 1 (Toyota), IDMerek = 2 (Honda)
GO

-- ========================================================
-- 6. INSERT DATA MOBIL FISIK
-- ========================================================
INSERT INTO MOBIL (Nopol, IDTipe, IDMerek, HargaSewaMobil, TahunPembuatan, IDCabang)
VALUES 
    ('D 1234 AB', 1, 1, 300000.00, 2022, 1),  -- Avanza (MPV Toyota)
    ('D 5678 XYZ', 2, 2, 500000.00, 2023, 1); -- Civic (Sedan Honda)
GO

-- ========================================================
-- 7. INSERT DATA TRANSAKSI PEMINJAMAN (MURNI DATE 'YYYY-MM-DD')
-- ========================================================

-- Skenario 1: Status 'Dikembalikan' & Tepat Waktu
-- Fadhil (1) sewa Avanza, di-handle Steven (3). Kembali tepat waktu.
INSERT INTO PEMINJAMAN (IDMember, Nopol, IDPegawai, TanggalPeminjaman, TanggalBatasPengembalian, TanggalKembali, TotalBiaya, PersentaseDenda)
VALUES (1, 'D 1234 AB', 3, '2026-05-10', '2026-05-13', '2026-05-13', 900000.00, 10.00);

-- Skenario 2: Status 'Dikembalikan' Tapi Terlambat (Kena Denda)
-- Pearce (2) sewa Civic, di-handle Kenneth (4). Batas tgl 15 Mei, kembali tgl 16 Mei.
INSERT INTO PEMINJAMAN (IDMember, Nopol, IDPegawai, TanggalPeminjaman, TanggalBatasPengembalian, TanggalKembali, TotalBiaya, PersentaseDenda)
VALUES (2, 'D 5678 XYZ', 4, '2026-05-12', '2026-05-15', '2026-05-16', 1500000.00, 10.00);

-- Skenario 3: Status 'Menunggu Konfirmasi' (Booking Online Terbuka)
-- Fadhil (1) booking Civic melalui web. Tertempel sementara ke Akun Sistem (5). TanggalKembali NULL.
INSERT INTO PEMINJAMAN (IDMember, Nopol, IDPegawai, TanggalPeminjaman, TanggalBatasPengembalian, TanggalKembali, TotalBiaya, PersentaseDenda)
VALUES (1, 'D 5678 XYZ', 5, '2026-06-02', '2026-06-05', NULL, 1500000.00, 10.00);

-- Skenario 4: Status 'Berjalan' (Mobil Sedang Digunakan)
-- Pearce (2) sewa Avanza, sudah di-approve oleh Steven (3) namun belum dikembalikan.
INSERT INTO PEMINJAMAN (IDMember, Nopol, IDPegawai, TanggalPeminjaman, TanggalBatasPengembalian, TanggalKembali, TotalBiaya, PersentaseDenda)
VALUES (2, 'D 1234 AB', 3, '2026-06-01', '2026-06-04', NULL, 900000.00, 10.00);
GO

-- ========================================================
-- 8. INSERT DATA FOTO KONDISI MOBIL (Opsional)
-- ========================================================
INSERT INTO FOTO (IDMember, IDPegawai, Nopol, Gambar, Deskripsi)
VALUES (1, 3, 'D 1234 AB', '/images/avanza_front.jpg', 'Kondisi bumper depan mulus saat penyerahan awal.');
GO

PRINT 'Seluruh data tiruan baru berhasil dimasukkan ke dalam 13 tabel secara berurutan!';
GO

-- ========================================================
-- CLEANUP TOTAL UNTUK SELURUH 13 TABEL DALAM DATABASE
-- ========================================================

-- 1. HAPUS DATA TABEL ANAK / KETERGANTUNGAN TERBAWAH
DELETE FROM FOTO;
DELETE FROM PEMINJAMAN;

-- 2. HAPUS DATA TABEL MOBIL 
-- (Harus dihapus sebelum TIPE_MOBIL dan MEREK_MOBIL karena memegang Foreign Key)
DELETE FROM MOBIL;

-- 3. HAPUS DATA MASTER SPESIFIKASI MOBIL
DELETE FROM TIPE_MOBIL;
DELETE FROM MEREK_MOBIL;

-- 4. HAPUS DATA ATRIBUT MULTIVALUED USER & CABANG
DELETE FROM EMAIL_USER;
DELETE FROM NOTELP_USER;
DELETE FROM EMAIL_CABANG;
DELETE FROM NOTELP_CABANG;

-- 5. HAPUS DATA ENTITAS SUBTYPE (ISA INHERITANCE)
DELETE FROM MEMBER;
DELETE FROM PEGAWAI;

-- 6. HAPUS DATA ENTITAS INDUK UTAMA (Level Teratas)
DELETE FROM [USER];
DELETE FROM CABANG;


-- ========================================================
-- RESET SEMUA COUNTER IDENTITY (KEMBALI KE AWAL / SEBELUM ID 1)
-- ========================================================
-- Menggunakan RESEED ke 0 agar baris data baru berikutnya otomatis mulai dari ID 1

DBCC CHECKIDENT ('TIPE_MOBIL', RESEED, 0);
DBCC CHECKIDENT ('MEREK_MOBIL', RESEED, 0);
DBCC CHECKIDENT ('[USER]', RESEED, 0);
DBCC CHECKIDENT ('CABANG', RESEED, 0);
DBCC CHECKIDENT ('FOTO', RESEED, 0);

-- Reset untuk tabel dengan Composite Primary Key + Identity
DBCC CHECKIDENT ('EMAIL_USER', RESEED, 0);
DBCC CHECKIDENT ('NOTELP_USER', RESEED, 0);
DBCC CHECKIDENT ('EMAIL_CABANG', RESEED, 0);
DBCC CHECKIDENT ('NOTELP_CABANG', RESEED, 0);

PRINT 'Seluruh 13 tabel dalam CarRentalDB berhasil dikosongkan dan di-reset total!';
GO