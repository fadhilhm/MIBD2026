export async function getDaftarMobil() {
    try {
        const response = await fetch('/api/get-data-mobil');

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
export async function addDataMobil(formData) {
    try {
        const response = await fetch('/api/add-data-mobil', {
            method: "POST",
            body: formData
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