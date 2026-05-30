import { getDaftarMobil } from "./api.js";

// navigasi 
const dashboardButton = document.querySelector('.menu button:nth-child(1)');
const exitButton = document.querySelector('.exit button');

dashboardButton.addEventListener('click', () => {
    window.location.href = '/dashboard-member';
});

exitButton.addEventListener('click', () => {
    window.location.href = '/login';
});

// display card
const productContainer = document.getElementById('productContainer');

async function getKatalogMobil() {
    try {
        const daftarMobil = await getDaftarMobil();

        productContainer.innerHTML = '';

        if (daftarMobil.length == 0) {
            productContainer.innerHTML = 
                `<p class="empty-message">Saat ini tidak ada mobil yang tersedia untuk disewa.</p>`;
            return;
        }

        daftarMobil.forEach(mobil => {
            const hargaFormat = new Intl.NumberFormat('id-ID', {
                style: 'currency',
                currency: 'IDR',
                maximumFractionDigits: 0
            }).format(mobil.HargaSewaMobil);

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
        productContainer.innerHTML = `<p class="error-message">Gagal memuat katalog mobil. Hubungi admin atau coba lagi nanti.</p>`;
    }
}

document.addEventListener('DOMContentLoaded', getKatalogMobil);

// pop up enable
const popupOverlay = document.getElementById("popupOverlay");


productContainer.addEventListener('click', (e) => {
    if (e.target.classList.contains('btn-pinjam')) {
        e.preventDefault();

        const card = e.target.closest('.item-card');
        const nopolMobil = card.getAttribute('data-nopol');

        console.log("Mobil dipilih, Nopol: ", nopolMobil);

        popupOverlay.classList.add("active");
    }
});

const closePopUpButton = document.getElementById("closePopup");
const btnCancel = document.getElementById("cancelPopup");

const closePopup = (e) => {
    e.preventDefault();
    popupOverlay.classList.remove("active");
};

// pop up unable
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

    const data = {startDate, endDate};

    // send a request to api
    try {
        const req = await fetch('/api/booking', {
            method: "POST",
            headers: {
                "Content-Type" : "application/json"
            },
            body: JSON.stringify(data)
        });
    
        const res = await req.json();

        if(res.success === true){
            alert(res.message);
        } else {
            alert("tidak berhasil");
        }

    } catch (error) {
        console.log(error);
    }
});


