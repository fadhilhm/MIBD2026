import { addDataMobil } from "./api";

const exitButton = document.querySelector('.exit button');

exitButton.addEventListener('click', () => {
    window.location.href = '/login'
});

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
    const tipe = document.getElementById("tipe").value;
    const merek = document.getElementById("merek").value;
    const tahunPembuatan = document.getElementById("tahun-pembuatan").value;
    const hargaSewa = document.getElementById("harga-sewa").value;
    const fotoInput = document.getElementById("foto-mobil");

    const formData = new FormData();
    formData.append("nopol", nopol);
    formData.append("tipe", tipe);
    formData.append("merek", merek);
    formData.append("tahunPembuatan", tahunPembuatan);
    formData.append("hargaSewa", hargaSewa);
    formData.append("fotoMobil", fotoInput.files[0]);

    try {
        const result = await addDataMobil(formData);

        if (result.success) {
            alert(result.message);
            popupOverlay.classList.remove("active");
            popupForm.reset();
        }
    } catch (error) {
        console.error("Error saat mengirim data: ", error);
        alert("Terjadi masalah koneksi ke server.");
    }
});