const dashboardButton = document.querySelector('.menu button:nth-child(1)')
const katalogMobilButton = document.querySelector('.menu button:nth-child(2)');
const exitButton = document.querySelector('.exit button');

katalogMobilButton.addEventListener('click', () => {
    window.location.href = '/katalog-mobil';
});


dashboardButton.addEventListener('click', () => {
    window.location.href = '/dashboard-member';
})

/**
 * Log Out Confirmation Pop up
 * Author: Pearce Nathaniel N.
*/
exitButton.addEventListener('click', () => {
    const confirmLogout = confirm("Apakah Anda yakin ingin keluar dari sistem?");

    if(confirmLogout){
        window.location.href = '/login';
    }
})

