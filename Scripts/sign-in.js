document.querySelector('.form-field').addEventListener('submit', async (e) => {
    e.preventDefault();

    const nama = document.getElementById('name-field').value;
    const jenisKelamin = document.getElementById('pria-radio').value;
    const tanggalLahir = document.getElementById('tgl-lahir').value;
    const email = document.getElementById('email').value;
    const phone = document.getElementById('phone').value;
    const noSIM = document.getElementById('no-sim').value;
    const password = document.getElementById('password').value;

    const form = { nama, jenisKelamin, tanggalLahir, email, phone, noSIM, password };

    try {
        const response = await fetch('/api/register', {
            method: 'POST',
            headers: { 
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(form)
        });

        const result = await response.json();

        if (response.ok) {
            alert('Pendaftaran berhasil');
            window.location.href = '/login';
        } else {
            alert('Gagal: ' + result.message);
        }

    } catch (error) {
        console.error('Error: ', error);
    }
});