import { formatToRupiah, getDataRiwayatRental, formatToTanggalID, logoutUser } from "./api.js";

const dashboardButton = document.querySelector('.menu button:nth-child(1)')
const katalogMobilButton = document.querySelector('.menu button:nth-child(2)');
const exitButton = document.querySelector('.exit button');

katalogMobilButton.addEventListener('click', () => {
    window.location.href = '/katalog-mobil';
});


dashboardButton.addEventListener('click', () => {
    window.location.href = '/dashboard-member';
})

exitButton.addEventListener('click', () => {
    const confirmLogout = confirm("Apakah Anda yakin ingin keluar dari sistem?");

    if (confirmLogout) {
        window.location.href = '/login';
    }
})

const tableRiwayat = document.querySelector('.riwayat-transaksi table tbody');

async function renderRiwayatRental() {
    try {
        let daftarRiwayatRental = await getDataRiwayatRental();

        if (daftarRiwayatRental.length == 0) {
            tableRiwayat.innerHTML = `
            <tr> 
                    <th> Tidak ada riwayat rental. </th> 
            </tr>`;
            return;
        }

        daftarRiwayatRental.sort((a, b) => new Date(b.TanggalPeminjaman) - new Date(a.TanggalPeminjaman));

        daftarRiwayatRental.forEach(riwayat => {
            const hargaFormat = formatToRupiah(riwayat.TotalBiaya);
            const tanggalKembali = new Date(riwayat.TanggalKembali);
            const deadlinePengembalian = new Date(riwayat.TanggalBatasPengembalian);
            const hariIni = new Date();

            let status;

            if (riwayat.TanggalKembali == null)
                status = `
                <td class="status-container">  
                    <p class="active-status"> Aktif </p>
                </td>`;
            else if (tanggalKembali > deadlinePengembalian)
                status = `
                <td class="status-container">  
                    <p class="late-status"> Telat </p>
                </td>`;
            else
                status = `
                <td class="status-container">  
                    <p class="finished-status"> Selesai </p>
                </td>`;

            const rowRiwayat = `
                <tr>
                    <td> ${riwayat.NamaMerek} </td>
                    <td> ${riwayat.Nopol} </td>
                    <td> ${formatToTanggalID(riwayat.TanggalPeminjaman)} </td>
                    <td> ${formatToTanggalID(riwayat.TanggalBatasPengembalian)} </td>
                    <td> ${hargaFormat} </td>
                    ${status}
                </tr>
            `;

            tableRiwayat.insertAdjacentHTML('beforeend', rowRiwayat);
        });
    } catch (error) {
        console.log("Gagal memuat riwayat transaksi", error);
    }
}

document.addEventListener('DOMContentLoaded', renderRiwayatRental);