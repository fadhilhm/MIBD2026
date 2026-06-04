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

INSERT INTO [USER] (Nama, TanggalLahir, JenisKelamin, UserPassword, [Role])
VALUES 
    -- user
    ('Fadhil', '20200112', 'M', 'fadhil', 1), 
    ('Pearce', '20200412', 'M', 'pearce', 1),
    -- admin
    ('Steven', '20200212', 'M', 'steven', 2), 
    ('Kenneth', '20200312', 'M', 'kenneth', 2);

INSERT INTO CABANG (NamaCabang, NamaJalan)
VALUES
    ('Cabang Citarum', 'Jl. Diporogero No. 22')

INSERT INTO PEGAWAI (IDUser, IDCabang)
VALUES
    (3, 1),
    (4, 1)

INSERT INTO EMAIL_USER(IDUser, AlamatEmail)
VALUES
    (1, 'fadhil@gmail.com'),
    (2, 'pearce@gmail.com'),
    (3, 'steven@gmail.com'),
    (4, 'kenneth@gmail.com')

INSERT INTO MEMBER (IDUser, NoSIM)
VALUES 
    (1, '1234567890123456'),
    (2, '1234567890654321')