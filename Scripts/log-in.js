document.getElementById('form-field').addEventListener('submit', async (e) => {
    e.preventDefault();

    const emailInput = document.querySelector('input[type="email"]').value;
    const passwordInput = document.querySelector('input[type="password"]').value;

    const login = { emailInput, passwordInput };

    try {
        const response = await fetch('/api/login', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(login)
        });

        const data = await response.json()

        if (response.ok) {
            if (data.user.role === 'Member') {
                window.location.href = '/dashboard-member';
            } else {
                window.location.href = '/dashboard-pegawai';
            }
        } else {
            alert('Login Gagal: ' + data.message);
        }
    } catch (error) {
        console.error('Network Error Connection Context:', error);
        alert('Could not establish a connection to the backend server.');
    }
});