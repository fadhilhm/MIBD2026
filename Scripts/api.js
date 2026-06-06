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
            headers:{
                "Content-Type" : "application/json"
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

export function formatToRupiah(money) {
    return new Intl.NumberFormat('id-ID', {
        style: 'currency',
        currency: 'IDR',
        maximumFractionDigits: '0'
    }).format(money);
};