-- Create DB
CREATE DATABASE CarRentalDB;
GO

USE CarRentalDB;
GO

-- Entity
CREATE TABLE TIPE_MOBIL
(
    IDTipe INT IDENTITY(1,1) PRIMARY KEY,
    NamaTipe VARCHAR(255) NOT NULL,
    -- 'SUV', 'Sedan', 'MPV'
    Kapasitas INT NOT NULL
);

CREATE TABLE MEREK_MOBIL
(
    IDMerek INT IDENTITY(1,1) PRIMARY KEY,
    NamaMerek VARCHAR(255) NOT NULL
);

CREATE TABLE [USER]
(
    IDUser INT IDENTITY(1,1) PRIMARY KEY,
    Nama VARCHAR(255) NOT NULL,
    TanggalLahir DATE NOT NULL,
    JenisKelamin VARCHAR(20) NOT NULL,
    AlamatEmail VARCHAR(255) NOT NULL,
    UserPassword VARCHAR(50) NOT NULL,
    NomorTelp VARCHAR(30) NOT NULL,
    [Role] BIT NOT NULL
);

CREATE TABLE CABANG
(
    IDCabang INT IDENTITY(1,1) PRIMARY KEY,
    NamaCabang VARCHAR(255) NOT NULL,
    NamaJalan VARCHAR(255) NOT NULL,
    AlamatEmail VARCHAR(255) NOT NULL,
    NoTelp VARCHAR(30) NOT NULL
);

CREATE TABLE MOBIL
(
    Nopol VARCHAR(20) PRIMARY KEY,
    IDTipe INT NOT NULL,
    IDMerek INT NOT NULL,
    HargaSewaMobil DECIMAL(12, 2) NOT NULL,
    TahunPembuatan INT NOT NULL,
    IDCabang INT NOT NULL,
    isActive BIT NOT NULL DEFAULT 1,
    updatedAt DATETIME NOT NULL DEFAULT GETDATE(),
    [version] INT NOT NULL DEFAULT 1,
    FOREIGN KEY (IDCabang) REFERENCES CABANG(IDCabang),
    FOREIGN KEY (IDTipe) REFERENCES TIPE_MOBIL(IDTipe),
    FOREIGN KEY (IDMerek) REFERENCES MEREK_MOBIL(IDMerek)
);

CREATE TABLE MEMBER
(
    IDUser INT PRIMARY KEY,
    NoSIM VARCHAR(50) NOT NULL,
    FOREIGN KEY (IDUser) REFERENCES [USER](IDUser) ON DELETE CASCADE
);

CREATE TABLE PEGAWAI
(
    IDUser INT PRIMARY KEY,
    IDCabang INT NOT NULL,
    FOREIGN KEY (IDUser) REFERENCES [USER](IDUser) ON DELETE CASCADE,
    FOREIGN KEY (IDCabang) REFERENCES CABANG(IDCabang)
);

-- Atribut Multivalue
-- (hasil transformasi multivalue dari peminjaman)
CREATE TABLE FOTO
(
    IDFoto INT IDENTITY(1,1) PRIMARY KEY,
    IDMember INT NOT NULL,
    IDPegawai INT NOT NULL,
    Nopol VARCHAR(20) NOT NULL,
    Gambar VARCHAR(2048) NOT NULL,
    -- Path to image
    Kondisi BIT NOT NULL,
    -- 0 = sebelum, 1 = sesudah
    Deskripsi TEXT NULL,
    -- Condition notes or structural captions
    FOREIGN KEY (IDMember) REFERENCES MEMBER(IDUser),
    FOREIGN KEY (IDPegawai) REFERENCES PEGAWAI(IDUser),
    FOREIGN KEY (Nopol) REFERENCES MOBIL(Nopol)
);

-- Relasi
CREATE TABLE PEMINJAMAN
(
    IDMember INT NOT NULL,
    Nopol VARCHAR(20) NOT NULL,
    IDPegawai INT NOT NULL,
    TanggalPeminjaman DATE NOT NULL,
    TanggalKembali DATE NULL,
    TanggalBatasPengembalian DATE NOT NULL,
    TotalBiaya DECIMAL(12, 2) NOT NULL,
    TotalDenda DECIMAL(12, 2) NOT NULL DEFAULT 0, -- (akhir - awal) * 10% harga sewa
    PRIMARY KEY (IDMember, Nopol, IDPegawai, TanggalPeminjaman),
    FOREIGN KEY (IDMember) REFERENCES MEMBER(IDUser),
    FOREIGN KEY (Nopol) REFERENCES MOBIL(Nopol),
    FOREIGN KEY (IDPegawai) REFERENCES PEGAWAI(IDUser)
);
GO


