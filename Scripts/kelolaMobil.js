import { addDataMobil, getDaftarMobil, formatToRupiah, deleteMobilAPI, updateDataMobil } from "./api.js";

const kelolaPeminjamanBtn = document.getElementById('kelola-peminjaman-btn');
const exitButton = document.querySelector('.exit button');

kelolaPeminjamanBtn.addEventListener('click', (e) => {
    e.preventDefault();
    window.location.href = '/dashboard-pegawai'
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

// show katalog
async function renderKatalogMobil() {
    try {
        const daftarMobil = await getDaftarMobil();

        productContainer.innerHTML = '';

        if (daftarMobil.length === 0) {
            productContainer.innerHTML = `<p class="empty-message">Belum ada data mobil di database.</p>`;
            return;
        }

        daftarMobil.forEach(mobil => {
            const cardMobil = `
                <div class="item-card" data-nopol="${mobil.Nopol}">
                    <div class="status-product-active">
                        Tersedia
                    </div>
                    <div class="info">
                        <h5>${mobil.NamaMerek}</h5>
                        <p>${mobil.Nopol}</p>
                        <div class="location">
                            <div>
                                <img src="/image/location.png" alt="">
                            </div>
                            <p>${mobil.NamaJalan || 'Alamat tidak terdaftar'}</p>
                        </div>
                        <p class="price">${formatToRupiah(mobil.HargaSewaMobil)} / hari</p>
                        <div class="car-info">
                            <div class="capacity">
                                <img src="/image/person.png" alt="">
                                <p>${mobil.Kapasitas} Kursi</p>
                            </div>
                            <div class="year-production">
                                <img src="/image/calender.png" alt="">
                                <p>${mobil.TahunPembuatan}</p>
                            </div>
                            <div class="car-type">
                                <img src="/image/car.png" alt="">
                                <p>${mobil.NamaTipe}</p>
                            </div>
                        </div>
                    </div>
                    <div class="group-button">
                        <button class="change-button" data-nopol="${mobil.Nopol}" data-version="${mobil.version}">Ubah</button>
                        <button class="delete-button" data-nopol="${mobil.Nopol}" data-version="${mobil.version}">Hapus</button>
                    </div>
                </div>
            `;
            productContainer.innerHTML += cardMobil;
        });
    } catch (error) {
        console.error("Kegagalan terjadi dalam mengambil data mobil:", error);
        productContainer.innerHTML = `<p class="error-message">Gagal mengambil data dari server.</p>`;
    }
}

document.addEventListener('DOMContentLoaded', renderKatalogMobil);

// pop up enable
const popupOverlay = document.getElementById("popupOverlay");
const addBtn = document.getElementById("add-car");
const closePopUpButton = document.getElementById("closePopup");
const btnCancel = document.getElementById("cancelPopup");

addBtn.addEventListener("click", (e) => {
    e.preventDefault()
    // Reset form & atur ulang ke mode tambah;
    popupForm.reset();
    document.getElementById("popup-title").innerText = "Form Tambah Mobil";
    document.getElementById("nopol").readOnly = false; // Nopol boleh diisi baru
    
    popupOverlay.dataset.mode = "add"; 
    popupOverlay.classList.add("active");
});

// pop up unable
const closePopup = (e) => {
    e.preventDefault();
    popupOverlay.classList.remove("active")
};

closePopUpButton.addEventListener('click', closePopup);
btnCancel.addEventListener("click", closePopup);

// simpan data
const popupForm = document.querySelector(".popup-form");

popupForm.addEventListener("submit", async (e) => {
    e.preventDefault();

    const mode = popupOverlay.dataset.mode;

    const nopol = document.getElementById("nopol").value;
    const merek = document.getElementById("merek").value;
    const tipe = document.getElementById("tipe").value;
    const kapasitasKursi = document.getElementById("kapasitas-kursi").value
    const tahunPembuatan = document.getElementById("tahun-pembuatan").value;
    const hargaSewa = document.getElementById("harga-sewa").value;

    const data = {
        nopol: nopol,
        merek: merek,
        tipe: tipe,
        kapasitas: kapasitasKursi,
        tahunPembuatan: tahunPembuatan,
        hargaSewa: hargaSewa
    }

    try {
        if (mode === 'edit') {
            // tambah property
            data.version = popupOverlay.dataset.version;

            const result = await updateDataMobil(data);

            if (result.success) {
                alert(result.message);
                popupOverlay.classList.remove("active");
                popupForm.reset();
                renderKatalogMobil();
            } else {
                alert("Gagal mengubah data: " + result.message);
            }

        } else {
            const result = await addDataMobil(data);

            if (result.success) {
                alert(result.message);
                popupOverlay.classList.remove("active");
                popupForm.reset();

                renderKatalogMobil();
            } else {
                alert("Gagal menyimpan data: " + result.message);
            }
        }
    } catch (error) {
        console.error("Error saat mengirim data: ", error);
        alert("Terjadi masalah koneksi ke server.");
    }
});

// update
async function handleUpdateData(e) {
    const nopol = e.target.dataset.nopol;

    try {
        // Ambil data katalog terbaru untuk mencari data mobil yang diklik
        const daftarMobil = await getDaftarMobil();
        const mobil = daftarMobil.find(m => m.Nopol === nopol);

        if (!mobil) {
            alert("Data mobil tidak ditemukan!");
            return;
        }

        // Isikan data mobil yang dipilih ke dalam Form Pop-up
        document.getElementById("nopol").value = mobil.Nopol;
        document.getElementById("merek").value = mobil.NamaMerek;
        document.getElementById("tipe").value = mobil.NamaTipe;
        document.getElementById("kapasitas-kursi").value = mobil.Kapasitas;
        document.getElementById("tahun-pembuatan").value = mobil.TahunPembuatan;
        document.getElementById("harga-sewa").value = mobil.HargaSewaMobil;

        // Pengaturan Khusus Mode ubah:
        document.getElementById("popup-title").innerText = "Form Ubah Mobil";
        document.getElementById("nopol").readOnly = true; // Nopol (Primary Key) tidak boleh diedit

        popupOverlay.dataset.mode = "edit"; // Tandai sebagai mode edit
        popupOverlay.dataset.version = mobil.version; // Simpan version

        popupOverlay.classList.add("active"); // Tampilkan pop-up
    } catch (error) {
        console.error("Gagal memuat data untuk ubah:", error);
        alert("Terjadi kesalahan saat memuat data.");
    }
}

// delete
async function handleDeleteCar(e) {
    // Cek apakah yang diklik benar tombol hapus
    if (!e.target.classList.contains("delete-button")) return;

    const nopol = e.target.dataset.nopol;
    const version = e.target.dataset.version;

    // Validasi awal jika data version gagal dimuat ke DOM
    if (!version || version === "undefined") {
        alert("Gagal menghapus: Versi enkripsi data tidak valid atau kosong.");
        return;
    }

    const confirmDelete = confirm(`Apakah Anda yakin ingin menghapus mobil dengan Nopol ${nopol}?`);
    if (!confirmDelete) return;

    try {
        const result = await deleteMobilAPI(nopol, version);

        if (result.success) {
            alert(result.message);
            renderKatalogMobil();
        } else {
            alert("Operasi Ditolak: " + result.message);
        }
    } catch (error) {
        console.error("Error saat eksekusi", error);
        alert("Terjadi masalah koneksi ke server");
    }
}

// reload display
const productContainer = document.getElementById("productContainer");
productContainer.addEventListener("click", async (e) => {
    if (e.target.classList.contains("delete-button")) {
        handleDeleteCar(e);
        return;
    }

    if (e.target.classList.contains("change-button")) {
        handleUpdateData(e);
        return;
    }
});