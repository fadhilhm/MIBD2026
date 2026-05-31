import { addDataMobil, getDaftarMobil, formatToRupiah } from "./api.js";

const exitButton = document.querySelector('.exit button');

exitButton.addEventListener('click', () => {
    window.location.href = '/login'
});

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
                    <div class="img-item-container">
                        <img src="/image/${mobil.NamaMerek.toLowerCase()}_${mobil.NamaTipe.toLowerCase()}_${mobil.Nopol.trim()}.png" alt="${mobil.NamaMerek} ${mobil.NamaTipe}">
                    </div>
                    <div class="info">
                        <h5>${mobil.NamaMerek} ${mobil.NamaTipe}</h5>
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
                        </div>
                    </div>
                    <div class="group-button">
                        <button class="change-button" data-nopol="${mobil.Nopol}">Ubah</button>
                        <button class="delete-button" data-nopol="${mobil.Nopol}">Hapus</button>
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
    const fotoInput = document.getElementById("foto-mobil");

    const formData = new FormData();
    formData.append("nopol", nopol);
    formData.append("tipe", tipe);
    formData.append("merek", merek);
    formData.append("kapasitas", kapasitasKursi);
    formData.append("tahunPembuatan", tahunPembuatan);
    formData.append("hargaSewa", hargaSewa);
    formData.append("fotoMobil", fotoInput.files[0]);

    try {
        const result = await addDataMobil(formData);

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