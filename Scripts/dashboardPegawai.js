const exitButton = document.querySelector('.exit-button-container a');

exitButton.addEventListener('click', (e) => {
    e.preventDefault();

    window.location.href = '/login';
})

// pop up
const popupOverlay = document.getElementById("popupOverlay");
const doneBtn = document.getElementById("done-button");
const closePopUpButton = document.getElementById("closePopup");
const btnCancel = document.getElementById("cancelPopup");

doneBtn.addEventListener("click", (e) => {
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