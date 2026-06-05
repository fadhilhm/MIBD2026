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


-- Dummy Data Cabang
INSERT INTO CABANG (NamaCabang, NamaJalan, AlamatEmail)
VALUES 
    ('Cabang Citarum', 'Jl. Diponegoro No. 22', 'citarum@carrental.com'),
    ('Cabang Dago', 'Jl. Ir. H. Juanda No. 102', 'dago@carrental.com'),
    ('Cabang Riau', 'Jl. R.E. Martadinata No. 57', 'riau@carrental.com'),
    ('Cabang Cihampelas', 'Jl. Cihampelas No. 160', 'cihampelas@carrental.com'),
    ('Cabang Buah Batu', 'Jl. Buah Batu No. 235', 'buahbatu@carrental.com')

INSERT INTO NOTELP_CABANG (IDCabang, NomorTelp)
VALUES 
    (1, '0224201234'),
    (2, '0224234567'),
    (3, '0227209812'),
    (4, '0222015544'),
    (5, '0225408899')

-- Dummy Data User
INSERT INTO [USER] (Nama, TanggalLahir, JenisKelamin, AlamatEmail, UserPassword, NomorTelp, [Role])
VALUES
    ('Fadhil', '2020-01-12', 'M', 'fadhil@gmail.com', 'fadhil', '081122334455', 1),                
    ('Pearce', '2020-04-12', 'M', 'pearce@gmail.com', 'pearce', '081955556666', 1),                
    ('Steven', '2020-02-12', 'M', 'steven@gmail.com', 'steven', '082198761234', 2),                
    ('Kenneth', '2020-03-12', 'M', 'kenneth@gmail.com', 'kenneth', '085711223344', 2),              
    ('SISTEM AUTOMATION', '2026-01-01', 'M', 'sys@test', 'test', '089677889900', 2); 

INSERT INTO PEGAWAI (IDUser, IDCabang)
VALUES 
    (3, 1), -- Steven
    (4, 1), -- Kenneth
    (5, 1); -- Akun Sistem

INSERT INTO MEMBER (IDUser, NoSIM)
VALUES
    (1, '1234567890123456'), -- Fadhil
    (2, '1234567890654321'); -- Pearce

-- Dummy Data Mobil
INSERT INTO TIPE_MOBIL (NamaTipe, Kapasitas) 
VALUES 
    ('MPV', 7),
    ('Sedan', 5),
    ('SUV', 7),
    ('EV', 5),
    ('City Car', 5);

INSERT INTO MEREK_MOBIL (NamaMerek) 
VALUES 
    ('Honda Brio'),
    ('Mitsubishi Xpander'),
    ('Suzuki Ertiga'),
    ('Daihatsu Sigra'),
    ('Hyundai Stargazer');

INSERT INTO MOBIL (Nopol, IDTipe, IDMerek, HargaSewaMobil, TahunPembuatan, IDCabang)
VALUES 
    -- Honda Brio (City Car, 5 Kursi)
    ('D 1234 ABC', 5, 1, 350000, 2022, 1), 
    
    -- Mitsubishi Xpander (MPV, 7 Kursi)
    ('D 8888 XYZ', 1, 2, 550000, 2023, 2), 
    
    -- Suzuki Ertiga (MPV, 7 Kursi)
    ('D 4567 EFG', 1, 3, 500000, 2021, 3), 
    
    -- Daihatsu Sigra (MPV/LCGC, 7 Kursi tapi di sini kita pasangkan ke MPV)
    ('D 2910 OPQ', 1, 4, 300000, 2022, 4), 

    -- Hyundai Stargazer (MPV, 7 Kursi)
    ('D 7117 VST', 1, 5, 600000, 2024, 5);

--