import { fetchDataDashboardPegawai, formatToRupiah, formatToTanggalID, formatToInputDate } from './api.js';

// Kelola Mobil
const kelolaMobilButton = document.getElementById("kelola-mobil-btn");
const exitButton = document.getElementById('exit-button');

// Pop Up 
const popupOverlay = document.getElementById("popupOverlay");
const actionBtn = document.getElementById("action-button");
const closePopUpButton = document.getElementById("closePopup");
const btnCancel = document.getElementById("cancelPopup");
// Pop Up Konfirmasi
const popupOverlayKonfirmasi = document.getElementById("popupOverlayKonfirmasi");
const actionBtnKonfirmasi = document.getElementById("action-button-konfirmasi");
const closePopUpButtonKonfirmasi = document.getElementById("closePopupKonfirmasi");
const btnCancelkonfirmasi = document.getElementById("cancelPopupKonfirmasi");
const tbodyPeminjaman = document.getElementById("table-body-peminjaman");

// Data dari query
let listRecordsDashboardGlobal = [];

// Navigasi
kelolaMobilButton.addEventListener('click', (e) => {
    e.preventDefault();
    window.location.href = '/kelola-mobil';
})

/**
 * Log Out Confirmation Pop up & Session Destroy 
 * Author: Pearce Nathaniel N.
*/
exitButton.type = 'button';
exitButton.addEventListener('click', async (e) => {
    e.preventDefault();
    e.stopPropagation();

    const confirmLogout = confirm("Apakah Anda yakin ingin keluar dari sistem?");
    if (!confirmLogout) return; // If cancel, abort

    // Prevent double events
    if (exitButton.getAttribute('data-loading') === 'true') return;
    // Mark proses sedang berjalan
    exitButton.setAttribute('data-loading', 'true');
    const originalHTML = exitButton.innerHTML;
    exitButton.innerText = "Keluar..."

    try {
        const res = await logoutUser();
        if (res.ok) {
            window.location.href = '/login';
        } else {
            alert("Gagal keluar dari server. Silahkan coba kembali.");
            exitButton.removeAttribute('data-loading');
            exitButton.innerHTML = originalHTML;
        };
    } catch (error) {
        console.error("Detail Error Jaringan: ", error);
        window.location.href = '/login';
    }

})


// actionBtn.addEventListener("click", (e) => {
//     e.preventDefault();
//     popupOverlay.classList.add("active");
// });

// pop up unable
closePopUpButton.addEventListener('click', (e) => {
    e.preventDefault();
    popupOverlay.classList.remove("active");
});

btnCancel.addEventListener("click", (e) => {
    e.preventDefault();
    popupOverlay.classList.remove("active");
});

/**
 * Show data peminjaman di Dashboard Pegawai
 * Author: Pearce Nathaniel N.
 */
document.addEventListener("DOMContentLoaded", () => {
    loadDataDashboard();
});

async function loadDataDashboard() {
    const tableBody = document.getElementById("table-body-peminjaman");
    if (!tableBody) return;

    try {
        const response = await fetchDataDashboardPegawai();

        if (response.status === 401) {
            alert("Akses ditolak. Silahkan login terlebih dahulu!");
            window.location.href = '/login';
            return;
        }

        const records = await response.json();
        listRecordsDashboardGlobal = records;
        tableBody.innerHTML = "";

        if (records.length === 0) {
            tableBody.innerHTML = `<tr><td colspan="7" style="text-align: center;">Tidak ada data peminjaman di cabang ini.</td></tr>`;
            return;
        }

        // Loop to grab each data
        records.forEach(sewa => {
            const row = document.createElement("tr");

            let statusHTML = "";
            let actionHTML = "";

            if (sewa.status === "Menunggu Verifikasi") {
                statusHTML = `<p id="waiting-status">Menunggu Konfirmasi</p>`;
                actionHTML = `<button class="action-button" id="action-button-konfirmasi" data-nopol="${sewa.nopol}" data-member="${sewa.idMember}" data-tanggal="${sewa.tglPeminjaman}">Konfirmasi</button>`;
            } else if (sewa.status === "Ongoing") {
                statusHTML = `<p id="rent-status">Dipinjam</p>`;
                actionHTML = `<button class="action-button" id="action-button" data-nopol="${sewa.nopol}" data-member="${sewa.idMember}" data-tanggal="${sewa.tglPeminjaman}">Tindakan</button>`;

            } else if (sewa.status == "Selesai") {
                statusHTML = `<p id="returned-status">Dikembalikan</p>`;
                // Placeholder
                actionHTML = `<span style="color: #4caf50; font-weight: bold; padding-left: 10px;">✓ Selesai</span>`;
            }

            // Suntik ke html sesuai format
            row.innerHTML = `
                <td><strong>${sewa.nama}</strong></td>
                <td>${sewa.merek}</td>
                <td><code>${sewa.nopol}</code></td>
                <td>${formatToTanggalID(sewa.tglPeminjaman)}</td>
                <td>${formatToTanggalID(sewa.tglBatas)}</td>
                <td>${statusHTML}</td>
                <td>
                    <div class="action-btn-container">
                        ${actionHTML}
                        </div>
                </td>
            `;

            tableBody.appendChild(row);
        });

        initPopupTriggers();
    } catch (error) {
        console.error("Error pada loadDataDashboard forEach loop: ", error);
        tableBody.innerHTML = `<tr><td colspan="7" style="text-align: center; color: red;">Gagal memuat data dari server.</td></tr>`;
    }
}

// Helper function untuk trigeger Event Pop-up dinamis 
function initPopupTriggers() {
    // Ikat click tombol Konfirmasi
    const btnKonfirmasiList = document.querySelectorAll('[id="action-button-konfirmasi"]');
    console.log(`Jumlah tombol konfirmasi yang ditemukan di tabel: ${btnKonfirmasiList.length}`);
    btnKonfirmasiList.forEach(btn => {
        btn.addEventListener("click", (e) => {
            e.preventDefault();
            const nopolPilihan = btn.getAttribute("data-nopol");
            const memberPilihan = btn.getAttribute("data-member");
            const tanggalPilihan = btn.getAttribute("data-tanggal");

            const dataSewaLengkap = listRecordsDashboardGlobal.find(sewa =>
                sewa.nopol === nopolPilihan &&
                String(sewa.idMember) === String(memberPilihan) &&
                sewa.tglPeminjaman === tanggalPilihan
            );

            if (dataSewaLengkap) {
                console.log("Data ditemukan! Mengisi form dan membuka pop-up konfirmasi.");
                openPopUpKonfirmasi(dataSewaLengkap);
            } else {
                console.error("Gagal mencocokkan data transaksi berdasarkan Kunci Komposit.");
                if (popupOverlayKonfirmasi) popupOverlayKonfirmasi.classList.add("active");
            }
        })
    });

    // Ikat click tombol Tindakan
    const btnTindakanList = document.querySelectorAll('[id="action-button"]');
    console.log(`Jumlah tombol konfirmasi yang ditemukan di tabel: ${btnTindakanList.length}`);
    btnTindakanList.forEach(btn => {
        btn.addEventListener("click", (e) => {
            e.preventDefault();
            const nopolPilihan = btn.getAttribute("data-nopol");
            const memberPilihan = btn.getAttribute("data-member");
            const tanggalPilihan = btn.getAttribute("data-tanggal");

            const dataSewaLengkap = listRecordsDashboardGlobal.find(sewa =>
                sewa.nopol === nopolPilihan &&
                String(sewa.idMember) === String(memberPilihan) &&
                sewa.tglPeminjaman === tanggalPilihan
            );

            if (dataSewaLengkap) {
                console.log("Data ditemukan! Mengisi form dan membuka pop-up konfirmasi.");
                openPopUpTindakan(dataSewaLengkap);
            } else {
                console.error("Gagal mencocokkan data transaksi berdasarkan Kunci Komposit.");
                if (popupOverlay) popupOverlay.classList.add("active");
            }
        })
    });

}

/**
 * Prefill data di Pop Up Konfirmasi
 * Author: Pearce Nathaniel N.
 */

let peminjamanAktif = null;
export function openPopUpKonfirmasi(data) {
    peminjamanAktif = data;

    const overlayKonfirmasi = document.getElementById("popupOverlayKonfirmasi");
    if (!overlayKonfirmasi) return;

    // Prefill data
    overlayKonfirmasi.querySelector('#popup-title').innerText = data.merek;
    overlayKonfirmasi.querySelector('#popup-nopol').innerText = `Plat no: ${data.nopol}`;
    overlayKonfirmasi.querySelector('#popup-cabang').innerText = `Cabang: ${data.namaCabang}, ${data.namaJalan}`;
    overlayKonfirmasi.querySelector('#popup-harga-sewa').innerText = `Harga / Hari: ${formatToRupiah(data.hargaSewaPerHari)}`;

    overlayKonfirmasi.querySelector('#popup-kapasitas').innerText = `${data.kapasitas} Kursi`;
    overlayKonfirmasi.querySelector('#popup-tahun-keluaran').innerText = data.tahunMobil;
    overlayKonfirmasi.querySelector('#popup-tipe').innerText = data.namaTipe;

    overlayKonfirmasi.querySelector('#nama-penyewa').value = data.nama;
    overlayKonfirmasi.querySelector('#tanggal-sewa').value = formatToInputDate(data.tglPeminjaman);
    overlayKonfirmasi.querySelector('#tanggal-kembali').value = formatToInputDate(data.tglBatas);

    // Link Foto
    overlayKonfirmasi.querySelector('#foto-depan-sebelum').value = "";
    overlayKonfirmasi.querySelector('#foto-belakang-sebelum').value = "";
    overlayKonfirmasi.querySelector('#foto-kanan-sebelum').value = "";
    overlayKonfirmasi.querySelector('#foto-kiri-sebelum').value = "";

    overlayKonfirmasi.classList.add("active");
}

// Pop Up Konfirmasi unable
closePopUpButtonKonfirmasi.addEventListener('click', (e) => {
    e.preventDefault();
    popupOverlayKonfirmasi.classList.remove("active");
    peminjamanAktif = null;
});

btnCancelkonfirmasi.addEventListener("click", (e) => {
    e.preventDefault();
    popupOverlayKonfirmasi.classList.remove("active");
    peminjamanAktif = null;
});

tbodyPeminjaman.addEventListener("click", (e) => {
    if (e.target && e.target.classList.contains("btn-konfirmasi-aksi")) {
        e.preventDefault();
        const tombol = e.target;

        const nopolPilihan = tombol.getAttribute("data-nopol");
        const memberPilihan = tombol.getAttribute("data-member");
        const tanggalPilihan = tombol.getAttribute("data-tanggal");

        const dataSewaLengkap = list
    }
});

/**
 * Prefill data di Pop Up Tindakan
 * Author: Pearce Nathaniel N.
 */

export function openPopUpTindakan(data) {
    if (!popupOverlay) return;

    // Prefill data
    popupOverlay.querySelector('#popup-title').innerText = data.merek;
    popupOverlay.querySelector('#popup-nopol').innerText = `Plat no: ${data.nopol}`;
    popupOverlay.querySelector('#popup-cabang').innerText = `Cabang: ${data.namaCabang}, ${data.namaJalan}`;
    popupOverlay.querySelector('#popup-harga-sewa').innerText = `Harga / Hari: ${formatToRupiah(data.hargaSewaPerHari)}`;

    popupOverlay.querySelector('#popup-kapasitas').innerText = `${data.kapasitas} Kursi`;
    popupOverlay.querySelector('#popup-tahun-keluaran').innerText = data.tahunMobil;
    popupOverlay.querySelector('#popup-tipe').innerText = data.namaTipe;

    popupOverlay.querySelector('#nama-penyewa').value = data.nama;
    popupOverlay.querySelector('#tanggal-sewa').value = formatToInputDate(data.tglPeminjaman);
    popupOverlay.querySelector('#tanggal-kembali').value = formatToInputDate(data.tglBatas);

    // Denda
    const tanggalHariIni = new Date();
    tanggalHariIni.setHours(0, 0, 0, 0);
    const tanggalDeadline = new Date(data.tglBatas);
    tanggalDeadline.setHours(0, 0, 0, 0);

    const selisihHari = Math.ceil((tanggalHariIni - tanggalDeadline) / (100 * 60 * 60 * 24));

    let hariTerlambat = 0;
    let totalDenda = 0;

    if (selisihHari > 0) {
        hariTerlambat = selisihHari;
        totalDenda = hariTerlambat * (data.persentaseDenda / 100.0) * (data.hargaSewaPerHari);
    }
    popupOverlay.querySelector('#jumlah-terlambat').value = `${hariTerlambat} Hari`;
    popupOverlay.querySelector('#total-denda').value = formatToRupiah(totalDenda);


    // Link Foto
    popupOverlay.querySelector('#foto-depan-sesudah').value = "";
    popupOverlay.querySelector('#foto-belakang-sesudah').value = "";
    popupOverlay.querySelector('#foto-kanan-sesudah').value = "";
    popupOverlay.querySelector('#foto-kiri-sesudah').value = "";

    popupOverlay.classList.add("active");

}