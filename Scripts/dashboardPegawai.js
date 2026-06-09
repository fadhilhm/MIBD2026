import { submitKonfirmasiPeminjaman, submitTindakanPengembalian, fetchDataDashboardPegawai, formatToRupiah, formatToTanggalID, formatToInputDate, getDetailFotoPeminjaman } from './api.js';

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
    // console.log(`Jumlah tombol konfirmasi yang ditemukan di tabel: ${btnKonfirmasiList.length}`);
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
                // console.log("Data ditemukan! Mengisi form dan membuka pop-up konfirmasi.");
                openPopUpKonfirmasi(dataSewaLengkap);
            } else {
                console.error("Gagal mencocokkan data transaksi berdasarkan Kunci Komposit.");
                if (popupOverlayKonfirmasi) popupOverlayKonfirmasi.classList.add("active");
            }
        })
    });

    // Ikat click tombol Tindakan
    const btnTindakanList = document.querySelectorAll('[id="action-button"]');
    // console.log(`Jumlah tombol tindakan yang ditemukan di tabel: ${btnTindakanList.length}`);
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
                // console.log("Data ditemukan! Mengisi form dan membuka pop-up konfirmasi.");
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



    // Denda calculation
    let hariTerlambat = 0;
    if (data.tglBatas) {
       // Tanggal kembali rill adalah hari ini (Waktu live serah terima mobil)
        const dateKembali = new Date();
        const dateBatas = new Date(data.tglBatas);
        
        // Ekstrak string murni YYYY-MM-DD langsung dari objek Date asli
        const stringKembali = dateKembali.toISOString().split('T')[0];
        const stringBatas = dateBatas.toISOString().split('T')[0];

        const selisihMs = new Date(stringKembali) - new Date(stringBatas);
        if (selisihMs > 0) {
            hariTerlambat = Math.round(selisihMs / (1000 * 60 * 60 * 24));
        }
    }

    let hitungTotalDenda = (data.hargaSewaPerHari * 10 / 100.0) * hariTerlambat;
    const biayaSewaPokok = parseFloat(data.totalBiaya) || 0;
    let totalBiayaFinal = biayaSewaPokok + hitungTotalDenda;

    popupOverlay.querySelector('#jumlah-terlambat').value = `${hariTerlambat} Hari`;
    popupOverlay.querySelector('#total-denda').value = formatToRupiah(hitungTotalDenda || 0);

    // popupOverlay.querySelector('#jumlah-terlambat').value = `${hariTerlambat} Hari`;
    // popupOverlay.querySelector('#total-denda').value = formatToRupiah(hitungTotalDenda);


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
        await submitTindakan(data, hitungTotalDenda);
    };

    popupOverlay.classList.add("active");
}

function formatKeTanggalLokal(dateString) {
    if (!dateString) return "-";
    // Bersihkan jika ada komponen jam (T00:00:00.000Z)
    const cleanDate = dateString.split('T')[0];
    const [year, month, day] = cleanDate.split('-');
    return `${day}/${month}/${year}`;
}

/**
 * Prefill data di Pop Up Selesai (Read Only)
 * AuthorL Pearce Nathaniel N.
 */

// POPUP DETAIL MENDING BIKIN BARU
const popupOverlayDetail = document.getElementById("popupOverlayDetail");

const closePopupDetail = document.getElementById("closePopupDetail");

const cancelPopupDetail = document.getElementById("cancelPopupDetail");

closePopupDetail.addEventListener("click", () => {
    popupOverlayDetail.classList.remove("active");
});

cancelPopupDetail.addEventListener("click", () => {
    popupOverlayDetail.classList.remove("active");
});

export async function openPopUpDetailSelesai(data) {
    // Open popup first so user sees it immediately
    popupOverlayDetail.classList.add("active");

    // Fill in all non-foto fields immediately (these come from dashboard data which is fine)
    popupOverlayDetail.querySelector('#popup-nopol').innerText = `Plat no: ${data.nopol}`;
    popupOverlayDetail.querySelector('#popup-cabang').innerText = `Cabang: ${data.namaCabang}`;
    popupOverlayDetail.querySelector('#popup-harga-sewa').innerText = `Harga / Hari: ${formatToRupiah(data.hargaSewaPerHari)}`;
    popupOverlayDetail.querySelector('#popup-kapasitas').innerText = `${data.kapasitas} Kursi`;
    popupOverlayDetail.querySelector('#popup-tahun-keluaran').innerText = data.tahunMobil;
    popupOverlayDetail.querySelector('#popup-tipe').innerText = data.namaTipe;
    popupOverlayDetail.querySelector('#nama-penyewa').value = data.nama;
    // popupOverlayDetail.querySelector('#tanggal-sewa').value = formatToInputDate(data.tglPeminjaman);

    const tglPinjamFormatted = formatKeTanggalLokal(data.tglPeminjaman);
    const tglBatasFormatted = formatKeTanggalLokal(data.tglBatas);
    popupOverlayDetail.querySelector('#tanggal-sewa').value = `(${tglPinjamFormatted}) - (${tglBatasFormatted})`;

    popupOverlayDetail.querySelector('#tanggal-kembali').value = formatToInputDate(data.tglKembali);

    // Denda calculation
    let hariTerlambat = 0;
    if (data.tglKembali && data.tglBatas) {
        const stringKembali = new Date(data.tglKembali).toISOString().split('T')[0];
        const stringBatas = new Date(data.tglBatas).toISOString().split('T')[0];
        
        const selisihMs = new Date(stringKembali) - new Date(stringBatas);
        if (selisihMs > 0) {
            hariTerlambat = Math.round(selisihMs / (1000 * 60 * 60 * 24));
        }
    }
    popupOverlayDetail.querySelector('#jumlah-terlambat').value = `${hariTerlambat} Hari`;
    popupOverlayDetail.querySelector('#total-denda').value = formatToRupiah(data.totalDenda || 0);

    const elTotalBiaya = popupOverlayDetail.querySelector('#total-biaya');
    if (elTotalBiaya) elTotalBiaya.value = formatToRupiah(data.totalBiaya || 0);

    // Clear foto fields while loading
    const fotoIds = [
        '#detail-foto-depan-sebelum', '#detail-foto-belakang-sebelum',
        '#detail-foto-kanan-sebelum', '#detail-foto-kiri-sebelum',
        '#detail-foto-depan-sesudah', '#detail-foto-belakang-sesudah',
        '#detail-foto-kanan-sesudah', '#detail-foto-kiri-sesudah'
    ];
    fotoIds.forEach(id => {
        popupOverlayDetail.querySelector(id).value = "Memuat foto...";
    });

    // Fetch fresh foto data from the dedicated API
    try {
        const result = await getDetailFotoPeminjaman(data.nopol, data.idMember);

        // result.data is an array of { Gambar, Kondisi, Deskripsi }
        // Kondisi 0 = Sebelum, Kondisi 1 = Sesudah
        const fotoSebelum = result.data.filter(f => f.Kondisi === 0 || f.Kondisi === false);
        const fotoSesudah = result.data.filter(f => f.Kondisi === 1 || f.Kondisi === true);

        // Helper: find foto by keyword in Deskripsi
        const cari = (arr, keyword) => {
            const found = arr.find(f => f.Deskripsi && f.Deskripsi.toLowerCase().includes(keyword));
            return found ? found.Gambar : "Tidak ada dokumentasi.";
        };

        popupOverlayDetail.querySelector('#detail-foto-depan-sebelum').value = cari(fotoSebelum, 'depan');
        popupOverlayDetail.querySelector('#detail-foto-belakang-sebelum').value = cari(fotoSebelum, 'belakang');
        popupOverlayDetail.querySelector('#detail-foto-kanan-sebelum').value = cari(fotoSebelum, 'kanan');
        popupOverlayDetail.querySelector('#detail-foto-kiri-sebelum').value = cari(fotoSebelum, 'kiri');

        popupOverlayDetail.querySelector('#detail-foto-depan-sesudah').value = cari(fotoSesudah, 'depan');
        popupOverlayDetail.querySelector('#detail-foto-belakang-sesudah').value = cari(fotoSesudah, 'belakang');
        popupOverlayDetail.querySelector('#detail-foto-kanan-sesudah').value = cari(fotoSesudah, 'kanan');
        popupOverlayDetail.querySelector('#detail-foto-kiri-sesudah').value = cari(fotoSesudah, 'kiri');

    } catch (error) {
        console.error("Gagal memuat foto detail:", error);
        fotoIds.forEach(id => {
            popupOverlayDetail.querySelector(id).value = "Gagal memuat foto.";
        });
    }
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

async function submitTindakan(dataSewa, totalDenda = 0) {
    const btnSubmit = document.getElementById("btn-submit-tindakan");
    const popupTindakan = document.getElementById("popupOverlay");

    const data = {
        nopol: dataSewa.nopol,
        idMember: parseInt(dataSewa.idMember),
        tglPeminjaman: dataSewa.tglPeminjaman,
        totalDenda: totalDenda,
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