


-- =======

-- =======================================
-- Query show all Peminjaman di Dashboard-Pegawai pada Cabangnya
-- =======================================

USE CarRentalDB
GO
-- Cari ID Cabang Pegawai yg login
SELECT IDCabang
        FROM PEGAWAI
        WHERE IDUser = 1

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
            JOIN MEREK_MOBIL ON MOBIL.IDMerek = MEREK_MOBIL.IDMerek -- Cari Nama Merek
        WHERE IDPegawai = 5 -- Mobil yang satu cabang dengan pegawai itu.


