-- Create database container
CREATE DATABASE CarRentalDB;
GO

USE CarRentalDB;
GO

-- ==========================================
-- 1. BASE INDEPENDENT TABLES (LEVEL 1)
-- ==========================================

CREATE TABLE TIPE_MOBIL (
    IDTipe INT IDENTITY(1,1) PRIMARY KEY,
    NamaTipe VARCHAR(255) NOT NULL,
    Kapasitas INT NOT NULL
);

CREATE TABLE MEREK_MOBIL (
    IDMerek INT IDENTITY(1,1) PRIMARY KEY,
    NamaMerek VARCHAR(255) NOT NULL
);

CREATE TABLE [USER] (
    IDUser INT IDENTITY(1,1) PRIMARY KEY,
    Nama VARCHAR(255) NOT NULL,
    TanggalLahir DATE NOT NULL,
    JenisKelamin VARCHAR(20) NOT NULL -- e.g., Male/Female
);

CREATE TABLE CABANG (
    IDCabang INT IDENTITY(1,1) PRIMARY KEY,
    NamaCabang NVARCHAR(150) NOT NULL,
    NamaJalan NVARCHAR(255) NOT NULL
);

-- ==========================================
-- 2. WEAK ENTITIES & INHERITANCE (LEVEL 2)
-- ==========================================

CREATE TABLE MOBIL (
    Nopol NVARCHAR(20) PRIMARY KEY,
    IDTipe INT NOT NULL,
    IDMerek INT NOT NULL,
    HargaSewaMobil DECIMAL(12, 2) NOT NULL,
    TahunPembuatan INT NOT NULL,
    FOREIGN KEY (IDTipe) REFERENCES TIPE_MOBIL(IDTipe),
    FOREIGN KEY (IDMerek) REFERENCES MEREK_MOBIL(IDMerek)
);

CREATE TABLE MEMBER (
    IDUser INT PRIMARY KEY,
    NoSIM NVARCHAR(50) NOT NULL,
    FOREIGN KEY (IDUser) REFERENCES [USER](IDUser) ON DELETE CASCADE
);

CREATE TABLE PEGAWAI (
    IDUser INT PRIMARY KEY,
    IDCabang INT NOT NULL,
    FOREIGN KEY (IDUser) REFERENCES [USER](IDUser) ON DELETE CASCADE,
    FOREIGN KEY (IDCabang) REFERENCES CABANG(IDCabang)
);

-- Multivalued Attributes for USER
CREATE TABLE EMAIL_USER (
    IDUser INT,
    IDEmail INT IDENTITY(1,1),
    AlamatEmail NVARCHAR(255) NOT NULL,
    PRIMARY KEY (IDUser, IDEmail),
    FOREIGN KEY (IDUser) REFERENCES [USER](IDUser) ON DELETE CASCADE
);

CREATE TABLE NOTELP_USER (
    IDUser INT,
    IDNomor INT IDENTITY(1,1),
    NomorTelp NVARCHAR(30) NOT NULL,
    PRIMARY KEY (IDUser, IDNomor),
    FOREIGN KEY (IDUser) REFERENCES [USER](IDUser) ON DELETE CASCADE
);

-- Multivalued Attributes for CABANG
CREATE TABLE EMAIL_CABANG (
    IDCabang INT,
    IDEmail INT IDENTITY(1,1),
    AlamatEmail NVARCHAR(255) NOT NULL,
    PRIMARY KEY (IDCabang, IDEmail),
    FOREIGN KEY (IDCabang) REFERENCES CABANG(IDCabang) ON DELETE CASCADE
);

CREATE TABLE NOTELP_CABANG (
    IDCabang INT,
    IDNomor INT IDENTITY(1,1),
    NomorTelp NVARCHAR(30) NOT NULL,
    PRIMARY KEY (IDCabang, IDNomor),
    FOREIGN KEY (IDCabang) REFERENCES CABANG(IDCabang) ON DELETE CASCADE
);

-- ==========================================
-- 3. TRANSACTIONAL & JCT TABLES (LEVEL 3)
-- ==========================================

CREATE TABLE PEMINJAMAN (
    IDUser1 INT, -- Typically the Member/Customer renting
    Nopol NVARCHAR(20),
    IDUser2 INT, -- Typically the Employee handling the transaction
    TanggalPeminjaman DATETIME,
    TanggalKembali DATETIME NULL,
    TanggalBatasPengembalian DATETIME NOT NULL,
    TotalBiaya DECIMAL(12, 2) NOT NULL,
    PersentaseDenda DECIMAL(5, 2) NOT NULL, -- e.g., 10.50 for 10.5%
    PRIMARY KEY (IDUser1, Nopol, IDUser2, TanggalPeminjaman),
    FOREIGN KEY (IDUser1) REFERENCES [USER](IDUser),
    FOREIGN KEY (Nopol) REFERENCES MOBIL(Nopol),
    FOREIGN KEY (IDUser2) REFERENCES [USER](IDUser)
);

CREATE TABLE FOTO (
    IDFoto INT IDENTITY(1,1) PRIMARY KEY,
    IDUser1 INT NOT NULL,
    IDUser2 INT NOT NULL,
    Nopol NVARCHAR(20) NOT NULL,
    Gambar VARBINARY(MAX) NOT NULL, -- Storing image blob strings securely
    Deskripsi TEXT NULL,
    FOREIGN KEY (IDUser1) REFERENCES [USER](IDUser),
    FOREIGN KEY (IDUser2) REFERENCES [USER](IDUser),
    FOREIGN KEY (Nopol) REFERENCES MOBIL(Nopol)
);
GO