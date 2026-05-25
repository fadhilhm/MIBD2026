-- ============================================================================
-- SQL SCRIPT: CarRentalDB Schema Setup
-- Database Engine: Microsoft SQL Server (MS SQL Server)
-- Design Pattern: Relational Layout with Composite Primary Keys 
-- ============================================================================

CREATE DATABASE CarRentalDB;
GO

USE CarRentalDB;
GO

-- Entity
CREATE TABLE TIPE_MOBIL (
    IDTipe INT IDENTITY(1,1) PRIMARY KEY,
    NamaTipe VARCHAR(255) NOT NULL, -- e.g., 'SUV', 'Sedan', 'MPV'
    Kapasitas INT NOT NULL          -- Passenger capacity, e.g., 5, 7
);

CREATE TABLE MEREK_MOBIL (
    IDMerek INT IDENTITY(1,1) PRIMARY KEY,
    NamaMerek VARCHAR(255) NOT NULL -- e.g., 'Toyota', 'Honda', 'Suzuki'
);

CREATE TABLE [USER] (
    IDUser INT IDENTITY(1,1) PRIMARY KEY,
    Nama VARCHAR(255) NOT NULL,
    TanggalLahir DATE NOT NULL,
    JenisKelamin VARCHAR(20) NOT NULL -- e.g., 'Pria', 'Wanita'
);

CREATE TABLE CABANG (
    IDCabang INT IDENTITY(1,1) PRIMARY KEY,
    NamaCabang VARCHAR(255) NOT NULL, -- e.g., 'Cabang Bandung', 'Cabang Jakarta'
    NamaJalan VARCHAR(255) NOT NULL   -- e.g., 'Jl. Ciumbuleuit No. 94'
);

CREATE TABLE MOBIL (
    Nopol VARCHAR(20) PRIMARY KEY, -- e.g., 'D 1234 ABC'
    IDTipe INT NOT NULL,
    IDMerek INT NOT NULL,
    HargaSewaMobil DECIMAL(12, 2) NOT NULL, -- Rental price per day, e.g., 500000.00
    TahunPembuatan INT NOT NULL,            -- Manufacturing year, e.g., 2022
    FOREIGN KEY (IDTipe) REFERENCES TIPE_MOBIL(IDTipe),
    FOREIGN KEY (IDMerek) REFERENCES MEREK_MOBIL(IDMerek)
);

CREATE TABLE MEMBER (
    IDUser INT PRIMARY KEY,
    NoSIM VARCHAR(50) NOT NULL, -- Driver's license number
    FOREIGN KEY (IDUser) REFERENCES [USER](IDUser) ON DELETE CASCADE
);

CREATE TABLE PEGAWAI (
    IDUser INT PRIMARY KEY,
    IDCabang INT NOT NULL,
    FOREIGN KEY (IDUser) REFERENCES [USER](IDUser) ON DELETE CASCADE,
    FOREIGN KEY (IDCabang) REFERENCES CABANG(IDCabang)
);

CREATE TABLE EMAIL_USER (
    IDUser INT,
    IDEmail INT IDENTITY(1,1),
    AlamatEmail VARCHAR(255) NOT NULL, -- e.g., 'user@mail.com'
    PRIMARY KEY (IDUser, IDEmail),
    FOREIGN KEY (IDUser) REFERENCES [USER](IDUser) ON DELETE CASCADE
);

CREATE TABLE NOTELP_USER (
    IDUser INT,
    IDNomor INT IDENTITY(1,1),
    NomorTelp VARCHAR(30) NOT NULL, -- e.g., '08123456789'
    PRIMARY KEY (IDUser, IDNomor),
    FOREIGN KEY (IDUser) REFERENCES [USER](IDUser) ON DELETE CASCADE
);

CREATE TABLE EMAIL_CABANG (
    IDCabang INT,
    IDEmail INT IDENTITY(1,1),
    AlamatEmail VARCHAR(255) NOT NULL, -- e.g., 'branch@mail.com'
    PRIMARY KEY (IDCabang, IDEmail),
    FOREIGN KEY (IDCabang) REFERENCES CABANG(IDCabang) ON DELETE CASCADE
);

CREATE TABLE NOTELP_CABANG (
    IDCabang INT,
    IDNomor INT IDENTITY(1,1),
    NomorTelp VARCHAR(30) NOT NULL, -- e.g., '022123456'
    PRIMARY KEY (IDCabang, IDNomor),
    FOREIGN KEY (IDCabang) REFERENCES CABANG(IDCabang) ON DELETE CASCADE
);

-- Relation
CREATE TABLE PEMINJAMAN (
    IDMember INT,                          
    Nopol VARCHAR(20),
    IDPegawai INT,                         
    TanggalPeminjaman DATETIME,
    TanggalKembali DATETIME NULL,
    TanggalBatasPengembalian DATETIME NOT NULL,
    TotalBiaya DECIMAL(12, 2) NOT NULL,
    PersentaseDenda DECIMAL(5, 2) NOT NULL, -- e.g., 10.50 for 10.5%
    PRIMARY KEY (IDMember, Nopol, IDPegawai, TanggalPeminjaman),
    FOREIGN KEY (IDMember) REFERENCES MEMBER(IDUser),   
    FOREIGN KEY (Nopol) REFERENCES MOBIL(Nopol),
    FOREIGN KEY (IDPegawai) REFERENCES PEGAWAI(IDUser)   
);

CREATE TABLE FOTO (
    IDFoto INT IDENTITY(1,1) PRIMARY KEY,
    IDMember INT NOT NULL,                 
    IDPegawai INT NOT NULL,                
    Nopol VARCHAR(20) NOT NULL,
    Gambar VARCHAR(2048) NOT NULL, -- URL link path string to hosted cloud image asset
    Deskripsi TEXT NULL,           -- Condition notes or structural captions
    FOREIGN KEY (IDMember) REFERENCES MEMBER(IDUser),   
    FOREIGN KEY (IDPegawai) REFERENCES PEGAWAI(IDUser),   
    FOREIGN KEY (Nopol) REFERENCES MOBIL(Nopol)
);
GO