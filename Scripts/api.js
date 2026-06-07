export async function getDaftarMobil() {
    try {
        const response = await fetch('/api/mobil/get-data-mobil');

        if (!response.ok) {
            throw new Error(`Gagal mengambil data. Status: ${response.status}`);
        }

        return await response.json();
    } catch (error) {
        console.error("Error pada Scripts/api.js (getDaftarMobil): ", error);
        throw error;
    }
}

// mengirim data mobil beserta file gambar ke db
export async function addDataMobil(data) {
    try {
        const response = await fetch('/api/mobil/add-data-mobil', {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(data)
        });

        if (!response.ok) {
            throw new Error(`Gagal menambahkan data mobil. Status: ${response.status}`);
        }

        return await response.json();
    } catch (error) {
        console.error("Error pada Scripts/api.js (addDataMobil): ", error);
        throw error;
    }
}

export async function getDataRiwayatRental() {
    try {
        const response = await fetch('/api/peminjaman/get-riwayat-rental');

        if (!response.ok) {
            throw new Error(`Gagal mengambil riwayat rental. Status: ${response.status}`);
        }

        return await response.json();
    } catch (error) {
        console.error("Error pada Scripts/api.js (getRiwayatRental)", error);
        throw error
    }
}

export async function deleteMobilAPI(nopol, version){
    try {
        // clean
        const url = `/api/mobil/delete-mobil/${encodeURIComponent(nopol)}?version=${version}`;
        
        const response = await fetch(url, {
            method: "DELETE"
        });

        return await response.json();
    } catch (error) {
        console.error("Error pada Scripts/api.js (deleteMobilAPI): ", error);
        throw error;
    }
}

export async function addBooking(data) {
    try {
        const req = await fetch('/api/peminjaman/booking', {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(data)
        });

        const res = await req.json();

        if (res.success === true) {
            alert(res.message);
        } else {
            alert("tidak berhasil");
        }
    } catch (error) {
        console.log(error);
    }
}

export function formatToRupiah(money) {
    return new Intl.NumberFormat('id-ID', {
        style: 'currency',
        currency: 'IDR',
        maximumFractionDigits: '0'
    }).format(money);
};

export function formatToTanggalID(date) {
    return new Date(date).toLocaleDateString('id-ID', {
        day: 'numeric',
        month: 'long',
        year: 'numeric'
    });
}

/**
 * Destroy Session Saat Logout
 * Author: Pearce Nathaniel N.
 */

export async function logoutUser() {
    try {
        const response = await fetch('/api/logout', {
            method: 'POST'
        });

        if (!response.ok) {
            throw new Error(`Gagal destroy session. Status: ${response.status}`);
        }

        return response;
    } catch (error) {
        console.error("Error pada Scripts/api.js (logoutUser): ", error);
        throw error;
    }
}

/**
 * Fetch data Dashboard Pegawai
 * Author: Pearce Nathaniel N.
 */

export async function fetchDataDashboardPegawai() {
    try {

        const response = await   fetch('/api/peminjaman/peminjaman', {
            method: 'GET',
            headers: { 'Content-Type': 'application/json' }
        });

        if (!response.ok) {
            throw new Error(`Gagal fetch data dashboard pegawai. Status: ${response.status}`);
        }
        return response;
    } catch (error) {
        console.error("Error pada Scripts/api.js (fetchDataDashboardPegawai): ", error);
        throw error;
    }
}

// update data mobil
export async function updateDataMobil(data) {
    try {
        const response = await fetch(`/api/mobil/update-data-mobil`, {
            method: "PUT",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(data)
        });

        if (!response.ok) {
            throw new Error(`Gagal mengubah data mobil. Status: ${response.status}`);
        }

        return await response.json();
    } catch (error) {
        console.error("Error pada Scripts/api.js (updateDataMobil): ", error);
        throw error;
    }
}

// Format Tanggal untuk Pop Up Konfirmasi
export function formatToInputDate(date) {
    if (!date) return "";
    const d = new Date(date);
    
    // Ambil komponen tahun, bulan, dan tanggal
    const year = d.getFullYear();
    //getMonth() dimulai dari 0 (Januari = 0), maka harus ditambah 1. padStart memastikan selalu 2 digit (01, 02, dst)
    const month = String(d.getMonth() + 1).padStart(2, '0');
    const day = String(d.getDate()).padStart(2, '0');
    
    return `${year}-${month}-${day}`; // Menghasilkan format tepat: YYYY-MM-DD
}