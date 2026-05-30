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
    } catch (error) {
        
    }
}

// pop up enable
const popupOverlay = document.getElementById("popupOverlay");
const rentButton = document.getElementById("rent-button");
const closePopUpButton = document.getElementById("closePopup");
const btnCancel = document.getElementById("cancelPopup");

rentButton.addEventListener("click", (e) => {
    e.preventDefault();
    popupOverlay.classList.add("active");
});

// pop up unable
closePopUpButton.addEventListener('click', (e) => {
    e.preventDefault();
    popupOverlay.classList.remove("active");
});

btnCancel.addEventListener("click", (e) => {
    e.preventDefault();
    popupOverlay.classList.remove("active");
});

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


