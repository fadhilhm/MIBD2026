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
    JenisKelamin VARCHAR(20) NOT NULL 
);
ALTER TABLE [USER]
ADD [UserPassword] VARCHAR(50) NOT NULL

ALTER TABLE [USER]
ADD [Role] INT NOT NULL

CREATE TABLE CABANG (
    IDCabang INT IDENTITY(1,1) PRIMARY KEY,
    NamaCabang VARCHAR(255) NOT NULL, 
    NamaJalan VARCHAR(255) NOT NULL   
);

CREATE TABLE MOBIL (
    Nopol VARCHAR(20) PRIMARY KEY, 
    IDTipe INT NOT NULL,
    IDMerek INT NOT NULL,
    HargaSewaMobil DECIMAL(12, 2) NOT NULL, 
    TahunPembuatan INT NOT NULL,            
    FOREIGN KEY (IDTipe) REFERENCES TIPE_MOBIL(IDTipe),
    FOREIGN KEY (IDMerek) REFERENCES MEREK_MOBIL(IDMerek)
);

ALTER TABLE MOBIL
ADD IDCabang INT NOT NULL
FOREIGN KEY REFERENCES CABANG(IDCabang);

CREATE TABLE MEMBER (
    IDUser INT PRIMARY KEY,
    NoSIM VARCHAR(50) NOT NULL, 
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
    AlamatEmail VARCHAR(255) NOT NULL,
    PRIMARY KEY (IDUser, IDEmail),
    FOREIGN KEY (IDUser) REFERENCES [USER](IDUser) ON DELETE CASCADE
);

CREATE TABLE NOTELP_USER (
    IDUser INT,
    IDNomor INT IDENTITY(1,1),
    NomorTelp VARCHAR(30) NOT NULL, 
    PRIMARY KEY (IDUser, IDNomor),
    FOREIGN KEY (IDUser) REFERENCES [USER](IDUser) ON DELETE CASCADE
);

CREATE TABLE EMAIL_CABANG (
    IDCabang INT,
    IDEmail INT IDENTITY(1,1),
    AlamatEmail VARCHAR(255) NOT NULL, 
    PRIMARY KEY (IDCabang, IDEmail),
    FOREIGN KEY (IDCabang) REFERENCES CABANG(IDCabang) ON DELETE CASCADE
);

CREATE TABLE NOTELP_CABANG (
    IDCabang INT,
    IDNomor INT IDENTITY(1,1),
    NomorTelp VARCHAR(30) NOT NULL, 
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
    Gambar VARCHAR(2048) NOT NULL, -- Path to image
    Deskripsi TEXT NULL,           -- Condition notes or structural captions
    FOREIGN KEY (IDMember) REFERENCES MEMBER(IDUser),   
    FOREIGN KEY (IDPegawai) REFERENCES PEGAWAI(IDUser),   
    FOREIGN KEY (Nopol) REFERENCES MOBIL(Nopol)
);
GO