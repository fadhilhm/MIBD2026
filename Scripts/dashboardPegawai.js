const exitButton = document.querySelector('.exit-button-container a');

/**
 * Log Out Confirmation Pop up
 * Author: Pearce Nathaniel N.
*/
exitButton.addEventListener('click', (e) => {
    e.preventDefault();
    const confirmLogout = confirm("Apakah Anda yakin ingin keluar dari sistem?");

    if(confirmLogout){
        window.location.href = '/login';
    }
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