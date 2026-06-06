import { getDaftarMobil, formatToRupiah } from "./api.js";

// =================================================================
// 1. SELECTOR
// =================================================================
const dashboardButton = document.querySelector('.menu button:nth-child(1)');
const exitButton = document.querySelector('.exit button');

// -> Total Harga Sewa
const elementTanggalMulai = document.getElementById('tanggal-mulai');
const elementTanggalKembali = document.getElementById('tanggal-kembali');
const elementHargaSewa = document.getElementById('popup-harga-sewa');
const elementTotalHargaSewa = document.getElementById('total-harga');

// -> Pop up enable
const popupOverlay = document.getElementById("popupOverlay");

// -> pop up unable
const closePopUpButton = document.getElementById("closePopup");
const btnCancel = document.getElementById("cancelPopup");
const popupForm = document.querySelector(".popup-form");

// -> Display Card
const productContainer = document.getElementById('productContainer');

// =================================================================
// 2. NAVIGATION
// =================================================================
/**
 * Navigation Form
 * Author: Pearce Nathaniel N.
*/

dashboardButton.addEventListener('click', () => {
    window.location.href = '/dashboard-member';
});

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


// =================================================================
// 3. CORE LOGIC FUNCTIONS
// =================================================================

// Display card
let daftarMobil = [];


async function renderKatalogMobil() {
    try {
        daftarMobil = await getDaftarMobil();

        productContainer.innerHTML = '';

        if (daftarMobil.length == 0) {
            productContainer.innerHTML =
                `<p class="empty-message">Saat ini tidak ada mobil yang tersedia untuk disewa.</p>`;
            return;
        }

        daftarMobil.forEach(mobil => {
            const hargaFormat = formatToRupiah(mobil.HargaSewaMobil);

            const cardMobil = `
                <div class="item-card" data-nopol="${mobil.Nopol}">
                    <div class="status-product-active">
                        Tersedia
                    </div>
                    <div class="info">
                        <h5>${mobil.NamaMerek}</h5>
                        <div class="location">
                            <div>
                                <img src="/image/location.png" alt="">
                            </div>
                            <p>${mobil.NamaJalan}</p>
                        </div>
                        <p class="price">${hargaFormat} / hari</p>
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

                    <div class="rent-button">
                        <button class="btn-pinjam">Pinjam</button>
                    </div>
                </div>
            `;

            productContainer.innerHTML += cardMobil;
        });
    } catch (error) {
        console.error("Gagal memuat katalog: ", error);
        productContainer.innerHTML = `<p>Gagal memuat katalog mobil. Hubungi admin atau coba lagi nanti.</p>`;
    }
}

document.addEventListener('DOMContentLoaded', renderKatalogMobil);

// Pop up enable

productContainer.addEventListener('click', (e) => {
    if (e.target.classList.contains('btn-pinjam')) {
        e.preventDefault();

        const card = e.target.closest('.item-card');
        const nopolMobil = card.getAttribute('data-nopol');

        const mobilTerpilih = daftarMobil.find(mobil => mobil.Nopol === nopolMobil);

        console.log(mobilTerpilih);

        document.getElementById('popup-title').innerText = `${mobilTerpilih.NamaMerek}`;
        document.getElementById('popup-cabang').innerText = `${mobilTerpilih.NamaCabang}, ${mobilTerpilih.NamaJalan}`;
        document.getElementById('popup-nopol').innerText = `${mobilTerpilih.Nopol}`;
        document.getElementById('popup-harga-sewa').innerText = `${formatToRupiah(mobilTerpilih.HargaSewaMobil)} / Hari`;
        document.getElementById('popup-kapasitas').innerText = `${mobilTerpilih.Kapasitas} Kursi`;
        document.getElementById('popup-tahun-keluaran').innerText = mobilTerpilih.TahunPembuatan;
        document.getElementById('popup-tipe').innerText = `${mobilTerpilih.NamaTipe}`;
        document.getElementById('popup-email-cabang').innerText = mobilTerpilih.AlamatEmail;
        document.getElementById('popup-no-telp-cabang').innerText = `${mobilTerpilih.NoTelp}`;

        popupOverlay.classList.add("active");
    }
});

/**
 * Cancel Pop Up Peminjaman
 * Author: Fadhil & Pearce Nathaniel N.
 */

const closePopup = (e) => {
    e.preventDefault();
    const formElement = document.querySelector(".popup-form");

    // Clear Form
    if (formElement) formElement.reset();
    // Reset kalkulasi harga
    elementTotalHargaSewa.value = "";
    // Close element
    if (popupOverlay) popupOverlay.classList.remove("active");
};

closePopUpButton.addEventListener('click', closePopup)
btnCancel.addEventListener("click", closePopup)

// handle booking
document.querySelector(".popup-form").addEventListener("submit", async (e) => {
    e.preventDefault();
    // get the input from user
    const startDate = document.getElementById("tanggal-mulai").value;
    const endDate = document.getElementById("tanggal-kembali").value;

    // get id user
    // get id mobil
    // get id pegawai

    const data = { startDate, endDate };

    // send a request to api
    try {
        const req = await fetch('/api/booking', {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(data)
        });

        const res = await req.json();

        if (res.success === true) {
            alert(res.message);
        } else {
            alert("tidak berhasil");
        }

    } catch (error) {
        console.log(error);
    }
});

/**
 * Display Total Harga Peminjaman
 * Author: Pearce Nathaniel N.
 */


// Parse Text to number
function parseHargaSewa() {
    if (!elementHargaSewa) return 0;

    const textHarga = elementHargaSewa.innerText || elementHargaSewa.textContent;
    const angka = textHarga.replace(/[^0-9]/g, '');

    return parseInt(angka, 10) || 0;
}

// Hitung Total Harga Sewa
function hitungTotalHargaSewa() {
    const valMulai = elementTanggalMulai.value;
    const valKembali = elementTanggalKembali.value;
    const hargaPerHari = parseHargaSewa();

    // Hitung durasi peminjaman (Hari)
    if (valMulai && valKembali && hargaPerHari > 0) {
        const tanggalMulai = new Date(valMulai);
        const tanggalKembali = new Date(valKembali);
        // Selisih dalam ms, ubah ke hari. 
        // (1000 ms/s, 60 s/min, 60 min/h, 24 h/day) 
        // +1 karena inklusif.
        const durasi = Math.ceil((tanggalKembali - tanggalMulai) / (1000 * 60 * 60 * 24)) + 1;

        if (durasi > 0) {
            const totalHarga = hargaPerHari * durasi;
            elementTotalHargaSewa.value = "Rp " + totalHarga.toLocaleString('id-ID');
        } else if (durasi === 0) {
            elementTotalHargaSewa.value = "Rp " + hargaPerHari.toLocaleString('id-ID');
        } else {
            elementTotalHargaSewa.value = "Tanggal tidak valid!";
        }

    } else {
        elementTotalHargaSewa.value = "";
    }
}

if (elementTanggalMulai && elementTanggalKembali) {
    elementTanggalMulai.addEventListener('change', hitungTotalHargaSewa);
    elementTanggalKembali.addEventListener('change', hitungTotalHargaSewa);
}
