SELECT *FROM [USER]
SELECT *FROM PEGAWAI
SELECT *FROM [MEMBER]
SELECT *FROM MOBIL
SELECT * FROM CABANG
SELECT * FROM Merek_mobil
SELECT * FROM Foto
SELECT * FROM Peminjaman
SELECT * FROM Tipe_Mobil

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