-- ============================================================================
-- SQL SCRIPT: CarRentalDB Schema Setup
-- Database Engine: Microsoft SQL Server (MS SQL Server)
-- Design Pattern: Relational Layout with Composite Primary Keys & Role Separation
-- ============================================================================

-- Create database container from scratch
CREATE DATABASE CarRentalDB;
GO

USE CarRentalDB;
GO

-- ==========================================
-- 1. BASE INDEPENDENT TABLES (LEVEL 1)
-- ==========================================

-- Lookup table to handle car classifications (e.g., SUV, Sedan, MPV)
CREATE TABLE TIPE_MOBIL (
    IDTipe INT IDENTITY(1,1) PRIMARY KEY,
    NamaTipe VARCHAR(255) NOT NULL,
    Kapasitas INT NOT NULL
);

-- Lookup table to handle vehicle manufacturers/brands (e.g., Toyota, Honda)
CREATE TABLE MEREK_MOBIL (
    IDMerek INT IDENTITY(1,1) PRIMARY KEY,
    NamaMerek VARCHAR(255) NOT NULL
);

-- Parent identity table storing universal core details of all human profiles
CREATE TABLE [USER] (
    IDUser INT IDENTITY(1,1) PRIMARY KEY,
    Nama VARCHAR(255) NOT NULL,
    TanggalLahir DATE NOT NULL,
    JenisKelamin VARCHAR(20) NOT NULL 
);

-- Master directory tracking physical shop branch storefront locations
CREATE TABLE CABANG (
    IDCabang INT IDENTITY(1,1) PRIMARY KEY,
    NamaCabang VARCHAR(255) NOT NULL,
    NamaJalan VARCHAR(255) NOT NULL
);

-- ==========================================
-- 2. WEAK ENTITIES & INHERITANCE (LEVEL 2)
-- ==========================================

-- Core vehicle fleet tracking linked directly to structural lookups
CREATE TABLE MOBIL (
    Nopol VARCHAR(20) PRIMARY KEY,
    IDTipe INT NOT NULL,
    IDMerek INT NOT NULL,
    HargaSewaMobil DECIMAL(12, 2) NOT NULL,
    TahunPembuatan INT NOT NULL,
    FOREIGN KEY (IDTipe) REFERENCES TIPE_MOBIL(IDTipe),
    FOREIGN KEY (IDMerek) REFERENCES MEREK_MOBIL(IDMerek)
);

-- Customer account extension of the base [USER] identity
CREATE TABLE MEMBER (
    IDUser INT PRIMARY KEY,
    NoSIM VARCHAR(50) NOT NULL,
    FOREIGN KEY (IDUser) REFERENCES [USER](IDUser) ON DELETE CASCADE
);

-- Employee account extension of the base [USER] identity assigned to a branch
CREATE TABLE PEGAWAI (
    IDUser INT PRIMARY KEY,
    IDCabang INT NOT NULL,
    FOREIGN KEY (IDUser) REFERENCES [USER](IDUser) ON DELETE CASCADE,
    FOREIGN KEY (IDCabang) REFERENCES CABANG(IDCabang)
);

-- Multivalued attribute table for storing multiple user email profiles
CREATE TABLE EMAIL_USER (
    IDUser INT,
    IDEmail INT IDENTITY(1,1),
    AlamatEmail VARCHAR(255) NOT NULL,
    PRIMARY KEY (IDUser, IDEmail),
    FOREIGN KEY (IDUser) REFERENCES [USER](IDUser) ON DELETE CASCADE
);

-- Multivalued attribute table for storing multiple user contact numbers
CREATE TABLE NOTELP_USER (
    IDUser INT,
    IDNomor INT IDENTITY(1,1),
    NomorTelp VARCHAR(30) NOT NULL,
    PRIMARY KEY (IDUser, IDNomor),
    FOREIGN KEY (IDUser) REFERENCES [USER](IDUser) ON DELETE CASCADE
);

-- Multivalued attribute table for storing multiple branch email channels
CREATE TABLE EMAIL_CABANG (
    IDCabang INT,
    IDEmail INT IDENTITY(1,1),
    AlamatEmail VARCHAR(255) NOT NULL,
    PRIMARY KEY (IDCabang, IDEmail),
    FOREIGN KEY (IDCabang) REFERENCES CABANG(IDCabang) ON DELETE CASCADE
);

-- Multivalued attribute table for storing multiple branch phone lines
CREATE TABLE NOTELP_CABANG (
    IDCabang INT,
    IDNomor INT IDENTITY(1,1),
    NomorTelp VARCHAR(30) NOT NULL,
    PRIMARY KEY (IDCabang, IDNomor),
    FOREIGN KEY (IDCabang) REFERENCES CABANG(IDCabang) ON DELETE CASCADE
);

-- ==========================================
-- 3. TRANSACTIONAL & JCT TABLES (LEVEL 3)
-- ==========================================

-- Core rental ledger tracking explicit member-to-employee operational leases
CREATE TABLE PEMINJAMAN (
    IDUser1 INT, 
    Nopol VARCHAR(20),
    IDUser2 INT, 
    TanggalPeminjaman DATETIME,
    TanggalKembali DATETIME NULL,
    TanggalBatasPengembalian DATETIME NOT NULL,
    TotalBiaya DECIMAL(12, 2) NOT NULL,
    PersentaseDenda DECIMAL(5, 2) NOT NULL, 
    PRIMARY KEY (IDUser1, Nopol, IDUser2, TanggalPeminjaman),
    FOREIGN KEY (IDUser1) REFERENCES MEMBER(IDUser),   
    FOREIGN KEY (Nopol) REFERENCES MOBIL(Nopol),
    FOREIGN KEY (IDUser2) REFERENCES PEGAWAI(IDUser)   
);

-- Document storage table safeguarding image binary asset blobs for validation
CREATE TABLE FOTO (
    IDFoto INT IDENTITY(1,1) PRIMARY KEY,
    IDUser1 INT NOT NULL,
    IDUser2 INT NOT NULL,
    Nopol VARCHAR(20) NOT NULL,
    Gambar VARBINARY(MAX) NOT NULL, 
    Deskripsi TEXT NULL,
    FOREIGN KEY (IDUser1) REFERENCES MEMBER(IDUser),   
    FOREIGN KEY (IDUser2) REFERENCES PEGAWAI(IDUser),   
    FOREIGN KEY (Nopol) REFERENCES MOBIL(Nopol)
);
GO