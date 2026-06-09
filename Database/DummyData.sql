-- Data master
-- Dummy Data Cabang
INSERT INTO CABANG
    (NamaCabang, NamaJalan, AlamatEmail, NoTelp)
VALUES
    ('Cabang Citarum', 'Jl. Diponegoro No. 22', 'citarum@carrental.com', '0224201234'),
    ('Cabang Dago', 'Jl. Ir. H. Juanda No. 102', 'dago@carrental.com', '0224234567'),
    ('Cabang Riau', 'Jl. R.E. Martadinata No. 57', 'riau@carrental.com', '0227209812'),
    ('Cabang Cihampelas', 'Jl. Cihampelas No. 160', 'cihampelas@carrental.com', '0222015544'),
    ('Cabang Buah Batu', 'Jl. Buah Batu No. 235', 'buahbatu@carrental.com', '0225408899')


-- Data master
-- Dummy Data User
INSERT INTO [USER]
    (Nama, TanggalLahir, JenisKelamin, AlamatEmail, UserPassword, NomorTelp, [Role])
VALUES
    ('Fadhil', '2020-01-12', 'M', 'fadhil@gmail.com', 'fadhil', '081122334455', 0),
    ('Pearce', '2020-04-12', 'M', 'pearce@gmail.com', 'pearce', '081955556666', 0),
    ('Steven', '2020-02-12', 'M', 'steven@gmail.com', 'steven', '082198761234', 1),
    ('Kenneth', '2020-03-12', 'M', 'kenneth@gmail.com', 'kenneth', '085711223344', 1),
    ('SISTEM AUTOMATION', '2026-01-01', 'M', 'sys@test', 'test', '089677889900', 1),
    ('Andin', '2007-03-01', 'F', 'andin@gmail.com', 'andin', '089677884900', 1),
    ('Heri', '2006-02-01', 'M', 'heri@gmail.com', 'heri', '089677889100', 1),
    ('Ani' , '2004-07-03', 'F', 'ani@gmail.com', 'ani', '089677889923', 1),
    ('Rusdi', '1997-06-01', 'M', 'rusdi@gmail.com', 'rusdi', '089623889900', 0)


-- Data master
-- Dummy data user yang menjadi pegawai
INSERT INTO PEGAWAI
    (IDUser, IDCabang)
VALUES
    (3, 1),
    (4, 5),
    (5, 1),
    (6, 2),
    (7, 3),
    (8, 4)


-- Data master
-- Dummy data user yang menjadi member
INSERT INTO MEMBER
    (IDUser, NoSIM)
VALUES
    (1, '1234567890123456'),
    (2, '1234567890654321');


-- Data master
-- Dummy Data Mobil
INSERT INTO TIPE_MOBIL
    (NamaTipe, Kapasitas)
VALUES
    ('MPV', 7),
    ('Sedan', 5),
    ('SUV', 7),
    ('EV', 5),
    ('City Car', 5);


-- Data master
-- Dummy data merek mobil
INSERT INTO MEREK_MOBIL
    (NamaMerek)
VALUES
    ('Honda Brio'),
    ('Mitsubishi Xpander'),
    ('Suzuki Ertiga'),
    ('Daihatsu Sigra'),
    ('Hyundai Stargazer');


-- Data master
-- Dummy data mobil
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


-- Dummy data Transaksi Peminjaman
INSERT INTO PEMINJAMAN
    (IDMember, Nopol, IDPegawai, TanggalPeminjaman, TanggalKembali, TanggalBatasPengembalian, TotalBiaya, TotalDenda)
VALUES
    -- Bulan Januari 2026 (Kembali Tepat Waktu)
    (1, 'D 1234 ABC', 3, '2026-01-01', '2026-01-03', '2026-01-03', 700000.00, 0),
    -- 2 hari Brio
    (2, 'D 8888 XYZ', 4, '2026-01-02', '2026-01-05', '2026-01-05', 1650000.00, 0),
    -- 3 hari Xpander
    (1, 'D 4567 EFG', 5, '2026-01-05', '2026-01-07', '2026-01-07', 1000000.00, 0),
    -- 2 hari Ertiga
    (2, 'D 2910 OPQ', 3, '2026-01-06', '2026-01-08', '2026-01-08', 600000.00, 0),
    -- 2 hari Sigra
    (1, 'D 7117 VST', 4, '2026-01-10', '2026-01-15', '2026-01-15', 3000000.00, 0),
    -- 5 hari Stargazer
    (2, 'D 1234 ABC', 5, '2026-01-12', '2026-01-13', '2026-01-13', 350000.00, 0),
    -- 1 hari Brio
    (1, 'D 8888 XYZ', 3, '2026-01-15', '2026-01-18', '2026-01-18', 1650000.00, 0),
    -- 3 hari Xpander
    (2, 'D 4567 EFG', 4, '2026-01-20', '2026-01-22', '2026-01-22', 1000000.00, 0),
    -- 2 hari Ertiga
    (1, 'D 2910 OPQ', 5, '2026-01-22', '2026-01-25', '2026-01-25', 900000.00, 0),
    -- 3 hari Sigra
    (2, 'D 7117 VST', 3, '2026-01-25', '2026-01-27', '2026-01-27', 1200000.00, 0),
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
    (1, 'D 1234 ABC', 5, '2026-03-01', '2026-03-03', '2026-03-03', 700000.00, 0),
    (2, 'D 8888 XYZ', 3, '2026-03-05', '2026-03-08', '2026-03-08', 1650000.00, 0),
    (1, 'D 4567 EFG', 4, '2026-03-12', '2026-03-15', '2026-03-15', 1500000.00, 0),
    (2, 'D 2910 OPQ', 5, '2026-03-20', '2026-03-22', '2026-03-22', 600000.00, 0),
    (1, 'D 7117 VST', 3, '2026-04-02', '2026-04-05', '2026-04-05', 1800000.00, 0),
    (2, 'D 1234 ABC', 4, '2026-04-10', '2026-04-12', '2026-04-12', 700000.00, 0),
    (1, 'D 8888 XYZ', 5, '2026-04-18', '2026-04-21', '2026-04-21', 1650000.00, 0),

    -- Bulan Juni 2026 (Masih Dipinjam)
    (2, 'D 4567 EFG', 3, '2026-06-01', NULL, '2026-06-04', 1500000.00, 0),
    (1, 'D 2910 OPQ', 4, '2026-06-03', NULL, '2026-06-06', 900000.00, 0),
    (2, 'D 7117 VST', 5, '2026-06-04', NULL, '2026-06-07', 1800000.00, 0),

    -- STATUS: Menunggu Verifikasi (Booking dari Web)
    -- Ciri-ciri: TanggalKembali NULL, diikat ke Akun SISTEM AUTOMATION (ID Pegawai = 5)
    (1, 'D 8888 XYZ', 5, '2026-06-04', NULL, '2026-06-07', 1650000.00, 0),
    (2, 'D 7117 VST', 5, '2026-06-05', NULL, '2026-06-08', 1800000.00, 0),

    -- STATUS: Ongoing / Dipinjam (Sudah Verifikasi, Mobil di Jalan)
    -- Ciri-ciri: TanggalKembali NULL, diikat ke ID Pegawai manusia yang sah (Steven = ID 3)
    (1, 'D 4567 EFG', 3, '2026-06-02', NULL, '2026-06-05', 1500000.00, 0),
    (2, 'D 2910 OPQ', 3, '2026-06-03', NULL, '2026-06-06', 900000.00, 0);   


-- =========================================================================
-- DATA TRANSAKSI GENERATED: TABEL FOTO TRANSAKSI (SINKRON DETAIL PER BARIS)
-- AUTHOR: GEMINI COLLABORATOR FOR PEARCE NATHANIEL N.
-- =========================================================================
USE CarRentalDB;
GO

PRINT 'Memulai pembersihan dan penyuntikan massal tabel FOTO...';

INSERT INTO FOTO (IDMember, IDPegawai, Nopol, Gambar, Kondisi, Deskripsi)
VALUES
    -- =====================================================================
    -- REKOR BULAN JANUARI 2026 (STATUS: SELESAI -> LENGKAP 8 FOTO)
    -- =====================================================================
    -- Baris 1: Fadhil - Brio (D 1234 ABC) - 2026-01-01
    (1, 3, 'D 1234 ABC', 'https://images.unsplash.com/photo-1533473359331-0135ef1b58bf?q=80&w=600', 0, 'Foto Depan Sebelum Sewa - Brio Jan 1'),
    (1, 3, 'D 1234 ABC', 'https://images.unsplash.com/photo-1541899481282-d53bffe3c35d?q=80&w=600', 0, 'Foto Belakang Sebelum Sewa - Brio Jan 1'),
    (1, 3, 'D 1234 ABC', 'https://images.unsplash.com/photo-1502877338535-766e1452684a?q=80&w=600', 0, 'Foto Kanan Sebelum Sewa - Brio Jan 1'),
    (1, 3, 'D 1234 ABC', 'https://images.unsplash.com/photo-1492144534655-ae79c964c9d7?q=80&w=600', 0, 'Foto Kiri Sebelum Sewa - Brio Jan 1'),
    (1, 3, 'D 1234 ABC', 'https://images.unsplash.com/photo-1489824904134-891ab64532f1?q=80&w=600', 1, 'Foto Depan Sesudah Sewa - Brio Jan 1 Selesai'),
    (1, 3, 'D 1234 ABC', 'https://images.unsplash.com/photo-1583121274602-3e2820c69888?q=80&w=600', 1, 'Foto Belakang Sesudah Sewa - Brio Jan 1 Selesai'),
    (1, 3, 'D 1234 ABC', 'https://images.unsplash.com/photo-1553440569-bcc63803a83d?q=80&w=600', 1, 'Foto Kanan Sesudah Sewa - Brio Jan 1 Selesai'),
    (1, 3, 'D 1234 ABC', 'https://images.unsplash.com/photo-1542346656-e652a9757657?q=80&w=600', 1, 'Foto Kiri Sesudah Sewa - Brio Jan 1 Selesai'),

    -- Baris 2: Pearce - Xpander (D 8888 XYZ) - 2026-01-02
    (2, 4, 'D 8888 XYZ', 'https://images.unsplash.com/photo-1549399542-7e3f8b79c341?q=80&w=600', 0, 'Foto Depan Sebelum Sewa - Xpander Jan 2'),
    (2, 4, 'D 8888 XYZ', 'https://images.unsplash.com/photo-1617788138017-80ad40651399?q=80&w=600', 0, 'Foto Belakang Sebelum Sewa - Xpander Jan 2'),
    (2, 4, 'D 8888 XYZ', 'https://images.unsplash.com/photo-1619767886558-efdc259cde1a?q=80&w=600', 0, 'Foto Kanan Sebelum Sewa - Xpander Jan 2'),
    (2, 4, 'D 8888 XYZ', 'https://images.unsplash.com/photo-1580273916550-e323be2ae537?q=80&w=600', 0, 'Foto Kiri Sebelum Sewa - Xpander Jan 2'),
    (2, 4, 'D 8888 XYZ', 'https://images.unsplash.com/photo-1568605117036-5fe5e7bab0b7?q=80&w=600', 1, 'Foto Depan Sesudah Sewa - Xpander Jan 2 Selesai'),
    (2, 4, 'D 8888 XYZ', 'https://images.unsplash.com/photo-1503376780353-7e6692767b70?q=80&w=600', 1, 'Foto Belakang Sesudah Sewa - Xpander Jan 2 Selesai'),
    (2, 4, 'D 8888 XYZ', 'https://images.unsplash.com/photo-1542282088-72c9c27ed0cd?q=80&w=600', 1, 'Foto Kanan Sesudah Sewa - Xpander Jan 2 Selesai'),
    (2, 4, 'D 8888 XYZ', 'https://images.unsplash.com/photo-1552519507-da3b142c6e3d?q=80&w=600', 1, 'Foto Kiri Sesudah Sewa - Xpander Jan 2 Selesai'),

    -- Baris 3: Fadhil - Ertiga (D 4567 EFG) - 2026-01-05
    (1, 5, 'D 4567 EFG', 'https://images.unsplash.com/photo-1525609004556-c46c7d6cf0a3?q=80&w=600', 0, 'Foto Depan Sebelum Sewa - Ertiga Jan 5'),
    (1, 5, 'D 4567 EFG', 'https://images.unsplash.com/photo-1552519507-da3b142c6e3d?q=80&w=600', 0, 'Foto Belakang Sebelum Sewa - Ertiga Jan 5'),
    (1, 5, 'D 4567 EFG', 'https://images.unsplash.com/photo-1503376780353-7e6692767b70?q=80&w=600', 0, 'Foto Kanan Sebelum Sewa - Ertiga Jan 5'),
    (1, 5, 'D 4567 EFG', 'https://images.unsplash.com/photo-1568605117036-5fe5e7bab0b7?q=80&w=600', 0, 'Foto Kiri Sebelum Sewa - Ertiga Jan 5'),
    (1, 5, 'D 4567 EFG', 'https://images.unsplash.com/photo-1494976388531-d1058094e2bd?q=80&w=600', 1, 'Foto Depan Sesudah Sewa - Ertiga Jan 5 Selesai'),
    (1, 5, 'D 4567 EFG', 'https://images.unsplash.com/photo-1511919884226-fd3cad34687c?q=80&w=600', 1, 'Foto Belakang Sesudah Sewa - Ertiga Jan 5 Selesai'),
    (1, 5, 'D 4567 EFG', 'https://images.unsplash.com/photo-1504215680048-db15dc05967c?q=80&w=600', 1, 'Foto Kanan Sesudah Sewa - Ertiga Jan 5 Selesai'),
    (1, 5, 'D 4567 EFG', 'https://images.unsplash.com/photo-1541348263662-e0d864388e7a?q=80&w=600', 1, 'Foto Kiri Sesudah Sewa - Ertiga Jan 5 Selesai'),

    -- Baris 4: Pearce - Sigra (D 2910 OPQ) - 2026-01-06
    (2, 3, 'D 2910 OPQ', 'https://images.unsplash.com/photo-1533473359331-0135ef1b58bf?q=80&w=600', 0, 'Foto Depan Sebelum Sewa - Sigra Jan 6'),
    (2, 3, 'D 2910 OPQ', 'https://images.unsplash.com/photo-1541899481282-d53bffe3c35d?q=80&w=600', 0, 'Foto Belakang Sebelum Sewa - Sigra Jan 6'),
    (2, 3, 'D 2910 OPQ', 'https://images.unsplash.com/photo-1502877338535-766e1452684a?q=80&w=600', 0, 'Foto Kanan Sebelum Sewa - Sigra Jan 6'),
    (2, 3, 'D 2910 OPQ', 'https://images.unsplash.com/photo-1492144534655-ae79c964c9d7?q=80&w=600', 0, 'Foto Kiri Sebelum Sewa - Sigra Jan 6'),
    (2, 3, 'D 2910 OPQ', 'https://images.unsplash.com/photo-1489824904134-891ab64532f1?q=80&w=600', 1, 'Foto Depan Sesudah Sewa - Sigra Jan 6 Selesai'),
    (2, 3, 'D 2910 OPQ', 'https://images.unsplash.com/photo-1583121274602-3e2820c69888?q=80&w=600', 1, 'Foto Belakang Sesudah Sewa - Sigra Jan 6 Selesai'),
    (2, 3, 'D 2910 OPQ', 'https://images.unsplash.com/photo-1553440569-bcc63803a83d?q=80&w=600', 1, 'Foto Kanan Sesudah Sewa - Sigra Jan 6 Selesai'),
    (2, 3, 'D 2910 OPQ', 'https://images.unsplash.com/photo-1542346656-e652a9757657?q=80&w=600', 1, 'Foto Kiri Sesudah Sewa - Sigra Jan 6 Selesai'),

    -- Baris 5: Fadhil - Stargazer (D 7117 VST) - 2026-01-10
    (1, 4, 'D 7117 VST', 'https://images.unsplash.com/photo-1549399542-7e3f8b79c341?q=80&w=600', 0, 'Foto Depan Sebelum Sewa - Stargazer Jan 10'),
    (1, 4, 'D 7117 VST', 'https://images.unsplash.com/photo-1617788138017-80ad40651399?q=80&w=600', 0, 'Foto Belakang Sebelum Sewa - Stargazer Jan 10'),
    (1, 4, 'D 7117 VST', 'https://images.unsplash.com/photo-1619767886558-efdc259cde1a?q=80&w=600', 0, 'Foto Kanan Sebelum Sewa - Stargazer Jan 10'),
    (1, 4, 'D 7117 VST', 'https://images.unsplash.com/photo-1580273916550-e323be2ae537?q=80&w=600', 0, 'Foto Kiri Sebelum Sewa - Stargazer Jan 10'),
    (1, 4, 'D 7117 VST', 'https://images.unsplash.com/photo-1568605117036-5fe5e7bab0b7?q=80&w=600', 1, 'Foto Depan Sesudah Sewa - Stargazer Jan 10 Selesai'),
    (1, 4, 'D 7117 VST', 'https://images.unsplash.com/photo-1503376780353-7e6692767b70?q=80&w=600', 1, 'Foto Belakang Sesudah Sewa - Stargazer Jan 10 Selesai'),
    (1, 4, 'D 7117 VST', 'https://images.unsplash.com/photo-1542282088-72c9c27ed0cd?q=80&w=600', 1, 'Foto Kanan Sesudah Sewa - Stargazer Jan 10 Selesai'),
    (1, 4, 'D 7117 VST', 'https://images.unsplash.com/photo-1552519507-da3b142c6e3d?q=80&w=600', 1, 'Foto Kiri Sesudah Sewa - Stargazer Jan 10 Selesai'),

    -- Baris 6: Pearce - Brio (D 1234 ABC) - 2026-01-12
    (2, 5, 'D 1234 ABC', 'https://images.unsplash.com/photo-1525609004556-c46c7d6cf0a3?q=80&w=600', 0, 'Foto Depan Sebelum Sewa - Brio Jan 12'),
    (2, 5, 'D 1234 ABC', 'https://images.unsplash.com/photo-1552519507-da3b142c6e3d?q=80&w=600', 0, 'Foto Belakang Sebelum Sewa - Brio Jan 12'),
    (2, 5, 'D 1234 ABC', 'https://images.unsplash.com/photo-1503376780353-7e6692767b70?q=80&w=600', 0, 'Foto Kanan Sebelum Sewa - Brio Jan 12'),
    (2, 5, 'D 1234 ABC', 'https://images.unsplash.com/photo-1568605117036-5fe5e7bab0b7?q=80&w=600', 0, 'Foto Kiri Sebelum Sewa - Brio Jan 12'),
    (2, 5, 'D 1234 ABC', 'https://images.unsplash.com/photo-1494976388531-d1058094e2bd?q=80&w=600', 1, 'Foto Depan Sesudah Sewa - Brio Jan 12 Selesai'),
    (2, 5, 'D 1234 ABC', 'https://images.unsplash.com/photo-1511919884226-fd3cad34687c?q=80&w=600', 1, 'Foto Belakang Sesudah Sewa - Brio Jan 12 Selesai'),
    (2, 5, 'D 1234 ABC', 'https://images.unsplash.com/photo-1504215680048-db15dc05967c?q=80&w=600', 1, 'Foto Kanan Sesudah Sewa - Brio Jan 12 Selesai'),
    (2, 5, 'D 1234 ABC', 'https://images.unsplash.com/photo-1541348263662-e0d864388e7a?q=80&w=600', 1, 'Foto Kiri Sesudah Sewa - Brio Jan 12 Selesai'),

    -- Baris 7: Fadhil - Xpander (D 8888 XYZ) - 2026-01-15
    (1, 3, 'D 8888 XYZ', 'https://images.unsplash.com/photo-1533473359331-0135ef1b58bf?q=80&w=600', 0, 'Foto Depan Sebelum Sewa - Xpander Jan 15'),
    (1, 3, 'D 8888 XYZ', 'https://images.unsplash.com/photo-1541899481282-d53bffe3c35d?q=80&w=600', 0, 'Foto Belakang Sebelum Sewa - Xpander Jan 15'),
    (1, 3, 'D 8888 XYZ', 'https://images.unsplash.com/photo-1502877338535-766e1452684a?q=80&w=600', 0, 'Foto Kanan Sebelum Sewa - Xpander Jan 15'),
    (1, 3, 'D 8888 XYZ', 'https://images.unsplash.com/photo-1492144534655-ae79c964c9d7?q=80&w=600', 0, 'Foto Kiri Sebelum Sewa - Xpander Jan 15'),
    (1, 3, 'D 8888 XYZ', 'https://images.unsplash.com/photo-1489824904134-891ab64532f1?q=80&w=600', 1, 'Foto Depan Sesudah Sewa - Xpander Jan 15 Selesai'),
    (1, 3, 'D 8888 XYZ', 'https://images.unsplash.com/photo-1583121274602-3e2820c69888?q=80&w=600', 1, 'Foto Belakang Sesudah Sewa - Xpander Jan 15 Selesai'),
    (1, 3, 'D 8888 XYZ', 'https://images.unsplash.com/photo-1553440569-bcc63803a83d?q=80&w=600', 1, 'Foto Kanan Sesudah Sewa - Xpander Jan 15 Selesai'),
    (1, 3, 'D 8888 XYZ', 'https://images.unsplash.com/photo-1542346656-e652a9757657?q=80&w=600', 1, 'Foto Kiri Sesudah Sewa - Xpander Jan 15 Selesai'),

    -- Baris 8: Pearce - Ertiga (D 4567 EFG) - 2026-01-20
    (2, 4, 'D 4567 EFG', 'https://images.unsplash.com/photo-1549399542-7e3f8b79c341?q=80&w=600', 0, 'Foto Depan Sebelum Sewa - Ertiga Jan 20'),
    (2, 4, 'D 4567 EFG', 'https://images.unsplash.com/photo-1617788138017-80ad40651399?q=80&w=600', 0, 'Foto Belakang Sebelum Sewa - Ertiga Jan 20'),
    (2, 4, 'D 4567 EFG', 'https://images.unsplash.com/photo-1619767886558-efdc259cde1a?q=80&w=600', 0, 'Foto Kanan Sebelum Sewa - Ertiga Jan 20'),
    (2, 4, 'D 4567 EFG', 'https://images.unsplash.com/photo-1580273916550-e323be2ae537?q=80&w=600', 0, 'Foto Kiri Sebelum Sewa - Ertiga Jan 20'),
    (2, 4, 'D 4567 EFG', 'https://images.unsplash.com/photo-1568605117036-5fe5e7bab0b7?q=80&w=600', 1, 'Foto Depan Sesudah Sewa - Ertiga Jan 20 Selesai'),
    (2, 4, 'D 4567 EFG', 'https://images.unsplash.com/photo-1503376780353-7e6692767b70?q=80&w=600', 1, 'Foto Belakang Sesudah Sewa - Ertiga Jan 20 Selesai'),
    (2, 4, 'D 4567 EFG', 'https://images.unsplash.com/photo-1542282088-72c9c27ed0cd?q=80&w=600', 1, 'Foto Kanan Sesudah Sewa - Ertiga Jan 20 Selesai'),
    (2, 4, 'D 4567 EFG', 'https://images.unsplash.com/photo-1552519507-da3b142c6e3d?q=80&w=600', 1, 'Foto Kiri Sesudah Sewa - Ertiga Jan 20 Selesai'),

    -- Baris 9: Fadhil - Sigra (D 2910 OPQ) - 2026-01-22
    (1, 5, 'D 2910 OPQ', 'https://images.unsplash.com/photo-1525609004556-c46c7d6cf0a3?q=80&w=600', 0, 'Foto Depan Sebelum Sewa - Sigra Jan 22'),
    (1, 5, 'D 2910 OPQ', 'https://images.unsplash.com/photo-1552519507-da3b142c6e3d?q=80&w=600', 0, 'Foto Belakang Sebelum Sewa - Sigra Jan 22'),
    (1, 5, 'D 2910 OPQ', 'https://images.unsplash.com/photo-1503376780353-7e6692767b70?q=80&w=600', 0, 'Foto Kanan Sebelum Sewa - Sigra Jan 22'),
    (1, 5, 'D 2910 OPQ', 'https://images.unsplash.com/photo-1568605117036-5fe5e7bab0b7?q=80&w=600', 0, 'Foto Kiri Sebelum Sewa - Sigra Jan 22'),
    (1, 5, 'D 2910 OPQ', 'https://images.unsplash.com/photo-1494976388531-d1058094e2bd?q=80&w=600', 1, 'Foto Depan Sesudah Sewa - Sigra Jan 22 Selesai'),
    (1, 5, 'D 2910 OPQ', 'https://images.unsplash.com/photo-1511919884226-fd3cad34687c?q=80&w=600', 1, 'Foto Belakang Sesudah Sewa - Sigra Jan 22 Selesai'),
    (1, 5, 'D 2910 OPQ', 'https://images.unsplash.com/photo-1504215680048-db15dc05967c?q=80&w=600', 1, 'Foto Kanan Sesudah Sewa - Sigra Jan 22 Selesai'),
    (1, 5, 'D 2910 OPQ', 'https://images.unsplash.com/photo-1541348263662-e0d864388e7a?q=80&w=600', 1, 'Foto Kiri Sesudah Sewa - Sigra Jan 22 Selesai'),

    -- Baris 10: Pearce - Stargazer (D 7117 VST) - 2026-01-25
    (2, 3, 'D 7117 VST', 'https://images.unsplash.com/photo-1533473359331-0135ef1b58bf?q=80&w=600', 0, 'Foto Depan Sebelum Sewa - Stargazer Jan 25'),
    (2, 3, 'D 7117 VST', 'https://images.unsplash.com/photo-1541899481282-d53bffe3c35d?q=80&w=600', 0, 'Foto Belakang Sebelum Sewa - Stargazer Jan 25'),
    (2, 3, 'D 7117 VST', 'https://images.unsplash.com/photo-1502877338535-766e1452684a?q=80&w=600', 0, 'Foto Kanan Sebelum Sewa - Stargazer Jan 25'),
    (2, 3, 'D 7117 VST', 'https://images.unsplash.com/photo-1492144534655-ae79c964c9d7?q=80&w=600', 0, 'Foto Kiri Sebelum Sewa - Stargazer Jan 25'),
    (2, 3, 'D 7117 VST', 'https://images.unsplash.com/photo-1489824904134-891ab64532f1?q=80&w=600', 1, 'Foto Depan Sesudah Sewa - Stargazer Jan 25 Selesai'),
    (2, 3, 'D 7117 VST', 'https://images.unsplash.com/photo-1583121274602-3e2820c69888?q=80&w=600', 1, 'Foto Belakang Sesudah Sewa - Stargazer Jan 25 Selesai'),
    (2, 3, 'D 7117 VST', 'https://images.unsplash.com/photo-1553440569-bcc63803a83d?q=80&w=600', 1, 'Foto Kanan Sesudah Sewa - Stargazer Jan 25 Selesai'),
    (2, 3, 'D 7117 VST', 'https://images.unsplash.com/photo-1542346656-e652a9757657?q=80&w=600', 1, 'Foto Kiri Sesudah Sewa - Stargazer Jan 25 Selesai'),

    -- =====================================================================
    -- REKOR BULAN FEBRUARI 2026 (STATUS: SELESAI + TELAT -> LENGKAP 8 FOTO)
    -- =====================================================================
    -- Baris 11: Fadhil - Brio (D 1234 ABC) - 2026-02-01
    (1, 4, 'D 1234 ABC', 'https://images.unsplash.com/photo-1549399542-7e3f8b79c341?q=80&w=600', 0, 'Foto Depan Sebelum Sewa - Brio Feb 1'),
    (1, 4, 'D 1234 ABC', 'https://images.unsplash.com/photo-1617788138017-80ad40651399?q=80&w=600', 0, 'Foto Belakang Sebelum Sewa - Brio Feb 1'),
    (1, 4, 'D 1234 ABC', 'https://images.unsplash.com/photo-1619767886558-efdc259cde1a?q=80&w=600', 0, 'Foto Kanan Sebelum Sewa - Brio Feb 1'),
    (1, 4, 'D 1234 ABC', 'https://images.unsplash.com/photo-1580273916550-e323be2ae537?q=80&w=600', 0, 'Foto Kiri Sebelum Sewa - Brio Feb 1'),
    (1, 4, 'D 1234 ABC', 'https://images.unsplash.com/photo-1568605117036-5fe5e7bab0b7?q=80&w=600', 1, 'Foto Depan Sesudah Sewa - Brio Feb 1 Selesai'),
    (1, 4, 'D 1234 ABC', 'https://images.unsplash.com/photo-1503376780353-7e6692767b70?q=80&w=600', 1, 'Foto Belakang Sesudah Sewa - Brio Feb 1 Selesai'),
    (1, 4, 'D 1234 ABC', 'https://images.unsplash.com/photo-1542282088-72c9c27ed0cd?q=80&w=600', 1, 'Foto Kanan Sesudah Sewa - Brio Feb 1 Selesai'),
    (1, 4, 'D 1234 ABC', 'https://images.unsplash.com/photo-1552519507-da3b142c6e3d?q=80&w=600', 1, 'Foto Kiri Sesudah Sewa - Brio Feb 1 Selesai'),

    -- Baris 12: Pearce - Xpander (D 8888 XYZ) - 2026-02-02
    (2, 5, 'D 8888 XYZ', 'https://images.unsplash.com/photo-1525609004556-c46c7d6cf0a3?q=80&w=600', 0, 'Foto Depan Sebelum Sewa - Xpander Feb 2'),
    (2, 5, 'D 8888 XYZ', 'https://images.unsplash.com/photo-1552519507-da3b142c6e3d?q=80&w=600', 0, 'Foto Belakang Sebelum Sewa - Xpander Feb 2'),
    (2, 5, 'D 8888 XYZ', 'https://images.unsplash.com/photo-1503376780353-7e6692767b70?q=80&w=600', 0, 'Foto Kanan Sebelum Sewa - Xpander Feb 2'),
    (2, 5, 'D 8888 XYZ', 'https://images.unsplash.com/photo-1568605117036-5fe5e7bab0b7?q=80&w=600', 0, 'Foto Kiri Sebelum Sewa - Xpander Feb 2'),
    (2, 5, 'D 8888 XYZ', 'https://images.unsplash.com/photo-1494976388531-d1058094e2bd?q=80&w=600', 1, 'Foto Depan Sesudah Sewa - Xpander Feb 2 Selesai'),
    (2, 5, 'D 8888 XYZ', 'https://images.unsplash.com/photo-1511919884226-fd3cad34687c?q=80&w=600', 1, 'Foto Belakang Sesudah Sewa - Xpander Feb 2 Selesai'),
    (2, 5, 'D 8888 XYZ', 'https://images.unsplash.com/photo-1504215680048-db15dc05967c?q=80&w=600', 1, 'Foto Kanan Sesudah Sewa - Xpander Feb 2 Selesai'),
    (2, 5, 'D 8888 XYZ', 'https://images.unsplash.com/photo-1541348263662-e0d864388e7a?q=80&w=600', 1, 'Foto Kiri Sesudah Sewa - Xpander Feb 2 Selesai'),

    -- Baris 13: Fadhil - Ertiga (D 4567 EFG) - 2026-02-08
    (1, 3, 'D 4567 EFG', 'https://images.unsplash.com/photo-1533473359331-0135ef1b58bf?q=80&w=600', 0, 'Foto Depan Sebelum Sewa - Ertiga Feb 8'),
    (1, 3, 'D 4567 EFG', 'https://images.unsplash.com/photo-1541899481282-d53bffe3c35d?q=80&w=600', 0, 'Foto Belakang Sebelum Sewa - Ertiga Feb 8'),
    (1, 3, 'D 4567 EFG', 'https://images.unsplash.com/photo-1502877338535-766e1452684a?q=80&w=600', 0, 'Foto Kanan Sebelum Sewa - Ertiga Feb 8'),
    (1, 3, 'D 4567 EFG', 'https://images.unsplash.com/photo-1492144534655-ae79c964c9d7?q=80&w=600', 0, 'Foto Kiri Sebelum Sewa - Ertiga Feb 8'),
    (1, 3, 'D 4567 EFG', 'https://images.unsplash.com/photo-1489824904134-891ab64532f1?q=80&w=600', 1, 'Foto Depan Sesudah Sewa - Ertiga Feb 8 Selesai'),
    (1, 3, 'D 4567 EFG', 'https://images.unsplash.com/photo-1583121274602-3e2820c69888?q=80&w=600', 1, 'Foto Belakang Sesudah Sewa - Ertiga Feb 8 Selesai'),
    (1, 3, 'D 4567 EFG', 'https://images.unsplash.com/photo-1553440569-bcc63803a83d?q=80&w=600', 1, 'Foto Kanan Sesudah Sewa - Ertiga Feb 8 Selesai'),
    (1, 3, 'D 4567 EFG', 'https://images.unsplash.com/photo-1542346656-e652a9757657?q=80&w=600', 1, 'Foto Kiri Sesudah Sewa - Ertiga Feb 8 Selesai'),

    -- Baris 14: Pearce - Sigra (D 2910 OPQ) - 2026-02-10
    (2, 4, 'D 2910 OPQ', 'https://images.unsplash.com/photo-1549399542-7e3f8b79c341?q=80&w=600', 0, 'Foto Depan Sebelum Sewa - Sigra Feb 10'),
    (2, 4, 'D 2910 OPQ', 'https://images.unsplash.com/photo-1617788138017-80ad40651399?q=80&w=600', 0, 'Foto Belakang Sebelum Sewa - Sigra Feb 10'),
    (2, 4, 'D 2910 OPQ', 'https://images.unsplash.com/photo-1619767886558-efdc259cde1a?q=80&w=600', 0, 'Foto Kanan Sebelum Sewa - Sigra Feb 10'),
    (2, 4, 'D 2910 OPQ', 'https://images.unsplash.com/photo-1580273916550-e323be2ae537?q=80&w=600', 0, 'Foto Kiri Sebelum Sewa - Sigra Feb 10'),
    (2, 4, 'D 2910 OPQ', 'https://images.unsplash.com/photo-1568605117036-5fe5e7bab0b7?q=80&w=600', 1, 'Foto Depan Sesudah Sewa - Sigra Feb 10 Selesai'),
    (2, 4, 'D 2910 OPQ', 'https://images.unsplash.com/photo-1503376780353-7e6692767b70?q=80&w=600', 1, 'Foto Belakang Sesudah Sewa - Sigra Feb 10 Selesai'),
    (2, 4, 'D 2910 OPQ', 'https://images.unsplash.com/photo-1542282088-72c9c27ed0cd?q=80&w=600', 1, 'Foto Kanan Sesudah Sewa - Sigra Feb 10 Selesai'),
    (2, 4, 'D 2910 OPQ', 'https://images.unsplash.com/photo-1552519507-da3b142c6e3d?q=80&w=600', 1, 'Foto Kiri Sesudah Sewa - Sigra Feb 10 Selesai'),

    -- Baris 15: Fadhil - Stargazer (D 7117 VST) - 2026-02-12
    (1, 5, 'D 7117 VST', 'https://images.unsplash.com/photo-1525609004556-c46c7d6cf0a3?q=80&w=600', 0, 'Foto Depan Sebelum Sewa - Stargazer Feb 12'),
    (1, 5, 'D 7117 VST', 'https://images.unsplash.com/photo-1552519507-da3b142c6e3d?q=80&w=600', 0, 'Foto Belakang Sebelum Sewa - Stargazer Feb 12'),
    (1, 5, 'D 7117 VST', 'https://images.unsplash.com/photo-1503376780353-7e6692767b70?q=80&w=600', 0, 'Foto Kanan Sebelum Sewa - Stargazer Feb 12'),
    (1, 5, 'D 7117 VST', 'https://images.unsplash.com/photo-1568605117036-5fe5e7bab0b7?q=80&w=600', 0, 'Foto Kiri Sebelum Sewa - Stargazer Feb 12'),
    (1, 5, 'D 7117 VST', 'https://images.unsplash.com/photo-1494976388531-d1058094e2bd?q=80&w=600', 1, 'Foto Depan Sesudah Sewa - Stargazer Feb 12 Selesai'),
    (1, 5, 'D 7117 VST', 'https://images.unsplash.com/photo-1511919884226-fd3cad34687c?q=80&w=600', 1, 'Foto Belakang Sesudah Sewa - Stargazer Feb 12 Selesai'),
    (1, 5, 'D 7117 VST', 'https://images.unsplash.com/photo-1504215680048-db15dc05967c?q=80&w=600', 1, 'Foto Kanan Sesudah Sewa - Stargazer Feb 12 Selesai'),
    (1, 5, 'D 7117 VST', 'https://images.unsplash.com/photo-1541348263662-e0d864388e7a?q=80&w=600', 1, 'Foto Kiri Sesudah Sewa - Stargazer Feb 12 Selesai'),

    -- Baris 16: Pearce - Brio (D 1234 ABC) - 2026-02-15
    (2, 3, 'D 1234 ABC', 'https://images.unsplash.com/photo-1533473359331-0135ef1b58bf?q=80&w=600', 0, 'Foto Depan Sebelum Sewa - Brio Feb 15'),
    (2, 3, 'D 1234 ABC', 'https://images.unsplash.com/photo-1541899481282-d53bffe3c35d?q=80&w=600', 0, 'Foto Belakang Sebelum Sewa - Brio Feb 15'),
    (2, 3, 'D 1234 ABC', 'https://images.unsplash.com/photo-1502877338535-766e1452684a?q=80&w=600', 0, 'Foto Kanan Sebelum Sewa - Brio Feb 15'),
    (2, 3, 'D 1234 ABC', 'https://images.unsplash.com/photo-1492144534655-ae79c964c9d7?q=80&w=600', 0, 'Foto Kiri Sebelum Sewa - Brio Feb 15'),
    (2, 3, 'D 1234 ABC', 'https://images.unsplash.com/photo-1489824904134-891ab64532f1?q=80&w=600', 1, 'Foto Depan Sesudah Sewa - Brio Feb 15 Selesai'),
    (2, 3, 'D 1234 ABC', 'https://images.unsplash.com/photo-1583121274602-3e2820c69888?q=80&w=600', 1, 'Foto Belakang Sesudah Sewa - Brio Feb 15 Selesai'),
    (2, 3, 'D 1234 ABC', 'https://images.unsplash.com/photo-1553440569-bcc63803a83d?q=80&w=600', 1, 'Foto Kanan Sesudah Sewa - Brio Feb 15 Selesai'),
    (2, 3, 'D 1234 ABC', 'https://images.unsplash.com/photo-1542346656-e652a9757657?q=80&w=600', 1, 'Foto Kiri Sesudah Sewa - Brio Feb 15 Selesai'),

    -- Baris 17: Fadhil - Xpander (D 8888 XYZ) - 2026-02-18
    (1, 4, 'D 8888 XYZ', 'https://images.unsplash.com/photo-1549399542-7e3f8b79c341?q=80&w=600', 0, 'Foto Depan Sebelum Sewa - Xpander Feb 18'),
    (1, 4, 'D 8888 XYZ', 'https://images.unsplash.com/photo-1617788138017-80ad40651399?q=80&w=600', 0, 'Foto Belakang Sebelum Sewa - Xpander Feb 18'),
    (1, 4, 'D 8888 XYZ', 'https://images.unsplash.com/photo-1619767886558-efdc259cde1a?q=80&w=600', 0, 'Foto Kanan Sebelum Sewa - Xpander Feb 18'),
    (1, 4, 'D 8888 XYZ', 'https://images.unsplash.com/photo-1580273916550-e323be2ae537?q=80&w=600', 0, 'Foto Kiri Sebelum Sewa - Xpander Feb 18'),
    (1, 4, 'D 8888 XYZ', 'https://images.unsplash.com/photo-1568605117036-5fe5e7bab0b7?q=80&w=600', 1, 'Foto Depan Sesudah Sewa - Xpander Feb 18 Selesai'),
    (1, 4, 'D 8888 XYZ', 'https://images.unsplash.com/photo-1503376780353-7e6692767b70?q=80&w=600', 1, 'Foto Belakang Sesudah Sewa - Xpander Feb 18 Selesai'),
    (1, 4, 'D 8888 XYZ', 'https://images.unsplash.com/photo-1542282088-72c9c27ed0cd?q=80&w=600', 1, 'Foto Kanan Sesudah Sewa - Xpander Feb 18 Selesai'),
    (1, 4, 'D 8888 XYZ', 'https://images.unsplash.com/photo-1552519507-da3b142c6e3d?q=80&w=600', 1, 'Foto Kiri Sesudah Sewa - Xpander Feb 18 Selesai'),

    -- Baris 18: Pearce - Ertiga (D 4567 EFG) - 2026-02-20
    (2, 5, 'D 4567 EFG', 'https://images.unsplash.com/photo-1525609004556-c46c7d6cf0a3?q=80&w=600', 0, 'Foto Depan Sebelum Sewa - Ertiga Feb 20'),
    (2, 5, 'D 4567 EFG', 'https://images.unsplash.com/photo-1552519507-da3b142c6e3d?q=80&w=600', 0, 'Foto Belakang Sebelum Sewa - Ertiga Feb 20'),
    (2, 5, 'D 4567 EFG', 'https://images.unsplash.com/photo-1503376780353-7e6692767b70?q=80&w=600', 0, 'Foto Kanan Sebelum Sewa - Ertiga Feb 20'),
    (2, 5, 'D 4567 EFG', 'https://images.unsplash.com/photo-1568605117036-5fe5e7bab0b7?q=80&w=600', 0, 'Foto Kiri Sebelum Sewa - Ertiga Feb 20'),
    (2, 5, 'D 4567 EFG', 'https://images.unsplash.com/photo-1494976388531-d1058094e2bd?q=80&w=600', 1, 'Foto Depan Sesudah Sewa - Ertiga Feb 20 Selesai'),
    (2, 5, 'D 4567 EFG', 'https://images.unsplash.com/photo-1511919884226-fd3cad34687c?q=80&w=600', 1, 'Foto Belakang Sesudah Sewa - Ertiga Feb 20 Selesai'),
    (2, 5, 'D 4567 EFG', 'https://images.unsplash.com/photo-1504215680048-db15dc05967c?q=80&w=600', 1, 'Foto Kanan Sesudah Sewa - Ertiga Feb 20 Selesai'),
    (2, 5, 'D 4567 EFG', 'https://images.unsplash.com/photo-1541348263662-e0d864388e7a?q=80&w=600', 1, 'Foto Kiri Sesudah Sewa - Ertiga Feb 20 Selesai'),

    -- Baris 19: Fadhil - Sigra (D 2910 OPQ) - 2026-02-22
    (1, 3, 'D 2910 OPQ', 'https://images.unsplash.com/photo-1533473359331-0135ef1b58bf?q=80&w=600', 0, 'Foto Depan Sebelum Sewa - Sigra Feb 22'),
    (1, 3, 'D 2910 OPQ', 'https://images.unsplash.com/photo-1541899481282-d53bffe3c35d?q=80&w=600', 0, 'Foto Belakang Sebelum Sewa - Sigra Feb 22'),
    (1, 3, 'D 2910 OPQ', 'https://images.unsplash.com/photo-1502877338535-766e1452684a?q=80&w=600', 0, 'Foto Kanan Sebelum Sewa - Sigra Feb 22'),
    (1, 3, 'D 2910 OPQ', 'https://images.unsplash.com/photo-1492144534655-ae79c964c9d7?q=80&w=600', 0, 'Foto Kiri Sebelum Sewa - Sigra Feb 22'),
    (1, 3, 'D 2910 OPQ', 'https://images.unsplash.com/photo-1489824904134-891ab64532f1?q=80&w=600', 1, 'Foto Depan Sesudah Sewa - Sigra Feb 22 Selesai'),
    (1, 3, 'D 2910 OPQ', 'https://images.unsplash.com/photo-1583121274602-3e2820c69888?q=80&w=600', 1, 'Foto Belakang Sesudah Sewa - Sigra Feb 22 Selesai'),
    (1, 3, 'D 2910 OPQ', 'https://images.unsplash.com/photo-1553440569-bcc63803a83d?q=80&w=600', 1, 'Foto Kanan Sesudah Sewa - Sigra Feb 22 Selesai'),
    (1, 3, 'D 2910 OPQ', 'https://images.unsplash.com/photo-1542346656-e652a9757657?q=80&w=600', 1, 'Foto Kiri Sesudah Sewa - Sigra Feb 22 Selesai'),

    -- Baris 20: Pearce - Stargazer (D 7117 VST) - 2026-02-25
    (2, 4, 'D 7117 VST', 'https://images.unsplash.com/photo-1549399542-7e3f8b79c341?q=80&w=600', 0, 'Foto Depan Sebelum Sewa - Stargazer Feb 25'),
    (2, 4, 'D 7117 VST', 'https://images.unsplash.com/photo-1617788138017-80ad40651399?q=80&w=600', 0, 'Foto Belakang Sebelum Sewa - Stargazer Feb 25'),
    (2, 4, 'D 7117 VST', 'https://images.unsplash.com/photo-1619767886558-efdc259cde1a?q=80&w=600', 0, 'Foto Kanan Sebelum Sewa - Stargazer Feb 25'),
    (2, 4, 'D 7117 VST', 'https://images.unsplash.com/photo-1580273916550-e323be2ae537?q=80&w=600', 0, 'Foto Kiri Sebelum Sewa - Stargazer Feb 25'),
    (2, 4, 'D 7117 VST', 'https://images.unsplash.com/photo-1568605117036-5fe5e7bab0b7?q=80&w=600', 1, 'Foto Depan Sesudah Sewa - Stargazer Feb 25 Selesai'),
    (2, 4, 'D 7117 VST', 'https://images.unsplash.com/photo-1503376780353-7e6692767b70?q=80&w=600', 1, 'Foto Belakang Sesudah Sewa - Stargazer Feb 25 Selesai'),
    (2, 4, 'D 7117 VST', 'https://images.unsplash.com/photo-1542282088-72c9c27ed0cd?q=80&w=600', 1, 'Foto Kanan Sesudah Sewa - Stargazer Feb 25 Selesai'),
    (2, 4, 'D 7117 VST', 'https://images.unsplash.com/photo-1552519507-da3b142c6e3d?q=80&w=600', 1, 'Foto Kiri Sesudah Sewa - Stargazer Feb 25 Selesai'),

    -- =====================================================================
    -- REKOR BULAN MARET - APRIL 2026 (STATUS: SELESAI -> LENGKAP 8 FOTO)
    -- =====================================================================
    -- Baris 21: Fadhil - Brio (D 1234 ABC) - 2026-03-01
    (1, 5, 'D 1234 ABC', 'https://images.unsplash.com/photo-1525609004556-c46c7d6cf0a3?q=80&w=600', 0, 'Foto Depan Sebelum - Brio Mar 1'),
    (1, 5, 'D 1234 ABC', 'https://images.unsplash.com/photo-1552519507-da3b142c6e3d?q=80&w=600', 0, 'Foto Belakang Sebelum - Brio Mar 1'),
    (1, 5, 'D 1234 ABC', 'https://images.unsplash.com/photo-1503376780353-7e6692767b70?q=80&w=600', 0, 'Foto Kanan Sebelum - Brio Mar 1'),
    (1, 5, 'D 1234 ABC', 'https://images.unsplash.com/photo-1568605117036-5fe5e7bab0b7?q=80&w=600', 0, 'Foto Kiri Sebelum - Brio Mar 1'),
    (1, 5, 'D 1234 ABC', 'https://images.unsplash.com/photo-1494976388531-d1058094e2bd?q=80&w=600', 1, 'Foto Depan Sesudah - Brio Mar 1 Selesai'),
    (1, 5, 'D 1234 ABC', 'https://images.unsplash.com/photo-1511919884226-fd3cad34687c?q=80&w=600', 1, 'Foto Belakang Sesudah - Brio Mar 1 Selesai'),
    (1, 5, 'D 1234 ABC', 'https://images.unsplash.com/photo-1504215680048-db15dc05967c?q=80&w=600', 1, 'Foto Kanan Sesudah - Brio Mar 1 Selesai'),
    (1, 5, 'D 1234 ABC', 'https://images.unsplash.com/photo-1541348263662-e0d864388e7a?q=80&w=600', 1, 'Foto Kiri Sesudah - Brio Mar 1 Selesai'),

    -- Baris 22: Pearce - Xpander (D 8888 XYZ) - 2026-03-05
    (2, 3, 'D 8888 XYZ', 'https://images.unsplash.com/photo-1533473359331-0135ef1b58bf?q=80&w=600', 0, 'Foto Depan Sebelum - Xpander Mar 5'),
    (2, 3, 'D 8888 XYZ', 'https://images.unsplash.com/photo-1541899481282-d53bffe3c35d?q=80&w=600', 0, 'Foto Belakang Sebelum - Xpander Mar 5'),
    (2, 3, 'D 8888 XYZ', 'https://images.unsplash.com/photo-1502877338535-766e1452684a?q=80&w=600', 0, 'Foto Kanan Sebelum - Xpander Mar 5'),
    (2, 3, 'D 8888 XYZ', 'https://images.unsplash.com/photo-1492144534655-ae79c964c9d7?q=80&w=600', 0, 'Foto Kiri Sebelum - Xpander Mar 5'),
    (2, 3, 'D 8888 XYZ', 'https://images.unsplash.com/photo-1489824904134-891ab64532f1?q=80&w=600', 1, 'Foto Depan Sesudah - Xpander Mar 5 Selesai'),
    (2, 3, 'D 8888 XYZ', 'https://images.unsplash.com/photo-1583121274602-3e2820c69888?q=80&w=600', 1, 'Foto Belakang Sesudah - Xpander Mar 5 Selesai'),
    (2, 3, 'D 8888 XYZ', 'https://images.unsplash.com/photo-1553440569-bcc63803a83d?q=80&w=600', 1, 'Foto Kanan Sesudah - Xpander Mar 5 Selesai'),
    (2, 3, 'D 8888 XYZ', 'https://images.unsplash.com/photo-1542346656-e652a9757657?q=80&w=600', 1, 'Foto Kiri Sesudah - Xpander Mar 5 Selesai'),

    -- Baris 23: Fadhil - Ertiga (D 4567 EFG) - 2026-03-12
    (1, 4, 'D 4567 EFG', 'https://images.unsplash.com/photo-1549399542-7e3f8b79c341?q=80&w=600', 0, 'Foto Depan Sebelum - Ertiga Mar 12'),
    (1, 4, 'D 4567 EFG', 'https://images.unsplash.com/photo-1617788138017-80ad40651399?q=80&w=600', 0, 'Foto Belakang Sebelum - Ertiga Mar 12'),
    (1, 4, 'D 4567 EFG', 'https://images.unsplash.com/photo-1619767886558-efdc259cde1a?q=80&w=600', 0, 'Foto Kanan Sebelum - Ertiga Mar 12'),
    (1, 4, 'D 4567 EFG', 'https://images.unsplash.com/photo-1580273916550-e323be2ae537?q=80&w=600', 0, 'Foto Kiri Sebelum - Ertiga Mar 12'),
    (1, 4, 'D 4567 EFG', 'https://images.unsplash.com/photo-1568605117036-5fe5e7bab0b7?q=80&w=600', 1, 'Foto Depan Sesudah - Ertiga Mar 12 Selesai'),
    (1, 4, 'D 4567 EFG', 'https://images.unsplash.com/photo-1503376780353-7e6692767b70?q=80&w=600', 1, 'Foto Belakang Sesudah - Ertiga Mar 12 Selesai'),
    (1, 4, 'D 4567 EFG', 'https://images.unsplash.com/photo-1542282088-72c9c27ed0cd?q=80&w=600', 1, 'Foto Kanan Sesudah - Ertiga Mar 12 Selesai'),
    (1, 4, 'D 4567 EFG', 'https://images.unsplash.com/photo-1552519507-da3b142c6e3d?q=80&w=600', 1, 'Foto Kiri Sesudah - Ertiga Mar 12 Selesai'),

    -- Baris 24: Pearce - Sigra (D 2910 OPQ) - 2026-03-20
    (2, 5, 'D 2910 OPQ', 'https://images.unsplash.com/photo-1525609004556-c46c7d6cf0a3?q=80&w=600', 0, 'Foto Depan Sebelum - Sigra Mar 20'),
    (2, 5, 'D 2910 OPQ', 'https://images.unsplash.com/photo-1552519507-da3b142c6e3d?q=80&w=600', 0, 'Foto Belakang Sebelum - Sigra Mar 20'),
    (2, 5, 'D 2910 OPQ', 'https://images.unsplash.com/photo-1503376780353-7e6692767b70?q=80&w=600', 0, 'Foto Kanan Sebelum - Sigra Mar 20'),
    (2, 5, 'D 2910 OPQ', 'https://images.unsplash.com/photo-1568605117036-5fe5e7bab0b7?q=80&w=600', 0, 'Foto Kiri Sebelum - Sigra Mar 20'),
    (2, 5, 'D 2910 OPQ', 'https://images.unsplash.com/photo-1494976388531-d1058094e2bd?q=80&w=600', 1, 'Foto Depan Sesudah - Sigra Mar 20 Selesai'),
    (2, 5, 'D 2910 OPQ', 'https://images.unsplash.com/photo-1511919884226-fd3cad34687c?q=80&w=600', 1, 'Foto Belakang Sesudah - Sigra Mar 20 Selesai'),
    (2, 5, 'D 2910 OPQ', 'https://images.unsplash.com/photo-1504215680048-db15dc05967c?q=80&w=600', 1, 'Foto Kanan Sesudah - Sigra Mar 20 Selesai'),
    (2, 5, 'D 2910 OPQ', 'https://images.unsplash.com/photo-1541348263662-e0d864388e7a?q=80&w=600', 1, 'Foto Kiri Sesudah - Sigra Mar 20 Selesai'),

    -- Baris 25: Fadhil - Stargazer (D 7117 VST) - 2026-04-02
    (1, 3, 'D 7117 VST', 'https://images.unsplash.com/photo-1533473359331-0135ef1b58bf?q=80&w=600', 0, 'Foto Depan Sebelum - Stargazer Apr 2'),
    (1, 3, 'D 7117 VST', 'https://images.unsplash.com/photo-1541899481282-d53bffe3c35d?q=80&w=600', 0, 'Foto Belakang Sebelum - Stargazer Apr 2'),
    (1, 3, 'D 7117 VST', 'https://images.unsplash.com/photo-1502877338535-766e1452684a?q=80&w=600', 0, 'Foto Kanan Sebelum - Stargazer Apr 2'),
    (1, 3, 'D 7117 VST', 'https://images.unsplash.com/photo-1492144534655-ae79c964c9d7?q=80&w=600', 0, 'Foto Kiri Sebelum - Stargazer Apr 2'),
    (1, 3, 'D 7117 VST', 'https://images.unsplash.com/photo-1489824904134-891ab64532f1?q=80&w=600', 1, 'Foto Depan Sesudah - Stargazer Apr 2 Selesai'),
    (1, 3, 'D 7117 VST', 'https://images.unsplash.com/photo-1583121274602-3e2820c69888?q=80&w=600', 1, 'Foto Belakang Sesudah - Stargazer Apr 2 Selesai'),
    (1, 3, 'D 7117 VST', 'https://images.unsplash.com/photo-1553440569-bcc63803a83d?q=80&w=600', 1, 'Foto Kanan Sesudah - Stargazer Apr 2 Selesai'),
    (1, 3, 'D 7117 VST', 'https://images.unsplash.com/photo-1542346656-e652a9757657?q=80&w=600', 1, 'Foto Kiri Sesudah - Stargazer Apr 2 Selesai'),

    -- Baris 26: Pearce - Brio (D 1234 ABC) - 2026-04-10
    (2, 4, 'D 1234 ABC', 'https://images.unsplash.com/photo-1549399542-7e3f8b79c341?q=80&w=600', 0, 'Foto Depan Sebelum - Brio Apr 10'),
    (2, 4, 'D 1234 ABC', 'https://images.unsplash.com/photo-1617788138017-80ad40651399?q=80&w=600', 0, 'Foto Belakang Sebelum - Brio Apr 10'),
    (2, 4, 'D 1234 ABC', 'https://images.unsplash.com/photo-1619767886558-efdc259cde1a?q=80&w=600', 0, 'Foto Kanan Sebelum - Brio Apr 10'),
    (2, 4, 'D 1234 ABC', 'https://images.unsplash.com/photo-1580273916550-e323be2ae537?q=80&w=600', 0, 'Foto Kiri Sebelum - Brio Apr 10'),
    (2, 4, 'D 1234 ABC', 'https://images.unsplash.com/photo-1568605117036-5fe5e7bab0b7?q=80&w=600', 1, 'Foto Depan Sesudah - Brio Apr 10 Selesai'),
    (2, 4, 'D 1234 ABC', 'https://images.unsplash.com/photo-1503376780353-7e6692767b70?q=80&w=600', 1, 'Foto Belakang Sesudah - Brio Apr 10 Selesai'),
    (2, 4, 'D 1234 ABC', 'https://images.unsplash.com/photo-1542282088-72c9c27ed0cd?q=80&w=600', 1, 'Foto Kanan Sesudah - Brio Apr 10 Selesai'),
    (2, 4, 'D 1234 ABC', 'https://images.unsplash.com/photo-1552519507-da3b142c6e3d?q=80&w=600', 1, 'Foto Kiri Sesudah - Brio Apr 10 Selesai'),

    -- Baris 27: Fadhil - Xpander (D 8888 XYZ) - 2026-04-18
    (1, 5, 'D 8888 XYZ', 'https://images.unsplash.com/photo-1525609004556-c46c7d6cf0a3?q=80&w=600', 0, 'Foto Depan Sebelum - Xpander Apr 18'),
    (1, 5, 'D 8888 XYZ', 'https://images.unsplash.com/photo-1552519507-da3b142c6e3d?q=80&w=600', 0, 'Foto Belakang Sebelum - Xpander Apr 18'),
    (1, 5, 'D 8888 XYZ', 'https://images.unsplash.com/photo-1503376780353-7e6692767b70?q=80&w=600', 0, 'Foto Kanan Sebelum - Xpander Apr 18'),
    (1, 5, 'D 8888 XYZ', 'https://images.unsplash.com/photo-1568605117036-5fe5e7bab0b7?q=80&w=600', 0, 'Foto Kiri Sebelum - Xpander Apr 18'),
    (1, 5, 'D 8888 XYZ', 'https://images.unsplash.com/photo-1494976388531-d1058094e2bd?q=80&w=600', 1, 'Foto Depan Sesudah - Xpander Apr 18 Selesai'),
    (1, 5, 'D 8888 XYZ', 'https://images.unsplash.com/photo-1511919884226-fd3cad34687c?q=80&w=600', 1, 'Foto Belakang Sesudah - Xpander Apr 18 Selesai'),
    (1, 5, 'D 8888 XYZ', 'https://images.unsplash.com/photo-1504215680048-db15dc05967c?q=80&w=600', 1, 'Foto Kanan Sesudah - Xpander Apr 18 Selesai'),
    (1, 5, 'D 8888 XYZ', 'https://images.unsplash.com/photo-1541348263662-e0d864388e7a?q=80&w=600', 1, 'Foto Kiri Sesudah - Xpander Apr 18 Selesai'),

    -- =====================================================================
    -- REKOR BULAN JUNI 2026 (STATUS: ONGOING -> HANYA FOTO SEBELUM KONDISI 0)
    -- =====================================================================
    -- Baris 28: Pearce - Ertiga (D 4567 EFG) - 2026-06-01 (Ongoing)
    (2, 3, 'D 4567 EFG', 'https://images.unsplash.com/photo-1533473359331-0135ef1b58bf?q=80&w=600', 0, 'Foto Depan Sebelum Sewa - Ertiga Ongoing 1'),
    (2, 3, 'D 4567 EFG', 'https://images.unsplash.com/photo-1541899481282-d53bffe3c35d?q=80&w=600', 0, 'Foto Belakang Sebelum Sewa - Ertiga Ongoing 1'),
    (2, 3, 'D 4567 EFG', 'https://images.unsplash.com/photo-1502877338535-766e1452684a?q=80&w=600', 0, 'Foto Kanan Sebelum Sewa - Ertiga Ongoing 1'),
    (2, 3, 'D 4567 EFG', 'https://images.unsplash.com/photo-1492144534655-ae79c964c9d7?q=80&w=600', 0, 'Foto Kiri Sebelum Sewa - Ertiga Ongoing 1'),

    -- Baris 29: Fadhil - Sigra (D 2910 OPQ) - 2026-06-03 (Ongoing)
    (1, 4, 'D 2910 OPQ', 'https://images.unsplash.com/photo-1549399542-7e3f8b79c341?q=80&w=600', 0, 'Foto Depan Sebelum Sewa - Sigra Ongoing 2'),
    (1, 4, 'D 2910 OPQ', 'https://images.unsplash.com/photo-1617788138017-80ad40651399?q=80&w=600', 0, 'Foto Belakang Sebelum Sewa - Sigra Ongoing 2'),
    (1, 4, 'D 2910 OPQ', 'https://images.unsplash.com/photo-1619767886558-efdc259cde1a?q=80&w=600', 0, 'Foto Kanan Sebelum Sewa - Sigra Ongoing 2'),
    (1, 4, 'D 2910 OPQ', 'https://images.unsplash.com/photo-1580273916550-e323be2ae537?q=80&w=600', 0, 'Foto Kiri Sebelum Sewa - Sigra Ongoing 2'),

    -- Baris 30: Pearce - Stargazer (D 7117 VST) - 2026-06-04 (Ongoing)
    (2, 5, 'D 7117 VST', 'https://images.unsplash.com/photo-1525609004556-c46c7d6cf0a3?q=80&w=600', 0, 'Foto Depan Sebelum Sewa - Stargazer Ongoing 3'),
    (2, 5, 'D 7117 VST', 'https://images.unsplash.com/photo-1552519507-da3b142c6e3d?q=80&w=600', 0, 'Foto Belakang Sebelum Sewa - Stargazer Ongoing 3'),
    (2, 5, 'D 7117 VST', 'https://images.unsplash.com/photo-1503376780353-7e6692767b70?q=80&w=600', 0, 'Foto Kanan Sebelum Sewa - Stargazer Ongoing 3'),
    (2, 5, 'D 7117 VST', 'https://images.unsplash.com/photo-1568605117036-5fe5e7bab0b7?q=80&w=600', 0, 'Foto Kiri Sebelum Sewa - Stargazer Ongoing 3'),

    -- Baris 33: Fadhil - Ertiga (D 4567 EFG) - 2026-06-02 (Ongoing Terverifikasi Manusia)
    (1, 3, 'D 4567 EFG', 'https://images.unsplash.com/photo-1494976388531-d1058094e2bd?q=80&w=600', 0, 'Foto Depan Sebelum Sewa - Ertiga Ongoing Steven'),
    (1, 3, 'D 4567 EFG', 'https://images.unsplash.com/photo-1511919884226-fd3cad34687c?q=80&w=600', 0, 'Foto Belakang Sebelum Sewa - Ertiga Ongoing Steven'),
    (1, 3, 'D 4567 EFG', 'https://images.unsplash.com/photo-1504215680048-db15dc05967c?q=80&w=600', 0, 'Foto Kanan Sebelum Sewa - Ertiga Ongoing Steven'),
    (1, 3, 'D 4567 EFG', 'https://images.unsplash.com/photo-1541348263662-e0d864388e7a?q=80&w=600', 0, 'Foto Kiri Sebelum Sewa - Ertiga Ongoing Steven'),

    -- Baris 34: Pearce - Sigra (D 2910 OPQ) - 2026-06-03 (Ongoing Terverifikasi Manusia)
    (2, 3, 'D 2910 OPQ', 'https://images.unsplash.com/photo-1533473359331-0135ef1b58bf?q=80&w=600', 0, 'Foto Depan Sebelum Sewa - Sigra Ongoing Steven'),
    (2, 3, 'D 2910 OPQ', 'https://images.unsplash.com/photo-1541899481282-d53bffe3c35d?q=80&w=600', 0, 'Foto Belakang Sebelum Sewa - Sigra Ongoing Steven'),
    (2, 3, 'D 2910 OPQ', 'https://images.unsplash.com/photo-1502877338535-766e1452684a?q=80&w=600', 0, 'Foto Kanan Sebelum Sewa - Sigra Ongoing Steven'),
    (2, 3, 'D 2910 OPQ', 'https://images.unsplash.com/photo-1492144534655-ae79c964c9d7?q=80&w=600', 0, 'Foto Kiri Sebelum Sewa - Sigra Ongoing Steven');

-- KETERANGAN NOTE:
-- Baris 31 (Xpander D 8888 XYZ) dan Baris 32 (Stargazer D 7117 VST) Bulan Juni dengan Pegawai ID 5 (SISTEM AUTOMATION)
-- sengaja TIDAK dimasukkan ke tabel FOTO ini karena statusnya masih "Menunggu Verifikasi" (Belum ada serah terima foto).

PRINT 'Query INSERT INTO FOTO massal selesai dijalankan!';
GO



-- DELETE UNTUK TEST
USE CarRentalDB;
GO

PRINT '=== MEMULAI PROSES PEMBERSIHAN DATA ===';

-- 1. HAPUS TABEL TRANSAKSI ANAK (Paling Bawah)
-- Tabel ini bergantung pada PEMINJAMAN, PEGAWAI, dan MEMBER
PRINT 'Cleaning FOTO...';
DELETE FROM FOTO;

-- 2. HAPUS TABEL TRANSAKSI UTAMA
-- Tabel ini bergantung pada MOBIL, MEMBER, dan PEGAWAI
PRINT 'Cleaning PEMINJAMAN...';
DELETE FROM PEMINJAMAN;

-- 3. HAPUS TABEL RELASI ENTITAS
-- Tabel-tabel ini bergantung pada USER dan CABANG
PRINT 'Cleaning MEMBER...';
DELETE FROM MEMBER;

PRINT 'Cleaning PEGAWAI...';
DELETE FROM PEGAWAI;

-- 4. HAPUS DATA MASTER UTAMA
-- Tabel MOBIL bergantung pada CABANG, TIPE_MOBIL, dan MEREK_MOBIL
PRINT 'Cleaning MOBIL...';
DELETE FROM MOBIL;

PRINT 'Cleaning [USER]...';
DELETE FROM [USER];

PRINT 'Cleaning CABANG...';
DELETE FROM CABANG;

PRINT 'Cleaning TIPE_MOBIL...';
DELETE FROM TIPE_MOBIL;

PRINT 'Cleaning MEREK_MOBIL...';
DELETE FROM MEREK_MOBIL;

-- 5. RESET IDENTITY SEED (Opsional)
-- Agar nomor ID IDENTITY(1,1) kembali merayap dari angka 1 lagi
PRINT 'Resetting Auto-Increment Auto IDs...';
DBCC CHECKIDENT ('TIPE_MOBIL', RESEED, 0);
DBCC CHECKIDENT ('MEREK_MOBIL', RESEED, 0);
DBCC CHECKIDENT ('[USER]', RESEED, 0);
DBCC CHECKIDENT ('CABANG', RESEED, 0);
DBCC CHECKIDENT ('FOTO', RESEED, 0);

PRINT '=== ALL DATA SUCCESSFULLY WIPED CLEAN ===';
GO