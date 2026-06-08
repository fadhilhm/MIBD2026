import { submitKonfirmasiPeminjaman, submitTindakanPengembalian, fetchDataDashboardPegawai, formatToRupiah, formatToTanggalID, formatToInputDate } from './api.js';

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
        records.forEach((sewa, index) => {
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
                actionHTML = `<span class="btn-detail-selesai" data-index="${index}" style="color: #4caf50; font-weight: bold; padding-left: 10px; cursor: pointer;">✓ Selesai (Detail)</span>`;
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
    console.log(`Jumlah tombol tindakan yang ditemukan di tabel: ${btnTindakanList.length}`);
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

    document.querySelectorAll('.btn-detail-selesai').forEach(span => {
        span.addEventListener('click', (e) => {

            const idx = e.currentTarget.getAttribute('data-index');
            const dataSewa = listRecordsDashboardGlobal[idx];

            // Panggil fungsi pop-up read-only Anda
            openPopUpDetailSelesai(dataSewa);
        });
    })

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

    const btnSubmit = document.getElementById("submitPopupKonfirmasi");
    btnSubmit.onclick = async function (e) {
        e.preventDefault();

        console.log("Tombol Setujui diklik! Memulai pemanggilan fungsi submitKonfirmasi...");
        await submitKonfirmasi(data);
    };
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

    const selisihWaktuMs = tanggalHariIni - tanggalDeadline;
    const selisihHari = Math.ceil(selisihWaktuMs / (1000 * 60 * 60 * 24));

    let hariTerlambat = 0;
    let hitungTotalDenda = 0;

    // Cek apakah telat atau tidak
    if (selisihHari > 0) {
        hariTerlambat = selisihHari;
        hitungTotalDenda = hariTerlambat * (data.hargaSewaPerHari || 0);
    }
    popupOverlay.querySelector('#jumlah-terlambat').value = `${hariTerlambat} Hari`;
    popupOverlay.querySelector('#total-denda').value = formatToRupiah(hitungTotalDenda);


    const btnSubmit = popupOverlay.querySelector('#btn-submit-tindakan');
    if (btnSubmit) {
        btnSubmit.style.display = "block"; // Munculkan tombol karena butuh submit data
        btnSubmit.setAttribute("data-total-denda", hitungTotalDenda);
    }

    // Link Foto
    popupOverlay.querySelector('#foto-depan-sesudah').value = "";
    popupOverlay.querySelector('#foto-belakang-sesudah').value = "";
    popupOverlay.querySelector('#foto-kanan-sesudah').value = "";
    popupOverlay.querySelector('#foto-kiri-sesudah').value = "";
    
    
    const btnSubmitTindakan = document.getElementById("btn-submit-tindakan");
    btnSubmitTindakan.onclick = async function (e) {
        e.preventDefault();
        
        console.log("Tombol Setujui diklik! Memulai pemanggilan fungsi submitTindakan...");
        await submitTindakan(data);
    };
    
    popupOverlay.classList.add("active");
}

/**
 * Prefill data di Pop Up Selesai (Read Only)
 * AuthorL Pearce Nathaniel N.
 */
export function openPopUpDetailSelesai(data) {
    if (!popupOverlay) return;

    // Prefill data kendaraan dan cabang
    popupOverlay.querySelector('#popup-title').innerText = data.merek;
    popupOverlay.querySelector('#popup-nopol').innerText = `Plat no: ${data.nopol}`;
    popupOverlay.querySelector('#popup-cabang').innerText = `Cabang: ${data.namaCabang}, ${data.namaJalan}`;
    popupOverlay.querySelector('#popup-harga-sewa').innerText = `Harga / Hari: ${formatToRupiah(data.hargaSewaPerHari)}`;
    popupOverlay.querySelector('#popup-kapasitas').innerText = `${data.kapasitas} Kursi`;
    popupOverlay.querySelector('#popup-tahun-keluaran').innerText = data.tahunMobil;
    popupOverlay.querySelector('#popup-tipe').innerText = data.namaTipe;

    // Data Pelanggan
    popupOverlay.querySelector('#nama-penyewa').value = data.nama;
    popupOverlay.querySelector('#tanggal-sewa').value = formatToInputDate(data.tglPeminjaman);
    popupOverlay.querySelector('#tanggal-kembali').value = formatToInputDate(data.tglKembali);


    let totalDenda = data.totalDenda ? parseFloat(data.totalDenda) : 0;
    let hariTerlambat = 0;

    // Hitung balik hari keterlambatan berdasarkan selisih TanggalKembali asli dan TanggalBatas asli di DB
    if (data.tglKembali && data.tglBatas) {
        const tglKembaliObj = new Date(data.tglKembali);
        tglKembaliObj.setHours(0, 0, 0, 0);

        const tglDeadlineObj = new Date(data.tglBatas);
        tglDeadlineObj.setHours(0, 0, 0, 0);

        const selisihWaktu = tglKembaliObj - tglDeadlineObj;
        const selisihHari = Math.ceil(selisihWaktu / (1000 * 60 * 60 * 24));

        hariTerlambat = selisihHari > 0 ? selisihHari : 0;
    }

    // Suntik nilai paten database ke dalam input form pop-up
    popupOverlay.querySelector('#jumlah-terlambat').value = `${hariTerlambat} Hari`;
    popupOverlay.querySelector('#total-denda').value = formatToRupiah(totalDenda);

    popupOverlay.querySelector('#jumlah-terlambat').value = `${hariTerlambat} Hari`;
    popupOverlay.querySelector('#total-denda').value = formatToRupiah(totalDenda);

    // Karena ini read-only, kita tidak mau pegawai bisa mengedit atau menekan tombol simpan ulang
    const btnSubmit = popupOverlay.querySelector('#btn-submit-tindakan');
    if (btnSubmit) btnSubmit.style.display = "none";

    // Tampilkan popup ke layar
    popupOverlay.classList.add("active");
}

/**
 * Submit Form Pegawai (Konfirmasi, Tindakan) 
 * Author: Pearce Nathaniel N.
 */

// Submit Konfirmasi
async function submitKonfirmasi(dataPeminjaman) {
    const btnSubmit = document.getElementById("btn-submit");
    const popupKonfirmasi = document.getElementById("popupOverlayKonfirmasi");

    const dataPayload = {
        nopol: dataPeminjaman.nopol,
        idMember: parseInt(dataPeminjaman.idMember),
        tglPeminjaman: dataPeminjaman.tglPeminjaman,

        fotoDepan: popupKonfirmasi.querySelector('#foto-depan-sebelum').value,
        fotoBelakang: popupKonfirmasi.querySelector('#foto-belakang-sebelum').value,
        fotoKanan: popupKonfirmasi.querySelector('#foto-kanan-sebelum').value,
        fotoKiri: popupKonfirmasi.querySelector('#foto-kiri-sebelum').value
    };


    if (btnSubmit) btnSubmit.disabled = true;

    try {
        const result = await submitKonfirmasiPeminjaman(dataPayload);

        if (result.success) {
            alert("Peminjaman berhasil dikonfirmasi! Status berubah menjadi 'Dipinjam' (Ongoing).");

            popupKonfirmasi.classList.remove("active");

            // Reload Page
            await loadDataDashboard();
        } else {
            alert(`Gagal konfirmasi: ${result.message}`);
        }
    } catch (error) {
        console.error("Error pada proses submit konfirmasi:", error);
        alert("Terjadi kesalahan koneksi atau internal server.");
    } finally {
        if (btnSubmit) btnSubmit.disabled = false;
    }
}

// Submit Tindakan Pengembalian Mobil

async function submitTindakan(dataSewa) {
    const btnSubmit = document.getElementById("btn-submit-tindakan");
    const popupTindakan = document.getElementById("popupOverlay");

    const data = {
        nopol: dataSewa.nopol,
        idMember: parseInt(dataSewa.idMember),
        tglPeminjaman: dataSewa.tglPeminjaman,
        totalDenda: parseFloat(document.getElementById('btn-submit-tindakan').getAttribute('data-total-denda')) || 0,
        fotoDepan: document.getElementById('foto-depan-sesudah').value,
        fotoBelakang: document.getElementById('foto-belakang-sesudah').value,
        fotoKanan: document.getElementById('foto-kanan-sesudah').value,
        fotoKiri: document.getElementById('foto-kiri-sesudah').value
    };

    if (btnSubmit) btnSubmit.disabled = true;

    try {
        const result = await submitTindakanPengembalian(data);
        if (result.success) {
            alert("Mobil berhasil dikembalikan! Status transaksi bergeser ke Selesai.");
            popupTindakan.classList.remove("active");

            popupTindakan.classList.remove("active");
            await loadDataDashboard(); // Reload layout dashboard
        } else {
            alert(`Gagal konfirmasi: ${result.message}`);
        }
    } catch (err) {
        alert("Gagal memproses pengembalian di sistem.");
    } finally {
        if (btnSubmit) btnSubmit.disabled = false;
    }
}