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
closePopUpButton.addEventListener('click', (e) => {
    e.preventDefault();
    popupOverlay.classList.remove("active");
});

btnCancel.addEventListener("click", (e) => {
    e.preventDefault();
    popupOverlay.classList.remove("active");
});