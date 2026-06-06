import { addDataMobil, getDaftarMobil, formatToRupiah, deleteMobilAPI } from "./api.js";

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
                        <button class="change-button" data-nopol="${mobil.Nopol}">Ubah</button>
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
    e.preventDefault();
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
        const result = await addDataMobil(data);

        if (result.success) {
            alert(result.message);
            popupOverlay.classList.remove("active");
            popupForm.reset();

            renderKatalogMobil();
        } else {
            alert("Gagal menyimpan data: " + result.message);
        }
    } catch (error) {
        console.error("Error saat mengirim data: ", error);
        alert("Terjadi masalah koneksi ke server.");
    }
});

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

// 💡 4. Sambungkan Event Listener ke fungsi handler baru kita
const productContainer = document.getElementById("productContainer");
productContainer.addEventListener("click", handleDeleteCar);