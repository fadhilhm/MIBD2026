const katalogMobilButton = document.querySelector('.menu button:nth-child(2)');
const exitButton = document.querySelector('.exit button');

katalogMobilButton.addEventListener('click', () => {
    window.location.href = '/katalog-mobil';
});

exitButton.addEventListener('click', () => {
    window.location.href = '/login';
})


// fetching data mobil yang terental dan riwayat peminjaman
