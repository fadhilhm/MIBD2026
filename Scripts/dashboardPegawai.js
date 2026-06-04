const kelolaMobilButton = document.getElementById("kelola-mobil-btn");
const exitButton = document.getElementById('exit-button');

kelolaMobilButton.addEventListener('click', (e) => {
    e.preventDefault();
    window.location.href = '/kelola-mobil';
})

exitButton.addEventListener('click', (e) => {
    e.preventDefault();
    window.location.href = '/login';
})

// pop up
const popupOverlay = document.getElementById("popupOverlay");
const actionBtn = document.getElementById("action-button");
const closePopUpButton = document.getElementById("closePopup");
const btnCancel = document.getElementById("cancelPopup");

actionBtn.addEventListener("click", (e) => {
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