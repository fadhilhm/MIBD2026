export async function getDaftarMobil() {
    try {
        const response = await fetch('api/data_mobil');

        if (!response.ok) {
            throw new Error(`Gagal mengambil data. Status: ${response.status}`);
        }

        return await response.json();
    } catch (error) {
        console.error("Error pada Scripts/api.js: ", error);

        throw error;
    }
}