SELECT *
FROM [USER]
SELECT *
FROM PEGAWAI
SELECT *
FROM MEMBER
SELECT *
FROM EMAIL_USER

-- Delete rows from table 'TableName'
DELETE FROM [USER]
GO

-- Log In
SELECT EMAIL_USER.AlamatEmail, [USER].UserPassword
FROM [USER]
    INNER JOIN EMAIL_USER
    ON [USER].IDUser = EMAIL_USER.IDUser

-- Ubah user jadi pegawai dan cabang
-- UPDATE [USER]
-- SET Role = 2
-- WHERE IDUser = 1;

-- INSERT INTO CABANG(NamaCabang, NamaJalan)
-- VALUES('Cabang Citarum', 'Jl. Diporegoro No.22')

-- INSERT INTO PEGAWAI(IDUser, IDCabang)
-- VALUES(1, 1)

-- UPDATE TIPE_MOBIL
-- SET NamaTipe = 'EV'
-- WHERE IDTipe = 2;

UPDATE MEREK_MOBIL
SET NamaMerek = 'Tesla Model 3'
WHERE IDMerek = 2