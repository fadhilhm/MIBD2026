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

<<<<<<< HEAD
-- UPDATE MEREK_MOBIL
-- SET NamaMerek = 'Tesla Model 3'
-- WHERE IDMerek = 2

-- SELECT * FROM CABANG
-- SELECT * FROM [User]
-- SELECT * FROM Pegawai
-- SELECT * FROM EMAIL_USER
-- SELECT * FROM MOBIL

-- ALTER TABLE MOBIL
-- ADD IDCabang INT FOREIGN KEY REFERENCES Cabang(IDCabang) 

-- ALTER TABLE MOBIL
-- ALTER COLUMN 
-- 	IDCabang INT NOT NULL

-- UPDATE Mobil
-- SET IDCabang = 1
-- WHERE Nopol = 'BE 1234 E'


-- DELETE FROM MOBIL
=======
INSERT INTO [USER] (Nama, TanggalLahir, JenisKelamin, UserPassword, [Role])
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
    (1, '1234567890123456'),
    (2, '1234567890654321')
>>>>>>> b27b03f8a6ddbce40338dd64da3f6670d07c6e58
