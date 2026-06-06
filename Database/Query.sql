


-- =======

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
    PEMINJAMAN.TanggalKembali
-- PEMINJAMAN.TotalBiaya + (PEMINJAMAN.TotalBiaya * PEMINJAMAN.PersentaseDenda /100.0) AS TotalBiayaPlusDenda
    PEMINJAMAN.TanggalKembali,
    PEMINJAMAN.TotalBiaya + (PEMINJAMAN.TotalBiaya * PEMINJAMAN.PersentaseDenda /100.0) AS TotalBiayaPlusDenda
FROM PEMINJAMAN
    JOIN MEMBER ON PEMINJAMAN.IDMember = MEMBER.IDUser -- Cari idMember utk Nama
    JOIN [USER] ON [USER].IDUser = MEMBER.IDUser -- Cari Nama User
    JOIN MOBIL ON PEMINJAMAN.Nopol = MOBIL.NOPOL -- Cari idMobiil utk Nama Merek
    JOIN MEREK_MOBIL ON MOBIL.IDMerek = MEREK_MOBIL.IDMerek -- Cari Nama Merek
    JOIN PEGAWAI ON PEGAWAI.IDCabang = MOBIL.IDCabang
WHERE PEGAWAI.IDCabang = MOBIL.IDCabang
GO


