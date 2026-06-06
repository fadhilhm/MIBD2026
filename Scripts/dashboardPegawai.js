import { fetchDataDashboardPegawai, logoutUser, formatToRupiah, formatToTanggalID } from './api.js';

const kelolaMobilButton = document.getElementById("kelola-mobil-btn");
const exitButton = document.getElementById('exit-button');

kelolaMobilButton.addEventListener('click', (e) => {
    e.preventDefault();
    window.location.href = '/kelola-mobil';
})

/**
 * Log Out Confirmation Pop up
 * Author: Pearce Nathaniel N.
*/
exitButton.addEventListener('click', () => {
    const confirmLogout = confirm("Apakah Anda yakin ingin keluar dari sistem?");

    if (confirmLogout) {
        window.location.href = '/login';
    }
})

// pop up
const popupOverlay = document.getElementById("popupOverlay");
const actionBtn = document.getElementById("action-button");
const closePopUpButton = document.getElementById("closePopup");
const btnCancel = document.getElementById("cancelPopup");

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

const popupOverlayKonfirmasi = document.getElementById("popupOverlayKonfirmasi");
const actionBtnKonfirmasi = document.getElementById("action-button-konfirmasi");
const closePopUpButtonKonfirmasi = document.getElementById("closePopupKonfirmasi");
const btnCancelkonfirmasi = document.getElementById("cancelPopupKonfirmasi");

// actionBtnKonfirmasi.addEventListener("click", (e) => {
//     e.preventDefault();
//     popupOverlayKonfirmasi.classList.add("active");
// });

// // pop up unable
closePopUpButtonKonfirmasi.addEventListener('click', (e) => {
    e.preventDefault();
    popupOverlayKonfirmasi.classList.remove("active");
});

btnCancelkonfirmasi.addEventListener("click", (e) => {
    e.preventDefault();
    popupOverlayKonfirmasi.classList.remove("active");
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
                actionHTML = `<button class="action-button" id="action-button-konfirmasi" data-nopol="${sewa.nopol}">Konfirmasi</button>`;
            } else if (sewa.status === "Ongoing") {
                statusHTML = `<p id="rent-status">Dipinjam</p>`;
                actionHTML = `<button class="action-button" id="action-button" data-nopol="${sewa.nopol}">Tindakan</button>`;

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
    // Ikat click tombol Tindakan
    const btnTindakanList = document.querySelectorAll('[id="action-button"]');
    btnTindakanList.forEach(btn => {
        btn.addEventListener("click", (e) => {
            e.preventDefault();
            const nopol = btn.getAttribute("data-nopol");
            console.log("Memproses form tindakan untuk mobil plat:", nopol);
            if (popupOverlay) popupOverlay.classList.add("active");
        });
    });

    // Ikat click tombol Konfirmasi
    const btnKonfirmasiList = document.querySelectorAll('[id="action-button-konfirmasi"]');
    btnKonfirmasiList.forEach(btn => {
        btn.addEventListener("click", (e) => {
            e.preventDefault();
            const nopol = btn.getAttribute("data-nopol");
            console.log("Memproses form konfirmasi awal untuk mobil plat:", nopol);
            if (popupOverlayKonfirmasi) popupOverlayKonfirmasi.classList.add("active");

        })
    })
}