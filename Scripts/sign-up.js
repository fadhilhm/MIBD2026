document.querySelector('.form-field').addEventListener('submit', async (e) => {
    e.preventDefault();

    const nama = document.getElementById('name-field').value;
    const jenisKelamin = document.getElementById('pria-radio').checked ? 'M' : 'F';
    const tanggalLahir = document.getElementById('tgl-lahir').value;
    const email = document.getElementById('email').value;
    const phone = document.getElementById('phone').value;
    const noSIM = document.getElementById('no-sim').value;
    const password = document.getElementById('password').value;

    const form = { nama, jenisKelamin, tanggalLahir, email, phone, noSIM, password };

    try {
        const validationResponse = await fetch('/api/validate', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ email: email })
        });

        const validationResult = await validationResponse.json();

        if (validationResult.exists) {
            alert(validationResult.message);    
            return;
        }

        const signUpResponse = await fetch('/api/signup', {
            method: 'POST',
            headers: { 
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(form)
        });

        const signUpResult = await signUpResponse.json();

        if (signUpResult.success) {
            alert(signUpResult.message);
            window.location.href = '/login';
        } else {
            alert(signUpResult.message);
        }

    } catch (error) {
        console.error('Error: ', error);
    }
});