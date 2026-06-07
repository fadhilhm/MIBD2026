USE CarRentalDB;
GO

-- 1. Dummy Data Master

-- Dummy Data Cabang
INSERT INTO CABANG
    (NamaCabang, NamaJalan, AlamatEmail, NoTelp)
VALUES
    ('Cabang Citarum', 'Jl. Diponegoro No. 22', 'citarum@carrental.com', '0224201234'),
    ('Cabang Dago', 'Jl. Ir. H. Juanda No. 102', 'dago@carrental.com', '0224234567'),
    ('Cabang Riau', 'Jl. R.E. Martadinata No. 57', 'riau@carrental.com', '0227209812'),
    ('Cabang Cihampelas', 'Jl. Cihampelas No. 160', 'cihampelas@carrental.com', '0222015544'),
    ('Cabang Buah Batu', 'Jl. Buah Batu No. 235', 'buahbatu@carrental.com', '0225408899')

-- Dummy Data User
INSERT INTO [USER]
    (Nama, TanggalLahir, JenisKelamin, AlamatEmail, UserPassword, NomorTelp, [Role])
VALUES
    ('Fadhil', '2020-01-12', 'M', 'fadhil@gmail.com', 'fadhil', '081122334455', 0),
    ('Pearce', '2020-04-12', 'M', 'pearce@gmail.com', 'pearce', '081955556666', 0),
    ('Steven', '2020-02-12', 'M', 'steven@gmail.com', 'steven', '082198761234', 1),
    ('Kenneth', '2020-03-12', 'M', 'kenneth@gmail.com', 'kenneth', '085711223344', 1),
    ('SISTEM AUTOMATION', '2026-01-01', 'M', 'sys@test', 'test', '089677889900', 1);

INSERT INTO PEGAWAI
    (IDUser, IDCabang)
VALUES
    (3, 1),
    -- Steven
    (4, 1),
    -- Kenneth
    (5, 1);
-- Akun Sistem

INSERT INTO MEMBER
    (IDUser, NoSIM)
VALUES
    (1, '1234567890123456'),
    -- Fadhil
    (2, '1234567890654321');
-- Pearce

-- Dummy Data Mobil
INSERT INTO TIPE_MOBIL
    (NamaTipe, Kapasitas)
VALUES
    ('MPV', 7),
    ('Sedan', 5),
    ('SUV', 7),
    ('EV', 5),
    ('City Car', 5);

INSERT INTO MEREK_MOBIL
    (NamaMerek)
VALUES
    ('Honda Brio'),
    ('Mitsubishi Xpander'),
    ('Suzuki Ertiga'),
    ('Daihatsu Sigra'),
    ('Hyundai Stargazer');

INSERT INTO MOBIL
    (Nopol, IDTipe, IDMerek, HargaSewaMobil, TahunPembuatan, IDCabang)
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

-- Data Transaksi

-- Dummy Data Peminjaman
INSERT INTO PEMINJAMAN
    (IDMember, Nopol, IDPegawai, TanggalPeminjaman, TanggalKembali, TanggalBatasPengembalian, TotalBiaya, TotalDenda)
VALUES
    -- Bulan Januari 2026 (Kembali Tepat Waktu)
    (1, 'D 1234 ABC', 3, '2026-01-01', '2026-01-03', '2026-01-03', 700000.00, NULL),
    -- 2 hari Brio
    (2, 'D 8888 XYZ', 4, '2026-01-02', '2026-01-05', '2026-01-05', 1650000.00, NULL),
    -- 3 hari Xpander
    (1, 'D 4567 EFG', 5, '2026-01-05', '2026-01-07', '2026-01-07', 1000000.00, NULL),
    -- 2 hari Ertiga
    (2, 'D 2910 OPQ', 3, '2026-01-06', '2026-01-08', '2026-01-08', 600000.00, NULL),
    -- 2 hari Sigra
    (1, 'D 7117 VST', 4, '2026-01-10', '2026-01-15', '2026-01-15', 3000000.00, NULL),
    -- 5 hari Stargazer
    (2, 'D 1234 ABC', 5, '2026-01-12', '2026-01-13', '2026-01-13', 350000.00, NULL),
    -- 1 hari Brio
    (1, 'D 8888 XYZ', 3, '2026-01-15', '2026-01-18', '2026-01-18', 1650000.00, NULL),
    -- 3 hari Xpander
    (2, 'D 4567 EFG', 4, '2026-01-20', '2026-01-22', '2026-01-22', 1000000.00, NULL),
    -- 2 hari Ertiga
    (1, 'D 2910 OPQ', 5, '2026-01-22', '2026-01-25', '2026-01-25', 900000.00, NULL),
    -- 3 hari Sigra
    (2, 'D 7117 VST', 3, '2026-01-25', '2026-01-27', '2026-01-27', 1200000.00, NULL),
    -- 2 hari Stargazer

    -- Bulan Februari 2026 (Ada Kasus Terlambat Kembali)
    (1, 'D 1234 ABC', 4, '2026-02-01', '2026-02-04', '2026-02-03', 700000.00, 35000.00),
    -- Terlambat 1 hari
    (2, 'D 8888 XYZ', 5, '2026-02-02', '2026-02-06', '2026-02-05', 1650000.00, 55000.00),
    (1, 'D 4567 EFG', 3, '2026-02-08', '2026-02-11', '2026-02-10', 1000000.00, 50000.00),
    (2, 'D 2910 OPQ', 4, '2026-02-10', '2026-02-13', '2026-02-12', 600000.00, 30000.00),
    (1, 'D 7117 VST', 5, '2026-02-12', '2026-02-16', '2026-02-15', 1800000.00, 60000.00),
    -- Terlambat 2 hari
    (2, 'D 1234 ABC', 3, '2026-02-15', '2026-02-19', '2026-02-17', 700000.00, 70000.00),
    (1, 'D 8888 XYZ', 4, '2026-02-18', '2026-02-23', '2026-02-21', 1650000.00, 110000.00),
    (2, 'D 4567 EFG', 5, '2026-02-20', '2026-02-25', '2026-02-23', 1500000.00, 100000.00),
    -- Terlambat 3 hari
    (1, 'D 2910 OPQ', 3, '2026-02-22', '2026-02-27', '2026-02-24', 600000.00, 90000.00),
    (2, 'D 7117 VST', 4, '2026-02-25', '2026-03-03', '2026-02-28', 1800000.00, 180000.00),

    -- Bulan Maret - April 2026
    (1, 'D 1234 ABC', 5, '2026-03-01', '2026-03-03', '2026-03-03', 700000.00, NULL),
    (2, 'D 8888 XYZ', 3, '2026-03-05', '2026-03-08', '2026-03-08', 1650000.00, NULL),
    (1, 'D 4567 EFG', 4, '2026-03-12', '2026-03-15', '2026-03-15', 1500000.00, NULL),
    (2, 'D 2910 OPQ', 5, '2026-03-20', '2026-03-22', '2026-03-22', 600000.00, NULL),
    (1, 'D 7117 VST', 3, '2026-04-02', '2026-04-05', '2026-04-05', 1800000.00, NULL),
    (2, 'D 1234 ABC', 4, '2026-04-10', '2026-04-12', '2026-04-12', 700000.00, NULL),
    (1, 'D 8888 XYZ', 5, '2026-04-18', '2026-04-21', '2026-04-21', 1650000.00, NULL),

    -- Bulan Juni 2026 (Masih Dipinjam)
    (2, 'D 4567 EFG', 3, '2026-06-01', NULL, '2026-06-04', 1500000.00, NULL),
    (1, 'D 2910 OPQ', 4, '2026-06-03', NULL, '2026-06-06', 900000.00, NULL),
    (2, 'D 7117 VST', 5, '2026-06-04', NULL, '2026-06-07', 1800000.00, NULL);




-- ====================================================================
-- TAMBAHAN DATA TRANSAKSI UNTUK TESTING STATUS "ONGOING" & "VERIFIKASI"
-- KONDISI TIMELINE: JUNI 2026
-- ====================================================================
USE CarRentalDB;
GO

INSERT INTO PEMINJAMAN
    (IDMember, Nopol, IDPegawai, TanggalPeminjaman, TanggalKembali, TanggalBatasPengembalian, TotalBiaya, TotalDenda)
VALUES
    -- 1. TEST STATUS: Menunggu Verifikasi (Booking dari Web)
    -- Ciri-ciri: TanggalKembali NULL, diikat ke Akun SISTEM AUTOMATION (ID Pegawai = 5)
    (1, 'D 8888 XYZ', 5, '2026-06-04', NULL, '2026-06-07', 1650000.00, NULL),
    (2, 'D 7117 VST', 5, '2026-06-05', NULL, '2026-06-08', 1800000.00, NULL),

    -- 2. TEST STATUS: Ongoing / Dipinjam (Sudah Verifikasi, Mobil di Jalan)
    -- Ciri-ciri: TanggalKembali NULL, diikat ke ID Pegawai manusia yang sah (Steven = ID 3)
    (1, 'D 4567 EFG', 3, '2026-06-02', NULL, '2026-06-05', 1500000.00, NULL),
    (2, 'D 2910 OPQ', 3, '2026-06-03', NULL, '2026-06-06', 900000.00, NULL);


SELECT NOPOL, IDCabang
FROM MOBIL
WHERE NOPOL IN ('D 8888 XYZ', 'D 7117 VST', 'D 4567 EFG', 'D 2910 OPQ');

UPDATE MOBIL SET IDCabang = 1 WHERE NOPOL IN ('D 8888 XYZ', 'D 7117 VST', 'D 4567 EFG', 'D 2910 OPQ');